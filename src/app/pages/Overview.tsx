import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Users, Activity, ClipboardCheck, AlertTriangle, TrendingUp,
  Pill, FlaskConical, BedDouble, Stethoscope, ChevronRight,
  Clock, CheckCircle2, ArrowUpRight, Heart, Syringe,
  CalendarDays, ShieldAlert, Loader2,
} from "lucide-react";
import { getStats, getPatients, getTodayInterventions, getAlerts } from "../api";
import type { Patient, Intervention, Alert, Stats } from "../api";

const ALERT_ICONS: Record<string, any> = { critical: ShieldAlert, warning: FlaskConical, info: CheckCircle2 };

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return `Il y a ${Math.floor(hrs / 24)}j`;
}

export function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getStats(), getPatients(), getTodayInterventions(), getAlerts()])
      .then(([s, p, i, a]) => { setStats(s); setPatients(p); setInterventions(i); setAlerts(a); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  if (loading) {
    return (
      <div className="min-h-full bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[#f8f9fb] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 mb-1">Erreur de connexion</p>
          <p className="text-xs text-slate-400">{error}</p>
          <p className="text-xs text-slate-400 mt-2">Vérifiez que le serveur API est lancé sur le port 3001.</p>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Patients Actifs", value: String(stats?.activePatients ?? 0), change: `+${stats?.todayPatients ?? 0} aujourd'hui`, icon: Users, color: "indigo", trend: (stats?.todayPatients ?? 0) > 0 ? "up" : "neutral" },
    { label: "Interventions Prévues", value: String(stats?.todayInterventions ?? 0), change: "Aujourd'hui", icon: Syringe, color: "violet", trend: "neutral" },
    { label: "Dossiers Complets", value: `${stats?.completionRate ?? 0}%`, change: "Taux de complétion", icon: ClipboardCheck, color: "emerald", trend: "up" },
    { label: "Alertes Actives", value: String(stats?.activeAlerts ?? 0), change: `${stats?.criticalAlerts ?? 0} critiques`, icon: AlertTriangle, color: "amber", trend: (stats?.activeAlerts ?? 0) > 0 ? "down" : "neutral" },
  ];

  const COLOR_MAP: Record<string, { iconBg: string; text: string; badge: string }> = {
    indigo:  { iconBg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-50 text-indigo-600" },
    violet:  { iconBg: "bg-violet-100", text: "text-violet-600", badge: "bg-violet-50 text-violet-600" },
    emerald: { iconBg: "bg-emerald-100", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-600" },
    amber:   { iconBg: "bg-amber-100", text: "text-amber-600", badge: "bg-amber-50 text-amber-600" },
  };

  const dept = stats?.department;
  const deptStats = [
    { label: "Consultations Pré-Anesthésiques", count: parseInt(dept?.consultations_done ?? "0"), total: Math.max(parseInt(dept?.consultations_total ?? "1"), 1), icon: Stethoscope },
    { label: "Prescriptions Actives", count: parseInt(dept?.prescriptions_done ?? "0"), total: Math.max(parseInt(dept?.prescriptions_total ?? "1"), 1), icon: Pill },
    { label: "Examens Biologiques", count: parseInt(dept?.exams_done ?? "0"), total: Math.max(parseInt(dept?.exams_total ?? "1"), 1), icon: FlaskConical },
    { label: "Transferts Post-Op", count: parseInt(dept?.transfers_done ?? "0"), total: Math.max(parseInt(dept?.transfers_total ?? "1"), 1), icon: BedDouble },
  ];

  return (
    <div className="min-h-full bg-[#f8f9fb]">
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Vue d'ensemble</h1>
            <p className="text-xs text-slate-400 -mt-0.5">Statut global du service d'anesthésie</p>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, i) => {
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
          {/* Recent Patients */}
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
            {patients.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Aucun patient enregistré</p>
                <button onClick={() => navigate("/workflow")} className="text-xs text-indigo-500 font-semibold mt-2 hover:text-indigo-700">
                  Créer un premier dossier →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {patients.slice(0, 6).map((p) => {
                  const completedSteps = parseInt(p.completed_steps ?? "0");
                  const progress = Math.round((completedSteps / 10) * 100);
                  const phase = p.last_phase || "PRE-OP";
                  return (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate("/workflow")}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        p.status === "complet" ? "bg-emerald-50 text-emerald-600" :
                        p.status === "alerte" ? "bg-red-50 text-red-500" :
                        "bg-indigo-50 text-indigo-600"
                      }`}>
                        {p.first_name[0]}{p.last_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-700 truncate">{p.first_name} {p.last_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.dmi_id}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400">{p.last_step || "Aucune étape"}</span>
                          <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                            phase === "PRE-OP" ? "bg-indigo-50 text-indigo-500 border-indigo-200" :
                            phase === "PER-OP" ? "bg-rose-50 text-rose-500 border-rose-200" :
                            "bg-emerald-50 text-emerald-500 border-emerald-200"
                          }`}>{phase}</span>
                        </div>
                      </div>
                      <div className="w-20 shrink-0">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-400">Progrès</span>
                          <span className="font-bold text-slate-600">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Alerts */}
          <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertes
              </h2>
              {(stats?.criticalAlerts ?? 0) > 0 && (
                <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-md border border-red-100">
                  {stats?.criticalAlerts} critiques
                </span>
              )}
            </div>
            {alerts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Aucune alerte active</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {alerts.slice(0, 5).map((alert) => {
                  const Icon = ALERT_ICONS[alert.type] || CheckCircle2;
                  return (
                    <div key={alert.id} className="px-5 py-3.5 flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        alert.type === "critical" ? "bg-red-50 text-red-500" :
                        alert.type === "warning" ? "bg-amber-50 text-amber-500" :
                        "bg-emerald-50 text-emerald-500"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 font-medium leading-snug">{alert.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(alert.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Today's Interventions */}
          <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-violet-500" />
                Interventions du Jour
              </h2>
            </div>
            {interventions.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CalendarDays className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Aucune intervention prévue aujourd'hui</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {interventions.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-14 text-center shrink-0">
                      <span className="text-lg font-bold text-indigo-600">{u.scheduled_time?.slice(0, 5)}</span>
                    </div>
                    <div className="w-px h-10 bg-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{u.procedure_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{u.first_name} {u.last_name} · {u.room}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                      u.anesth_type === "AG" ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-sky-50 text-sky-600 border-sky-200"
                    }`}>
                      {u.anesth_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
              {deptStats.map((d, i) => {
                const pct = d.total > 0 ? Math.round((d.count / d.total) * 100) : 0;
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
                      <div className={`h-full rounded-full transition-all ${pct === 100 ? "bg-emerald-500" : pct >= 75 ? "bg-indigo-500" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Live monitoring strip */}
        <motion.div variants={item} className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Monitorage en temps réel</p>
              <p className="text-xs text-slate-400">{stats?.activePatients ?? 0} patients dans le système</p>
            </div>
          </div>
          <button onClick={() => navigate("/workflow")} className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shrink-0 border border-white/10">
            Ouvrir le Workflow <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
