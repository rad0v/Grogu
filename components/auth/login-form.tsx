"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { UserRole } from "@/lib/types";
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
  login,
  loginAsDemo,
} from "@/lib/mock-auth";
import { ServiceError } from "@/lib/services";
import { homePathForRole, useSession } from "@/lib/hooks/use-session";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Passwords are at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const { session } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const [demoBusy, setDemoBusy] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function go(role: UserRole) {
    router.replace(next || homePathForRole(role));
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await login(values);
      go(result.role);
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't sign you in. Please try again.",
      );
    }
  });

  async function onDemo(role: UserRole) {
    setFormError(null);
    setDemoBusy(role);
    try {
      const result = await loginAsDemo(role);
      go(result.role);
    } catch {
      setFormError("Couldn't start the demo session.");
      setDemoBusy(null);
    }
  }

  return (
    <AuthCard
      title="Log in to Grogu"
      description="Use a demo account, or any email from the seed data."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-secondary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        {session && (
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{session.user.name}</span>.
            Logging in below switches accounts.
          </div>
        )}
        <div className="grid gap-2">
          <Button
            variant="secondary"
            className="justify-start"
            loading={demoBusy === "tester"}
            disabled={demoBusy !== null || isSubmitting}
            onClick={() => onDemo("tester")}
          >
            Continue as {DEMO_ACCOUNTS.tester.label}
          </Button>
          <Button
            variant="secondary"
            className="justify-start"
            loading={demoBusy === "developer"}
            disabled={demoBusy !== null || isSubmitting}
            onClick={() => onDemo("developer")}
          >
            Continue as {DEMO_ACCOUNTS.developer.label}
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or with email
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Email" htmlFor="login-email" error={errors.email?.message}>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder={DEMO_ACCOUNTS.tester.email}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </Field>
          <Field
            label="Password"
            htmlFor="login-password"
            hint={`Any 6+ characters works — try "${DEMO_PASSWORD}".`}
            error={errors.password?.message}
          >
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </Field>

          {formError && (
            <p
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {formError}
            </p>
          )}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Log in"}
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
