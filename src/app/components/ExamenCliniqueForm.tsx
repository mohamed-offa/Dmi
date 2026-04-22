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

const ExamRow = ({ label, name }: { label: string, name: string }) => (
  <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/5">
    <RadioGroup label={label} name={`${name}_status`} options={["Non réalisé", "Oui"]} />
    <TextInput label="Résultat :" name={`${name}_result`} placeholder="Saisir le résultat..." />
  </div>
);

export function ExamenCliniqueForm() {
  return (
    <div className="space-y-1">
      <Section title="1. Signes Vitaux & Général" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Tension Systolique" name="ta_sys" type="number" placeholder="mmHg" />
          <TextInput label="Tension Diastolique" name="ta_dia" type="number" placeholder="mmHg" />
          <TextInput label="Fréquence Cardiaque" name="fc" type="number" placeholder="bpm" />
          <TextInput label="Fréquence Resp." name="fr" type="number" placeholder="cycles/min" />
          <TextInput label="SpO2 (%)" name="spo2" type="number" placeholder="%" />
          <TextInput label="Température (°C)" name="temperature" type="number" step="0.1" placeholder="°C" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="IMC (kg/m²)" name="imc" type="number" step="0.1" />
          </div>
          <RadioGroup label="État nutritionnel" name="etat_nutritionnel" options={["Normopondéral", "Surpoids", "Obésité", "Dénutrition"]} />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <RadioGroup label="Force musculaire (se lever, serrer la main)" name="force_musculaire" options={["Normale", "Diminuée"]} />
          <RadioGroup label="État cutané (plaies, escarres)" name="etat_cutane" options={["Intact", "Anomalies"]} />
          <TextInput label="Si anomalies, précisez :" name="etat_cutane_details" />
          <RadioGroup label="Circulation périphérique" name="circulation_periph" options={["Normale", "Anormale"]} />
          <TextInput label="Si anormale, précisez :" name="circulation_periph_details" />
        </div>
      </Section>

      <Section title="2. Voies Aériennes (Intubation)">
        <RadioGroup label="Score de Mallampati" name="mallampati" options={["Classe I", "Classe II", "Classe III", "Classe IV"]} />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <RadioGroup label="Ouverture buccale" name="ouverture_buccale" options={["Normale", "Limitée"]} />
          <RadioGroup label="Mobilité du cou" name="mobilite_cou" options={["Normale", "Limitée"]} />
        </div>
        <div className="mt-4">
          <TextInput label="Distance thyromentonnière (cm)" name="distance_thyro" type="number" step="0.1" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Dents instables" name="dents_instables" options={["Non", "Oui"]} />
          <RadioGroup label="Prothèse dentaire" name="prothese_dentaire" options={["Non", "Oui (fixe)", "Oui (mobile)"]} />
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <RadioGroup label="Risque d'intubation difficile" name="risque_intubation" options={["Faible", "Modéré", "Élevé"]} />
        </div>
      </Section>

      <Section title="3. Respiratoire & Cardiovasculaire">
        <h4 className="text-teal-400 font-bold mb-3 border-b border-white/10 pb-1">Examen Respiratoire</h4>
        <RadioGroup label="Auscultation pulmonaire" name="auscultation_pulm" options={["Normale", "Râles", "Sibilants"]} />
        <RadioGroup label="Dyspnée au repos" name="dyspnee_repos" options={["Non", "Oui"]} />
        <RadioGroup label="Capacité respiratoire à l'effort" name="capacité_resp_effort" options={["Bonne tolérance", "Dyspnée légère", "Dyspnée modérée", "Dyspnée sévère"]} />

        <h4 className="text-teal-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Examen Cardiovasculaire</h4>
        <RadioGroup label="Auscultation cardiaque" name="auscultation_cardio" options={["Normale", "Souffle cardiaque"]} />
        <TextInput label="Si souffle, précisez :" name="auscultation_cardio_details" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <RadioGroup label="Œdème MI" name="oedeme_mi" options={["Non", "Oui"]} />
          <RadioGroup label="Pouls périphériques" name="pouls_periph" options={["Normaux", "Diminués"]} />
        </div>
        <div className="mt-4">
          <RadioGroup label="Signes d'insuffisance cardiaque (turgescence jugulaire...)" name="signes_insuff_cardio" options={["Absents", "Présents"]} />
          <TextInput label="Si présents, précisez :" name="signes_insuff_cardio_details" />
        </div>
      </Section>

      <Section title="4. Neurologique & Rachis">
        <h4 className="text-teal-400 font-bold mb-3 border-b border-white/10 pb-1">Examen Neurologique</h4>
        <RadioGroup label="État de conscience" name="etat_conscience" options={["Normal", "Altéré"]} />
        <div className="mt-4">
          <RadioGroup label="Déficit neurologique" name="deficit_neuro" options={["Non", "Oui"]} />
          <TextInput label="Si oui, précisez :" name="deficit_neuro_details" />
        </div>
        <div className="mt-4">
          <RadioGroup label="Réflexes moteurs et sensitifs" name="reflexes" options={["Normaux", "Anormaux"]} />
          <TextInput label="Si anormaux, précisez :" name="reflexes_details" />
        </div>

        <h4 className="text-teal-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Examen du Rachis (ALR)</h4>
        <RadioGroup label="Déformation du rachis" name="deformation_rachis" options={["Non", "Oui"]} />
        <TextInput label="Si oui, précisez :" name="deformation_rachis_details" />
        <div className="mt-4">
          <RadioGroup label="Mobilité lombaire" name="mobilite_lombaire" options={["Normale", "Limitée"]} />
        </div>
        <div className="mt-4">
          <RadioGroup label="Douleur ou pathologie rachidienne connue" name="pathologie_rachis" options={["Non", "Oui"]} />
          <TextInput label="Si oui, précisez :" name="pathologie_rachis_details" />
        </div>
      </Section>

      <Section title="5. Examens Biologiques">
        <div className="space-y-4">
          <ExamRow label="Numération formule sanguine (NFS)" name="exam_nfs" />
          <ExamRow label="Glycémie" name="exam_glycemie" />
          <ExamRow label="Fonction rénale (urée / créatinine)" name="exam_renale" />
          <ExamRow label="Ionogramme sanguin" name="exam_iono" />
          <ExamRow label="Bilan de coagulation (TP / TCA / INR)" name="exam_coagulation" />
        </div>
      </Section>

      <Section title="6. Examens Imagerie & Autres">
        <h4 className="text-teal-400 font-bold mb-3 border-b border-white/10 pb-1">Cardiologiques</h4>
        <div className="space-y-4">
          <ExamRow label="Électrocardiogramme (ECG)" name="exam_ecg" />
          <ExamRow label="Échocardiographie" name="exam_echocardio" />
        </div>

        <h4 className="text-teal-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Radiologiques</h4>
        <div className="space-y-4">
          <ExamRow label="Radiographie thoracique" name="exam_radio_thorax" />
          <ExamRow label="Scanner ou IRM" name="exam_scan_irm" />
        </div>

        <h4 className="text-teal-400 font-bold mt-6 mb-3 border-b border-white/10 pb-1">Autres</h4>
        <div className="space-y-4">
          <ExamRow label="Échographie abdominale ou pelvienne" name="exam_echo_abdo" />
          <ExamRow label="Autres examens spécifiques (endoscopie, EFR...)" name="exam_autres" />
        </div>
      </Section>
    </div>
  );
}
