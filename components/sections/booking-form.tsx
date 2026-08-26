"use client";

import { useState, type BaseSyntheticEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Input } from "@/components/ui/input";
import { LeadConsent } from "@/components/ui/lead-consent";
import type { LeadFormValues } from "@/components/ui/lead-form";
import { Select } from "@/components/ui/select";
import { leadFormVariants } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";
import { trackLeadSuccess } from "@/lib/analytics/lead-events";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";
import { submitLead } from "@/lib/leads/client";
import { newSubmissionId } from "@/lib/leads/submission-id";
import { formatUsPhoneAsYouType } from "@/lib/phone-format";

const config = leadFormVariants.booking;

function SquareButton({
  children,
  ...rest
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="group flex w-full items-center justify-center gap-3 rounded-full bg-navy-900 p-4 font-sans text-button text-white transition-colors hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-70"
      {...rest}
    >
      {children}
      <ArrowRightIcon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

/** Single-step booking form: every field (first name, last name, email,
 * phone, car-accident) visible and submittable at once — no "Continue"
 * gate. Submits through the ATS-031 pipeline (/api/lead → /thank-you) with
 * the "booking" variant re-validated server-side. */
export function BookingForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(config.fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(config.fields.map((field) => [field.name, ""])),
  });

  const onValid = async (values: LeadFormValues, event?: BaseSyntheticEvent) => {
    setSubmitError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;

    // Spam guard: a filled honeypot routes nowhere and submits nothing.
    if (honeypot?.value) {
      reset();
      return;
    }

    try {
      const stableSubmissionId = submissionId ?? newSubmissionId();
      if (!submissionId) setSubmissionId(stableSubmissionId);
      const { submissionId: confirmedId } = await submitLead(
        stableSubmissionId,
        config.variant,
        values,
        "",
      );
      // Conversion == a durably-stored lead: only fire on the server-confirmed ID.
      if (confirmedId) trackLeadSuccess(confirmedId);
      setSubmissionId(null);
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
      className="relative flex flex-col gap-4"
    >
      <h2 className="mb-2 font-display text-h1 text-white">Request an appointment</h2>

      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="booking-form-website">Website</label>
        <input
          id="booking-form-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <LeadConsent dark />

      {config.fields.map((field) => {
        const label = field.label.toUpperCase();
        const error = errors[field.name]?.message;
        if (field.type === "select") {
          return (
            <Select
              key={field.name}
              label={label}
              variant="dark"
              options={field.options ?? []}
              placeholder={field.placeholder}
              error={error}
              {...register(field.name)}
            />
          );
        }
        if (field.type === "tel") {
          const { onChange, ...telField } = register(field.name);
          return (
            <Input
              key={field.name}
              label={label}
              type="tel"
              inputMode="tel"
              variant="dark"
              autoComplete={field.autoComplete}
              placeholder={siteConfig.business.phone}
              maxLength={14}
              error={error}
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
            type={field.type === "email" ? "email" : "text"}
            variant="dark"
            autoComplete={field.autoComplete}
            error={error}
            {...register(field.name)}
          />
        );
      })}

      <div className="mt-2">
        <SquareButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting || undefined}>
          {isSubmitting ? "Sending…" : config.submitLabel}
        </SquareButton>
      </div>

      {submitError && (
        <p role="alert" className="font-sans text-field text-error">
          {submitError}
        </p>
      )}
    </form>
  );
}
