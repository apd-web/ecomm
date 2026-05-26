import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Card, Input, Section } from "@ecomm/ui";

import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/Toast";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpValues = z.infer<typeof signUpSchema>;

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export function SignUpPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const { push } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await authApi.register(values);
      setSession(session.user, session.accessToken);
      push({ title: "Account created", message: "Verify email to unlock full access." });
      navigate("/profile");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error?.message ?? "Unable to create account")
        : error instanceof Error
          ? error.message
          : "Unable to create account";
      push({ title: "Sign up failed", message });
    }
  });

  const redirect = encodeURIComponent(`${window.location.origin}/profile`);

  return (
    <Section size="wide">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Join Aurora</p>
          <h1 className="text-display font-semibold">Create your premium commerce profile.</h1>
          <p className="text-sm text-muted">
            Unlock early access drops, stored sessions, and personalized recommendations.
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
            Already have an account?{" "}
            <Link to="/signin" className="text-accent hover:text-accentSoft">
              Sign in
            </Link>
            .
          </div>
        </div>
        <Card className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Sign up</p>
            <h2 className="mt-3 text-title font-semibold">Create access</h2>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              label="Name"
              placeholder="Aurora Nova"
              error={errors.name?.message}
              {...register("name")}
            />
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
            <Button size="lg" type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-xs text-muted">
              By continuing, you agree to Aurora Commerce terms and premium onboarding.
            </p>
          </form>
        </Card>
      </div>
    </Section>
  );
}
