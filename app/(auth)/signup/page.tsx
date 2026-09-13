import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Grogu account as a tester or a developer.",
};

export default function SignupPage() {
  return <SignupForm />;
}
