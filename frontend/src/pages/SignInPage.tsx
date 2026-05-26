import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Card, Input, Section } from "@ecomm/ui";

import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/Toast";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInValues = z.infer<typeof signInSchema>;

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export function SignInPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const { push } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await authApi.login(values);
      setSession(session.user, session.accessToken);
      push({ title: "Welcome back", message: "Signed in successfully." });
      navigate("/profile");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error?.message ?? "Unable to sign in")
        : error instanceof Error
          ? error.message
          : "Unable to sign in";
      push({ title: "Sign in failed", message });
    }
  });

  const redirect = encodeURIComponent(`${window.location.origin}/profile`);

  return (
    <Section size="wide">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Member access</p>
          <h1 className="text-display font-semibold">Welcome back to Aurora Commerce.</h1>
          <p className="text-sm text-muted">
            Sign in to view saved drops, manage sessions, and unlock concierge support.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <a
              className="rounded-2xl border border-line/70 bg-surface/60 px-4 py-3 text-sm text-text transition hover:border-accent"
              href={`${apiBaseUrl}/auth/oauth/google/start?redirect=${redirect}`}
            >
              Continue with Google
            </a>
            <a
              className="rounded-2xl border border-line/70 bg-surface/60 px-4 py-3 text-sm text-text transition hover:border-accent"
              href={`${apiBaseUrl}/auth/oauth/github/start?redirect=${redirect}`}
            >
              Continue with GitHub
            </a>
          </div>
          <div className="text-xs text-muted">
            New here?{" "}
            <Link to="/signup" className="text-accent hover:text-accentSoft">
              Create an account
            </Link>
            .
          </div>
        </div>
        <Card className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Sign in</p>
            <h2 className="mt-3 text-title font-semibold">Secure access</h2>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email"
              placeholder="you@aurora.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Secure session • MFA ready</span>
              <span className="text-accentSoft">Password reset via email</span>
            </div>
            <Button size="lg" type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </Section>
  );
}
