import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, User, Stethoscope, Activity, ClipboardCheck,
  ScrollText, CheckSquare, ActivitySquare, BedDouble, FileCheck, Pill,
  Check, X, Fingerprint, UserPlus, Edit3, TrendingUp, Loader2, ChevronDown, Users,
} from "lucide-react";
import { getPatients, createPatient, getPatientSteps, saveStep, updatePatient } from "../api";
import type { Patient } from "../api";
import { ConsultationForm } from "../components/ConsultationForm";
import { ExamenCliniqueForm } from "../components/ExamenCliniqueForm";
import { ScoresRisqueForm } from "../components/ScoresRisqueForm";
import { PremedicationForm } from "../components/PremedicationForm";
import { CheckListForm } from "../components/CheckListForm";
import { FeuilleAnesthesieForm } from "../components/FeuilleAnesthesieForm";
import { CockpitForm } from "../components/CockpitForm";
import { TransfertPostOpForm } from "../components/TransfertPostOpForm";
import { SyntheseValidationForm } from "../components/SyntheseValidationForm";

const STEPS = [
  { id: 1, title: "Identification Patient", phase: "PRE-OP", icon: User, accent: "indigo" },
  { id: 2, title: "Consultation Pré-Anesthésique", phase: "PRE-OP", icon: Stethoscope, accent: "sky" },
  { id: 3, title: "Examen Clinique & Bilan", phase: "PRE-OP", icon: Activity, accent: "cyan" },
  { id: 4, title: "Scores de Risque", phase: "PRE-OP", icon: ActivitySquare, accent: "amber" },
  { id: 5, title: "Prémédication", phase: "PRE-OP", icon: Pill, accent: "purple" },
  { id: 6, title: "La check list", phase: "PRE-OP", icon: CheckSquare, accent: "rose" },
  { id: 7, title: "Feuille d'Anesthésie", phase: "PER-OP", icon: ScrollText, accent: "fuchsia" },
  { id: 8, title: "Cockpit Peropératoire", phase: "PER-OP", icon: Activity, accent: "violet" },
  { id: 9, title: "Transfert & Post-opératoire", phase: "POST-OP", icon: BedDouble, accent: "blue" },
  { id: 10, title: "Synthèse & Validation", phase: "POST-OP", icon: FileCheck, accent: "emerald" },
];

