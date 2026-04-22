const API_BASE = "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ─── Types ───

export interface Patient {
  id: number;
  dmi_id: string;
  first_name: string;
  last_name: string;
  address: string;
  room: string;
  diagnostic: string;
  status: string;
  created_at: string;
  updated_at: string;
  completed_steps?: string;
  total_steps?: string;
  last_step?: string;
  last_phase?: string;
}

export interface WorkflowStep {
  id: number;
  patient_id: number;
  step_id: number;
  step_title: string;
  phase: string;
  data: Record<string, any>;
  completed: boolean;
  completed_at: string;
}

export interface Intervention {
  id: number;
  patient_id: number;
  procedure_name: string;
  scheduled_time: string;
  scheduled_date: string;
  room: string;
  anesth_type: string;
  first_name?: string;
  last_name?: string;
  dmi_id?: string;
}

export interface Alert {
  id: number;
  patient_id: number | null;
  type: "critical" | "warning" | "info";
  message: string;
  resolved: boolean;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

export interface Stats {
  activePatients: number;
  todayPatients: number;
  todayInterventions: number;
  activeAlerts: number;
  criticalAlerts: number;
  completionRate: number;
  department: {
    consultations_done: string;
    consultations_total: string;
    prescriptions_done: string;
    prescriptions_total: string;
    exams_done: string;
    exams_total: string;
    transfers_done: string;
    transfers_total: string;
  };
}

// ─── Patients ───

export const getPatients = () => request<Patient[]>("/patients");
export const getPatient = (id: number) => request<Patient>(`/patients/${id}`);
export const createPatient = (data: { first_name: string; last_name: string; address?: string; room?: string; diagnostic?: string }) =>
  request<Patient>("/patients", { method: "POST", body: JSON.stringify(data) });
export const updatePatient = (id: number, data: Partial<Patient>) =>
  request<Patient>(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePatient = (id: number) =>
  request<{ success: boolean }>(`/patients/${id}`, { method: "DELETE" });

// ─── Workflow Steps ───

export const getPatientSteps = (patientId: number) => request<WorkflowStep[]>(`/patients/${patientId}/steps`);
export const saveStep = (patientId: number, stepId: number, data: { step_title: string; phase: string; data: Record<string, any> }) =>
  request<WorkflowStep>(`/patients/${patientId}/steps/${stepId}`, { method: "PUT", body: JSON.stringify(data) });

// ─── Interventions ───

export const getInterventions = () => request<Intervention[]>("/interventions");
export const getTodayInterventions = () => request<Intervention[]>("/interventions/today");
export const createIntervention = (data: { patient_id: number; procedure_name: string; scheduled_time: string; scheduled_date?: string; room?: string; anesth_type?: string }) =>
  request<Intervention>("/interventions", { method: "POST", body: JSON.stringify(data) });

// ─── Alerts ───

export const getAlerts = () => request<Alert[]>("/alerts");
export const createAlert = (data: { patient_id?: number; type: string; message: string }) =>
  request<Alert>("/alerts", { method: "POST", body: JSON.stringify(data) });
export const resolveAlert = (id: number) =>
  request<Alert>(`/alerts/${id}/resolve`, { method: "PUT" });

// ─── Stats ───

export const getStats = () => request<Stats>("/stats");
