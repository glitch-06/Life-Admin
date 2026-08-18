import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, LogOut, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { ConfirmationModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultNotificationSettings, demoIntegrations, demoUser } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";
import type { NotificationSettings } from "@/lib/types";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Life Admin" },
      { name: "description", content: "Manage your account, reminders and connected services." },
      { property: "og:title", content: "Settings — Life Admin" },
      { property: "og:description", content: "Manage your account, reminders and connections." },
    ],
  }),
  component: SettingsPage,
});

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="surface-card space-y-4 p-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(demoUser.name);
  const [email, setEmail] = useState(demoUser.email);
  const [notifications, setNotifications] = useState<NotificationSettings>(
    defaultNotificationSettings,
  );
  const [integrations, setIntegrations] = useState(demoIntegrations);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function toggleLeadTime(days: number) {
    setNotifications((prev) => ({
      ...prev,
      leadTimes: prev.leadTimes.map((item) =>
        item.days === days ? { ...item, enabled: !item.enabled } : item,
      ),
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your account and how Life Admin behaves." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Account" description="How we address you and where we send reminders.">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              toast.success("Your details were saved.");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="settings-name">Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit">
              <Check aria-hidden="true" />
              Save changes
            </Button>
          </form>
        </Card>

        <Card title="Notifications" description="Choose when and how we nudge you.">
          <Row label="Email reminders" hint="Deadline reminders sent to your inbox.">
            <Switch
              checked={notifications.emailReminders}
              aria-label="Email reminders"
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, emailReminders: checked }))
              }
            />
          </Row>
          <Row label="Browser notifications" hint="Alerts while you have Life Admin open.">
            <Switch
              checked={notifications.browserNotifications}
              aria-label="Browser notifications"
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, browserNotifications: checked }))
              }
            />
          </Row>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Remind me before a deadline</p>
            <div className="flex flex-wrap gap-2">
              {notifications.leadTimes.map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => toggleLeadTime(item.days)}
                  aria-pressed={item.enabled}
                  className={
                    item.enabled
                      ? "rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                      : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
                  }
                >
                  {item.days === 1 ? "1 day" : `${item.days} days`}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-priority">Alert me about</Label>
            <Select
              value={notifications.priorityAlerts}
              onValueChange={(value) =>
                setNotifications((prev) => ({
                  ...prev,
                  priorityAlerts: value as NotificationSettings["priorityAlerts"],
                }))
              }
            >
              <SelectTrigger id="settings-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everything</SelectItem>
                <SelectItem value="high_medium">Needs attention and worth knowing</SelectItem>
                <SelectItem value="high">Only what needs attention</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card title="Appearance" description="Life Admin looks best in your preferred light.">
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              <Sun aria-hidden="true" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <Moon aria-hidden="true" />
              Dark
            </Button>
          </div>
        </Card>

        <Card title="Connections" description="Bring information in automatically.">
          <ul className="space-y-3">
            {integrations.map((integration) => (
              <li key={integration.id}>
                <Row label={integration.name} hint={integration.description}>
                  <Button
                    variant={integration.connected ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setIntegrations((prev) =>
                        prev.map((item) =>
                          item.id === integration.id
                            ? { ...item, connected: !item.connected }
                            : item,
                        ),
                      );
                      toast(
                        integration.connected
                          ? `${integration.name} disconnected.`
                          : `${integration.name} will be available soon.`,
                      );
                    }}
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </Row>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Plan" description="You're on the Free plan.">
          <p className="text-sm text-muted-foreground">
            7 of 10 documents used this month.
          </p>
          <Button asChild variant="outline">
            <Link to="/app/billing">View plans</Link>
          </Button>
        </Card>

        <Card title="Danger zone" description="Actions here can't be undone.">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast("You've been signed out of the demo.")}>
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 aria-hidden="true" />
              Delete account
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your account?"
        description="This removes every document, deadline and reminder you've saved. This can't be undone."
        confirmLabel="Delete account"
        destructive
        onConfirm={() => toast("Account deletion isn't enabled in the demo.")}
      />
    </div>
  );
}
