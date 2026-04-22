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
        <span className="font-bold text-sm text-rose-400">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
      </button>
      {isOpen && <div className="p-4 space-y-4 text-sm text-slate-300">{children}</div>}
    </div>
  );
};

const ToggleItem = ({ label, name }: { label: string, name: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 gap-4">
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

export function CheckListForm() {
  return (
    <div className="space-y-1">
      <Section title="Check‑list de la salle d’opération" defaultOpen={true}>
        <div className="space-y-1">
          <ToggleItem label="Salle préparée et matériel vérifié avant l’arrivée du patient" name="cl_salle_preparee" />
          <ToggleItem label="Table opératoire fonctionnelle et adaptée à l’intervention" name="cl_table_op" />
          <ToggleItem label="Appareil d’anesthésie vérifié (test machine)" name="cl_machine_anes" />
          <ToggleItem label="Circuit respiratoire installé et étanche" name="cl_circuit_resp" />
          <ToggleItem label="Ventilateur fonctionnel" name="cl_ventilateur" />
          <ToggleItem label="Système d’aspiration disponible et fonctionnel" name="cl_aspiration" />
          <ToggleItem label="Source d’oxygène disponible et pression vérifiée" name="cl_o2" />
          <ToggleItem label="Source d’air médical et protoxyde d’azote vérifiées (si utilisées)" name="cl_air_n2o" />
          <ToggleItem label="Monitorage standard disponible (ECG, TA, SpO₂, capnographie)" name="cl_monitorage" />
          <ToggleItem label="Défibrillateur disponible et fonctionnel" name="cl_defibrillateur" />
          <ToggleItem label="Chariot d’urgence complet" name="cl_chariot_urgence" />
          <ToggleItem label="Matériel d’intubation disponible (laryngoscope, lames, sondes)" name="cl_materiel_intubation" />
          <ToggleItem label="Dispositifs alternatifs pour voie aérienne difficile disponibles" name="cl_voie_aerienne_diff" />
          <ToggleItem label="Médicaments d’anesthésie préparés et étiquetés" name="cl_meds_anes" />
          <ToggleItem label="Médicaments d’urgence disponibles (adrénaline, atropine, éphédrine…)" name="cl_meds_urgence" />
          <ToggleItem label="Perfusions et dispositifs d’accès veineux prêts" name="cl_perfusions" />
          <ToggleItem label="Dispositifs de réchauffement disponibles" name="cl_rechauffement" />
          <ToggleItem label="Système d’éclairage opératoire fonctionnel" name="cl_eclairage" />
          <ToggleItem label="Matériel chirurgical stérile disponible" name="cl_materiel_chir" />
        </div>
      </Section>

      <Section title="Check‑list OMS - Avant l’induction (Sign In)">
        <div className="space-y-1">
          <ToggleItem label="Identité du patient confirmée" name="oms_identite" />
          <ToggleItem label="Site opératoire confirmé" name="oms_site" />
          <ToggleItem label="Intervention confirmée" name="oms_intervention" />
          <ToggleItem label="Consentement éclairé signé" name="oms_consentement" />
          <ToggleItem label="Allergies connues vérifiées" name="oms_allergies" />
          <ToggleItem label="Risque de voie aérienne difficile identifié" name="oms_risque_vad" />
          <ToggleItem label="Risque de saignement important (>500 ml adulte / >7 ml/kg enfant)" name="oms_saignement" />
          <ToggleItem label="Monitorage installé (SpO₂, ECG, TA)" name="oms_monitorage_installe" />
        </div>
      </Section>

      <Section title="Check‑list OMS - Avant l’incision (Time Out)">
        <div className="space-y-1">
          <ToggleItem label="Présentation de l’équipe (nom et rôle)" name="oms_equipe" />
          <ToggleItem label="Confirmation patient / site / procédure" name="oms_confirm_time_out" />
          <ToggleItem label="Antibioprophylaxie administrée dans les 60 min" name="oms_antibio" />
          <ToggleItem label="Anticipation des événements critiques discutée" name="oms_anticipation" />
          <ToggleItem label="Disponibilité des images ou examens nécessaires" name="oms_images" />
        </div>
      </Section>

      <Section title="Check‑list OMS - Avant la sortie (Sign Out)">
        <div className="space-y-1">
          <ToggleItem label="Intervention réalisée confirmée" name="oms_intervention_realisee" />
          <ToggleItem label="Comptage des compresses / aiguilles / instruments correct" name="oms_comptage" />
          <ToggleItem label="Étiquetage correct des prélèvements" name="oms_etiquetage" />
          <ToggleItem label="Problèmes d’équipement signalés" name="oms_problemes_equip" />
          <ToggleItem label="Plan de prise en charge postopératoire discuté" name="oms_plan_postop" />
        </div>
      </Section>
    </div>
  );
}