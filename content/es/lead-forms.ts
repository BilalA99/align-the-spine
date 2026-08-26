import type { LeadFormVariantConfig } from "@/content/lead-forms";
import type { LeadFieldConfig } from "@/lib/lead-form-schema";

/** Spanish lead-form presets — the /es mirror of content/lead-forms.ts.
 *
 * Only what the visitor reads is translated. Three things are deliberately
 * identical to the English presets and must stay that way:
 *
 *  1. `variant` keys. /api/lead picks its server-side validation schema by
 *     variant, so a Spanish form posting `variant: "accidentEval"` is
 *     re-validated by exactly the same rules as the English one. A separate
 *     "accidentEvalEs" key would silently 400 every Spanish lead.
 *  2. Field `name`s. They're the payload keys the practice's lead pipeline
 *     and lib/analytics.ts's classifyLeadPriority read — a Spanish lead has
 *     to land in the same shape as an English one, not a parallel format
 *     nobody downstream knows how to parse.
 *  3. Select `value`s ("yes"/"no", "back-pain", …). Same reason: the label
 *     is for the human, the value is for the pipeline.
 *
 * No field was added. Spanish forms ask exactly what the English ones ask —
 * no extra health questions, no accident narrative, no claim number (see
 * ATS-E3 3.1, and §Healthcare privacy in the report: medical detail
 * collected in a form is medical detail that ends up in analytics).
 */
const baseFields: LeadFieldConfig[] = [
  { name: "firstName", label: "Nombre", half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Apellido", half: true, autoComplete: "family-name" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
];

/** "¿Está relacionado con un accidente de auto?" — the same broad
 * qualifier the English form asks, kept optional for the same reason. */
const carAccidentField: LeadFieldConfig = {
  name: "carAccident",
  label: "¿Está relacionado con un accidente de auto?",
  type: "select",
  required: false,
  placeholder: "Seleccione una opción",
  options: [
    { label: "Sí", value: "yes" },
    { label: "No", value: "no" },
  ],
};

/** Accident date, not an accident description: it narrows Florida's
 * 14-day PIP evaluation window, which is scheduling information rather
 * than clinical detail. */
const accidentDateField: LeadFieldConfig = {
  name: "accidentDate",
  label: "Fecha del accidente",
  type: "date",
  autoComplete: "off",
};

export const esLeadFormVariants = {
  heroEval: {
    variant: "heroEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar mi evaluación",
  },
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields, accidentDateField],
    submitLabel: "Solicitar mi evaluación",
  },
  contactUs: {
    variant: "contactUs",
    fields: [
      { name: "name", label: "Nombre", half: true, autoComplete: "name" },
      { name: "phone", label: "Teléfono", type: "tel", half: true, autoComplete: "tel" },
      { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
      carAccidentField,
      { name: "message", label: "Mensaje", type: "textarea" },
    ],
    submitLabel: "Enviar mensaje",
  },
  carAccident: {
    variant: "carAccident",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar mi evaluación por accidente",
  },
  reviewsEval: {
    variant: "reviewsEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar mi evaluación",
  },
  /** Two-step form for /es/solicitar-cita. "Solicitar" throughout, never
   * "reservar"/"confirmar": the office calls back to set the time. */
  booking: {
    variant: "booking",
    fields: [
      { name: "firstName", label: "Nombre", autoComplete: "given-name" },
      { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
      { name: "lastName", label: "Apellido", autoComplete: "family-name" },
      {
        name: "reason",
        label: "Motivo de la consulta",
        type: "select",
        placeholder: "Seleccione un motivo",
        options: [
          { label: "Dolor de espalda", value: "back-pain" },
          { label: "Dolor de cuello", value: "neck-pain" },
          { label: "Ciática", value: "sciatica" },
          { label: "Accidente de auto", value: "accident" },
          { label: "Visita a domicilio", value: "home-visit" },
          { label: "Otro", value: "other" },
        ],
      },
    ],
    submitLabel: "Solicitar mi evaluación",
  },
} satisfies Record<string, LeadFormVariantConfig>;
