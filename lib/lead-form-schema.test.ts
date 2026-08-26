import { describe, expect, it } from "vitest";

import {
  buildLeadFormSchema,
  enLeadFormMessages,
  esLeadFormMessages,
  type LeadFieldConfig,
  type LeadFormMessages,
} from "./lead-form-schema";

function schemaFor(field: LeadFieldConfig) {
  return buildLeadFormSchema([field]);
}

describe("phone validation", () => {
  const schema = schemaFor({ name: "phone", label: "Phone", type: "tel" });

  it("accepts a well-formed 10-digit US number in common formats", () => {
    expect(schema.safeParse({ phone: "(954) 573-7192" }).success).toBe(true);
    expect(schema.safeParse({ phone: "954-573-7192" }).success).toBe(true);
    expect(schema.safeParse({ phone: "9545737192" }).success).toBe(true);
  });

  it("accepts 11 digits only with a leading country code 1", () => {
    expect(schema.safeParse({ phone: "19545737192" }).success).toBe(true);
    expect(schema.safeParse({ phone: "29545737192" }).success).toBe(false);
  });

  it("rejects too few digits", () => {
    expect(schema.safeParse({ phone: "123" }).success).toBe(false);
    expect(schema.safeParse({ phone: "954-5737" }).success).toBe(false);
  });

  it("rejects too many digits — doesn't just check punctuation shape", () => {
    expect(schema.safeParse({ phone: "9545737192999" }).success).toBe(false);
  });

  it("rejects letters and other non-phone characters", () => {
    expect(schema.safeParse({ phone: "call-me-maybe" }).success).toBe(false);
  });

  it("rejects a raw string over the length ceiling before it even reaches format checks", () => {
    expect(schema.safeParse({ phone: "9".repeat(50) }).success).toBe(false);
  });
});

describe("email validation", () => {
  const schema = schemaFor({ name: "email", label: "Email", type: "email" });

  it("accepts a well-formed email, trimming surrounding whitespace", () => {
    const parsed = schema.safeParse({ email: "  patient@example.com  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("patient@example.com");
  });

  it("rejects malformed email addresses", () => {
    expect(schema.safeParse({ email: "not-an-email" }).success).toBe(false);
    expect(schema.safeParse({ email: "missing@tld" }).success).toBe(false);
    expect(schema.safeParse({ email: "@example.com" }).success).toBe(false);
  });

  it("rejects header-injection attempts (newlines can't survive the email format check)", () => {
    expect(schema.safeParse({ email: "a@b.com\nBcc: evil@example.com" }).success).toBe(false);
  });

  it("rejects an email over the RFC practical length ceiling", () => {
    const tooLong = `${"a".repeat(250)}@example.com`;
    expect(schema.safeParse({ email: tooLong }).success).toBe(false);
  });
});

describe("required vs optional fields", () => {
  it("rejects an empty required field", () => {
    const schema = schemaFor({ name: "firstName", label: "First Name" });
    expect(schema.safeParse({ firstName: "" }).success).toBe(false);
    expect(schema.safeParse({ firstName: "   " }).success).toBe(false);
  });

  it("allows an empty optional field but still validates format when filled in", () => {
    const schema = schemaFor({
      name: "email",
      label: "Email",
      type: "email",
      required: false,
    });
    expect(schema.safeParse({ email: "" }).success).toBe(true);
    expect(schema.safeParse({ email: "not-an-email" }).success).toBe(false);
    expect(schema.safeParse({ email: "ok@example.com" }).success).toBe(true);
  });
});

describe("generic text fields", () => {
  it("trims whitespace and enforces a length ceiling", () => {
    const schema = schemaFor({ name: "firstName", label: "First Name" });
    const parsed = schema.safeParse({ firstName: "  Maria  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.firstName).toBe("Maria");
    expect(schema.safeParse({ firstName: "a".repeat(200) }).success).toBe(false);
  });

  it("caps a textarea at a much longer ceiling than a plain text field", () => {
    const schema = schemaFor({ name: "message", label: "Message", type: "textarea" });
    expect(schema.safeParse({ message: "a".repeat(1000) }).success).toBe(true);
    expect(schema.safeParse({ message: "a".repeat(3000) }).success).toBe(false);
  });
});

describe("zip validation", () => {
  const schema = schemaFor({ name: "zip", label: "Zip Code", type: "zip" });

  it("accepts 5-digit and ZIP+4 formats", () => {
    expect(schema.safeParse({ zip: "33441" }).success).toBe(true);
    expect(schema.safeParse({ zip: "33441-1234" }).success).toBe(true);
  });

  it("rejects malformed ZIP codes", () => {
    expect(schema.safeParse({ zip: "abc" }).success).toBe(false);
    expect(schema.safeParse({ zip: "1234" }).success).toBe(false);
  });
});

describe("localized validation messages", () => {
  /** §Forms: a Spanish form must report its errors in Spanish. The rules
   * themselves are shared and identical — only the wording is localized —
   * so a Spanish submission can never pass validation an English one would
   * fail, and vice versa. */
  const fields: LeadFieldConfig[] = [
    { name: "firstName", label: "Nombre" },
    { name: "phone", label: "Teléfono", type: "tel" },
    { name: "email", label: "Correo electrónico", type: "email" },
    { name: "accidentDate", label: "Fecha del accidente", type: "date" },
  ];

  function messagesFor(values: Record<string, string>, msgs: LeadFormMessages) {
    const result = buildLeadFormSchema(fields, msgs).safeParse(values);
    if (result.success) return [];
    return result.error.issues.map((issue) => issue.message);
  }

  const empty = { firstName: "", phone: "", email: "", accidentDate: "" };

  it("reports required fields in Spanish", () => {
    const messages = messagesFor(empty, esLeadFormMessages);
    expect(messages).toContain("Campo obligatorio");
    expect(messages).not.toContain("Required");
  });

  it("reports format errors in Spanish", () => {
    const messages = messagesFor(
      { firstName: "Ana", phone: "123", email: "no-arroba", accidentDate: "31/12/2026" },
      esLeadFormMessages,
    );
    expect(messages).toContain("Ingrese un número de teléfono válido de 10 dígitos");
    expect(messages).toContain("Ingrese un correo electrónico válido");
    expect(messages).toContain("Ingrese una fecha válida");
  });

  it("defaults to English so existing call sites are unaffected", () => {
    expect(messagesFor(empty, enLeadFormMessages)).toContain("Required");
    // No explicit messages argument at all -> English.
    const result = buildLeadFormSchema(fields).safeParse(empty);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((i) => i.message)).toContain("Required");
    }
  });

  it("applies identical rules in both languages", () => {
    const values = {
      firstName: "Ana",
      phone: "9545737192",
      email: "a@b.com",
      accidentDate: "2026-01-05",
    };
    expect(buildLeadFormSchema(fields, esLeadFormMessages).safeParse(values).success).toBe(
      buildLeadFormSchema(fields, enLeadFormMessages).safeParse(values).success,
    );

    const bad = { firstName: "", phone: "1", email: "x", accidentDate: "nope" };
    expect(buildLeadFormSchema(fields, esLeadFormMessages).safeParse(bad).success).toBe(
      buildLeadFormSchema(fields, enLeadFormMessages).safeParse(bad).success,
    );
  });
});
