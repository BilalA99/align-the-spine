"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { errorId } from "@/components/ui/field";
import { LeadConsent } from "@/components/ui/lead-consent";
import type { LeadFormValues } from "@/components/ui/lead-form";
import { siteConfig } from "@/content/site";
import { trackLeadConversion } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  buildLeadFormSchema,
  type LeadFieldConfig,
  type LeadFieldType,
} from "@/lib/lead-form-schema";
import { submitLead } from "@/lib/leads/client";
import { formatUsPhoneAsYouType } from "@/lib/phone-format";

export interface UnderlineFormProps {
  variant?: string;
  fields: LeadFieldConfig[];
  submitLabel: string;
  successMessage?: string;
  className?: string;
}

function inputType(type: LeadFieldType) {
  if (type === "tel" || type === "email") return type;
  return "text";
}

const fieldClasses =
  "w-full border-0 border-b border-mute-300 bg-transparent px-0 pb-2 pt-1 font-sans text-field text-navy-900 outline-none transition-colors placeholder:text-mute-400 focus:border-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500";

/** Borderless, underline-only field styling used only by the homepage
 * "Contact us" band (per the contact-us-final design) — every other lead
 * form on the site uses the boxed <Input>/<Select>/<Textarea> field set via
 * <LeadForm>. Kept as a separate component rather than a variant of
 * <LeadForm> so that shared field styling never leaks between the two. */
export function UnderlineForm({
  variant = "contact",
  fields,
  submitLabel,
  successMessage = "Thanks — we'll be in touch shortly.",
  className,
}: UnderlineFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, ""])),
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const onValid = async (values: LeadFormValues, event?: BaseSyntheticEvent) => {
    setSubmitted(false);
    setSubmitError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;

    if (honeypot?.value) {
      setSubmitted(true);
      reset();
      return;
    }

    try {
      const stableSubmissionId = submissionId ?? crypto.randomUUID();
      if (!submissionId) setSubmissionId(stableSubmissionId);
      await submitLead(stableSubmissionId, variant, values, honeypot?.value ?? "");
      trackLeadConversion(variant, values);
      setSubmissionId(null);
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      className={cn("grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2", className)}
    >
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="underline-form-website">Website</label>
        <input
          id="underline-form-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {fields.map((field) => {
        const type = field.type ?? "text";
        const spanClass = field.half ? undefined : "sm:col-span-2";
        const error = errors[field.name]?.message;
        const registered = register(field.name);

        return (
          <div key={field.name} className={cn("flex flex-col gap-2", spanClass)}>
            <label
              htmlFor={`underline-${field.name}`}
              className="font-sans text-stat-label uppercase tracking-[1px] text-navy-900"
            >
              {field.label}
            </label>
            <input
              id={`underline-${field.name}`}
              type={inputType(type)}
              inputMode={type === "zip" ? "numeric" : undefined}
              autoComplete={field.autoComplete}
              placeholder={type === "tel" ? siteConfig.business.phone : field.placeholder}
              maxLength={type === "tel" ? 14 : undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId(`underline-${field.name}`) : undefined}
              className={fieldClasses}
              {...registered}
              onChange={
                type === "tel"
                  ? (event) => {
                      event.target.value = formatUsPhoneAsYouType(event.target.value);
                      registered.onChange(event);
                    }
                  : registered.onChange
              }
            />
            {error && (
              <p
                id={errorId(`underline-${field.name}`)}
                role="alert"
                className="font-sans text-field-error text-error"
              >
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>

      <LeadConsent className="sm:col-span-2" />

      {submitError && (
        <p role="alert" className="font-sans text-field-error text-error sm:col-span-2">
          {submitError}
        </p>
      )}

      {submitted && (
        <p role="status" className="font-sans text-field text-navy-900 sm:col-span-2">
          {successMessage}
        </p>
      )}
    </form>
  );
}
