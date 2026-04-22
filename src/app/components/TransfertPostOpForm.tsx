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
        <span className="font-bold text-sm text-indigo-400">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
      </button>
      {isOpen && <div className="p-4 space-y-5 text-sm text-slate-300">{children}</div>}
    </div>
  );
};

const ToggleItem = ({ label, name }: { label: string, name: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
    <span className="text-slate-200 leading-snug flex-1">{label}</span>
    <div className="flex gap-4 shrink-0">
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative flex items-center shrink-0">
          <input 
            type="radio" 
            name={name} 
            value="Non" 
            className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-rose-500 checked:border-rose-500 focus:outline-none transition-all" 
          />
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
        </div>
        <span className="group-hover:text-white transition-colors text-xs font-medium text-slate-400">Non</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative flex items-center shrink-0">
          <input 
            type="radio" 
            name={name} 
            value="Oui" 
            className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none transition-all" 
          />
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
        </div>
        <span className="group-hover:text-white transition-colors text-xs font-medium text-slate-400">Oui</span>
      </label>
    </div>
  </div>
);

const ToggleItemWithInput = ({ label, name, inputLabel, inputName, placeholder }: { label: string, name: string, inputLabel: string, inputName: string, placeholder?: string }) => {
  const [val, setVal] = useState<string>("");
  return (
    <div className="flex flex-col gap-2 py-3 border-b border-white/5 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-slate-200 leading-snug flex-1">{label}</span>
        <div className="flex gap-4 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center shrink-0">
              <input 
                type="radio" 
                name={name} 
                value="Non" 
                onChange={(e) => setVal(e.target.value)}
                className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-rose-500 checked:border-rose-500 focus:outline-none transition-all" 
              />
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
            </div>
            <span className="group-hover:text-white transition-colors text-xs font-medium text-slate-400">Non</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center shrink-0">
              <input 
                type="radio" 
                name={name} 
                value="Oui"
                onChange={(e) => setVal(e.target.value)}
                className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none transition-all" 
              />
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
            </div>
            <span className="group-hover:text-white transition-colors text-xs font-medium text-slate-400">Oui</span>
          </label>
        </div>
      </div>
      {val === "Oui" && (
        <div className="mt-2 ml-4 flex flex-col gap-1 sm:flex-row sm:items-center">
          <span className="text-xs text-slate-400">{inputLabel}</span>
          <input 
            type="text" 
            name={inputName} 
            placeholder={placeholder}
            className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      )}
    </div>
  );
};

const FormGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-3 py-2 border-b border-white/5 last:border-0">
    <span className="block text-slate-200 leading-snug">{title}</span>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
      {children}
    </div>
  </div>
);

const Radio = ({ label, name, value, withInput }: { label: string, name: string, value: string, withInput?: boolean }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center shrink-0 mt-0.5">
        <input 
          type="radio" 
          name={name} 
          value={value} 
          className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition-all" 
        />
        <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black hidden peer-checked:block pointer-events-none" />
      </div>
      <div className="flex-1">
        <span className="group-hover:text-white transition-colors text-sm text-slate-300">{label}</span>
        {withInput && (
          <input 
            type="text" 
            name={`${name}_${value}_details`}
            placeholder="Préciser..."
            className="mt-2 w-full bg-black/40 border border-white/10 rounded-md px-3 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/50"
          />
        )}
      </div>
    </label>
  );
}

const Checkbox = ({ label, name, value, withInput, inputPlaceholder = "Préciser..." }: { label: string, name: string, value: string, withInput?: boolean, inputPlaceholder?: string }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center shrink-0 mt-0.5">
        <input 
          type="checkbox" 
          name={name} 
          value={value} 
          className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition-all" 
        />
        <svg className="absolute inset-0 w-3 h-3 m-auto text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div className="flex-1 flex flex-col">
        <span className="group-hover:text-white transition-colors text-sm text-slate-300">{label}</span>
        {withInput && (
          <input 
            type="text" 
            name={`${name}_${value}_details`}
            placeholder={inputPlaceholder}
            className="mt-2 w-full bg-black/40 border border-white/10 rounded-md px-3 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/50"
          />
        )}
      </div>
    </label>
  );
}


export function TransfertPostOpForm() {
  return (
    <div className="space-y-1">
      <Section title="Extubation et Transfert" defaultOpen={true}>
        <div className="space-y-2">
          
          <ToggleItem 
            label="Est-ce que le patient a été extubé en salle d’opération ?" 
            name="po_extube_salle" 
          />
          
          <ToggleItem 
            label="Est-ce que le patient respirait spontanément avant l’extubation ?" 
            name="po_resp_spontanee" 
          />

          <FormGroup title="Est-ce que le patient a présenté une complication lors de l’extubation ?">
            <Checkbox name="po_complication_extubation" value="Laryngospasme" label="Laryngospasme" />
            <Checkbox name="po_complication_extubation" value="Desaturation" label="Désaturation" />
            <Checkbox name="po_complication_extubation" value="Toux" label="Toux" />
            <Checkbox name="po_complication_extubation" value="Aucune" label="Aucune" />
            <Checkbox name="po_complication_extubation" value="Autre" label="Autre" withInput />
          </FormGroup>

          <FormGroup title="Est-ce que le patient a été transféré vers :">
            <Radio name="po_transfert_vers" value="SSPI" label="Salle de réveil (SSPI)" />
            <Radio name="po_transfert_vers" value="USI" label="Unité de soins intensifs" />
            <Radio name="po_transfert_vers" value="Service_hospitalisation" label="Service d’hospitalisation" />
          </FormGroup>

        </div>
      </Section>

      <Section title="Monitorage et Suivi Immédiat" defaultOpen={true}>
        <div className="space-y-2">
          
          <ToggleItemWithInput 
            label="Douleur aiguë évaluée au réveil (EVA/EN) :" 
            name="po_douleur_evaluee" 
            inputLabel="Score :" 
            inputName="po_douleur_score" 
            placeholder="Ex: 4/10"
          />

          <ToggleItem 
            label="Prophylaxie de la douleur postopératoire anticipée (morphiniques, blocs périphériques, PCA) :" 
            name="po_prophylaxie_douleur" 
          />

          <ToggleItem 
            label="Monitorage post-extubation immédiat (SpO₂, ECG, TA) assuré :" 
            name="po_monitorage_immediat" 
          />

        </div>
      </Section>
    </div>
  );
}