import { motion } from "motion/react";
import { ShieldAlert, History as HistoryIcon, UserPlus, ActivitySquare } from "lucide-react";

export function History() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Antécédents Médicaux</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          Ajouter un antécédent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allergies */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2.5 rounded-xl text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Allergies & Intolérances</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "Pénicilline", severity: "Sévère", date: "Découvert en 2010" },
              { name: "Arachides", severity: "Modérée", date: "Depuis l'enfance" },
            ].map((alg, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                <div>
                  <div className="font-semibold text-slate-800">{alg.name}</div>
                  <div className="text-xs text-slate-500">{alg.date}</div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  alg.severity === 'Sévère' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {alg.severity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pathologies */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
              <ActivitySquare className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Pathologies Chroniques</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "Hypertension Artérielle", status: "Contrôlée", date: "Diagnostiqué en 2018" },
              { name: "Diabète Type 2", status: "En surveillance", date: "Diagnostiqué en 2020" },
            ].map((path, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">{path.name}</div>
                  <div className="text-xs text-slate-500">{path.date}</div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  path.status === 'Contrôlée' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {path.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Surgical History */}
        <motion.div variants={item} className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Historique Chirurgical</h2>
          </div>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
            {[
              { op: "Appendicectomie", date: "15 Mai 2005", surgeon: "Dr. Lambert", hospital: "Clinique des Lilas" },
              { op: "Ablation de la vésicule biliaire", date: "10 Octobre 2019", surgeon: "Dr. Dubois", hospital: "Hôpital Central" },
            ].map((surg, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
                <div className="font-bold text-slate-800">{surg.op}</div>
                <div className="text-sm text-indigo-600 font-semibold mb-1">{surg.date}</div>
                <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl inline-block mt-2">
                  <span className="block">Chirurgien: {surg.surgeon}</span>
                  <span className="block">Lieu: {surg.hospital}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
