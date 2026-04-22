import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Heart, Wind, Droplets } from "lucide-react";

// Generate initial fake data for the last 15 seconds
const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 15; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 1000);
    data.push({
      time: t.toLocaleTimeString('fr-FR', { minute: '2-digit', second: '2-digit' }),
      fc: 68 + Math.floor(Math.random() * 5),
      spo2: 98 + Math.floor(Math.random() * 2),
      sys: 115 + Math.floor(Math.random() * 10),
      dia: 75 + Math.floor(Math.random() * 5),
    });
  }
  return data;
};

export function CockpitForm() {
  const [data, setData] = useState(generateInitialData());
  const [currentVitals, setCurrentVitals] = useState(data[data.length - 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { minute: '2-digit', second: '2-digit' });
        
        // Slight random walk based on previous values
        const last = newData[newData.length - 1];
        const newPoint = {
          time,
          fc: Math.max(50, Math.min(120, last.fc + (Math.random() * 4 - 2))),
          spo2: Math.max(90, Math.min(100, last.spo2 + (Math.random() * 2 - 0.5))),
          sys: Math.max(90, Math.min(160, last.sys + (Math.random() * 6 - 3))),
          dia: Math.max(50, Math.min(100, last.dia + (Math.random() * 4 - 2))),
        };
        
        newData.push(newPoint);
        if (newData.length > 20) newData.shift(); // Keep last 20 points
        
        setCurrentVitals(newPoint);
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Vitals Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/30 border border-green-500/20 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-green-500/10">
            <Heart className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-1.5 text-green-400 mb-1 z-10">
            <Heart className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold">FC</span>
          </div>
          <span className="text-2xl font-bold text-white z-10">{Math.round(currentVitals.fc)}</span>
          <span className="text-[10px] text-green-500/50 z-10">bpm</span>
        </div>

        <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-cyan-500/10">
            <Wind className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1 z-10">
            <Wind className="w-4 h-4" />
            <span className="text-xs font-bold">SpO₂</span>
          </div>
          <span className="text-2xl font-bold text-white z-10">{Math.round(currentVitals.spo2)}</span>
          <span className="text-[10px] text-cyan-500/50 z-10">%</span>
        </div>

        <div className="bg-black/30 border border-purple-500/20 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-purple-500/10">
            <Activity className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 mb-1 z-10">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold">PNI</span>
          </div>
          <span className="text-2xl font-bold text-white z-10 flex items-baseline gap-1">
            {Math.round(currentVitals.sys)}<span className="text-sm text-purple-400/80">/{Math.round(currentVitals.dia)}</span>
          </span>
          <span className="text-[10px] text-purple-500/50 z-10">mmHg</span>
        </div>

        <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-amber-500/10">
            <Droplets className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 mb-1 z-10">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-bold">Perfusion</span>
          </div>
          <span className="text-2xl font-bold text-white z-10 text-center text-sm mt-1">Cristalloïdes</span>
          <span className="text-[10px] text-amber-500/50 z-10">En cours</span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-black/20 border border-white/10 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center justify-between">
          <span>Surveillance Monitorage Continu</span>
          <span className="flex items-center gap-1.5 text-[10px] text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Enregistrement actif
          </span>
        </h4>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickMargin={10}
                tickFormatter={(val) => val}
              />
              <YAxis 
                yAxisId="left"
                stroke="#94a3b8" 
                fontSize={10} 
                domain={[40, 180]} 
                tickCount={6}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#06b6d4" 
                fontSize={10} 
                domain={[80, 100]} 
                tickCount={5}
                hide
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111A18', borderColor: '#ffffff20', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="fc" 
                name="FC (bpm)" 
                stroke="#4ade80" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="spo2" 
                name="SpO₂ (%)" 
                stroke="#06b6d4" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="sys" 
                name="Systolique" 
                stroke="#c084fc" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Context from Anesthesia Sheet */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="text-xs font-bold text-violet-400 mb-3">CONTRÔLE PEROPÉRATOIRE</h4>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center shrink-0 mt-0.5">
              <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-violet-500 checked:border-violet-500 focus:outline-none transition-all" />
              <svg className="absolute inset-0 w-3 h-3 m-auto text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Stabilité hémodynamique maintenue</span>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center shrink-0 mt-0.5">
              <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-violet-500 checked:border-violet-500 focus:outline-none transition-all" />
              <svg className="absolute inset-0 w-3 h-3 m-auto text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Réinjections d'anesthésiques / Analgésiques</span>
              <input type="text" name="reinjections" placeholder="Préciser les doses..." className="mt-2 w-full bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-white text-xs focus:outline-none focus:border-violet-500/50" />
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center shrink-0 mt-0.5">
              <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-violet-500 checked:border-violet-500 focus:outline-none transition-all" />
              <svg className="absolute inset-0 w-3 h-3 m-auto text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Événement critique peropératoire</span>
              <input type="text" name="evenement_critique" placeholder="Hypotension, saignement..." className="mt-2 w-full bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-white text-xs focus:outline-none focus:border-violet-500/50" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}