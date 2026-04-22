import { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, FileCheck, UserCheck, Activity, BedDouble, AlertCircle, Fingerprint, MapPin, Syringe } from "lucide-react";

interface SyntheseValidationFormProps {
  patientData: {
    name: string;
    firstName: string;
    lastName: string;
    id: string;
    address: string;
    room: string;
    diagnostic: string;
  };
  stepNotes: Record<number, any>;
}

export function SyntheseValidationForm({ patientData, stepNotes }: SyntheseValidationFormProps) {
  const [signature, setSignature] = useState("");

  const getStatusColor = (stepId: number) => {
    return stepNotes[stepId] ? "text-emerald-400" : "text-amber-400";
  };

  const getStatusBg = (stepId: number) => {
    return stepNotes[stepId] ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20";
  };

  const completedCount = Object.keys(stepNotes).length;
  const isComplete = completedCount >= 9;

  return (
    <div className="space-y-6">
      {/* Top Banner - AI Summary Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-500/30 rounded-2xl p-5 shadow-lg shadow-blue-900/20">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 border border-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Bilan Anesthésique Global</h3>
            <p className="text-xs text-blue-200/70 leading-relaxed">
              {isComplete 
                ? "L'ensemble du dossier médical informatisé a été complété avec succès. Prêt pour la validation légale et la clôture de l'épisode de soins."
                : `Attention : Le dossier est partiellement complété (${completedCount}/9 étapes). Veuillez vérifier les sections manquantes avant clôture.`}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Mini-Card */}
      <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
          <UserCheck className="w-5 h-5 text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Identité validée</p>
          <p className="text-sm font-bold text-white truncate">{patientData.name !== "En attente de patient..." ? patientData.name : "Non renseigné"}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] flex items-center gap-1 text-slate-400 bg-white/5 px-1.5 py-0.5 rounded"><Fingerprint className="w-3 h-3"/> {patientData.id}</span>
            {patientData.room && <span className="text-[10px] flex items-center gap-1 text-slate-400 bg-white/5 px-1.5 py-0.5 rounded"><MapPin className="w-3 h-3"/> Ch: {patientData.room}</span>}
          </div>
        </div>
      </div>

      {/* Accordion-like detailed summaries */}
      <div className="space-y-3">
        {/* Phase PRE-OP */}
        <div className={`border rounded-xl p-4 transition-all ${stepNotes[2] && stepNotes[3] ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Phase Pré-Opératoire</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-slate-400">ÉTAPES 1-6</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded-lg border flex flex-col gap-1 ${getStatusBg(2)}`}>
              <span className="text-[9px] uppercase font-bold text-slate-400">Consultation</span>
              <span className={`text-xs font-semibold ${getStatusColor(2)}`}>{stepNotes[2] ? "Validée" : "Manquante"}</span>
            </div>
            <div className={`p-2 rounded-lg border flex flex-col gap-1 ${getStatusBg(4)}`}>
              <span className="text-[9px] uppercase font-bold text-slate-400">Scores & Risques</span>
              <span className={`text-xs font-semibold ${getStatusColor(4)}`}>{stepNotes[4] ? "Évalués" : "Manquants"}</span>
            </div>
            <div className={`p-2 rounded-lg border flex flex-col gap-1 ${getStatusBg(5)}`}>
              <span className="text-[9px] uppercase font-bold text-slate-400">Prémédication</span>
              <span className={`text-xs font-semibold ${getStatusColor(5)}`}>{stepNotes[5] ? "Prescrite" : "Manquante"}</span>
            </div>
            <div className={`p-2 rounded-lg border flex flex-col gap-1 ${getStatusBg(6)}`}>
              <span className="text-[9px] uppercase font-bold text-slate-400">Check-list VVP</span>
              <span className={`text-xs font-semibold ${getStatusColor(6)}`}>{stepNotes[6] ? "Vérifiée" : "Manquante"}</span>
            </div>
          </div>
        </div>

        {/* Phase PER-OP */}
        <div className={`border rounded-xl p-4 transition-all ${stepNotes[7] && stepNotes[8] ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Phase Per-Opératoire</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-slate-400">ÉTAPES 7-8</span>
          </div>
          <div className="space-y-2">
            <div className={`p-3 rounded-lg border flex items-center justify-between ${getStatusBg(7)}`}>
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-fuchsia-400" />
                <span className="text-xs font-semibold text-slate-200">Feuille d'Anesthésie</span>
              </div>
              <span className={`text-xs font-bold ${getStatusColor(7)}`}>{stepNotes[7] ? "Complétée" : "En attente"}</span>
            </div>
            <div className={`p-3 rounded-lg border flex items-center justify-between ${getStatusBg(8)}`}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-200">Monitorage Cockpit</span>
              </div>
              <span className={`text-xs font-bold ${getStatusColor(8)}`}>{stepNotes[8] ? "Enregistré" : "En attente"}</span>
            </div>
          </div>
        </div>

        {/* Phase POST-OP */}
        <div className={`border rounded-xl p-4 transition-all ${stepNotes[9] ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Phase Post-Opératoire</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-slate-400">ÉTAPE 9</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col gap-2 ${getStatusBg(9)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">Transfert & SSPI</span>
              </div>
              <span className={`text-xs font-bold ${getStatusColor(9)}`}>{stepNotes[9] ? "Validé" : "En attente"}</span>
            </div>
            {stepNotes[9] && stepNotes[9].po_transfert_vers && (
              <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded">
                Transfert autorisé vers : <span className="font-bold text-white">{stepNotes[9].po_transfert_vers}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Signature block */}
      <div className="bg-[#080B0A]/80 border border-blue-500/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4" />
          Validation & Clôture
        </h4>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center shrink-0 mt-0.5">
              <input type="checkbox" required className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded bg-black/40 checked:bg-blue-500 checked:border-blue-500 focus:outline-none transition-all" />
              <svg className="absolute inset-0 w-3.5 h-3.5 m-auto text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-xs text-slate-300 leading-tight">
              Je certifie l'exactitude des informations médicales consignées dans ce dossier et procède à sa clôture numérique.
            </span>
          </label>
          
          <div className="pt-2">
            <input 
              type="text" 
              name="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              required
              placeholder="Signature électronique (Saisissez votre nom)"
              className="w-full bg-black/50 border border-blue-500/20 rounded-lg px-4 py-2.5 text-blue-100 font-medium placeholder:text-blue-900/50 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>
        </div>
      </div>

    </div>
  );
}