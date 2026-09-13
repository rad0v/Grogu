"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { testCompletion } from "@/lib/domain";
import { RATING_DIMENSIONS } from "@/lib/constants";
import type { FeedbackRatings, FeedbackSentiment } from "@/lib/types";
import {
  usePlaytest,
  useTestProgress,
  useTesterApplication,
} from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";
import { testsService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton, SuccessState } from "@/components/ui/states";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { GameArt } from "@/components/games/game-cover";
import { RatingInput } from "@/components/feedback/rating";

const ratingField = z
  .number({ error: "Give this a rating." })
  .int()
  .min(1, "Give this a rating.")
  .max(5);

const schema = z.object({
  fun: ratingField,
  difficulty: ratingField,
  clarity: ratingField,
  performance: ratingField,
  polish: ratingField,
  sentiment: z.enum(["positive", "neutral", "negative"]),
  summary: z.string().trim().min(40, "A sentence or two, please (40+ characters)."),
  highlights: z.string().trim().min(3, "Add at least one highlight."),
  painPoints: z.string().trim().optional(),
  bugs: z.string().trim().optional(),
  controlsNote: z.string().trim().optional(),
  wouldRecommend: z.enum(["yes", "no"]),
  hoursPlayed: z.coerce.number().min(0.5, "At least 0.5 hours.").max(200),
});

type FormValues = z.input<typeof schema>;

/**
 * The form is one payload, but asking for thirteen answers on one screen reads
 * as a chore. Three steps, each validated before advancing.
 */
const STEPS = ["Ratings", "Your report", "Wrap up"] as const;

const STEP_FIELDS: FieldPath<FormValues>[][] = [
  ["fun", "polish", "difficulty", "clarity", "performance"],
  ["summary", "highlights", "painPoints", "controlsNote", "bugs"],
  ["sentiment", "wouldRecommend", "hoursPlayed"],
];

/** Rating dimensions grouped the way a tester thinks about them. */
const RATING_GROUPS: {
  title: string;
  hint: string;
  keys: (keyof FeedbackRatings)[];
}[] = [
  {
    title: "Overall experience",
    hint: "Your gut reaction to the build as a whole.",
    keys: ["fun", "polish"],
  },
  {
    title: "Gameplay",
    hint: "How the moment-to-moment play landed.",
    keys: ["difficulty", "clarity"],
  },
  {
    title: "Technical",
    hint: "How the build ran on your setup.",
    keys: ["performance"],
  },
];

