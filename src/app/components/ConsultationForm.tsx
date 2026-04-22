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
    <div className="relative flex items-start pt-0.5">
      <input 
        type="checkbox" 
        name={name} 
        className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/40 checked:bg-teal-500 checked:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" 
      />
      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="group-hover:text-white transition-colors">{label}</span>
  </label>
);

const RadioGroup = ({ label, name, options }: { label: string, name: string, options: string[] }) => (
  <div className="space-y-2">
    <p className="font-semibold text-slate-200 leading-snug">{label}</p>
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input 
              type="radio" 
              name={name} 
              value={opt} 
              className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-teal-500 checked:border-teal-500 focus:outline-none transition-all" 
            />
            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white hidden peer-checked:block pointer-events-none" />
          </div>
          <span className="group-hover:text-white transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const YesNoRow = ({ label, name }: { label: string, name: string }) => (
  <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/5 last:border-0 group">
    <span className="text-slate-300 text-sm flex-1 group-hover:text-white transition-colors leading-snug">{label}</span>
    <div className="flex gap-4 shrink-0">
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative flex items-center">
          <input type="radio" name={name} value="Oui" className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-teal-500 checked:border-teal-500 transition-all" />
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white hidden peer-checked:block pointer-events-none" />
        </div>
        <span className="text-sm">Oui</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative flex items-center">
          <input type="radio" name={name} value="Non" className="peer appearance-none w-4 h-4 border border-white/20 rounded-full bg-black/40 checked:bg-teal-500 checked:border-teal-500 transition-all" />
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white hidden peer-checked:block pointer-events-none" />
        </div>
        <span className="text-sm">Non</span>
      </label>
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
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" 
    />
  </div>
);

const TextArea = ({ label, name, placeholder }: { label: string, name: string, placeholder?: string }) => (
  <div className="space-y-1.5">
    <label className="font-semibold text-slate-200">{label}</label>
    <textarea 
      name={name} 
      placeholder={placeholder} 
      rows={3}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all resize-none" 
    />
  </div>
);

