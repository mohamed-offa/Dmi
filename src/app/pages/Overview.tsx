import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Users, Activity, ClipboardCheck, AlertTriangle, TrendingUp,
  Pill, FlaskConical, BedDouble, Stethoscope, ChevronRight,
  Clock, CheckCircle2, XCircle, ArrowUpRight, Heart, Syringe,
  CalendarDays, ShieldAlert,
} from "lucide-react";

const STATS = [
  { label: "Patients Actifs", value: "24", change: "+3 aujourd'hui", icon: Users, color: "indigo", trend: "up" },
  { label: "Interventions Prévues", value: "8", change: "Cette semaine", icon: Syringe, color: "violet", trend: "neutral" },
  { label: "Dossiers Complets", value: "87%", change: "+5% vs semaine dern.", icon: ClipboardCheck, color: "emerald", trend: "up" },
  { label: "Alertes Actives", value: "3", change: "2 critiques", icon: AlertTriangle, color: "amber", trend: "down" },
];

const COLOR_MAP: Record<string, { bg: string; iconBg: string; text: string; badge: string }> = {
  indigo:  { bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-50 text-indigo-600" },
  violet:  { bg: "bg-violet-50", iconBg: "bg-violet-100", text: "text-violet-600", badge: "bg-violet-50 text-violet-600" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-600" },
  amber:   { bg: "bg-amber-50", iconBg: "bg-amber-100", text: "text-amber-600", badge: "bg-amber-50 text-amber-600" },
};

const RECENT_PATIENTS = [
  { name: "Ahmed Benali", id: "DMI-48291", status: "en-cours", step: "Cockpit Peropératoire", phase: "PER-OP", progress: 70 },
  { name: "Fatima Zahra", id: "DMI-37182", status: "complet", step: "Synthèse & Validation", phase: "POST-OP", progress: 100 },
  { name: "Youssef Amrani", id: "DMI-59304", status: "en-cours", step: "Examen Clinique", phase: "PRE-OP", progress: 30 },
  { name: "Nadia Kabbaj", id: "DMI-61025", status: "alerte", step: "Scores de Risque", phase: "PRE-OP", progress: 40 },
  { name: "Omar Tazi", id: "DMI-72841", status: "en-cours", step: "Prémédication", phase: "PRE-OP", progress: 50 },
];

const UPCOMING = [
  { patient: "Ahmed Benali", procedure: "Cholécystectomie", time: "08:30", room: "Bloc A - Salle 2", anesthType: "AG" },
  { patient: "Nadia Kabbaj", procedure: "Arthroscopie genou", time: "10:00", room: "Bloc B - Salle 1", anesthType: "ALR" },
  { patient: "Karim Idrissi", procedure: "Appendicectomie", time: "14:00", room: "Bloc A - Salle 3", anesthType: "AG" },
];

const ALERTS = [
  { type: "critical", message: "Allergie Pénicilline non confirmée — Nadia Kabbaj", time: "Il y a 12 min", icon: ShieldAlert },
  { type: "warning", message: "Bilan hépatique en attente — Omar Tazi", time: "Il y a 45 min", icon: FlaskConical },
  { type: "info", message: "Dossier DMI-37182 validé et clôturé", time: "Il y a 2h", icon: CheckCircle2 },
];

const DEPARTMENT_STATS = [
  { label: "Consultations Pré-Anesthésiques", count: 18, total: 24, icon: Stethoscope, color: "sky" },
  { label: "Prescriptions Actives", count: 42, total: 42, icon: Pill, color: "purple" },
  { label: "Examens Biologiques", count: 15, total: 20, icon: FlaskConical, color: "cyan" },
  { label: "Transferts Post-Op", count: 6, total: 8, icon: BedDouble, color: "blue" },
];

export function Overview() {
  const navigate = useNavigate();

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-full bg-[#f8f9fb]">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Vue d'ensemble</h1>
            <p className="text-xs text-slate-400 -mt-0.5">Statut global du service d'anesthésie</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">
              <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const c = COLOR_MAP[stat.color];
            return (
              <motion.div key={i} variants={item} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.trend === "up" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                  {stat.trend === "down" && <ArrowUpRight className="w-4 h-4 text-amber-500 rotate-90" />}
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                <p className={`text-[10px] font-semibold mt-2 ${c.badge} px-2 py-0.5 rounded-md inline-block`}>{stat.change}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Patients — takes 2 cols */}
          <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Patients Récents
              </h2>
              <button onClick={() => navigate("/workflow")} className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1 transition-colors">
                Voir tout <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {RECENT_PATIENTS.map((p, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate("/workflow")}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    p.status === "complet" ? "bg-emerald-50 text-emerald-600" :
                    p.status === "alerte" ? "bg-red-50 text-red-500" :
                    "bg-indigo-50 text-indigo-600"
                  }`}>
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700 truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400">{p.step}</span>
                      <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                        p.phase === "PRE-OP" ? "bg-indigo-50 text-indigo-500 border-indigo-200" :
                        p.phase === "PER-OP" ? "bg-rose-50 text-rose-500 border-rose-200" :
                        "bg-emerald-50 text-emerald-500 border-emerald-200"
                      }`}>{p.phase}</span>
                    </div>
                  </div>
                  <div className="w-20 shrink-0">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Progrès</span>
                      <span className="font-bold text-slate-600">{p.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        p.progress === 100 ? "bg-emerald-500" :
                        p.status === "alerte" ? "bg-red-400" :
                        "bg-indigo-500"
                      }`} style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertes
              </h2>
              <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-md border border-red-100">
                {ALERTS.filter(a => a.type === "critical").length} critiques
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {ALERTS.map((alert, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.type === "critical" ? "bg-red-50 text-red-500" :
                    alert.type === "warning" ? "bg-amber-50 text-amber-500" :
                    "bg-emerald-50 text-emerald-500"
                  }`}>
                    <alert.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 font-medium leading-snug">{alert.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Upcoming Interventions */}
          <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-violet-500" />
                Interventions du Jour
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {UPCOMING.map((u, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-14 text-center shrink-0">
                    <span className="text-lg font-bold text-indigo-600">{u.time}</span>
                  </div>
                  <div className="w-px h-10 bg-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700">{u.procedure}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{u.patient} · {u.room}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                    u.anesthType === "AG" ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-sky-50 text-sky-600 border-sky-200"
                  }`}>
                    {u.anesthType}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Department Stats */}
          <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Statut par Section
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {DEPARTMENT_STATS.map((d, i) => {
                const pct = Math.round((d.count / d.total) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <d.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">{d.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{d.count}/{d.total}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct === 100 ? "bg-emerald-500" : pct >= 75 ? "bg-indigo-500" : "bg-amber-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick vitals strip */}
        <motion.div variants={item} className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Monitorage en temps réel</p>
              <p className="text-xs text-slate-400">3 patients actuellement au bloc opératoire</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-slate-400">Bloc A</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-400">Stable</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Bloc B</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-400">Stable</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">SSPI</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-bold text-amber-400">1 alerte</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/workflow")} className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shrink-0 border border-white/10">
            Ouvrir le Cockpit <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
