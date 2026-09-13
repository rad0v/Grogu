import { Bug, Clock, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import { overallRating } from "@/lib/domain";
import type { Feedback, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { RatingStars } from "@/components/feedback/rating";

const SENTIMENT_TONE = {
  positive: "success",
  neutral: "muted",
  negative: "destructive",
} as const;

/** Bulleted sub-list inside a report. */
function Points({
  icon: Icon,
  label,
  tone,
  items,
}: {
  icon: typeof ThumbsUp;
  label: string;
  tone: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className={`mb-1.5 flex items-center gap-1.5 text-xs font-semibold ${tone}`}>
        <Icon className="size-3" aria-hidden /> {label}
      </p>
      <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span aria-hidden className="text-subtle-foreground">
              •
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One tester's feedback report. `tester` omitted → anonymised. */
export function FeedbackCard({
  feedback,
  tester,
}: {
  feedback: Feedback;
  tester?: User;
}) {
  return (
    <article className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {tester ? (
            <>
              <UserAvatar
                name={tester.name}
                src={tester.avatarUrl}
                className="size-8 shrink-0"
              />
              <span className="truncate text-sm font-medium">{tester.name}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              Anonymous tester
            </span>
          )}
          <Badge tone={SENTIMENT_TONE[feedback.sentiment]}>
            {feedback.sentiment}
          </Badge>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <RatingStars value={overallRating(feedback.ratings)} />
          <span className="text-xs text-subtle-foreground">
            {formatRelativeTime(feedback.submittedAt)}
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {feedback.summary}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Points
          icon={ThumbsUp}
          label="Highlights"
          tone="text-success"
          items={feedback.highlights}
        />
        <Points
          icon={ThumbsDown}
          label="Pain points"
          tone="text-warning"
          items={feedback.painPoints}
        />
      </div>

      <Points
        icon={Bug}
        label={`Bugs (${feedback.bugs.length})`}
        tone="text-destructive"
        items={feedback.bugs}
      />

      <dl className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-subtle-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3" aria-hidden />
          <dt className="sr-only">Hours played</dt>
          <dd>{feedback.hoursPlayed}h played</dd>
        </div>
        <div>
          <dt className="sr-only">Recommendation</dt>
          <dd>
            {feedback.wouldRecommend
              ? "Would recommend"
              : "Wouldn't recommend yet"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
