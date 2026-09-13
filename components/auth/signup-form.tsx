"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  EXPERIENCE_OPTIONS,
  GENRE_LABELS,
  GENRE_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
  STUDIO_SIZE_LABELS,
} from "@/lib/constants";
import type {
  DeveloperProfile,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
} from "@/lib/types";
import { signup } from "@/lib/mock-auth";
import { ServiceError } from "@/lib/services";
import { homePathForRole } from "@/lib/hooks/use-session";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SignupStepIndicator } from "@/components/auth/signup-step-indicator";
import { InteractiveRoleCard } from "@/components/auth/interactive-role-card";
import { SignupReviewCard } from "@/components/auth/signup-review-card";

const STUDIO_SIZES = ["solo", "small", "mid", "large"] as const;

const schema = z
  .object({
    role: z.enum(["tester", "developer"]),
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    location: z.string().trim().min(2, "Where are you located?"),
    experienceLevel: z.enum(EXPERIENCE_OPTIONS as [string, ...string[]]).optional(),
    preferredGenres: z.array(z.string()),
    platforms: z.array(z.string()),
    weeklyAvailabilityHours: z.coerce.number().int().optional(),
    studioName: z.string().trim().optional(),
    studioSize: z.enum(STUDIO_SIZES).optional(),
    website: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role === "tester") {
      if (!value.experienceLevel) {
        ctx.addIssue({
          code: "custom",
          path: ["experienceLevel"],
          message: "Select your experience level.",
        });
      }
      if (value.preferredGenres.length < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["preferredGenres"],
          message: "Select at least one genre you enjoy.",
        });
      }
      if (value.platforms.length < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["platforms"],
          message: "Select at least one platform you own.",
        });
      }
      const hours = value.weeklyAvailabilityHours ?? 0;
      if (hours < 1 || hours > 60) {
        ctx.addIssue({
          code: "custom",
          path: ["weeklyAvailabilityHours"],
          message: "Hours must be between 1 and 60.",
        });
      }
    } else {
      if (!value.studioName || value.studioName.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["studioName"],
          message: "Enter your studio name.",
        });
      }
      if (!value.studioSize) {
        ctx.addIssue({
          code: "custom",
          path: ["studioSize"],
          message: "Select your studio size.",
        });
      }
      if (value.website && !/^https?:\/\/.+/.test(value.website)) {
        ctx.addIssue({
          code: "custom",
          path: ["website"],
          message: "Enter a valid URL (starting with http:// or https://) or leave empty.",
        });
      }
    }
  });

type FormValues = z.input<typeof schema>;

const WIZARD_STEPS = [
  { id: 1, label: "Account & Role", shortLabel: "1. Account" },
  { id: 2, label: "Preferences & Profile", shortLabel: "2. Preferences" },
  { id: 3, label: "Review & Confirm", shortLabel: "3. Review" },
];

