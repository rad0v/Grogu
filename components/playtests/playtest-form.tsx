"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type FieldPath,
} from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Gamepad2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  EXPERIENCE_OPTIONS,
  FOCUS_LABELS,
  FOCUS_OPTIONS,
  GENRE_LABELS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
  TASK_TYPE_LABELS,
} from "@/lib/constants";
import type {
  ExperienceLevel,
  GamePlatform,
  Playtest,
  PlaytestFocus,
  TaskType,
} from "@/lib/types";
import { useDeveloperGames } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { playtestsService, ServiceError } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/states";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { GameArt } from "@/components/games/game-cover";

const TASK_TYPES = Object.keys(TASK_TYPE_LABELS) as TaskType[];

const taskSchema = z.object({
  taskId: z.string().optional(),
  title: z.string().trim().min(3, "Name the task."),
  description: z.string().trim().min(8, "Add a short instruction."),
  type: z.enum(TASK_TYPES),
  required: z.boolean(),
  estimatedMinutes: z.coerce.number().int().min(1).max(600),
});

const schema = z.object({
  gameId: z.string().min(1, "Choose a game."),
  title: z.string().trim().min(6, "Give the playtest a clear title."),
  summary: z.string().trim().min(30, "Explain what you're testing (30+ characters)."),
  goals: z.string().trim().min(10, "List at least one goal (one per line)."),
  focusAreas: z.array(z.string()).min(1, "Pick at least one focus area."),
  closesAt: z.string().min(1, "Pick a closing date."),
  minExperienceLevel: z.enum(EXPERIENCE_OPTIONS as [string, ...string[]]),
  platforms: z.array(z.string()).min(1, "Pick at least one platform."),
  languages: z.string().trim().min(2, "e.g. English"),
  minReputation: z.coerce.number().int().min(0).max(100),
  estimatedHours: z.coerce.number().min(0.5).max(60),
  ndaRequired: z.boolean(),
  reward: z.string().trim().min(3, "What do testers get? (reputation counts)"),
  maxTesters: z.coerce.number().int().min(1).max(500),
  tasks: z.array(taskSchema).min(1, "Add at least one task."),
  publish: z.boolean(),
});

type FormValues = z.input<typeof schema>;

const STEPS = [
  "Game",
  "Test information",
  "Requirements",
  "Tasks & reward",
  "Review",
] as const;

/** Fields validated before each step is allowed to advance. */
const STEP_FIELDS: FieldPath<FormValues>[][] = [
  ["gameId"],
  ["title", "summary", "goals", "focusAreas", "estimatedHours", "maxTesters", "closesAt"],
  ["minExperienceLevel", "platforms", "languages", "minReputation"],
  ["tasks", "reward"],
  [],
];

const lines = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function defaultCloseDate() {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().slice(0, 10);
}

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                                */
/* -------------------------------------------------------------------------- */

/** Multi-select pill used for focus areas and platforms. */
function ChipToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-[120ms] focus-visible:outline-none",
        active
          ? "border-primary-line bg-primary-soft text-secondary"
          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Numbered rail across the top of the wizard. */
function StepRail({
  step,
  onStepChange,
}: {
  step: number;
  onStepChange: (next: number) => void;
}) {
  return (
    <div className="space-y-4">
      <ol className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => done && onStepChange(i)}
                disabled={!done && !current}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-[120ms]",
                  current
                    ? "border-primary-line bg-primary-soft text-secondary"
                    : done
                      ? "border-border text-foreground hover:bg-accent"
                      : "border-border text-subtle-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full text-[10px] tabular-nums",
                    done
                      ? "bg-success text-success-foreground"
                      : "border border-current",
                  )}
                >
                  {done ? <Check className="size-2.5" /> : i + 1}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
      <Progress
        value={((step + 1) / STEPS.length) * 100}
        aria-label={`Step ${step + 1} of ${STEPS.length}`}
      />
    </div>
  );
}

/** One step's content. Heading + fields, no nested card. */
function StepPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-label text-subtle-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form                                                                       */
/* -------------------------------------------------------------------------- */

