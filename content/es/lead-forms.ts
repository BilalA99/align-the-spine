import type { LeadFormVariantConfig } from "@/content/lead-forms";
import type { LeadFieldConfig } from "@/lib/lead-form-schema";

/** Spanish lead-form presets — the /es mirror of content/lead-forms.ts.
 *
 * Only what the visitor reads is translated. Three things are deliberately
 * identical to the English presets and must stay that way:
 *
 *  1. `variant` keys. lib/leads/request.ts re-validates every submission
 *     with `buildLeadFormSchema(leadFormVariants[formId].fields)` — the
 *     ENGLISH config, looked up by variant name. A Spanish form posting a
 *     different variant key, or the same key with different fields, is
 *     rejected server-side.
 *  2. Field `name`s, and their ORDER. Same reason, plus they're the payload
 *     keys the practice's lead pipeline and lib/analytics read.
 *  3. Select `value`s ("yes"/"no"). The label is for the human, the value is
 *     for the pipeline.
 *
 * That coupling is not theoretical. An earlier version of this file was
 * written against an older English config and drifted: the Spanish
 * `contactUs` still asked for a single `name` field and `booking` still had
 * a `reason` select, after upstream had reshaped both around
 * `baseFields + carAccidentField`. Every Spanish submission through those
 * two forms would have been rejected by the server for missing required
 * fields. content/es/content-parity.test.ts now asserts field names, order,
 * variant keys and select values match, so this can't drift silently again.
 *
 * No field was added. Spanish forms ask exactly what the English ones ask —
 * no extra health questions, no accident narrative, no claim number.
 */
const baseFields: LeadFieldConfig[] = [
  { name: "firstName", label: "Nombre", half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Apellido", half: true, autoComplete: "family-name" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
];

const zipField: LeadFieldConfig = {
  name: "zip",
  label: "Código postal",
  type: "zip",
  autoComplete: "postal-code",
};

/** The same broad qualifier the English form asks, kept optional for the
 * same reason. */
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

/** Accident date, not an accident description: it narrows Florida's 14-day
 * initial-care timing period, which is scheduling information rather than
 * clinical detail. */
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
    submitLabel: "Solicitar una cita quiropráctica",
  },
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields, accidentDateField, carAccidentField],
    submitLabel: "Solicitar mi evaluación",
  },
  contactUs: {
    variant: "contactUs",
    fields: [
      ...baseFields,
      carAccidentField,
      { name: "message", label: "Mensaje", type: "textarea" },
    ],
    submitLabel: "Enviar mensaje",
  },
  carAccident: {
    variant: "carAccident",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar mi evaluación",
  },
  reviewsEval: {
    variant: "reviewsEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar una cita quiropráctica",
  },
  contact: {
    variant: "contact",
    fields: [
      { name: "firstName", label: "Nombre", half: true, autoComplete: "given-name" },
      { name: "lastName", label: "Apellido", half: true, autoComplete: "family-name" },
      { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
      { name: "phone", label: "Teléfono", type: "tel", half: true, autoComplete: "tel" },
      { ...zipField, half: true },
      carAccidentField,
      { name: "bestTime", label: "Mejor horario para contactarle", required: false },
    ],
    submitLabel: "Contáctenos",
  },
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields, zipField, carAccidentField],
    submitLabel: "Verificar elegibilidad",
  },
  /** "Solicitar", never "reservar"/"confirmar": the office calls back to
   * set the time. The English CTA was deliberately reworded off "Book" for
   * exactly this reason (ATS-E3 3.4). */
  booking: {
    variant: "booking",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Solicitar mi evaluación",
  },
} satisfies Record<string, LeadFormVariantConfig>;
