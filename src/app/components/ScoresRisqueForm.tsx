import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Section = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-3 bg-black/20">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="font-bold text-sm text-teal-400">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
      </button>
      {isOpen && <div className="p-4 space-y-5 text-sm text-slate-300">{children}</div>}
    </div>
  );
};

const Checkbox = ({ label, name }: { label: string, name: string }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative flex items-start pt-0.5 shrink-0">
      <input 
        type="checkbox" 
        name={name} 
        className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-amber-500 checked:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" 
      />
      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block text-black" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="group-hover:text-white transition-colors leading-snug">{label}</span>
  </label>
);

const RadioGroup = ({ label, name, options }: { label: string, name: string, options: string[] }) => (
  <div className="space-y-2">
    <p className="font-semibold text-slate-200 leading-snug">{label}</p>
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt} className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center pt-0.5 shrink-0">
            <input 
              type="radio" 
              name={name} 
              value={opt} 
              className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-amber-500 checked:border-amber-500 focus:outline-none transition-all" 
            />
            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
          </div>
          <span className="group-hover:text-white transition-colors leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const TextInput = ({ label, name, placeholder, type = "text" }: { label: string, name: string, placeholder?: string, type?: string }) => (
  <div className="space-y-1.5">
    <label className="font-semibold text-slate-200">{label}</label>
    <input 
      type={type} 
      name={name} 
      placeholder={placeholder} 
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" 
    />
  </div>
);

