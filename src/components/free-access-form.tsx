"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { submitFreeAccessRequest } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";

const formSchema = z.object({
  reason: z
    .string()
    .min(10, "দয়া করে অন্তত ১০টি অক্ষর লিখুন।")
    .max(500, "আপনার কারণটি ৫০০ অক্ষরের মধ্যে সীমাবদ্ধ রাখুন।"),
});

export function FreeAccessForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: (subscription: any) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setServerError("");

    const res = await submitFreeAccessRequest(data.reason);

    if (res.success) {
      // Refresh the page or call the success handler
      const { getUserSubscription } = await import("@/app/actions/user");
      const sub = await getUserSubscription();
      onSubmitSuccess(sub);
    } else {
      setServerError(res.error || "An error occurred");
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <FieldGroup>
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reason">আপনার কারণটি বিস্তারিত লিখুন:</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="reason"
                  placeholder="দয়া করে বিস্তারিত লিখুন কেন আপনি পেইড সাবস্ক্রিপশন নিতে পারছেন না..."
                  rows={4}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/500
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {serverError && (
        <p className="text-red-500 text-sm font-medium">{serverError}</p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full py-6 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800"
      >
        {submitting ? "Submitting..." : "Submit Request (আবেদন জমা দিন)"}
      </Button>
    </form>
  );
}
