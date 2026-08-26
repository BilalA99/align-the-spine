"use client";

import { useState, type BaseSyntheticEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Input } from "@/components/ui/input";
import type { LeadFormValues } from "@/components/ui/lead-form";
import { Select } from "@/components/ui/select";
import { leadFormVariants } from "@/content/lead-forms";
import { trackLeadSuccess } from "@/lib/analytics/lead-events";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";
import { newSubmissionId } from "@/lib/lead/submission-id";
import { submitLead } from "@/lib/lead/submit-client";
import { formatUsPhoneAsYouType } from "@/lib/phone-format";

const config = leadFormVariants.booking;
const STEP_ONE_FIELDS = ["firstName", "phone"] as const;

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

/** Two-step booking form per the Book-appt artboard (ATS-100): step 1 asks
 * first name + phone ("Continue"), step 2 the remaining fields ("Schedule My
 * Evaluation"). Submits through the ATS-031 pipeline (/api/lead → /thank-you)
 * with the "booking" variant re-validated server-side. */
export function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId] = useState(newSubmissionId);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(config.fields)) as Resolver<LeadFormValues>,
    defaultValues: Object.fromEntries(config.fields.map((field) => [field.name, ""])),
  });

  const visibleFields =
    step === 1
      ? config.fields.filter((field) => (STEP_ONE_FIELDS as readonly string[]).includes(field.name))
      : config.fields;

  const onContinue = async () => {
    if (await trigger([...STEP_ONE_FIELDS])) setStep(2);
  };

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
      const result = await submitLead({
        variant: config.variant,
        values,
        submissionId,
        website: "",
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

      {visibleFields.map((field) => {
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
              placeholder="(954) 573-7192"
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
        if (field.type === "email") {
          return (
            <Input
              key={field.name}
              label={label}
              type="email"
              inputMode="email"
              variant="dark"
              autoComplete={field.autoComplete}
              error={error}
              {...register(field.name)}
            />
          );
        }
        return (
          <Input
            key={field.name}
            label={label}
            type="text"
            variant="dark"
            autoComplete={field.autoComplete}
            error={error}
            {...register(field.name)}
          />
        );
      })}

      <div className="mt-2 flex flex-col gap-2">
        {step === 1 ? (
          <SquareButton type="button" onClick={onContinue}>
            Continue
          </SquareButton>
        ) : (
          <SquareButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting || undefined}>
            {isSubmitting ? "Sending…" : config.submitLabel}
          </SquareButton>
        )}
        <p className="text-center font-sans text-field-error font-light text-white">
          Step {step} of 2
        </p>
      </div>

      {submitError && (
        <p role="alert" className="font-sans text-field text-error">
          {submitError}
        </p>
      )}
    </form>
  );
}