const ACCENT_MAP: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  ring: "ring-indigo-200",  badge: "bg-indigo-100 text-indigo-700" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-600",     ring: "ring-sky-200",     badge: "bg-sky-100 text-sky-700" },
  cyan:    { bg: "bg-cyan-50",    text: "text-cyan-600",    ring: "ring-cyan-200",    badge: "bg-cyan-100 text-cyan-700" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-200",   badge: "bg-amber-100 text-amber-700" },
  purple:  { bg: "bg-purple-50",  text: "text-purple-600",  ring: "ring-purple-200",  badge: "bg-purple-100 text-purple-700" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-200",    badge: "bg-rose-100 text-rose-700" },
  fuchsia: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", ring: "ring-fuchsia-200", badge: "bg-fuchsia-100 text-fuchsia-700" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-200",  badge: "bg-violet-100 text-violet-700" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-200",    badge: "bg-blue-100 text-blue-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
};

const PHASE_COLORS: Record<string, string> = {
  "PRE-OP": "bg-indigo-50 text-indigo-600 border-indigo-200",
  "PER-OP": "bg-rose-50 text-rose-600 border-rose-200",
  "POST-OP": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const FormInput = ({ label, name, defaultValue, required = false }: { label: string; name: string; defaultValue?: string; required?: boolean }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      required={required}
      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all text-sm"
    />
  </div>
);

export function Dashboard() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepNotes, setStepNotes] = useState<Record<number, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [patientData, setPatientData] = useState({
    name: "En attente de patient...",
    firstName: "",
    lastName: "",
    id: "---",
    dbId: 0,
    address: "",
    room: "",
    diagnostic: "",
  });
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [showPatientList, setShowPatientList] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all patients on mount
  useEffect(() => {
    getPatients().then(setAllPatients).catch(() => {});
  }, []);

  const progress = Math.round((completedSteps.length / STEPS.length) * 100);

  const loadPatient = async (patient: Patient) => {
    setPatientData({
      name: `${patient.first_name} ${patient.last_name}`,
      firstName: patient.first_name,
      lastName: patient.last_name,
      id: patient.dmi_id,
      dbId: patient.id,
      address: patient.address,
      room: patient.room,
      diagnostic: patient.diagnostic,
    });
    // Load steps
    try {
      const steps = await getPatientSteps(patient.id);
      const completed = steps.filter((s) => s.completed).map((s) => s.step_id);
      const notes: Record<number, any> = {};
      steps.forEach((s) => { if (s.completed) notes[s.step_id] = s.data; });
      setCompletedSteps(completed);
      setStepNotes(notes);
    } catch {
      setCompletedSteps([]);
      setStepNotes({});
    }
    setShowPatientList(false);
  };

  const handleStepClick = (id: number) => {
    if (patientData.id === "---") { setIsModalOpen(true); return; }
    setActiveStepId(id);
  };

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStepId || !patientData.dbId) return;
    setSaving(true);

    const formData = new FormData(e.target as HTMLFormElement);
    let dataToSave: any = Object.fromEntries(formData.entries());

    if (activeStepId === 1) {
      const newName = `${dataToSave.firstName} ${dataToSave.lastName}`.trim();
      setPatientData((prev) => ({
        ...prev,
        name: newName || "Patient Anonyme",
        firstName: dataToSave.firstName || "",
        lastName: dataToSave.lastName || "",
        id: dataToSave.id || prev.id,
        address: dataToSave.address || "",
        room: dataToSave.room || "",
        diagnostic: dataToSave.diagnostic || "",
      }));
      // Also update patient in DB
      await updatePatient(patientData.dbId, {
        first_name: dataToSave.firstName,
        last_name: dataToSave.lastName,
        address: dataToSave.address,
        room: dataToSave.room,
        diagnostic: dataToSave.diagnostic,
      }).catch(() => {});
    }

    const step = STEPS.find((s) => s.id === activeStepId)!;
    try {
      await saveStep(patientData.dbId, activeStepId, {
        step_title: step.title,
        phase: step.phase,
        data: dataToSave,
      });
    } catch (err) {
      console.error("Failed to save step:", err);
    }

    setStepNotes((prev) => ({ ...prev, [activeStepId]: dataToSave }));
    if (!completedSteps.includes(activeStepId)) setCompletedSteps((prev) => [...prev, activeStepId]);
    setActiveStepId(null);
    setSaving(false);
  };

  const handleNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get("name") as string;
    const parts = fullName.split(" ");
    const firstName = parts.length > 1 ? parts[0] : fullName;
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    try {
      const patient = await createPatient({ first_name: firstName, last_name: lastName });
      setPatientData({
        name: fullName || "Patient Anonyme",
        firstName,
        lastName,
        id: patient.dmi_id,
        dbId: patient.id,
        address: "",
        room: "",
        diagnostic: "",
      });
      setAllPatients((prev) => [patient, ...prev]);
    } catch (err) {
      // Fallback to local-only
      setPatientData({
        name: fullName || "Patient Anonyme",
        firstName,
        lastName,
        id: `DMI-${Math.floor(Math.random() * 90000) + 10000}`,
        dbId: 0,
        address: "",
        room: "",
        diagnostic: "",
      });
    }
    setCompletedSteps([]);
    setStepNotes({});
    setIsModalOpen(false);
  };

  const activeStepData = STEPS.find((s) => s.id === activeStepId);

  const phases = ["PRE-OP", "PER-OP", "POST-OP"];

  return (
    <div className="min-h-full bg-[#f8f9fb]">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Tableau de bord</h1>
            <p className="text-xs text-slate-400 -mt-0.5">Workflow anesthésique</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Patient selector */}
            {allPatients.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowPatientList(!showPatientList)}
                  className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Charger patient</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPatientList ? "rotate-180" : ""}`} />
                </button>
                {showPatientList && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPatientList(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-20 max-h-64 overflow-y-auto">
                      {allPatients.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => loadPatient(p)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {p.first_name[0]}{p.last_name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">{p.first_name} {p.last_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{p.dmi_id}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau Patient</span>
          </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Patient card + progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Patient info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${patientData.id !== "---" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
              <Fingerprint className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Patient actuel</p>
              <p className="text-base font-bold text-slate-800 truncate">{patientData.name}</p>
              {patientData.room && <p className="text-xs text-slate-400 mt-0.5">Chambre {patientData.room} {patientData.diagnostic && `· ${patientData.diagnostic}`}</p>}
            </div>
            {patientData.id !== "---" && (
              <span className="bg-indigo-50 text-indigo-600 font-mono text-xs px-3 py-1.5 rounded-lg font-semibold border border-indigo-100 shrink-0">
                {patientData.id}
              </span>
            )}
          </motion.div>

          {/* Progress card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-500">Progression</span>
              </div>
              <span className="text-xl font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">{completedSteps.length}/{STEPS.length} étapes complétées</p>
          </motion.div>
        </div>

        {/* Steps by phase */}
        {phases.map((phase) => {
          const phaseSteps = STEPS.filter((s) => s.phase === phase);
          return (
            <div key={phase}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md border ${PHASE_COLORS[phase]}`}>
                  {phase}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {phaseSteps.map((step, i) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const colors = ACCENT_MAP[step.accent];
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleStepClick(step.id)}
                      className={`group relative bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                        isCompleted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isCompleted ? "bg-emerald-100 text-emerald-600" : `${colors.bg} ${colors.text}`
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <step.icon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-300">#{step.id}</span>
                          </div>
                          <h3 className={`text-sm font-semibold leading-tight mt-0.5 ${isCompleted ? "text-emerald-700" : "text-slate-700"}`}>
                            {step.title}
                          </h3>
                          {isCompleted && stepNotes[step.id] && (
                            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                              <Edit3 className="w-3 h-3 shrink-0" />
                              {step.id === 1
                                ? `Ch: ${patientData.room || "N/A"} · Diag: ${patientData.diagnostic || "N/A"}`
                                : typeof stepNotes[step.id] === "string" ? stepNotes[step.id] : "Formulaire complété"}
                            </p>
                          )}
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-all ${isCompleted ? "text-emerald-400" : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5"}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet for step data */}
      <AnimatePresence>
        {activeStepId !== null && activeStepData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setActiveStepId(null)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

              {/* Header */}
              <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ACCENT_MAP[activeStepData.accent].bg} ${ACCENT_MAP[activeStepData.accent].text}`}>
                  <activeStepData.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-800 leading-tight">{activeStepData.title}</h3>
                  <span className={`text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded border mt-1 inline-block ${PHASE_COLORS[activeStepData.phase]}`}>
                    {activeStepData.phase}
                  </span>
                </div>
                <button onClick={() => setActiveStepId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleStepSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-5 form-dark-override">
                  {activeStepData.id === 1 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Nom" name="lastName" defaultValue={patientData.lastName} required />
                        <FormInput label="Prénom" name="firstName" defaultValue={patientData.firstName} required />
                      </div>
                      <FormInput label="Numéro de dossier" name="id" defaultValue={patientData.id !== "---" ? patientData.id : ""} required />
                      <FormInput label="Adresse complète" name="address" defaultValue={patientData.address} />
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Chambre / Lit" name="room" defaultValue={patientData.room} />
                        <FormInput label="Diagnostic" name="diagnostic" defaultValue={patientData.diagnostic} />
                      </div>
                    </div>
                  ) : activeStepData.id === 2 ? <ConsultationForm />
                    : activeStepData.id === 3 ? <ExamenCliniqueForm />
                    : activeStepData.id === 4 ? <ScoresRisqueForm />
                    : activeStepData.id === 5 ? <PremedicationForm />
                    : activeStepData.id === 6 ? <CheckListForm />
                    : activeStepData.id === 7 ? <FeuilleAnesthesieForm />
                    : activeStepData.id === 8 ? <CockpitForm />
                    : activeStepData.id === 9 ? <TransfertPostOpForm />
                    : activeStepData.id === 10 ? <SyntheseValidationForm patientData={patientData} stepNotes={stepNotes} />
                    : (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Observations</label>
                        <textarea
                          name="notes"
                          defaultValue={typeof stepNotes[activeStepData.id] === "string" ? stepNotes[activeStepData.id] : ""}
                          required
                          rows={5}
                          placeholder="Saisissez les informations ici..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
                        />
                      </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    {saving ? "Enregistrement..." : "Enregistrer et Valider"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Patient Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
                <UserPlus className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Initialiser un DMI</h3>
              <p className="text-sm text-slate-400 mb-6">Créez un nouveau dossier patient pour démarrer le suivi anesthésique.</p>
              <form onSubmit={handleNewPatient} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom complet du patient</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Ex: Jean Dupont"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
                  Créer le dossier
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
