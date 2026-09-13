"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
}

interface SignupStepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function SignupStepIndicator({
  steps,
  currentStep,
  onStepClick,
}: SignupStepIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-border" />

        {/* Animated fill line */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Step nodes */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted && onStepClick;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:scale-105",
                  isCurrent &&
                    "border-primary bg-surface text-primary ring-4 ring-primary/20 shadow-lg shadow-primary/25 scale-110",
                  !isCompleted &&
                    !isCurrent &&
                    "border-border bg-muted/60 text-muted-foreground cursor-not-allowed",
                  isClickable && "cursor-pointer"
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 stroke-[3]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </button>

              <span
                className={cn(
                  "absolute top-11 text-[11px] font-medium whitespace-nowrap transition-colors duration-200",
                  isCurrent
                    ? "text-foreground font-semibold"
                    : isCompleted
                    ? "text-secondary"
                    : "text-muted-foreground"
                )}
              >
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" /> {/* Spacer for step text labels */}
    </div>
  );
}