export function PlaytestForm({ initialPlaytest }: { initialPlaytest?: Playtest }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user } = useSession();
  const games = useDeveloperGames(user?.id);
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(initialPlaytest);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      gameId:
        initialPlaytest?.gameId ?? searchParams.get("game") ?? games[0]?.id ?? "",
      title: initialPlaytest?.title ?? "",
      summary: initialPlaytest?.summary ?? "",
      goals: initialPlaytest?.goals.join("\n") ?? "",
      focusAreas: initialPlaytest?.focusAreas ?? [],
      closesAt: initialPlaytest?.closesAt.slice(0, 10) ?? defaultCloseDate(),
      minExperienceLevel:
        initialPlaytest?.requirements.minExperienceLevel ?? "regular",
      platforms: initialPlaytest?.requirements.platforms ?? [],
      languages: initialPlaytest?.requirements.languages.join(", ") ?? "English",
      minReputation: initialPlaytest?.requirements.minReputation ?? 40,
      estimatedHours: initialPlaytest?.requirements.estimatedHours ?? 4,
      ndaRequired: initialPlaytest?.requirements.ndaRequired ?? false,
      reward: initialPlaytest?.reward ?? "Grogu reputation",
      maxTesters: initialPlaytest?.maxTesters ?? 20,
      tasks: [
        ...(initialPlaytest?.tasks.map(({ id, ...task }) => ({
          ...task,
          taskId: id,
        })) ?? [
          {
            title: "Play the first session",
            description:
              "Play for the estimated time and note first impressions.",
            type: "objective" as const,
            required: true,
            estimatedMinutes: 45,
          },
        ]),
      ],
      publish: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });
  const focusAreas = useWatch({ control, name: "focusAreas" }) ?? [];
  const platforms = useWatch({ control, name: "platforms" }) ?? [];
  const gameId = useWatch({ control, name: "gameId" });

  if (!user) return null;

  if (games.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Create a playtest"
          description="You need a game first."
        />
        <EmptyState
          icon={Gamepad2}
          title="Add a game before creating a playtest"
          description="A playtest always belongs to one of your games."
          action={
            <Button asChild size="sm">
              <Link href="/developer/games/new">Add a game</Link>
            </Button>
          }
        />
      </div>
    );
  }

  function toggle(
    field: "focusAreas" | "platforms",
    current: string[],
    value: string,
  ) {
    setValue(
      field,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  }

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit(publish: boolean) {
    setValue("publish", publish);
    setFormError(null);
    await handleSubmit(async (values) => {
      try {
        const taskValues = values.tasks.map(({ taskId, ...task }) => ({
          ...(taskId ? { id: taskId } : {}),
          title: task.title,
          description: task.description,
          type: task.type as TaskType,
          required: task.required,
          estimatedMinutes: Number(task.estimatedMinutes),
        }));
        const input = {
          gameId: values.gameId,
          title: values.title,
          summary: values.summary,
          goals: lines(values.goals),
          focusAreas: values.focusAreas as PlaytestFocus[],
          requirements: {
            minExperienceLevel: values.minExperienceLevel as ExperienceLevel,
            platforms: values.platforms as GamePlatform[],
            preferredGenres: [],
            languages: values.languages
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            minReputation: Number(values.minReputation),
            estimatedHours: Number(values.estimatedHours),
            ndaRequired: values.ndaRequired,
          },
          tasks: taskValues,
          reward: values.reward,
          maxTesters: Number(values.maxTesters),
          closesAt: new Date(values.closesAt).toISOString(),
        };

        if (initialPlaytest) {
          await playtestsService.updatePlaytest(initialPlaytest.id, input);
          toast({ title: "Draft updated" });
        } else {
          const created = await playtestsService.createPlaytest({
            ...input,
            publish,
            tasks: taskValues.map((task) => ({
              title: task.title,
              description: task.description,
              type: task.type,
              required: task.required,
              estimatedMinutes: task.estimatedMinutes,
            })),
          });
          toast({
            title: publish ? "Playtest published" : "Draft saved",
            description: publish
              ? "Testers can find it on Discover now."
              : "Publish it when you're ready to recruit.",
          });
          router.push(`/developer/playtests/${created.id}`);
        }
      } catch (error) {
        setFormError(
          error instanceof ServiceError
            ? error.message
            : "Couldn't save the playtest. Please try again.",
        );
      }
    })();
  }

  const values = getValues();
  const selectedGame = games.find((g) => g.id === gameId);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Playtests", href: "/developer/playtests" },
          { label: isEdit ? "Edit draft" : "New playtest" },
        ]}
        title={isEdit ? "Edit draft playtest" : "Create a playtest"}
        description={
          isEdit
            ? "Update this draft before publishing it to testers."
            : "Five short steps. You can save a draft at any point."
        }
      />

      <StepRail step={step} onStepChange={setStep} />

      <form onSubmit={(e) => e.preventDefault()}>
        {/* ---- 1 · Game ------------------------------------------------ */}
        {step === 0 && (
          <StepPanel
            title="Which game is this playtest for?"
            description="A playtest always belongs to one of your games."
          >
            <Controller
              control={control}
              name="gameId"
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Select a game"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {games.map((game) => {
                    const active = field.value === game.id;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => field.onChange(game.id)}
                        className={cn(
                          "flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-colors duration-[120ms] focus-visible:outline-none",
                          active
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-surface hover:border-border-strong",
                        )}
                      >
                        <GameArt
                          game={game}
                          ratio="3/2"
                          className="w-24 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {game.title}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {game.genres.map((g) => GENRE_LABELS[g]).join(" • ")}
                          </p>
                        </div>
                        {active && (
                          <Check
                            className="ml-auto size-4 shrink-0 text-secondary"
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.gameId && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {errors.gameId.message}
              </p>
            )}
          </StepPanel>
        )}

        {/* ---- 2 · Test information ------------------------------------ */}
        {step === 1 && (
          <StepPanel
            title="Test information"
            description="What testers will see on the listing."
          >
            <div className="space-y-5">
              <Field
                label="Playtest title"
                htmlFor="pt-title"
                error={errors.title?.message}
                required
              >
                <Input
                  id="pt-title"
                  placeholder="e.g. Beta 0.8 — onboarding & difficulty"
                  aria-invalid={!!errors.title}
                  {...register("title")}
                />
              </Field>

              <Field
                label="Description"
                htmlFor="pt-summary"
                hint="What are you testing and who should apply?"
                error={errors.summary?.message}
                required
              >
                <Textarea
                  id="pt-summary"
                  rows={3}
                  aria-invalid={!!errors.summary}
                  {...register("summary")}
                />
              </Field>

              <Field
                label="Objectives"
                htmlFor="pt-goals"
                hint="One per line — what do you want to learn?"
                error={errors.goals?.message}
                required
              >
                <Textarea
                  id="pt-goals"
                  rows={3}
                  aria-invalid={!!errors.goals}
                  placeholder={
                    "Confirm new players understand the tide system\nFind blocking bugs in the first hour"
                  }
                  {...register("goals")}
                />
              </Field>

              <Field
                label="Focus areas"
                error={errors.focusAreas?.message}
                required
              >
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_OPTIONS.map((focus) => (
                    <ChipToggle
                      key={focus}
                      active={focusAreas.includes(focus)}
                      onClick={() => toggle("focusAreas", focusAreas, focus)}
                    >
                      {FOCUS_LABELS[focus]}
                    </ChipToggle>
                  ))}
                </div>
              </Field>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field
                  label="Duration (hours)"
                  htmlFor="pt-hours"
                  error={errors.estimatedHours?.message}
                >
                  <Input
                    id="pt-hours"
                    type="number"
                    step="0.5"
                    min={0.5}
                    {...register("estimatedHours")}
                  />
                </Field>
                <Field
                  label="Tester limit"
                  htmlFor="pt-max"
                  error={errors.maxTesters?.message}
                >
                  <Input id="pt-max" type="number" min={1} {...register("maxTesters")} />
                </Field>
                <Field
                  label="Applications close"
                  htmlFor="pt-closes"
                  error={errors.closesAt?.message}
                  required
                >
                  <Input id="pt-closes" type="date" {...register("closesAt")} />
                </Field>
              </div>
            </div>
          </StepPanel>
        )}

        {/* ---- 3 · Requirements ---------------------------------------- */}
        {step === 2 && (
          <StepPanel
            title="Tester requirements"
            description="Grogu shows these on the listing and uses them to guide applicants."
          >
            <div className="space-y-5">
              <Field label="Platforms" error={errors.platforms?.message} required>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <ChipToggle
                      key={platform}
                      active={platforms.includes(platform)}
                      onClick={() => toggle("platforms", platforms, platform)}
                    >
                      {PLATFORM_LABELS[platform]}
                    </ChipToggle>
                  ))}
                </div>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Minimum experience"
                  htmlFor="pt-exp"
                  error={errors.minExperienceLevel?.message}
                >
                  <Controller
                    control={control}
                    name="minExperienceLevel"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="pt-exp">
                          <SelectValue>
                            {EXPERIENCE_LABELS[field.value as ExperienceLevel]}
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
                    )}
                  />
                </Field>

                <Field
                  label="Minimum reputation"
                  htmlFor="pt-rep"
                  hint="0–100. Higher means fewer but more proven applicants."
                  error={errors.minReputation?.message}
                >
                  <Input
                    id="pt-rep"
                    type="number"
                    min={0}
                    max={100}
                    {...register("minReputation")}
                  />
                </Field>
              </div>

              <Field
                label="Languages"
                htmlFor="pt-lang"
                hint="Comma separated."
                error={errors.languages?.message}
              >
                <Input
                  id="pt-lang"
                  placeholder="English, Japanese"
                  {...register("languages")}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3.5">
                <Controller
                  control={control}
                  name="ndaRequired"
                  render={({ field }) => (
                    <Checkbox
                      className="mt-0.5"
                      checked={field.value}
                      onCheckedChange={(c) => field.onChange(c === true)}
                    />
                  )}
                />
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Require an NDA
                  </span>
                  <br />
                  Testers must agree before they can access the build.
                </span>
              </label>
            </div>
          </StepPanel>
        )}

        {/* ---- 4 · Tasks & reward -------------------------------------- */}
        {step === 3 && (
          <div className="space-y-10">
            <StepPanel
              title="Reward"
              description="What testers get for completing the playtest. Reputation always counts."
            >
              <Field
                label="Reward details"
                htmlFor="pt-reward"
                hint="e.g. “Steam key on release + $25 gift card”"
                error={errors.reward?.message}
                required
              >
                <Input
                  id="pt-reward"
                  aria-invalid={!!errors.reward}
                  {...register("reward")}
                />
              </Field>
            </StepPanel>

            <StepPanel
              title="Testing tasks"
              description="The checklist testers work through before submitting feedback."
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    append({
                      title: "",
                      description: "",
                      type: "objective",
                      required: false,
                      estimatedMinutes: 15,
                    })
                  }
                >
                  <Plus /> Add task
                </Button>
              }
            >
              <div className="space-y-4">
                {typeof errors.tasks?.message === "string" && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {errors.tasks.message}
                  </p>
                )}

                {fields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="space-y-4 rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Task {index + 1}</p>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => remove(index)}
                          aria-label={`Remove task ${index + 1}`}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>

                    <Field
                      label="Title"
                      htmlFor={`task-${index}-title`}
                      error={errors.tasks?.[index]?.title?.message}
                    >
                      <Input
                        id={`task-${index}-title`}
                        {...register(`tasks.${index}.title`)}
                      />
                    </Field>

                    <Field
                      label="Instruction"
                      htmlFor={`task-${index}-desc`}
                      error={errors.tasks?.[index]?.description?.message}
                    >
                      <Textarea
                        id={`task-${index}-desc`}
                        rows={2}
                        {...register(`tasks.${index}.description`)}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Type" htmlFor={`task-${index}-type`}>
                        <Controller
                          control={control}
                          name={`tasks.${index}.type`}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id={`task-${index}-type`}>
                                <SelectValue>
                                  {TASK_TYPE_LABELS[field.value as TaskType]}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {TASK_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {TASK_TYPE_LABELS[t]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>

                      <Field
                        label="Minutes"
                        htmlFor={`task-${index}-min`}
                        error={errors.tasks?.[index]?.estimatedMinutes?.message}
                      >
                        <Input
                          id={`task-${index}-min`}
                          type="number"
                          min={1}
                          {...register(`tasks.${index}.estimatedMinutes`)}
                        />
                      </Field>

                      <div className="flex items-end pb-2.5">
                        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                          <Controller
                            control={control}
                            name={`tasks.${index}.required`}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(c) => field.onChange(c === true)}
                              />
                            )}
                          />
                          Required
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StepPanel>
          </div>
        )}

        {/* ---- 5 · Review ---------------------------------------------- */}
        {step === 4 && (
          <StepPanel
            title="Review and publish"
            description="This is what testers will see. Publish when it reads right."
          >
            <div className="space-y-6">
              {selectedGame && (
                <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                  <GameArt
                    game={selectedGame}
                    ratio="3/2"
                    className="w-28 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold">
                      {selectedGame.title}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {values.title || "Untitled playtest"}
                    </p>
                  </div>
                </div>
              )}

              <dl>
                <ReviewRow label="Summary" value={values.summary} />
                <ReviewRow
                  label="Objectives"
                  value={
                    <ul className="space-y-1">
                      {lines(values.goals).map((goal) => (
                        <li key={goal}>• {goal}</li>
                      ))}
                    </ul>
                  }
                />
                <ReviewRow
                  label="Focus areas"
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {values.focusAreas.map((f) => (
                        <Badge key={f} tone="primary">
                          {FOCUS_LABELS[f as PlaytestFocus]}
                        </Badge>
                      ))}
                    </div>
                  }
                />
                <ReviewRow
                  label="Requirements"
                  value={`${EXPERIENCE_LABELS[values.minExperienceLevel as ExperienceLevel]}+ · ${(
                    values.platforms as string[]
                  )
                    .map((p) => PLATFORM_LABELS[p as GamePlatform])
                    .join(", ")} · reputation ${values.minReputation}${
                    values.ndaRequired ? " · NDA required" : ""
                  }`}
                />
                <ReviewRow label="Reward" value={values.reward} />
                <ReviewRow
                  label="Commitment"
                  value={`~${values.estimatedHours}h · ${values.tasks.length} ${
                    values.tasks.length === 1 ? "task" : "tasks"
                  } · up to ${values.maxTesters} testers`}
                />
                <ReviewRow
                  label="Applications close"
                  value={new Date(values.closesAt).toLocaleDateString()}
                />
              </dl>
            </div>
          </StepPanel>
        )}

        {formError && (
          <p
            className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        )}

        {/* ---- Controls -------------------------------------------------- */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft /> Back
            </Button>
          ) : (
            <Button asChild type="button" variant="ghost">
              <Link
                href={
                  initialPlaytest
                    ? `/developer/playtests/${initialPlaytest.id}`
                    : "/developer/playtests"
                }
              >
                Cancel
              </Link>
            </Button>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              loading={isSubmitting}
              onClick={() => submit(false)}
            >
              {isEdit ? "Save changes" : "Save draft"}
            </Button>

            {step < STEPS.length - 1 ? (
              <Button type="button" size="lg" onClick={next}>
                Continue <ArrowRight />
              </Button>
            ) : (
              !isEdit && (
                <Button
                  type="button"
                  size="lg"
                  loading={isSubmitting}
                  onClick={() => submit(true)}
                >
                  Publish playtest
                </Button>
              )
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
