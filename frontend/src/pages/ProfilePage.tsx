import { Link } from "react-router-dom";

import { Button, Card } from "@ecomm/ui";

import { useAuthStore } from "../store/authStore";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="mt-2 text-muted">Account, sessions, and security controls.</p>
        </div>
        {user ? (
          <Card className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Member</p>
              <h3 className="mt-2 text-title font-semibold">{user.name}</h3>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>Role</span>
                <span className="text-text">{user.roles.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Provider</span>
                <span className="text-text">{user.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email verified</span>
                <span className="text-text">{user.emailVerified ? "Yes" : "No"}</span>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-start gap-4">
            <h3 className="text-title font-semibold">Sign in to continue</h3>
            <p className="text-sm text-muted">
              Your profile unlocks secure sessions, saved devices, and verified access.
            </p>
            <Link to="/signin">
              <Button>Sign in</Button>
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
}
