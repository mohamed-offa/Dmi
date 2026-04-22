import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Syringe, ChevronRight, User, Stethoscope, Activity, ClipboardCheck, 
  ScrollText, CheckSquare, ActivitySquare, BedDouble, FileCheck, Pill,
  Check, X, Fingerprint, UserPlus, Edit3
} from "lucide-react";
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
  { id: 1, title: "Identification Patient", phase: "PRE-OP", icon: User, color: "text-emerald-400 bg-emerald-400/10", border: "group-hover:border-emerald-500" },
  { id: 2, title: "Consultation Pré-Anesthésique", phase: "PRE-OP", icon: Stethoscope, color: "text-cyan-400 bg-cyan-400/10", border: "group-hover:border-cyan-500" },
  { id: 3, title: "Examen Clinique & Bilan", phase: "PRE-OP", icon: Activity, color: "text-sky-400 bg-sky-400/10", border: "group-hover:border-sky-500" },
  { id: 4, title: "Scores de Risque", phase: "PRE-OP", icon: ActivitySquare, color: "text-amber-400 bg-amber-400/10", border: "group-hover:border-amber-500" },
  { id: 5, title: "Prémédication", phase: "PRE-OP", icon: Pill, color: "text-purple-400 bg-purple-400/10", border: "group-hover:border-purple-500" },
  { id: 6, title: "La check list", phase: "PRE-OP", icon: CheckSquare, color: "text-rose-400 bg-rose-400/10", border: "group-hover:border-rose-500" },
  { id: 7, title: "Feuille d’Anesthésie", phase: "PER-OP", icon: ScrollText, color: "text-fuchsia-400 bg-fuchsia-400/10", border: "group-hover:border-fuchsia-500" },
  { id: 8, title: "Cockpit Peropératoire", phase: "PER-OP", icon: Activity, color: "text-violet-400 bg-violet-400/10", border: "group-hover:border-violet-500" },
  { id: 9, title: "Transfert & Post-opératoire", phase: "POST-OP", icon: BedDouble, color: "text-indigo-400 bg-indigo-400/10", border: "group-hover:border-indigo-500" },
  { id: 10, title: "Synthèse & Validation", phase: "POST-OP", icon: FileCheck, color: "text-blue-400 bg-blue-400/10", border: "group-hover:border-blue-500" },
];

