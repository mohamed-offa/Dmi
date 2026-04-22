import { motion } from "motion/react";
import { Pill, Plus, Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Prescriptions() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Prescriptions Actives</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle Ordonnance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            name: "Ramipril",
            dose: "5 mg",
            freq: "1 fois par jour",
            time: "Matin",
            status: "active",
            startDate: "10 Oct 2023",
            endDate: "10 Avr 2024",
            doctor: "Dr. Dupont",
            warning: null,
          },
          {
            name: "Atorvastatine",
            dose: "20 mg",
            freq: "1 fois par jour",
            time: "Soir",
            status: "active",
            startDate: "15 Oct 2023",
            endDate: "15 Avr 2024",
            doctor: "Dr. Martin",
            warning: "À prendre au cours du repas",
          },
          {
            name: "Amoxicilline",
            dose: "1 g",
            freq: "3 fois par jour",
            time: "Matin, Midi, Soir",
            status: "ending",
            startDate: "01 Nov 2023",
            endDate: "07 Nov 2023",
            doctor: "Dr. Lemaire",
            warning: "Fin de traitement dans 2 jours",
          },
        ].map((med, i) => (
          <motion.div key={i} variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 relative overflow-hidden group hover:border-indigo-300 transition-colors">
            <div className={`absolute top-0 left-0 w-2 h-full ${
              med.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />

            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-2xl ${
                  med.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{med.name}</h3>
                  <div className="text-indigo-600 font-semibold">{med.dose}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                {med.freq}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Du {med.startDate} au {med.endDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">D</div>
                <span>Prescrit par {med.doctor}</span>
              </div>
              {med.warning && (
                <div className={`flex items-start gap-2 text-sm p-3 rounded-xl mt-4 ${
                  med.status === 'ending' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-medium">{med.warning}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                Renouveler
              </button>
              <button className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors text-sm">
                Voir l'ordonnance
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Historique des traitements */}
      <motion.div variants={item} className="mt-8 bg-slate-50/50 rounded-3xl p-6 border border-slate-200/60 border-dashed">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-slate-400" />
          Traitements Terminés
        </h2>
        <div className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
          <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div>
              <div className="font-bold text-slate-800">Paracétamol 1g</div>
              <div className="text-sm text-slate-500">Terminé le 12 Septembre 2023</div>
            </div>
            <div className="text-sm font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              7 jours
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
