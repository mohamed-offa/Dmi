import { motion } from "motion/react";
import { Pill, Plus, Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Prescriptions() {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } } };

  return (
    <div className="min-h-full bg-[#f8f9fb]">
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Prescriptions Actives</h1>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle Ordonnance</span>
          </button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { name: "Ramipril", dose: "5 mg", freq: "1 fois par jour", time: "Matin", status: "active", startDate: "10 Oct 2023", endDate: "10 Avr 2024", doctor: "Dr. Dupont", warning: null },
            { name: "Atorvastatine", dose: "20 mg", freq: "1 fois par jour", time: "Soir", status: "active", startDate: "15 Oct 2023", endDate: "15 Avr 2024", doctor: "Dr. Martin", warning: "À prendre au cours du repas" },
            { name: "Amoxicilline", dose: "1 g", freq: "3 fois par jour", time: "Matin, Midi, Soir", status: "ending", startDate: "01 Nov 2023", endDate: "07 Nov 2023", doctor: "Dr. Lemaire", warning: "Fin de traitement dans 2 jours" },
          ].map((med, i) => (
            <motion.div key={i} variants={item} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 relative overflow-hidden group hover:border-indigo-200 transition-all">
              <div className={`absolute top-0 left-0 w-1 h-full rounded-r ${med.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.status === "active" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"}`}>
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{med.name}</h3>
                    <div className="text-xs text-indigo-500 font-semibold">{med.dose}</div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                  <Clock className="w-3.5 h-3.5" />
                  {med.freq}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  <span>Du {med.startDate} au {med.endDate}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">D</div>
                  <span>Prescrit par {med.doctor}</span>
                </div>
                {med.warning && (
                  <div className={`flex items-start gap-2 text-xs p-3 rounded-xl mt-2 ${
                    med.status === "ending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="font-medium">{med.warning}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 border-t border-slate-100 pt-3.5">
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl transition-colors text-xs border border-slate-100">
                  Renouveler
                </button>
                <button className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-xl transition-colors text-xs border border-indigo-100">
                  Voir l'ordonnance
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm border-dashed">
          <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            Traitements Terminés
          </h2>
          <div className="opacity-50 hover:opacity-100 transition-all cursor-pointer">
            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="text-sm font-semibold text-slate-700">Paracétamol 1g</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Terminé le 12 Septembre 2023</div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-100">7 jours</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
