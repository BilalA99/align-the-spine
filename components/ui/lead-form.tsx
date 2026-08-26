"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver, type UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { type FieldVariant } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LeadConsent } from "@/components/ui/lead-consent";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/content/site";
import { trackLeadSuccess } from "@/lib/analytics/lead-events";
import { cn } from "@/lib/cn";
import {
  buildLeadFormSchema,
  type LeadFieldConfig,
  type LeadFieldType,
} from "@/lib/lead-form-schema";
import { submitLead } from "@/lib/leads/client";
import { newSubmissionId } from "@/lib/leads/submission-id";
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
  /** Overrides the default submission (POST /api/lead + redirect to
   * /thank-you). When provided, success shows `successMessage` inline instead. */
  onSubmit?: (values: LeadFormValues) => Promise<void>;
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
  submitVariant?: "primary" | "teal" | "white";
  /** Overrides the heading's default sans/navy-or-white styling entirely
   * (e.g. the solid-panel Hero variant's serif display heading). */
  headingClassName?: string;
  /** Overrides the consent line's default fieldVariant-driven color (grey
   * on dark, ink-500 on light). A `dark`-variant form whose bottom actually
   * sits inside a fade-to-white background — not solid navy the whole way
   * down, e.g. ServiceAreaHero/BlogHero's own hero panels — needs this
   * line dark (near-black), since the default grey has poor contrast on
   * BOTH ends of a navy-to-white gradient at once, not just one (reported:
   * grey consent text blending into the hero's bottom fade). Forms that
   * stay on a solid dark background the whole way down (e.g.
   * LeadFormPopup's dialog) should leave this unset. */
  consentClassName?: string;
  /** Heading element for `heading`, defaults to "h2". Pages that render this
   * form twice for a responsive mobile/desktop swap (one always `display:
   * none` at a given breakpoint) should pass "p" on whichever instance
   * isn't the semantic one, so the DOM never carries two identical <h2>s at
   * once — see hero-solid-panel.tsx and service-area-hero.tsx. */
  headingAs?: "h2" | "p";
  className?: string;
}

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
  errors: Record<string, string | undefined>;
  fieldVariant: FieldVariant;
  fieldOutline: boolean;
  labelCase: "upper" | "none";
}

/** Renders one field per its `type` — the one place that knows how a
 * select/textarea/tel/text field maps to its input component. */
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
        placeholder={field.placeholder ?? siteConfig.business.phone}
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
 * variant presets and docs/lead-form-contract.md for the props contract.
 * Always single-step, on every surface including mobile: with 3-5 fields
 * per variant, splitting into a "Continue" step first only added friction
 * without a real payoff (owner direction 2026-08-18 — see git history for
 * the two-step version this replaced, ATS-147). */
export function LeadForm({
  heading,
  variant = "heroEval",
  fields,
  submitLabel,
  onSubmit,
  successMessage = "Thanks — we'll be in touch shortly.",
  fieldVariant = "dark",
  fieldOutline = false,
  labelCase = "upper",
  submitVariant = "primary",
  headingClassName,
  consentClassName,
  headingAs = "h2",
  className,
}: LeadFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isSubmitted },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, ""])),
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

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
    errors: rhfErrors,
    fieldVariant,
    fieldOutline,
    labelCase,
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
      return;
    }

    try {
      const stableSubmissionId = submissionId ?? newSubmissionId();
      if (!submissionId) setSubmissionId(stableSubmissionId);
      const { submissionId: confirmedId } = await submitLead(
        stableSubmissionId,
        variant,
        values,
        honeypot?.value ?? "",
      );
      // The conversion is a durably-stored lead, nothing earlier — so it only
      // fires once the server confirms the submission ID it persisted.
      if (confirmedId) trackLeadSuccess(confirmedId);
      setSubmissionId(null);
      if (onSubmit) {
        await onSubmit(values);
        setSubmitted(true);
        return;
      }
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const HeadingTag = headingAs;

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
      <HeadingTag
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
      </HeadingTag>

      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="lead-form-website">Website</label>
        <input id="lead-form-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {fields.map((field) => renderField(field, fieldOpts))}

      <Button
        type="submit"
        variant={submitVariant}
        loading={isSubmitting}
        className="col-span-2 w-full"
      >
        {submitLabel}
      </Button>

      <LeadConsent dark={fieldVariant === "dark"} className={cn("col-span-2", consentClassName)} />

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
