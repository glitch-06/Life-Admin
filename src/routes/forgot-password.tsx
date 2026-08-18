import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Life Admin" },
      { name: "description", content: "We'll email you a link to get back into your account." },
      { property: "og:title", content: "Reset your password — Life Admin" },
      { property: "og:description", content: "We'll email you a link to get back into your account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll email you a link to get back in."
      footer={
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-3 text-center">
          <MailCheck className="mx-auto size-8 text-low" aria-hidden="true" />
          <p className="text-[15px]">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is
            on its way.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            await authService.requestPasswordReset(email);
            setLoading(false);
            setSent(true);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!email.includes("@") || loading}>
            {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
