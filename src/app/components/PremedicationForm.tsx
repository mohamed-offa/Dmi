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
        <span className="font-bold text-sm text-purple-400">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
      </button>
      {isOpen && <div className="p-4 space-y-5 text-sm text-slate-300">{children}</div>}
    </div>
  );
};

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
              className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-purple-500 checked:border-purple-500 focus:outline-none transition-all" 
            />
            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
          </div>
          <span className="group-hover:text-white transition-colors leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const Checkbox = ({ label, name }: { label: string, name: string }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative flex items-start pt-0.5 shrink-0">
      <input 
        type="checkbox" 
        name={name} 
        className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-purple-500 checked:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
      />
      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block text-black" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="group-hover:text-white transition-colors leading-snug">{label}</span>
  </label>
);

const TextInput = ({ label, name, placeholder, type = "text" }: { label: string, name: string, placeholder?: string, type?: string }) => (
  <div className="space-y-1.5 w-full">
    <label className="font-semibold text-slate-200 block">{label}</label>
    <input 
      type={type} 
      name={name} 
      placeholder={placeholder} 
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
    />
  </div>
);

export function PremedicationForm() {
  return (
    <div className="space-y-1">
      <Section title="1. Visite Pré-Anesthésique & Préparation" defaultOpen={true}>
        <RadioGroup label="Est-ce que le patient a bénéficié d’une visite pré-anesthésique avant l’intervention ?" name="visite_preanesthesique" options={["Non", "Oui"]} />
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Est-ce que le patient a reçu une explication concernant le type d’anesthésie prévu ?" name="explication_anesthesie" options={["Non", "Oui"]} />
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Est-ce que le patient a donné son consentement pour l’anesthésie ?" name="consentement_donne" options={["Non", "Oui"]} />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Est-ce que le patient a respecté la durée du jeûne préopératoire recommandée ?" name="jeune_respecte" options={["Non", "Oui"]} />
        </div>
      </Section>

      <Section title="2. Prémédication">
        <RadioGroup label="Est-ce que le patient a reçu une prémédication avant l’intervention ?" name="premedication_recue" options={["Non", "Oui"]} />
        
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="font-semibold text-purple-300 mb-4">Si oui, quel type de prémédication le patient a-t-il reçu ?</p>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-3">
              <Checkbox label="Sédatif" name="premed_sedatif" />
              <div className="pl-7">
                <TextInput label="Préciser (molécule, dose, horaire) :" name="premed_sedatif_details" />
              </div>
            </div>
            
            <Checkbox label="Anxiolytique" name="premed_anxiolytique" />
            <Checkbox label="Antalgique" name="premed_antalgique" />
            <Checkbox label="IPP / Anti-H2" name="premed_ipp" />
            <Checkbox label="Anticholinergique" name="premed_anticholinergique" />
            
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-3">
              <Checkbox label="Autre" name="premed_autre" />
              <div className="pl-7">
                <TextInput label="Préciser :" name="premed_autre_details" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup label="Est-ce que le patient a présenté des effets secondaires après la prémédication (somnolence excessive, hypotension, nausées…) ?" name="effets_secondaires" options={["Non", "Oui"]} />
          <TextInput label="Si oui, préciser lesquels :" name="effets_secondaires_details" />
        </div>
      </Section>

      <Section title="3. Anxiété & Conditionnement">
        <div className="space-y-4">
          <RadioGroup label="Est-ce que le patient présentait une anxiété avant l’intervention ?" name="anxiete_presente" options={["Non", "Oui"]} />
          <div className="w-2/3">
            <TextInput label="Score APAIS (si réalisé) / 20 :" name="score_apais" type="number" />
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-white/10">
          <RadioGroup label="Est-ce que les constantes vitales de le patient ont été contrôlées avant l’intervention ?" name="constantes_controlees" options={["Non", "Oui"]} />
        </div>
        
        <div className="mt-5 pt-4 border-t border-white/10">
          <RadioGroup label="Est-ce que la voie veineuse périphérique de le patient a été mise en place avant l’intervention ?" name="vvp_en_place" options={["Non", "Oui"]} />
        </div>
      </Section>
    </div>
  );
}
