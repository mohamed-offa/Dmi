import { motion } from "motion/react";
import { ShieldAlert, History as HistoryIcon, ActivitySquare } from "lucide-react";

export function History() {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } } };

  return (
    <div className="min-h-full bg-[#f8f9fb]">
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Antécédents Médicaux</h1>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Allergies */}
          <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <ShieldAlert className="w-[18px] h-[18px]" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">Allergies & Intolérances</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "Pénicilline", severity: "Sévère", date: "Découvert en 2010" },
                { name: "Arachides", severity: "Modérée", date: "Depuis l'enfance" },
              ].map((alg, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{alg.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{alg.date}</div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                    alg.severity === "Sévère" ? "bg-red-50 text-red-600 border border-red-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                  }`}>
                    {alg.severity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pathologies */}
          <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                <ActivitySquare className="w-[18px] h-[18px]" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">Pathologies Chroniques</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "Hypertension Artérielle", status: "Contrôlée", date: "Diagnostiqué en 2018" },
                { name: "Diabète Type 2", status: "En surveillance", date: "Diagnostiqué en 2020" },
              ].map((path, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{path.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{path.date}</div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                    path.status === "Contrôlée" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {path.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Surgical History */}
          <motion.div variants={item} className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <HistoryIcon className="w-[18px] h-[18px]" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">Historique Chirurgical</h2>
            </div>
            <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6 pb-2">
              {[
                { op: "Appendicectomie", date: "15 Mai 2005", surgeon: "Dr. Lambert", hospital: "Clinique des Lilas" },
                { op: "Ablation de la vésicule biliaire", date: "10 Octobre 2019", surgeon: "Dr. Dubois", hospital: "Hôpital Central" },
              ].map((surg, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-[3px] border-indigo-500" />
                  <div className="text-sm font-bold text-slate-700">{surg.op}</div>
                  <div className="text-xs text-indigo-500 font-semibold mb-1.5">{surg.date}</div>
                  <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl inline-block border border-slate-100">
                    <span className="block">Chirurgien : {surg.surgeon}</span>
                    <span className="block mt-0.5">Lieu : {surg.hospital}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
