import { motion } from "motion/react";
import { Download, FileText, Microscope, ChevronUp } from "lucide-react";

export function LabResults() {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } } };

  return (
    <div className="min-h-full bg-[#f8f9fb]">
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Examens Biologiques</h1>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors">
            <Microscope className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle Demande</span>
          </button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Bilan Sanguin Complet</h2>
              <p className="text-xs text-slate-400 mt-0.5">Prescrit par Dr. Dupont · 12 Octobre 2023</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-100">
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">Examen</th>
                  <th className="px-5 py-3 font-semibold">Résultat</th>
                  <th className="px-5 py-3 font-semibold">Unités</th>
                  <th className="px-5 py-3 font-semibold">Valeurs de Référence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Hémoglobine", result: "14.2", unit: "g/dL", ref: "12.0 - 16.0", status: "normal" },
                  { name: "Leucocytes", result: "7.5", unit: "G/L", ref: "4.0 - 10.0", status: "normal" },
                  { name: "Glycémie à jeun", result: "1.25", unit: "g/L", ref: "0.70 - 1.10", status: "high" },
                  { name: "Cholestérol Total", result: "2.40", unit: "g/L", ref: "< 2.00", status: "high" },
                  { name: "Triglycérides", result: "1.45", unit: "g/L", ref: "< 1.50", status: "normal" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{row.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        row.status === "high" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {row.result}
                        {row.status === "high" && <ChevronUp className="w-3 h-3" />}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{row.unit}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 opacity-60 hover:opacity-100 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-700">Bilan Hépatique</h2>
              <p className="text-xs text-slate-400 mt-0.5">Prescrit par Dr. Martin · En attente de résultats</p>
            </div>
            <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-amber-100">
              En cours
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