const FormInput = ({ label, name, defaultValue, required = false }: { label: string, name: string, defaultValue?: string, required?: boolean }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider ml-1">{label}</label>
    <input 
      type="text" 
      name={name} 
      defaultValue={defaultValue} 
      required={required}
      className="w-full bg-[#080B0A]/80 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner text-sm"
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
    address: "",
    room: "",
    diagnostic: ""
  });

  const progress = Math.round((completedSteps.length / STEPS.length) * 100);

  const handleStepClick = (id: number) => {
    if (patientData.id === "---") {
      setIsModalOpen(true);
      return;
    }
    setActiveStepId(id);
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    let dataToSave: any;
    
    if (activeStepId === 1) {
      dataToSave = Object.fromEntries(formData.entries());
      const newName = `${dataToSave.firstName} ${dataToSave.lastName}`.trim();
      
      // Update global patient data so the header reflects changes immediately
      setPatientData(prev => ({
        ...prev,
        name: newName || "Patient Anonyme",
        firstName: dataToSave.firstName || "",
        lastName: dataToSave.lastName || "",
        id: dataToSave.id || prev.id,
        address: dataToSave.address || "",
        room: dataToSave.room || "",
        diagnostic: dataToSave.diagnostic || ""
      }));
    } else if (activeStepId >= 2 && activeStepId <= 10) {
      dataToSave = Object.fromEntries(formData.entries());
    } else {
      dataToSave = formData.get("notes") as string;
    }
    
    if (activeStepId) {
      setStepNotes(prev => ({ ...prev, [activeStepId]: dataToSave }));
      if (!completedSteps.includes(activeStepId)) {
        setCompletedSteps(prev => [...prev, activeStepId]);
      }
      setActiveStepId(null);
    }
  };

  const handleNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get("name") as string;
    
    const parts = fullName.split(" ");
    const firstName = parts.length > 1 ? parts[0] : fullName;
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    
    setPatientData({
      name: fullName || "Patient Anonyme",
      firstName: firstName,
      lastName: lastName,
      id: `DMI-${Math.floor(Math.random() * 90000) + 10000}`,
      address: "",
      room: "",
      diagnostic: ""
    });
    setCompletedSteps([]); 
    setStepNotes({});
    setIsModalOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 30 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.6 } 
    },
  };

  const activeStepData = STEPS.find(s => s.id === activeStepId);

  return (
    <div className="min-h-screen bg-[#080B0A] text-slate-100 font-sans overflow-hidden relative">
      {/* Background ECG Waveform Effect */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden pointer-events-none opacity-10">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full text-emerald-500">
          <path
            d="M 0,50 L 100,50 L 120,40 L 130,80 L 140,20 L 160,50 L 300,50 L 320,45 L 330,70 L 340,30 L 360,50 L 500,50 L 520,35 L 530,90 L 540,10 L 560,50 L 700,50 L 720,40 L 730,80 L 740,20 L 760,50 L 1000,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10 shadow-2xl shadow-black border-x border-white/[0.02] bg-[#0E1513]/90 backdrop-blur-2xl pb-24">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-4 relative">
          <motion.div 
            initial={{ opacity: 0, rotate: -20, scale: 0.8 }} 
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }} 
            className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgba(45,212,191,0.3)] border border-teal-300/30"
          >
            <Syringe className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-emerald-300 mb-4"
          >
            DMI en anesthésie <br />non cardiaque
          </motion.h1>

          {/* PATIENT INFO BANNER */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl backdrop-blur-md"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${patientData.id !== '---' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-500'}`}>
              <Fingerprint className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Patient Actuel</p>
              <p className="text-sm font-bold text-slate-200 truncate">{patientData.name}</p>
            </div>
            {patientData.id !== '---' && (
              <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-xs px-2 py-1 rounded">
                {patientData.id}
              </div>
            )}
          </motion.div>

          {/* PROGRESS BAR */}
          {patientData.id !== '---' && (
            <div className="mt-4 px-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Progression Workflow</span>
                <span className="text-teal-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                />
              </div>
            </div>
          )}
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar no-scrollbar space-y-4">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3 relative"
          >
            <div className="absolute left-[1.4rem] top-8 bottom-8 w-px bg-gradient-to-b from-teal-900/50 via-teal-900/50 to-transparent z-0" />

            {STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.id);

              return (
                <motion.div
                  key={step.id}
                  variants={item}
                  onClick={() => handleStepClick(step.id)}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border transition-all cursor-pointer shadow-sm
                    ${isCompleted 
                      ? 'bg-emerald-900/10 border-emerald-500/30' 
                      : 'bg-[#131D1A]/80 hover:bg-[#1A2623] border-white/[0.03] hover:shadow-teal-900/10 border-l-4 ' + step.border
                    }
                  `}
                >
                  {/* Number/Icon/Check Square */}
                  <div className={`relative shrink-0 w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-300 z-10
                    ${isCompleted ? 'bg-emerald-500 text-white scale-95' : step.color + ' group-hover:scale-110'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" strokeWidth={3} />
                    ) : (
                      <>
                        <span className="font-bold text-[15px] z-10 group-hover:opacity-0 transition-opacity duration-200">{step.id}</span>
                        <step.icon className="w-5 h-5 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />
                      </>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-[15px] truncate transition-all duration-300 ${isCompleted ? 'text-emerald-400/80' : 'text-slate-300 font-semibold group-hover:text-white'}`}>
                      {step.title}
                    </h3>
                    {isCompleted && stepNotes[step.id] && (
                      <p className="text-xs text-slate-500 truncate mt-1 italic opacity-80 flex items-center gap-1">
                        <Edit3 className="w-3 h-3 inline" /> 
                        {step.id === 1 
                          ? `Chambre: ${patientData.room || 'N/A'} - Diag: ${patientData.diagnostic || 'N/A'}`
                          : typeof stepNotes[step.id] === 'string' 
                            ? stepNotes[step.id] 
                            : "Formulaire complété"}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    {!isCompleted && (
                      <span className={`text-[9px] font-bold tracking-widest px-2 py-1 rounded border border-dashed ${
                        step.phase === 'PRE-OP' ? 'text-teal-500 border-teal-500/30' :
                        step.phase === 'PER-OP' ? 'text-rose-500 border-rose-500/30' :
                        'text-emerald-500 border-emerald-500/30'
                      }`}>
                        {step.phase}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isCompleted ? 'text-emerald-500' : 'text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1'}`} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Fixed Bottom Action Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#080B0A] via-[#080B0A]/90 to-transparent pt-12 z-20 pointer-events-none">
          <motion.button 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "tween", ease: "easeOut", duration: 0.5 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full relative group overflow-hidden rounded-xl pointer-events-auto shadow-xl shadow-black/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500 group-hover:opacity-90"></div>
            <div className="absolute inset-0 border-2 border-white/20 rounded-xl group-hover:scale-[1.03] group-hover:opacity-0 transition-all duration-500"></div>
            
            <div className="relative flex items-center justify-center gap-2 py-4 px-6 text-white font-bold text-lg tracking-wide group-hover:tracking-widest transition-all duration-300">
              <UserPlus className="w-5 h-5 opacity-80" />
              <span>Nouveau Patient</span>
            </div>
            
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>
          </motion.button>
        </div>

        {/* Bottom Sheet for filling a step data */}
        <AnimatePresence>
          {activeStepId !== null && activeStepData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
            >
              <div 
                className="absolute inset-0" 
                onClick={() => setActiveStepId(null)}
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-md bg-[#111A18] rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-teal-900/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-10 flex flex-col max-h-[90vh]"
              >
                {/* Drag Handle for mobile feel */}
                <div className="w-12 h-1.5 shrink-0 bg-white/10 rounded-full mx-auto mb-6" />

                <button 
                  onClick={() => setActiveStepId(null)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-2 shrink-0">
                  <div className={`w-10 h-10 rounded-lg ${activeStepData.color} flex items-center justify-center`}>
                    <activeStepData.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {activeStepData.title}
                  </h3>
                </div>
                
                <p className="text-xs text-teal-500 font-semibold mb-6 flex items-center gap-2 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  PHASE: {activeStepData.phase}
                </p>
                
                <form onSubmit={handleStepSubmit} className="space-y-5 flex flex-col max-h-[75vh]">
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
                    {activeStepData.id === 1 ? (
                      
                      <div className="space-y-4 pt-2">
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

                    ) : activeStepData.id === 2 ? (
                      
                      <ConsultationForm />
                      
                    ) : activeStepData.id === 3 ? (
                      
                      <ExamenCliniqueForm />
                      
                    ) : activeStepData.id === 4 ? (
                      
                      <ScoresRisqueForm />
                      
                    ) : activeStepData.id === 5 ? (
                      
                      <PremedicationForm />
                      
                    ) : activeStepData.id === 6 ? (
                      
                      <CheckListForm />
                      
                    ) : activeStepData.id === 7 ? (
                      
                      <FeuilleAnesthesieForm />
                      
                    ) : activeStepData.id === 8 ? (
                      
                      <CockpitForm />
                      
                    ) : activeStepData.id === 9 ? (
                      
                      <TransfertPostOpForm />
                      
                    ) : activeStepData.id === 10 ? (
                      
                      <SyntheseValidationForm patientData={patientData} stepNotes={stepNotes} />
                      
                    ) : (
                      
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                          Observations Cliniques / Données
                        </label>
                        <textarea 
                          name="notes"
                          defaultValue={typeof stepNotes[activeStepData.id] === 'string' ? stepNotes[activeStepData.id] : ""}
                          required
                          rows={5}
                          placeholder="Saisissez les informations ici..."
                          className="w-full bg-[#080B0A]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all resize-none shadow-inner"
                        />
                      </div>
                      
                    )}
                  </div>
                  
                  <div className="shrink-0 mt-auto pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                    >
                      <Check className="w-5 h-5" />
                      Enregistrer et Valider
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal "Nouveau Patient" */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B0A]/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-sm bg-[#111A18] border border-teal-900/50 p-6 rounded-3xl shadow-2xl relative"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-4 border border-teal-500/30">
                  <UserPlus className="w-6 h-6 text-teal-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Initialiser un DMI</h3>
                <p className="text-sm text-slate-400 mb-6">Créez un nouveau dossier patient pour démarrer la checklist de suivi anesthésique.</p>
                
                <form onSubmit={handleNewPatient} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Nom complet du patient</label>
                    <input 
                      name="name"
                      type="text" 
                      required
                      placeholder="Ex: Jean Dupont"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Créer le dossier
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
