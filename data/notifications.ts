import type { Notification } from "@/lib/types";

/**
 * Mock notifications. Seeded for the two demo accounts (tester `tester-1`,
 * developer `dev-1`); the store appends new ones as flows run.
 */
export const notifications: Notification[] = [
  /* ---- Tester: Priya Nair (tester-1) --------------------------------- */
  {
    id: "notif-1",
    userId: "tester-1",
    type: "application-accepted",
    title: "You're in: Tidewright Beta 0.8",
    body: "Driftwood Games accepted your application. The build is ready to download.",
    href: "/tests/pt-1",
    read: false,
    createdAt: "2026-09-04T09:12:00Z",
  },
  {
    id: "notif-2",
    userId: "tester-1",
    type: "test-reminder",
    title: "Lantern & Loam feedback is due soon",
    body: "Your feedback window for Lantern & Loam closes on Sept 10.",
    href: "/tests/pt-2",
    read: false,
    createdAt: "2026-09-06T15:30:00Z",
  },
  {
    id: "notif-3",
    userId: "tester-1",
    type: "playtest-published",
    title: "New playtest matches your profile",
    body: "Paper Lanterns of Kaido is recruiting testers for a full campaign playthrough.",
    href: "/playtests/pt-3",
    read: true,
    createdAt: "2026-09-04T08:00:00Z",
  },
  {
    id: "notif-4",
    userId: "tester-1",
    type: "feedback-received",
    title: "Thanks for your Signal Garden feedback",
    body: "Null Horizon marked your report as helpful. +3 reputation.",
    href: "/profile",
    read: true,
    createdAt: "2026-08-02T11:45:00Z",
  },

  /* ---- Developer: Mara Okafor (dev-1) ------------------------------- */
  {
    id: "notif-5",
    userId: "dev-1",
    type: "application-received",
    title: "New applicant for Tidewright Beta 0.8",
    body: "Hannah Weiss applied. 3 applicants are now awaiting your review.",
    href: "/developer/playtests/pt-1",
    read: false,
    createdAt: "2026-09-06T18:20:00Z",
  },
  {
    id: "notif-6",
    userId: "dev-1",
    type: "feedback-received",
    title: "2 new feedback reports for Lantern & Loam",
    body: "Diego Fernandes and Priya Nair submitted feedback on the balance pass.",
    href: "/developer/playtests/pt-2",
    read: false,
    createdAt: "2026-09-06T10:05:00Z",
  },
  {
    id: "notif-7",
    userId: "dev-1",
    type: "test-reminder",
    title: "Tidewright recruiting closes in 12 days",
    body: "You've accepted 3 of 25 testers. Consider reviewing the pending applicants.",
    href: "/developer/playtests/pt-1",
    read: true,
    createdAt: "2026-09-05T09:00:00Z",
  },
  {
    id: "notif-8",
    userId: "dev-1",
    type: "system",
    title: "Your Signal Garden playtest wrapped up",
    body: "4 testers completed the co-op lobby test. Analytics are ready.",
    href: "/developer/analytics",
    read: true,
    createdAt: "2026-08-06T12:00:00Z",
  },
];
