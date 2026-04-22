import { useState } from "react";
import { ShieldCheck, FileCheck, UserCheck, Activity, BedDouble, Fingerprint, MapPin, Syringe } from "lucide-react";

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

  const getStatusColor = (stepId: number) => stepNotes[stepId] ? "text-emerald-600" : "text-amber-500";
  const getStatusBg = (stepId: number) => stepNotes[stepId] ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200";

  const completedCount = Object.keys(stepNotes).length;
  const isComplete = completedCount >= 9;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 border border-indigo-200">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Bilan Anesthésique Global</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isComplete
                ? "L'ensemble du dossier a été complété avec succès. Prêt pour la validation et la clôture."
                : `Dossier partiellement complété (${completedCount}/9 étapes). Vérifiez les sections manquantes.`}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Mini-Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Identité validée</p>
          <p className="text-sm font-bold text-slate-800 truncate">{patientData.name !== "En attente de patient..." ? patientData.name : "Non renseigné"}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] flex items-center gap-1 text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"><Fingerprint className="w-3 h-3" /> {patientData.id}</span>
            {patientData.room && <span className="text-[10px] flex items-center gap-1 text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"><MapPin className="w-3 h-3" /> Ch: {patientData.room}</span>}
          </div>
        </div>
      </div>

      {/* Phase summaries */}
      <div className="space-y-3">
        {/* PRE-OP */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phase Pré-Opératoire</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">ÉTAPES 1-6</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 2, label: "Consultation", done: "Validée", pending: "Manquante" },
              { id: 4, label: "Scores & Risques", done: "Évalués", pending: "Manquants" },
              { id: 5, label: "Prémédication", done: "Prescrite", pending: "Manquante" },
              { id: 6, label: "Check-list VVP", done: "Vérifiée", pending: "Manquante" },
            ].map((s) => (
              <div key={s.id} className={`p-2.5 rounded-lg border flex flex-col gap-0.5 ${getStatusBg(s.id)}`}>
                <span className="text-[9px] uppercase font-bold text-slate-400">{s.label}</span>
                <span className={`text-xs font-semibold ${getStatusColor(s.id)}`}>{stepNotes[s.id] ? s.done : s.pending}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PER-OP */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phase Per-Opératoire</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">ÉTAPES 7-8</span>
          </div>
          <div className="space-y-2">
            <div className={`p-3 rounded-lg border flex items-center justify-between ${getStatusBg(7)}`}>
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-fuchsia-500" />
                <span className="text-xs font-semibold text-slate-700">Feuille d'Anesthésie</span>
              </div>
              <span className={`text-xs font-bold ${getStatusColor(7)}`}>{stepNotes[7] ? "Complétée" : "En attente"}</span>
            </div>
            <div className={`p-3 rounded-lg border flex items-center justify-between ${getStatusBg(8)}`}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-semibold text-slate-700">Monitorage Cockpit</span>
              </div>
              <span className={`text-xs font-bold ${getStatusColor(8)}`}>{stepNotes[8] ? "Enregistré" : "En attente"}</span>
            </div>
          </div>
        </div>

        {/* POST-OP */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phase Post-Opératoire</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">ÉTAPE 9</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col gap-2 ${getStatusBg(9)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-700">Transfert & SSPI</span>
              </div>
              <span className={`text-xs font-bold ${getStatusColor(9)}`}>{stepNotes[9] ? "Validé" : "En attente"}</span>
            </div>
            {stepNotes[9] && stepNotes[9].po_transfert_vers && (
              <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                Transfert autorisé vers : <span className="font-bold text-slate-700">{stepNotes[9].po_transfert_vers}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Signature block */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4" />
          Validation & Clôture
        </h4>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center shrink-0 mt-0.5">
              <input type="checkbox" required className="peer appearance-none w-5 h-5 border-2 border-indigo-300 rounded bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none transition-all" />
              <svg className="absolute inset-0 w-3.5 h-3.5 m-auto text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-xs text-slate-600 leading-tight">
              Je certifie l'exactitude des informations médicales consignées dans ce dossier et procède à sa clôture numérique.
            </span>
          </label>
          <input
            type="text"
            name="signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
            placeholder="Signature électronique (Saisissez votre nom)"
            className="w-full bg-white border border-indigo-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}