export function SignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "tester",
      name: "",
      email: "",
      password: "",
      location: "",
      experienceLevel: "regular",
      preferredGenres: [],
      platforms: [],
      weeklyAvailabilityHours: 5,
      studioName: "",
      studioSize: "solo",
      website: "",
    },
  });

  const role = useWatch({ control, name: "role" });
  const name = useWatch({ control, name: "name" });
  const email = useWatch({ control, name: "email" });
  const location = useWatch({ control, name: "location" });
  const genres = useWatch({ control, name: "preferredGenres" }) ?? [];
  const platforms = useWatch({ control, name: "platforms" }) ?? [];
  const experienceLevel = useWatch({ control, name: "experienceLevel" });
  const weeklyAvailabilityHours = useWatch({ control, name: "weeklyAvailabilityHours" });
  const studioName = useWatch({ control, name: "studioName" });
  const studioSize = useWatch({ control, name: "studioSize" });
  const website = useWatch({ control, name: "website" });

  function toggleArray(
    field: "preferredGenres" | "platforms",
    current: string[],
    value: string
  ) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  }

  const validateStep1 = async (): Promise<boolean> => {
    const isValid = await trigger(["role", "name", "email", "password", "location"]);
    return isValid;
  };

  const validateStep2 = async (): Promise<boolean> => {
    if (role === "tester") {
      return await trigger([
        "experienceLevel",
        "preferredGenres",
        "platforms",
        "weeklyAvailabilityHours",
      ]);
    } else {
      return await trigger(["studioName", "studioSize", "website"]);
    }
  };

  const goToNextStep = async () => {
    setFormError(null);
    if (currentStep === 1) {
      const valid = await validateStep1();
      if (!valid) return;
      setDirection(1);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await validateStep2();
      if (!valid) return;
      setDirection(1);
      setCurrentStep(3);
    }
  };

  const goToPrevStep = (targetStep?: number) => {
    setFormError(null);
    const dest = targetStep ?? Math.max(1, currentStep - 1);
    setDirection(-1);
    setCurrentStep(dest);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result =
        values.role === "tester"
          ? await signup({
              role: "tester",
              name: values.name,
              email: values.email,
              password: values.password,
              location: values.location,
              experienceLevel: values.experienceLevel as ExperienceLevel,
              preferredGenres: values.preferredGenres as GameGenre[],
              platforms: values.platforms as GamePlatform[],
              weeklyAvailabilityHours: Number(values.weeklyAvailabilityHours),
            })
          : await signup({
              role: "developer",
              name: values.name,
              email: values.email,
              password: values.password,
              location: values.location,
              studioName: values.studioName ?? "",
              studioSize: values.studioSize as DeveloperProfile["studioSize"],
              website: values.website ?? "",
            });
      router.replace(homePathForRole(result.role));
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't create your account. Please try again."
      );
    }
  });

  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  return (
    <AuthCard
      title="Create your Grogu account"
      description={
        currentStep === 1
          ? "Step 1 of 3 — Select your platform role and enter credentials."
          : currentStep === 2
          ? "Step 2 of 3 — Personalize your gaming or studio profile."
          : "Step 3 of 3 — Review your profile and launch your account."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-secondary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        {/* Animated Multi-Step Indicator */}
        <SignupStepIndicator
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={(step) => goToPrevStep(step)}
        />

        <form onSubmit={onSubmit} noValidate>
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: ROLE & CREDENTIALS */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-5"
              >
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-4 text-secondary" /> I want to use Grogu to…
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InteractiveRoleCard
                      role="tester"
                      active={role === "tester"}
                      onSelect={() => setValue("role", "tester")}
                    />
                    <InteractiveRoleCard
                      role="developer"
                      active={role === "developer"}
                      onSelect={() => setValue("role", "developer")}
                    />
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" htmlFor="su-name" error={errors.name?.message}>
                    <Input
                      id="su-name"
                      placeholder="Alex Mercer"
                      autoComplete="name"
                      {...register("name")}
                    />
                  </Field>
                  <Field label="Location" htmlFor="su-location" error={errors.location?.message}>
                    <Input
                      id="su-location"
                      placeholder="Seattle, USA"
                      {...register("location")}
                    />
                  </Field>
                  <Field label="Email Address" htmlFor="su-email" error={errors.email?.message}>
                    <Input
                      id="su-email"
                      type="email"
                      placeholder="alex@example.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                  </Field>
                  <Field label="Password" htmlFor="su-password" error={errors.password?.message}>
                    <Input
                      id="su-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...register("password")}
                    />
                  </Field>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="w-full justify-between"
                  >
                    <span>Continue to Preferences</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PROFILE CUSTOMIZATION */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-5"
              >
                {role === "tester" ? (
                  <div className="space-y-5 rounded-xl border border-border bg-surface/70 p-5 shadow-sm">
                    <Field
                      label="Experience Level"
                      htmlFor="su-experience"
                      error={errors.experienceLevel?.message}
                    >
                      <Select
                        value={experienceLevel ?? "regular"}
                        onValueChange={(v) =>
                          setValue("experienceLevel", v, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger id="su-experience">
                          <SelectValue>
                            {
                              EXPERIENCE_LABELS[
                                (experienceLevel ?? "regular") as ExperienceLevel
                              ]
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_OPTIONS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {EXPERIENCE_LABELS[level as ExperienceLevel]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field
                      label="Favourite Genres (Select all that apply)"
                      error={errors.preferredGenres?.message}
                    >
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {GENRE_OPTIONS.map((genre) => {
                          const active = genres.includes(genre);
                          return (
                            <motion.button
                              key={genre}
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              aria-pressed={active}
                              onClick={() =>
                                toggleArray("preferredGenres", genres, genre)
                              }
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                                active
                                  ? "border-primary bg-primary/20 text-secondary shadow-sm shadow-primary/20 font-semibold"
                                  : "border-border/70 bg-surface/50 text-muted-foreground hover:border-border-strong hover:text-foreground"
                              )}
                            >
                              {active && <CheckCircle2 className="size-3 text-secondary" />}
                              <span>{GENRE_LABELS[genre]}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field
                      label="Available Testing Platforms"
                      error={errors.platforms?.message}
                    >
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PLATFORM_OPTIONS.map((platform) => {
                          const active = platforms.includes(platform);
                          return (
                            <motion.button
                              key={platform}
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              aria-pressed={active}
                              onClick={() => toggleArray("platforms", platforms, platform)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                                active
                                  ? "border-secondary/60 bg-secondary/15 text-foreground shadow-sm shadow-secondary/10 font-semibold"
                                  : "border-border/70 bg-surface/50 text-muted-foreground hover:border-border-strong hover:text-foreground"
                              )}
                            >
                              {active && <CheckCircle2 className="size-3 text-secondary" />}
                              <span>{PLATFORM_LABELS[platform]}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field
                      label="Weekly Availability Commitment"
                      htmlFor="su-hours"
                      error={errors.weeklyAvailabilityHours?.message}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-subtle-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5 text-secondary" /> Hours per week
                          </span>
                          <span className="font-semibold text-foreground text-sm">
                            {Number(weeklyAvailabilityHours) || 5} hours
                          </span>
                        </div>
                        <input
                          id="su-hours"
                          type="range"
                          min={1}
                          max={40}
                          value={Number(weeklyAvailabilityHours) || 5}
                          onChange={(e) =>
                            setValue("weeklyAvailabilityHours", Number(e.target.value), {
                              shouldValidate: true,
                            })
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary focus:outline-none"
                        />
                      </div>
                    </Field>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-xl border border-border bg-surface/70 p-5 shadow-sm">
                    <Field
                      label="Studio / Team Name"
                      htmlFor="su-studio"
                      error={errors.studioName?.message}
                    >
                      <Input
                        id="su-studio"
                        placeholder="e.g. Pixel Forge Games"
                        {...register("studioName")}
                      />
                    </Field>

                    <Field
                      label="Studio Size"
                      htmlFor="su-size"
                      error={errors.studioSize?.message}
                    >
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {STUDIO_SIZES.map((size) => {
                          const active = (studioSize ?? "solo") === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setValue("studioSize", size, { shouldValidate: true })
                              }
                              className={cn(
                                "flex flex-col items-start rounded-lg border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                active
                                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold"
                                  : "border-border bg-surface/40 text-muted-foreground hover:border-border-strong"
                              )}
                            >
                              <span className="text-xs">{STUDIO_SIZE_LABELS[size]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field
                      label="Studio Website (Optional)"
                      htmlFor="su-website"
                      error={errors.website?.message}
                    >
                      <Input
                        id="su-website"
                        placeholder="https://pixelforgegames.com"
                        {...register("website")}
                      />
                    </Field>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToPrevStep(1)}
                    className="w-1/3"
                  >
                    <ArrowLeft className="size-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="w-2/3 justify-between"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: REVIEW & LAUNCH */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-5"
              >
                <SignupReviewCard
                  formData={{
                    role,
                    name,
                    email,
                    location,
                    experienceLevel,
                    preferredGenres: genres,
                    platforms,
                    weeklyAvailabilityHours: Number(weeklyAvailabilityHours),
                    studioName,
                    studioSize,
                    website,
                  }}
                  onEditStep={(step) => goToPrevStep(step)}
                />

                {formError && (
                  <p
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    role="alert"
                  >
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToPrevStep(2)}
                    className="w-1/3"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="size-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-2/3 shadow-lg shadow-primary/25"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Creating account…" : "Launch Account"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </AuthCard>
  );
}
