"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useForm, type Resolver, type UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { type FieldVariant } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSuccess } from "@/lib/analytics/lead-events";
import { cn } from "@/lib/cn";
import {
  buildLeadFormSchema,
  type LeadFieldConfig,
  type LeadFieldType,
} from "@/lib/lead-form-schema";
import { newSubmissionId } from "@/lib/lead/submission-id";
import { submitLead } from "@/lib/lead/submit-client";
import { formatUsPhoneAsYouType } from "@/lib/phone-format";

export type LeadFormValues = Record<string, string>;

export type { LeadFieldConfig, LeadFieldType };
export { buildLeadFormSchema };

export interface LeadFormProps {
  heading: string;
  /** Variant key sent to /api/lead so the server re-validates against the
   * matching schema. Comes for free when spreading a leadFormVariants preset. */
  variant?: string;
  /** Field config driving both rendering and the zod validation schema. */
  fields: LeadFieldConfig[];
  submitLabel: string;
  successMessage?: string;
  /** Field styling for dark (hero) vs light surfaces. */
  fieldVariant?: FieldVariant;
  /** Transparent/bordered/rounded field look instead of the filled default
   * — the solid-panel Hero variant's design, since the filled look was
   * designed against LiquidGlass, not a flat navy background. */
  fieldOutline?: boolean;
  /** "upper" (default) uppercases field labels; "none" renders them as
   * authored (e.g. "First Name" instead of "FIRST NAME") — the
   * solid-panel Hero variant's design. */
  labelCase?: "upper" | "none";
  /** Submit button color — defaults to "primary" (navy); the solid-panel
   * Hero variant uses "teal" to match its design. */
  submitVariant?: "primary" | "teal";
  /** Overrides the heading's default sans/navy-or-white styling entirely
   * (e.g. the solid-panel Hero variant's serif display heading). */
  headingClassName?: string;
  /** Renders only `stepOneFieldNames` behind a "Continue" button first; the
   * rest of `fields` (and the real submit button) smoothly expand into view
   * once those validate — a height/opacity reveal (motion/react), not a
   * hard swap, so growing the form doesn't jump-cut the layout. Same
   * two-step idea as components/sections/booking-form.tsx, for hero
   * placements where showing every field at once would push the fold past
   * what's visible on a phone screen. */
  twoStep?: boolean;
  /** Field names shown in step 1 when `twoStep` is true. Defaults to
   * ["firstName", "phone"] — the shortest field set that's still a usable lead. */
  stepOneFieldNames?: string[];
  continueLabel?: string;
  className?: string;
}

// First+Last together (they render as a paired half-width row) plus Phone
// — keeps a real contact method in the fast first step. Dropping Phone to
// step 2 would mean anyone who abandons after step 1 leaves a name with no
// way to reach them, which defeats the point of asking early.
const DEFAULT_STEP_ONE_FIELDS = ["firstName", "lastName", "phone"];

function inputType(type: LeadFieldType) {
  if (type === "tel" || type === "email" || type === "date") return type;
  return "text";
}

// Native <input type="date"> pickers refuse to show any day past this as
// selectable when passed as `max` — belt-and-suspenders with the schema's
// isNotFutureDate refine (lib/lead-form-schema.ts), which still catches a
// browser that ignores `max` or a direct API request.
function todayIsoDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

interface RenderFieldOptions {
  register: UseFormRegister<LeadFormValues>;
  /** Plain field-name -> message map — deliberately not react-hook-form's
   * own FieldErrors shape, so callers can supply either RHF's formState
   * errors or a hand-built map (see LeadForm's stepOneErrors) through the
   * same prop. */
  errors: Record<string, string | undefined>;
  fieldVariant: FieldVariant;
  fieldOutline: boolean;
  labelCase: "upper" | "none";
}

/** Renders one field per its `type` — shared by the single-step path and
 * both halves of the two-step path so there's exactly one place that knows
 * how a select/textarea/tel/text field maps to its input component. */