const lines = (value?: string) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/** Grouped block of fields. Heading + hairline, never a nested card. */
function FormSection({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-5 border-t border-border pt-6 first:border-0 first:pt-0",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export function FeedbackForm({ playtestId }: { playtestId: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const toast = useToast();
  const { user } = useSession();
  const playtest = usePlaytest(playtestId);
  const application = useTesterApplication(user?.id, playtestId);
  const progress = useTestProgress(user?.id, playtestId);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sentiment: "neutral",
      summary: "",
      highlights: "",
      painPoints: "",
      bugs: "",
      controlsNote: "",
      wouldRecommend: "yes",
      hoursPlayed: 1,
    },
  });

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || !application || application.status !== "accepted") {
    return (
      <EmptyState
        icon={Lock}
        title="Feedback isn't available"
        description="You need to be an accepted tester on this playtest."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/tests">Back to my tests</Link>
          </Button>
        }
      />
    );
  }

  const completion = testCompletion(progress, playtest);
  const ready = completion.total === 0 || completion.done === completion.total;
  const alreadySubmitted =
    progress?.stage === "completed" || progress?.stage === "feedback-submitted";

  if (!ready && !alreadySubmitted) {
    return (
      <EmptyState
        icon={Lock}
        title="Finish the required tasks first"
        description={`${completion.done}/${completion.total} required tasks done. Complete them in the workspace, then come back.`}
        action={
          <Button asChild size="sm">
            <Link href={`/tests/${playtestId}`}>Back to workspace</Link>
          </Button>
        }
      />
    );
  }

  if (done || alreadySubmitted) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <SuccessState
          title="Feedback submitted"
          description={`Thanks for testing ${playtest.game.title}. Your report is with ${playtest.developer.name}, and it counts towards your tester reputation.`}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="secondary">
                <Link href="/tests">My tests</Link>
              </Button>
              <Button asChild>
                <Link href="/discover">Find another playtest</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const surveyTasks = playtest.tasks.filter(
    (t) => t.type === "survey" || t.type === "bug-report",
  );

  async function nextStep() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const ratings = {
        fun: Number(values.fun),
        difficulty: Number(values.difficulty),
        clarity: Number(values.clarity),
        performance: Number(values.performance),
        polish: Number(values.polish),
      };
      const painPoints = lines(values.painPoints);
      const bugs = lines(values.bugs);
      const highlights = lines(values.highlights);
      const answers = surveyTasks.map((task) => ({
        taskId: task.id,
        question: task.title,
        answer:
          task.type === "bug-report"
            ? bugs.join("; ") || "No blocking bugs found."
            : values.controlsNote?.trim() || values.summary,
      }));

      await testsService.submitFeedback(playtestId, user.id, {
        ratings,
        sentiment: values.sentiment as FeedbackSentiment,
        summary: values.summary,
        highlights,
        painPoints,
        bugs,
        answers,
        wouldRecommend: values.wouldRecommend === "yes",
        hoursPlayed: Number(values.hoursPlayed),
      });
      setDone(true);
      toast({
        title: "Feedback submitted",
        description: `${playtest.developer.name} can see your report now.`,
      });
      router.refresh();
    } catch {
      setFormError("Couldn't submit your feedback. Please try again.");
    }
  });

  const stepPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "My tests", href: "/tests" },
          { label: playtest.game.title, href: `/tests/${playtestId}` },
          { label: "Feedback" },
        ]}
        title="Playtest feedback"
        description="Structured feedback goes straight to the developer — and counts towards your reputation."
      />

      {/* What's being reviewed, so the tester never loses the thread. */}
      <div className="flex items-center gap-3.5 rounded-xl border border-border bg-surface p-3.5">
        <GameArt
          game={playtest.game}
          ratio="3/2"
          className="w-24 shrink-0 rounded-lg"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold">
            {playtest.game.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {playtest.title}
          </p>
        </div>
      </div>

      {/* ---- Step progress --------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium">
            Step {step + 1} of {STEPS.length}
            <span className="ml-2 font-normal text-muted-foreground">
              {STEPS[step]}
            </span>
          </p>
          <p className="text-xs tabular-nums text-subtle-foreground">
            {Math.round(stepPct)}%
          </p>
        </div>
        <Progress value={stepPct} aria-label={`Step ${step + 1} of ${STEPS.length}`} />
      </div>

      <form onSubmit={onSubmit} noValidate>
        {/* ---- Step 1 · Ratings ---------------------------------------- */}
        {step === 0 && (
          <div className="space-y-6">
            {RATING_GROUPS.map((group) => (
              <FormSection key={group.title} title={group.title} hint={group.hint}>
                <div className="space-y-6">
                  {group.keys.map((key) => {
                    const dim = RATING_DIMENSIONS.find((d) => d.key === key)!;
                    return (
                      <div key={key} className="space-y-2">
                        <div>
                          <p id={`rating-${key}`} className="text-sm font-medium">
                            {dim.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dim.hint}
                          </p>
                        </div>
                        <Controller
                          control={control}
                          name={key}
                          render={({ field }) => (
                            <RatingInput
                              labelledBy={`rating-${key}`}
                              value={Number(field.value) || 0}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        {errors[key] && (
                          <p
                            className="text-xs font-medium text-destructive"
                            role="alert"
                          >
                            {errors[key]?.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </FormSection>
            ))}
          </div>
        )}

        {/* ---- Step 2 · Written report --------------------------------- */}
        {step === 1 && (
          <div className="space-y-6">
            <FormSection
              title="In your own words"
              hint="The part developers read first. Be specific — “the tide UI confused me on day 2” beats “UI is bad”."
            >
              <Field
                label="Overall summary"
                htmlFor="fb-summary"
                hint="What's the headline? How did the session feel start to finish?"
                error={errors.summary?.message}
                required
              >
                <Textarea
                  id="fb-summary"
                  rows={4}
                  aria-invalid={!!errors.summary}
                  {...register("summary")}
                />
              </Field>

              <Field
                label="What did you enjoy?"
                htmlFor="fb-highlights"
                hint="One per line."
                error={errors.highlights?.message}
                required
              >
                <Textarea
                  id="fb-highlights"
                  rows={3}
                  aria-invalid={!!errors.highlights}
                  placeholder={
                    "The tide-forecast UI is intuitive\nSalvage loop is satisfying"
                  }
                  {...register("highlights")}
                />
              </Field>

              <Field
                label="What frustrated you?"
                htmlFor="fb-pain"
                hint="One per line."
                error={errors.painPoints?.message}
              >
                <Textarea id="fb-pain" rows={3} {...register("painPoints")} />
              </Field>
            </FormSection>

            <FormSection
              title="Controls & technical"
              hint="Anything that got between you and the game."
            >
              <Field
                label="Controls & feel"
                htmlFor="fb-controls"
                hint="How did movement, camera, and inputs feel?"
                error={errors.controlsNote?.message}
              >
                <Textarea id="fb-controls" rows={2} {...register("controlsNote")} />
              </Field>

              <Field
                label="Bugs encountered"
                htmlFor="fb-bugs"
                hint="One per line — include repro steps where you can."
                error={errors.bugs?.message}
              >
                <Textarea
                  id="fb-bugs"
                  rows={3}
                  placeholder="Day 2: saving during a storm soft-locks the UI (happened twice)"
                  {...register("bugs")}
                />
              </Field>
            </FormSection>
          </div>
        )}

        {/* ---- Step 3 · Wrap up ---------------------------------------- */}
        {step === 2 && (
          <FormSection
            title="Wrap up"
            hint="Two quick calls and how long you played."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2.5">
                <p className="text-sm font-medium">Overall impression</p>
                <Controller
                  control={control}
                  name="sentiment"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-2"
                    >
                      {(
                        [
                          ["positive", "Positive"],
                          ["neutral", "Mixed"],
                          ["negative", "Negative"],
                        ] as [FeedbackSentiment, string][]
                      ).map(([value, label]) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground"
                        >
                          <RadioGroupItem value={value} /> {label}
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-medium">
                  Would you recommend this build to a friend?
                </p>
                <Controller
                  control={control}
                  name="wouldRecommend"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-2"
                    >
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                        <RadioGroupItem value="yes" /> Yes
                      </label>
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                        <RadioGroupItem value="no" /> Not yet
                      </label>
                    </RadioGroup>
                  )}
                />
              </div>

              <Field
                label="Hours played"
                htmlFor="fb-hours"
                error={errors.hoursPlayed?.message}
                className="sm:max-w-xs"
              >
                <Input
                  id="fb-hours"
                  type="number"
                  step="0.5"
                  min={0.5}
                  aria-invalid={!!errors.hoursPlayed}
                  {...register("hoursPlayed")}
                />
              </Field>
            </div>
          </FormSection>
        )}

        {formError && (
          <p
            className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        )}

        {/* ---- Step controls ------------------------------------------- */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ArrowLeft /> Back
            </Button>
          ) : (
            <Button asChild variant="ghost" type="button">
              <Link href={`/tests/${playtestId}`}>Back to workspace</Link>
            </Button>
          )}

          {step < STEPS.length - 1 ? (
            <Button type="button" size="lg" onClick={nextStep}>
              Continue <ArrowRight />
            </Button>
          ) : (
            <Button type="submit" size="lg" loading={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit feedback"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
