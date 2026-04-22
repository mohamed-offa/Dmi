import pool from "./db.js";

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        dmi_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        address TEXT DEFAULT '',
        room VARCHAR(50) DEFAULT '',
        diagnostic TEXT DEFAULT '',
        status VARCHAR(20) DEFAULT 'en-cours',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS workflow_steps (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        step_id INTEGER NOT NULL,
        step_title VARCHAR(200) NOT NULL,
        phase VARCHAR(20) NOT NULL,
        data JSONB DEFAULT '{}',
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_patient_step ON workflow_steps(patient_id, step_id);

      CREATE TABLE IF NOT EXISTS interventions (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        procedure_name VARCHAR(200) NOT NULL,
        scheduled_time TIME,
        scheduled_date DATE DEFAULT CURRENT_DATE,
        room VARCHAR(100) DEFAULT '',
        anesth_type VARCHAR(20) DEFAULT 'AG',
        status VARCHAR(20) DEFAULT 'planifie',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'info',
        message TEXT NOT NULL,
        resolved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Database tables created successfully.");
  } catch (err) {
    console.error("Error initializing database:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

initDB();