function renderField(field: LeadFieldConfig, opts: RenderFieldOptions) {
  const { register, errors, fieldVariant, fieldOutline, labelCase } = opts;
  const type = field.type ?? "text";
  const spanClass = field.half ? undefined : "col-span-2";
  const error = errors[field.name];
  const label = labelCase === "none" ? field.label : field.label.toUpperCase();

  if (type === "select") {
    return (
      <Select
        key={field.name}
        label={label}
        variant={fieldVariant}
        outline={fieldOutline}
        options={field.options ?? []}
        placeholder={field.placeholder}
        error={error}
        className={spanClass}
        {...register(field.name)}
      />
    );
  }
  if (type === "textarea") {
    return (
      <Textarea
        key={field.name}
        label={label}
        variant={fieldVariant}
        outline={fieldOutline}
        placeholder={field.placeholder}
        error={error}
        className={spanClass}
        {...register(field.name)}
      />
    );
  }
  if (type === "tel") {
    const { onChange, ...telField } = register(field.name);
    return (
      <Input
        key={field.name}
        label={label}
        type="tel"
        inputMode="tel"
        variant={fieldVariant}
        outline={fieldOutline}
        placeholder={field.placeholder ?? "(954) 573-7192"}
        autoComplete={field.autoComplete}
        error={error}
        className={spanClass}
        maxLength={14}
        {...telField}
        onChange={(event) => {
          event.target.value = formatUsPhoneAsYouType(event.target.value);
          onChange(event);
        }}
      />
    );
  }
  return (
    <Input
      key={field.name}
      label={label}
      type={inputType(type)}
      inputMode={type === "zip" ? "numeric" : undefined}
      max={type === "date" ? todayIsoDate() : undefined}
      variant={fieldVariant}
      outline={fieldOutline}
      placeholder={field.placeholder}
      autoComplete={field.autoComplete}
      error={error}
      className={spanClass}
      {...register(field.name)}
    />
  );
}

/** Config-driven lead-capture form (ATS-030). Every lead form on the site is a
 * fields config passed to this engine — see content/lead-forms.ts for the
 * variant presets and docs/lead-form-contract.md for the props contract. */
