"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { PlaytestWithRelations } from "@/lib/types";
import { applicationsService, ServiceError } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuccessState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { GameArt } from "@/components/games/game-cover";

const schema = z.object({
  message: z
    .string()
    .trim()
    .min(30, "Tell the developer a bit more — at least 30 characters.")
    .max(600, "Keep it under 600 characters."),
  device: z
    .string()
    .trim()
    .min(3, "Add the device / specs you'll test on."),
  experienceNote: z.string().trim().max(400, "Keep it under 400 characters.").optional(),
  agreedToTerms: z
    .boolean()
    .refine((value) => value, "You need to agree before applying."),
});

type FormValues = z.infer<typeof schema>;

export function ApplyDialog({
  playtest,
  open,
  onOpenChange,
}: {
  playtest: PlaytestWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
      device: "",
      experienceNote: "",
      agreedToTerms: false,
    },
  });

  const agreed = useWatch({ control, name: "agreedToTerms" });

  function close(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setFormError(null);
        reset();
      }, 200);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await applicationsService.applyToPlaytest(playtest.id, {
        message: values.message,
        device: values.device,
        experienceNote: values.experienceNote ?? "",
        agreedToTerms: true,
      });
      setSubmitted(true);
      toast({
        title: "Application submitted",
        description: `${playtest.developer.name} will review it shortly.`,
      });
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't submit your application. Please try again.",
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md">
        {submitted ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Application submitted</DialogTitle>
              <DialogDescription>
                {playtest.developer.name} will review your application.
              </DialogDescription>
            </DialogHeader>
            <SuccessState
              title="Application submitted"
              description={`${playtest.developer.name} will review your application for ${playtest.title}. You'll see the status in your Applications.`}
              className="border-0 bg-transparent"
            />
            <DialogFooter>
              <Button variant="secondary" onClick={() => close(false)}>
                Keep browsing
              </Button>
              <Button asChild>
                <Link href="/applications">View my applications</Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <DialogHeader>
              <DialogTitle>Apply for playtest</DialogTitle>
              <DialogDescription>
                Two short questions. It takes about a minute.
              </DialogDescription>
            </DialogHeader>

            {/* Always show what is being applied for. */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
              <GameArt
                game={playtest.game}
                ratio="3/2"
                className="w-20 shrink-0 rounded-md"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">
                  {playtest.game.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {playtest.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-subtle-foreground">
                  ~{playtest.requirements.estimatedHours}h ·{" "}
                  {playtest.requirements.ndaRequired ? "NDA required" : "No NDA"}
                </p>
              </div>
            </div>

            <Field
              label="Why do you want to test this game?"
              htmlFor="apply-message"
              error={errors.message?.message}
              required
            >
              <Textarea
                id="apply-message"
                rows={4}
                placeholder="What draws you to this game, and what kind of feedback are you good at giving?"
                aria-invalid={!!errors.message}
                {...register("message")}
              />
            </Field>

            <Field
              label="Device & setup you'll test on"
              htmlFor="apply-device"
              error={errors.device?.message}
              required
            >
              <Input
                id="apply-device"
                placeholder="e.g. Windows 11, RTX 3060, 32GB RAM"
                aria-invalid={!!errors.device}
                {...register("device")}
              />
            </Field>

            <Field
              label="Relevant testing experience (optional)"
              htmlFor="apply-experience"
              error={errors.experienceNote?.message}
            >
              <Textarea
                id="apply-experience"
                rows={2}
                placeholder="Similar games you've tested, bug-reporting habits, etc."
                {...register("experienceNote")}
              />
            </Field>

            <div className="flex items-start gap-2">
              <Checkbox
                id="apply-terms"
                checked={agreed === true}
                onCheckedChange={(checked) =>
                  setValue("agreedToTerms", checked === true, {
                    shouldValidate: true,
                  })
                }
              />
              <Label htmlFor="apply-terms" className="font-normal text-muted-foreground">
                I&apos;ll complete the required tasks and submit honest feedback
                {playtest.requirements.ndaRequired
                  ? ", and I agree to the NDA before accessing the build."
                  : "."}
              </Label>
            </div>
            {errors.agreedToTerms && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {errors.agreedToTerms.message}
              </p>
            )}

            {formError && (
              <p
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {formError}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => close(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit application"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