export function ScoresRisqueForm() {
  return (
    <div className="space-y-1">
      <Section title="Score de DUKE & METs" defaultOpen={true}>
        <p className="text-xs text-slate-400 mb-3 italic">Cochez les activités possibles :</p>
        <div className="space-y-3">
          <Checkbox label="Prendre soin de soi (manger, s'habiller...) (2.75)" name="duke_1" />
          <Checkbox label="Marcher à l’intérieur (1.75)" name="duke_2" />
          <Checkbox label="Marcher 1 à 2 pâtés de maisons sur sol plat (2.75)" name="duke_3" />
          <Checkbox label="Monter un escalier ou une colline (5.50)" name="duke_4" />
          <Checkbox label="Courir sur une courte distance (8.00)" name="duke_5" />
          <Checkbox label="Travaux légers à la maison (2.70)" name="duke_6" />
          <Checkbox label="Travaux modérés (aspirateur, courses) (3.50)" name="duke_7" />
          <Checkbox label="Gros travaux (déplacer meubles lourds) (8.00)" name="duke_8" />
          <Checkbox label="Jardinage (tondre, désherber) (4.50)" name="duke_9" />
          <Checkbox label="Relations sexuelles (5.25)" name="duke_10" />
          <Checkbox label="Activités récréatives modérées (golf, danse) (6.00)" name="duke_11" />
          <Checkbox label="Sports intenses (natation, foot) (7.50)" name="duke_12" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
          <TextInput label="Total DUKE" name="duke_total" type="number" step="0.01" />
          <TextInput label="MET calculé" name="met_calcule" type="number" step="0.01" />
        </div>
        <div className="mt-4">
          <RadioGroup 
            label="Tolérance (METs)" 
            name="met_tolerance" 
            options={["Tolérance faible (< 4 METs)", "Tolérance modérée (4–7 METs)", "Bonne tolérance (> 7 METs)"]} 
          />
        </div>
      </Section>

      <Section title="Cardiovasculaire (Lee, NYHA, CHA₂DS₂-VASc)">
        <h4 className="text-amber-400 font-bold mb-3 border-b border-white/10 pb-1">Score de risque de Lee</h4>
        <div className="space-y-3">
          <Checkbox label="Chirurgie à haut risque (1 pt)" name="lee_1" />
          <Checkbox label="Coronaropathie (1 pt)" name="lee_2" />
          <Checkbox label="Insuffisance cardiaque (1 pt)" name="lee_3" />
          <Checkbox label="AVC / AIT (1 pt)" name="lee_4" />
          <Checkbox label="Diabète insulinodépendant (1 pt)" name="lee_5" />
          <Checkbox label="Insuffisance rénale chronique (1 pt)" name="lee_6" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextInput label="Total Lee (/6)" name="lee_total" type="number" />
        </div>
        <div className="mt-4">
          <RadioGroup label="Risque de Lee" name="lee_risque" options={["Faible (0–1 point)", "Intermédiaire (2 points)", "Élevé (≥ 3 points)"]} />
        </div>

        <h4 className="text-amber-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">NYHA (Insuffisance cardiaque)</h4>
        <RadioGroup 
          label="Classe NYHA" 
          name="nyha_classe" 
          options={[
            "Classe I : Pas de limitation. Activité normale.", 
            "Classe II : Limitation légère. Effort entraîne fatigue.", 
            "Classe III : Limitation marquée. Effort habituel entraîne symptômes.", 
            "Classe IV : Incapacité à tout effort. Symptômes au repos."
          ]} 
        />

        <h4 className="text-amber-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Score CHA₂DS₂-VASc (FA)</h4>
        <div className="space-y-3">
          <Checkbox label="Insuffisance cardiaque congestive (1 pt)" name="cha_1" />
          <Checkbox label="Hypertension artérielle (1 pt)" name="cha_2" />
          <Checkbox label="Âge ≥ 75 ans (2 pts)" name="cha_3" />
          <Checkbox label="Diabète (1 pt)" name="cha_4" />
          <Checkbox label="AVC / AIT / embolie (2 pts)" name="cha_5" />
          <Checkbox label="Maladie vasculaire (1 pt)" name="cha_6" />
          <Checkbox label="Âge 65–74 ans (1 pt)" name="cha_7" />
          <Checkbox label="Sexe féminin (1 pt)" name="cha_8" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextInput label="Total CHA₂DS₂-VASc (/9)" name="cha_total" type="number" />
        </div>
        <div className="mt-4">
          <RadioGroup label="Risque Thromboembolique" name="cha_risque" options={["Faible (0–1)", "Intermédiaire (2–3)", "Élevé (≥ 4)"]} />
        </div>
      </Section>

      <Section title="Pulmonaire (STOP-BANG, GOLD, ARISCAT)">
        <h4 className="text-amber-400 font-bold mb-3 border-b border-white/10 pb-1">Score STOP-BANG (SAS)</h4>
        <div className="space-y-3">
          <Checkbox label="Ronflement habituel (1 pt)" name="stop_1" />
          <Checkbox label="Fatigue diurne (1 pt)" name="stop_2" />
          <Checkbox label="Observation d’apnée nocturne (1 pt)" name="stop_3" />
          <Checkbox label="Hypertension artérielle (1 pt)" name="stop_4" />
          <Checkbox label="IMC > 35 kg/m² (1 pt)" name="stop_5" />
          <Checkbox label="Âge > 50 ans (1 pt)" name="stop_6" />
          <Checkbox label="Circonférence cou > 40 cm (1 pt)" name="stop_7" />
          <Checkbox label="Sexe masculin (1 pt)" name="stop_8" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextInput label="Total STOP-BANG (/8)" name="stop_total" type="number" />
        </div>
        <div className="mt-4">
          <RadioGroup label="Risque de SAS" name="stop_risque" options={["Faible (0–2)", "Intermédiaire (3–4)", "Élevé (5–8)"]} />
        </div>

        <h4 className="text-amber-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Score GOLD (BPCO)</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextInput label="Grade VEMS (%)" name="gold_vems" type="number" />
        </div>
        <RadioGroup label="Stade GOLD" name="gold_stade" options={["GOLD 1 : ≥ 80 % (léger)", "GOLD 2 : 50–79 % (modéré)", "GOLD 3 : 30–49 % (sévère)", "GOLD 4 : < 30 % (très sévère)"]} />

        <h4 className="text-amber-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Score ARISCAT (Complications Pulm.)</h4>
        <div className="space-y-4">
          <RadioGroup label="SpO₂ préopératoire" name="ari_spo2" options={["≥ 96 % (0 pt)", "91–95 % (8 pts)", "≤ 90 % (24 pts)"]} />
          <RadioGroup label="Âge" name="ari_age" options={["≤ 50 ans (0 pt)", "51–80 ans (3 pts)", "> 80 ans (16 pts)"]} />
          <RadioGroup label="Infection respiratoire récente (1 mois)" name="ari_infection" options={["Non (0 pt)", "Oui (17 pts)"]} />
          <RadioGroup label="Anémie préopératoire (Hb ≤ 10 g/dL)" name="ari_anemie" options={["Non (0 pt)", "Oui (11 pts)"]} />
          <RadioGroup label="Incision chirurgicale" name="ari_incision" options={["Périphérique (0 pt)", "Abdominale supérieure (15 pts)", "Intra-thoracique (24 pts)"]} />
          <RadioGroup label="Durée de la chirurgie" name="ari_duree" options={["< 2 h (0 pt)", "2–3 h (16 pts)", "> 3 h (16 pts)"]} />
          <RadioGroup label="Procédure d’urgence" name="ari_urgence" options={["Non (0 pt)", "Oui (8 pts)"]} />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <TextInput label="Total ARISCAT" name="ari_total" type="number" />
        </div>
        <div className="mt-4">
          <RadioGroup label="Risque ARISCAT" name="ari_risque" options={["Faible : < 26 (1.6%)", "Intermédiaire : 26–44 (13.3%)", "Élevé : ≥ 45 (42.1%)"]} />
        </div>
      </Section>

      <Section title="Autres Scores (Apfel, Child-Pugh, ASA)">
        <h4 className="text-amber-400 font-bold mb-3 border-b border-white/10 pb-1">Score d'Apfel (NVPO)</h4>
        <div className="space-y-3">
          <Checkbox label="Sexe féminin (1 pt)" name="apfel_1" />
          <Checkbox label="Non-fumeur (1 pt)" name="apfel_2" />
          <Checkbox label="Antécédents de NVPO ou mal des transports (1 pt)" name="apfel_3" />
          <Checkbox label="Utilisation d’opioïdes postopératoires (1 pt)" name="apfel_4" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextInput label="Total Apfel (/4)" name="apfel_total" type="number" />
        </div>
        <div className="mt-4">
          <RadioGroup label="Risque NVPO" name="apfel_risque" options={["0 pt → 10 %", "1 pt → 21 %", "2 pts → 39 %", "3 pts → 61 %", "4 pts → 79 %"]} />
        </div>

        <h4 className="text-amber-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Score de Child-Pugh (Cirrhose)</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextInput label="Bilirubine" name="child_bili" />
          <TextInput label="Albumine" name="child_albumine" />
          <TextInput label="Ascite" name="child_ascite" />
          <TextInput label="INR" name="child_inr" />
          <TextInput label="Encéphalopathie" name="child_encephalo" />
        </div>
        <RadioGroup label="Classe Child-Pugh" name="child_classe" options={["Classe A (5–6 pts) : Compensée", "Classe B (7–9 pts) : Significative", "Classe C (10–15 pts) : Décompensée"]} />

        <h4 className="text-amber-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Classification ASA</h4>
        <RadioGroup label="Score ASA" name="asa_score" options={["ASA I", "ASA II", "ASA III", "ASA IV", "ASA V", "ASA VI"]} />
      </Section>
    </div>
  );
}