export function ConsultationForm() {
  return (
    <div className="space-y-1">
      <Section title="1. Informations Générales" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Poids (kg)" name="poids" type="number" placeholder="Ex: 75" />
          <TextInput label="Taille (cm)" name="taille" type="number" placeholder="Ex: 175" />
        </div>
        <TextInput label="Nature de l’acte chirurgical" name="acte_chirurgical" placeholder="Ex: Appendicectomie" />
      </Section>

      <Section title="2. Antécédents Médicaux">
        <p className="font-semibold text-slate-200 mb-2">Le patient souffre-t-il de :</p>
        <div className="grid grid-cols-1 gap-2">
          <Checkbox label="Hypertension artérielle" name="atcd_hta" />
          <Checkbox label="Asthme" name="atcd_asthme" />
          <Checkbox label="Accident vasculaire cérébral" name="atcd_avc" />
          <Checkbox label="Diabète" name="atcd_diabete" />
          <Checkbox label="Épilepsie" name="atcd_epilepsie" />
          <Checkbox label="Dyslipidémie" name="atcd_dyslipidemie" />
          <Checkbox label="Cardiopathie" name="atcd_cardiopathie" />
          <Checkbox label="Autres (Ulcère, Anémie, Psy, Endoc...)" name="atcd_autres" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup 
            label="Insuffisance rénale nécessitant dialyse ?" 
            name="dialyse" 
            options={["Non", "Oui (Lun-Mer-Ven)", "Oui (Mar-Jeu-Sam)"]} 
          />
          <RadioGroup 
            label="Présence d'une fistule artério-veineuse ?" 
            name="fistule" 
            options={["Non", "Oui (Membre supérieur Gauche)", "Oui (Membre supérieur Droit)"]} 
          />
        </div>
      </Section>

      <Section title="3. Traitements, Allergies & Mode de vie">
        <TextArea label="Médicaments en cours" name="medicaments" placeholder="Nom, prises, horaires..." />
        
        <div className="mt-4 space-y-4">
          <RadioGroup label="Suivi correct du traitement (compliance) ?" name="compliance" options={["Oui, régulier", "Non, irrégulier/interrompu"]} />
          <TextInput label="Si non, précisez :" name="compliance_details" />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup label="Compléments alimentaires / Phytothérapie ?" name="complements" options={["Non", "Oui"]} />
          <TextInput label="Si oui, précisez (produit, dose) :" name="complements_details" />
        </div>

        <div className="grid gap-4 mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Allergie médicamenteuse ?" name="allergie" options={["Non", "Oui"]} />
          <TextInput label="Si oui, précisez :" name="allergie_details" placeholder="Ex: Pénicilline" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Tabac (ou Neffa) ?" name="tabac" options={["Non", "Oui"]} />
          <RadioGroup label="Alcool ?" name="alcool" options={["Non", "Oui"]} />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup label="Voyages récents (3 derniers mois) / Risque infectieux ?" name="voyages" options={["Non", "Oui"]} />
          <RadioGroup label="Vaccinations à jour (Grippe, COVID, etc.) ?" name="vaccins_jour" options={["Oui", "Non"]} />
        </div>
      </Section>

      <Section title="4. ATCD Chirurgicaux & Anesthésiques">
        <RadioGroup label="Opérations antérieures ?" name="op_anterieures" options={["Non", "Oui"]} />
        <TextArea label="Si oui, type d'anesthésie et dates :" name="op_details" placeholder="AG, ALR, etc." />
        <RadioGroup label="Complications chir. ou anesthésiques ?" name="complications" options={["Non", "Oui"]} />
        <TextInput label="Si oui, précisez :" name="complications_details" />
        <RadioGroup label="Hospitalisation antérieure (hors chirurgie) ?" name="hospit_anterieure" options={["Non", "Oui"]} />
        
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup label="Nausées/vomissements après une opération (PONV) ?" name="nausees_postop" options={["Non", "Oui"]} />
          <RadioGroup label="Mal des transports ?" name="mal_transports" options={["Non", "Oui"]} />
        </div>
      </Section>

      <Section title="5. Évaluation Cardiorespiratoire">
        <div className="space-y-4">
          <RadioGroup label="Infection respiratoire dans le mois précédent ?" name="infection_respiratoire" options={["Non", "Oui"]} />
          <RadioGroup label="Activité usuelle entraîne fatigue, dyspnée ou palpitations ?" name="gene_usuelle" options={["Non", "Oui"]} />
          <RadioGroup label="Confortable au repos, mais effort entraîne gêne ?" name="gene_repos" options={["Non", "Oui"]} />
          <RadioGroup label="Dyspnée/palpitations au repos qui augmente à l'effort ?" name="gene_totale" options={["Non", "Oui"]} />
          
          <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
            <RadioGroup label="Douleurs/crampes aux jambes à la marche (arrêt au repos) ?" name="crampes_jambes" options={["Non", "Oui"]} />
            <RadioGroup label="Si oui, distance d'apparition :" name="crampes_distance" options={["Moins de 50m", "50 mètres", "100 mètres", "Plus de 100m"]} />
          </div>
        </div>
      </Section>

      <Section title="6. Capacité Fonctionnelle (METs)">
        <p className="font-semibold text-slate-200 mb-3">Le patient est-il capable de :</p>
        <div className="bg-black/20 rounded-lg p-2 border border-white/5">
          <YesNoRow label="Faire ses soins (manger, s'habiller, se laver)" name="met_soins" />
          <YesNoRow label="Marcher à l'intérieur de la maison" name="met_marche_int" />
          <YesNoRow label="Marcher 1 à 2 blocs sur chemin plat (200m)" name="met_marche_ext" />
          <YesNoRow label="Monter un escalier ou une colline" name="met_escalier_1" />
          <YesNoRow label="Monter DEUX étages sans repos" name="met_escalier_2" />
          <YesNoRow label="Courir sur une courte distance" name="met_courir" />
          <YesNoRow label="Faire des travaux légers (poussière, vaisselle)" name="met_travaux_legers" />
          <YesNoRow label="Faire des travaux modérés (aspirateur, courses)" name="met_travaux_moderes" />
          <YesNoRow label="Faire de gros travaux (déplacer meubles lourds)" name="met_travaux_lourds" />
          <YesNoRow label="Faire du jardinage" name="met_jardinage" />
          <YesNoRow label="Avoir des relations sexuelles" name="met_sexe" />
          <YesNoRow label="Sports modérés (golf, danse, tennis double)" name="met_sport_modere" />
          <YesNoRow label="Sports intenses (natation, foot, ski)" name="met_sport_intense" />
        </div>
      </Section>

      <Section title="7. Voies Aériennes & Sommeil">
        <RadioGroup label="Ronfle la nuit ?" name="ronflement" options={["Non", "Parfois", "Toujours"]} />
        <RadioGroup label="Apnée du sommeil suspectée (arrêts respiratoires observés) ?" name="apnee" options={["Non", "Oui"]} />
        <RadioGroup label="Troubles du sommeil / Insomnie ?" name="trouble_sommeil" options={["Non", "Oui"]} />
        <RadioGroup label="Fatigue, épuisement ou somnolence diurne ?" name="fatigue_diurne" options={["Non", "Oui"]} />
        
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup label="Prothèse dentaire ?" name="prothese_dentaire" options={["Non", "Dents fixes", "Dents instables"]} />
          <RadioGroup label="Pathologie colonne vertébrale ?" name="pathologie_rachis" options={["Non", "Oui (douleur/autre)"]} />
          <TextInput label="Chiffres tensionnels habituels" name="tension_habituelle" placeholder="Ex: 12/8" />
        </div>
      </Section>

      <Section title="8. Risque Hémorragique & Famille">
        <RadioGroup label="Saignement prolongé / répété ?" name="saignement" options={["Non", "Oui"]} />
        <RadioGroup label="Hémorragie inhabituelle / Transfusion par le passé ?" name="transfusion" options={["Non", "Oui"]} />
        <RadioGroup label="Quelqu'un dans la famille avec trouble de la coagulation ?" name="atcd_fam_coagulation" options={["Non", "Oui"]} />
        <RadioGroup label="Maladie musculaire familiale ?" name="atcd_fam_musculaire" options={["Non", "Oui"]} />
        <RadioGroup label="Incident familial lié à l'anesthésie ?" name="atcd_fam_anesthesie" options={["Non", "Oui"]} />
      </Section>

      <Section title="9. Spécifique Femmes">
        <RadioGroup label="Enceinte (ou possibilité de l'être) ?" name="femme_enceinte" options={["Non", "Oui"]} />
        <RadioGroup label="Allaitante ?" name="femme_allaitante" options={["Non", "Oui"]} />
        <div className="grid grid-cols-3 gap-3 mt-4">
          <TextInput label="Grossesses" name="nb_grossesses" type="number" />
          <TextInput label="Accouchements" name="nb_accouchements" type="number" />
          <TextInput label="Enfants vivants" name="nb_enfants" type="number" />
        </div>
      </Section>

      <Section title="10. Spécifique Pédiatrie (Enfants)">
        <RadioGroup label="Né par :" name="enfant_naissance" options={["Voie basse", "Césarienne"]} />
        <RadioGroup label="Prématuré ?" name="enfant_premature" options={["Non", "Oui"]} />
        <RadioGroup label="Parents apparentés ?" name="enfant_parents_apparentes" options={["Non", "Oui"]} />
        <RadioGroup label="Hospitalisation après la naissance ?" name="enfant_hospit_naissance" options={["Non", "Oui"]} />
        <RadioGroup label="Développement psychomoteur normal ?" name="enfant_psycho" options={["Oui", "Non"]} />
        <RadioGroup label="A reçu tous les vaccins nécessaires ?" name="enfant_vaccins" options={["Oui", "Non"]} />
        <RadioGroup label="Convulsions fébriles durant l'enfance ?" name="enfant_convulsions" options={["Non", "Oui"]} />
      </Section>
    </div>
  );
}
