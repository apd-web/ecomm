import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button, Card } from "@ecomm/ui";

import { useAuthStore } from "../store/authStore";
import { authApi } from "../services/authApi";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: () => authApi.listSessions(),
    enabled: Boolean(user),
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] }),
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => authApi.revokeAllSessions(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] }),
  });

  const unlinkMutation = useMutation({
    mutationFn: (provider: "google" | "github") => authApi.unlinkOAuth(provider),
  });

  const startLink = async (provider: "google" | "github") => {
    const url = await authApi.getOAuthLinkUrl(provider, "/profile");
    window.location.href = url;
  };

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="mt-2 text-muted">Account, sessions, and security controls.</p>
        </div>
        {user ? (
          <div className="grid gap-4 md:grid-cols-2">
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

              <div className="md:col-span-2 mt-2 border-t border-line/60 pt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">OAuth Providers</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => void startLink("google")}>
                    Link Google
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void startLink("github")}>
                    Link GitHub
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => unlinkMutation.mutate("google")}
                    disabled={unlinkMutation.isPending}
                  >
                    Unlink Google
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => unlinkMutation.mutate("github")}
                    disabled={unlinkMutation.isPending}
                  >
                    Unlink GitHub
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-title font-semibold">Active sessions</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => revokeAllMutation.mutate()}
                  disabled={revokeAllMutation.isPending}
                >
                  Revoke all
                </Button>
              </div>
              {sessionsQuery.isLoading ? (
                <p className="text-sm text-muted">Loading sessions...</p>
              ) : sessionsQuery.data && sessionsQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {sessionsQuery.data.map((session) => (
                    <div key={session.id} className="rounded-xl border border-line/70 p-3 text-sm">
                      <p className="text-text">{session.userAgent ?? "Unknown device"}</p>
                      <p className="text-muted">IP: {session.ip ?? "unknown"}</p>
                      <p className="text-muted">
                        Expires: {new Date(session.expiresAt).toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => revokeSessionMutation.mutate(session.id)}
                          disabled={revokeSessionMutation.isPending}
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No active sessions found.</p>
              )}
            </Card>
          </div>
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