export function LeadForm({
  heading,
  variant = "heroEval",
  fields,
  submitLabel,
  successMessage = "Thanks — we'll be in touch shortly.",
  fieldVariant = "dark",
  fieldOutline = false,
  labelCase = "upper",
  submitVariant = "primary",
  headingClassName,
  twoStep = false,
  stepOneFieldNames = DEFAULT_STEP_ONE_FIELDS,
  continueLabel = "Continue",
  className,
}: LeadFormProps) {
  const router = useRouter();
  const reduceMotion = Boolean(useReducedMotion());
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, ""])),
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Stable per-instance idempotency key — reused across retries so a
  // double-submit collapses to one lead server-side.
  const [submissionId] = useState(newSubmissionId);
  const [step, setStep] = useState<1 | 2>(1);
  // Step-1-only errors, shown before `step` advances — kept separate from
  // RHF's own `errors` since those are validated independently below
  // (buildLeadFormSchema(stepOneFields), not the full-form resolver).
  const [stepOneErrors, setStepOneErrors] = useState<Record<string, string>>({});

  const stepOneFields = twoStep
    ? fields.filter((field) => stepOneFieldNames.includes(field.name))
    : fields;
  const stepTwoFields = twoStep
    ? fields.filter((field) => !stepOneFieldNames.includes(field.name))
    : [];
  // Defensive: only surface an RHF error once its field has actually been
  // touched or a real submit was attempted, never on mere mount — cheap
  // insurance against ever flagging a field "Required" before the visitor
  // has had a chance to type in it.
  const rhfErrors = Object.fromEntries(
    Object.entries(errors)
      .filter(([name]) => isSubmitted || touchedFields[name])
      .map(([name, error]) => [name, error?.message]),
  );
  const fieldOpts: RenderFieldOptions = {
    register,
    errors: twoStep && step === 1 ? stepOneErrors : rhfErrors,
    fieldVariant,
    fieldOutline,
    labelCase,
  };

  const onContinue = () => {
    const values = getValues();
    const result = buildLeadFormSchema(stepOneFields).safeParse(
      Object.fromEntries(stepOneFieldNames.map((name) => [name, values[name] ?? ""])),
    );
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        nextErrors[String(issue.path[0])] = issue.message;
      }
      setStepOneErrors(nextErrors);
      return;
    }
    setStepOneErrors({});
    setStep(2);
  };

  const onValid = async (values: LeadFormValues, event?: BaseSyntheticEvent) => {
    setSubmitted(false);
    setSubmitError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;

    // Spam guard: a filled honeypot fakes success without submitting anything.
    if (honeypot?.value) {
      setSubmitted(true);
      reset();
      return;
    }

    try {
      const result = await submitLead({
        variant,
        values,
        submissionId,
        website: honeypot?.value ?? "",
      });
      trackLeadSuccess(result.submissionId);
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit(onValid)}
      noValidate
      className={cn(
        "relative grid grid-cols-2 gap-x-4",
        fieldOutline ? "gap-y-6" : "gap-y-5",
        className,
      )}
    >
      <h2
        className={cn(
          "col-span-2 mb-3 text-2xl",
          headingClassName ??
            cn(
              "font-sans text-button font-medium",
              fieldVariant === "dark" ? "text-white" : "text-navy-900",
            ),
        )}
      >
        {heading}
      </h2>

      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="lead-form-website">Website</label>
        <input id="lead-form-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {stepOneFields.map((field) => renderField(field, fieldOpts))}

      {twoStep && (
        <AnimatePresence initial={false}>
          {step === 2 && (
            <motion.div
              key="step-two-fields"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-2 overflow-hidden"
            >
              <div className={cn("grid grid-cols-2 gap-x-4", fieldOutline ? "gap-y-6" : "gap-y-5")}>
                {stepTwoFields.map((field) => renderField(field, fieldOpts))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Explicit, distinct `key`s here are load-bearing, not decoration:
       * without them React sees the same component type at the same tree
       * position across the step-1/step-2 branches and patches the
       * existing <button> DOM node in place rather than replacing it. That
       * means the *same* node has its `type` attribute flip from "button"
       * to "submit" while the browser is still processing the very click
       * that caused the flip — so the click which should only advance the
       * step also submits the (still step-1) form in the same tick, faux
       * "Required" errors and all. Traced by logging formState + the
       * native SubmitEvent's `submitter` across renders; distinct keys
       * force a real unmount/remount instead. */}
      {twoStep && step === 1 ? (
        <Button
          key="continue-button"
          type="button"
          variant={submitVariant}
          onClick={onContinue}
          className="col-span-2 w-full"
        >
          {continueLabel}
        </Button>
      ) : (
        <Button
          key="submit-button"
          type="submit"
          variant={submitVariant}
          loading={isSubmitting}
          className="col-span-2 w-full"
        >
          {submitLabel}
        </Button>
      )}

      {twoStep && (
        <p
          className={cn(
            "col-span-2 text-center font-sans text-stat-label",
            fieldVariant === "dark" ? "text-mute-300" : "text-ink-500",
          )}
        >
          Step {step} of 2
        </p>
      )}

      {submitError && (
        <p role="alert" className="col-span-2 font-sans text-field text-error">
          {submitError}
        </p>
      )}

      {submitted && (
        <p
          role="status"
          className={cn(
            "col-span-2 font-sans text-field",
            fieldVariant === "dark" ? "text-white" : "text-navy-900",
          )}
        >
          {successMessage}
        </p>
      )}
    </form>
  );
}
