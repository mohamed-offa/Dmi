import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── PATIENTS ───

// List all patients
app.get("/api/patients", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        COUNT(ws.id) FILTER (WHERE ws.completed = true) AS completed_steps,
        COUNT(ws.id) AS total_steps,
        (SELECT ws2.step_title FROM workflow_steps ws2 WHERE ws2.patient_id = p.id AND ws2.completed = true ORDER BY ws2.completed_at DESC LIMIT 1) AS last_step,
        (SELECT ws2.phase FROM workflow_steps ws2 WHERE ws2.patient_id = p.id AND ws2.completed = true ORDER BY ws2.completed_at DESC LIMIT 1) AS last_phase
      FROM patients p
      LEFT JOIN workflow_steps ws ON ws.patient_id = p.id
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single patient
app.get("/api/patients/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM patients WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Patient not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create patient
app.post("/api/patients", async (req, res) => {
  const { first_name, last_name, address, room, diagnostic } = req.body;
  const dmi_id = `DMI-${Math.floor(Math.random() * 90000) + 10000}`;
  try {
    const { rows } = await pool.query(
      `INSERT INTO patients (dmi_id, first_name, last_name, address, room, diagnostic)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [dmi_id, first_name, last_name, address || "", room || "", diagnostic || ""]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update patient
app.put("/api/patients/:id", async (req, res) => {
  const { first_name, last_name, address, room, diagnostic, status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE patients SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name),
       address = COALESCE($3, address), room = COALESCE($4, room), diagnostic = COALESCE($5, diagnostic),
       status = COALESCE($6, status), updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [first_name, last_name, address, room, diagnostic, status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Patient not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete patient
app.delete("/api/patients/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM patients WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── WORKFLOW STEPS ───

// Get steps for a patient
app.get("/api/patients/:id/steps", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM workflow_steps WHERE patient_id = $1 ORDER BY step_id",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/update a step
app.put("/api/patients/:id/steps/:stepId", async (req, res) => {
  const { step_title, phase, data } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO workflow_steps (patient_id, step_id, step_title, phase, data, completed, completed_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       ON CONFLICT (patient_id, step_id)
       DO UPDATE SET data = $5, completed = true, completed_at = NOW(), step_title = $3, phase = $4
       RETURNING *`,
      [req.params.id, req.params.stepId, step_title, phase, JSON.stringify(data)]
    );
    // Update patient timestamp
    await pool.query("UPDATE patients SET updated_at = NOW() WHERE id = $1", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── INTERVENTIONS ───

app.get("/api/interventions", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT i.*, p.first_name, p.last_name, p.dmi_id
      FROM interventions i
      LEFT JOIN patients p ON p.id = i.patient_id
      ORDER BY i.scheduled_date DESC, i.scheduled_time ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/interventions/today", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT i.*, p.first_name, p.last_name, p.dmi_id
      FROM interventions i
      LEFT JOIN patients p ON p.id = i.patient_id
      WHERE i.scheduled_date = CURRENT_DATE
      ORDER BY i.scheduled_time ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/interventions", async (req, res) => {
  const { patient_id, procedure_name, scheduled_time, scheduled_date, room, anesth_type } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO interventions (patient_id, procedure_name, scheduled_time, scheduled_date, room, anesth_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient_id, procedure_name, scheduled_time, scheduled_date || new Date(), room || "", anesth_type || "AG"]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ALERTS ───

app.get("/api/alerts", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, p.first_name, p.last_name, p.dmi_id
      FROM alerts a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.resolved = false
      ORDER BY
        CASE a.type WHEN 'critical' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END,
        a.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/alerts", async (req, res) => {
  const { patient_id, type, message } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO alerts (patient_id, type, message) VALUES ($1, $2, $3) RETURNING *",
      [patient_id || null, type || "info", message]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/alerts/:id/resolve", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "UPDATE alerts SET resolved = true WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── OVERVIEW STATS ───

app.get("/api/stats", async (req, res) => {
  try {
    const [patients, todayPatients, interventions, alerts, completionRate, deptStats] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM patients WHERE status != 'archive'"),
      pool.query("SELECT COUNT(*) AS count FROM patients WHERE DATE(created_at) = CURRENT_DATE"),
      pool.query("SELECT COUNT(*) AS count FROM interventions WHERE scheduled_date = CURRENT_DATE"),
      pool.query("SELECT COUNT(*) AS count FROM alerts WHERE resolved = false"),
      pool.query(`
        SELECT
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(AVG(CASE WHEN sub.completed_steps >= 10 THEN 100 ELSE (sub.completed_steps::numeric / 10) * 100 END))
          END AS rate
        FROM (
          SELECT p.id, COUNT(ws.id) FILTER (WHERE ws.completed = true) AS completed_steps
          FROM patients p LEFT JOIN workflow_steps ws ON ws.patient_id = p.id
          WHERE p.status != 'archive'
          GROUP BY p.id
        ) sub
      `),
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM workflow_steps WHERE step_id = 2 AND completed = true) AS consultations_done,
          (SELECT COUNT(*) FROM patients WHERE status != 'archive') AS consultations_total,
          (SELECT COUNT(DISTINCT patient_id) FROM workflow_steps WHERE step_id IN (5) AND completed = true) AS prescriptions_done,
          (SELECT COUNT(*) FROM patients WHERE status != 'archive') AS prescriptions_total,
          (SELECT COUNT(*) FROM workflow_steps WHERE step_id = 3 AND completed = true) AS exams_done,
          (SELECT COUNT(*) FROM patients WHERE status != 'archive') AS exams_total,
          (SELECT COUNT(*) FROM workflow_steps WHERE step_id = 9 AND completed = true) AS transfers_done,
          (SELECT COUNT(*) FROM patients WHERE status != 'archive') AS transfers_total
      `),
    ]);

    const criticalAlerts = await pool.query("SELECT COUNT(*) AS count FROM alerts WHERE resolved = false AND type = 'critical'");

    res.json({
      activePatients: parseInt(patients.rows[0].count),
      todayPatients: parseInt(todayPatients.rows[0].count),
      todayInterventions: parseInt(interventions.rows[0].count),
      activeAlerts: parseInt(alerts.rows[0].count),
      criticalAlerts: parseInt(criticalAlerts.rows[0].count),
      completionRate: parseInt(completionRate.rows[0].rate) || 0,
      department: deptStats.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
