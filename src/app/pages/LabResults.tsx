import { motion } from "motion/react";
import { Download, FileText, Microscope, Filter, ChevronDown } from "lucide-react";

export function LabResults() {
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
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Examens Biologiques</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors">
            <Microscope className="w-4 h-4" />
            Nouvelle Demande
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Bilan Sanguin Complet</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Prescrit par Dr. Dupont • 12 Octobre 2023</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-indigo-100 transition-colors">
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 rounded-tl-xl font-semibold">Examen</th>
                  <th className="px-6 py-4 font-semibold">Résultat</th>
                  <th className="px-6 py-4 font-semibold">Unités</th>
                  <th className="px-6 py-4 rounded-tr-xl font-semibold">Valeurs de Référence</th>
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
                    <td className="px-6 py-4 font-medium text-slate-800">{row.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-sm ${
                        row.status === 'high' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {row.result}
                        {row.status === 'high' && <ChevronDown className="w-4 h-4 rotate-180" />}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{row.unit}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 overflow-hidden opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-2xl text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Bilan Hépatique</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Prescrit par Dr. Martin • En attente de résultats</p>
              </div>
            </div>
            <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-sm font-bold">
              En cours
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
