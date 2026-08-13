"use client";

import { useState } from "react";
import { contactSchema } from "@/schemas/contactSchema";
import { zodErrorsToFieldMap } from "@/utils/formErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | success

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("idle");

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorsToFieldMap(result.error));
      return;
    }

    // No backend in this project — simulate a successful submission.
    setErrors({});
    setFormData(initialForm);
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === "success" && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary"
        >
          Thanks for reaching out — your message has been received.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
        />
        {errors.subject && (
          <p id="subject-error" role="alert" className="text-sm text-destructive">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
}