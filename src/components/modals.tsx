import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/lib/store";
import type { LifeEvent } from "@/lib/types";

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? "bg-destructive text-destructive-foreground" : ""}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ReminderModal({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Pick<LifeEvent, "id" | "title" | "deadline"> | null;
}) {
  const { addReminder } = useAppStore();
  const [lead, setLead] = useState("3");
  const [channel, setChannel] = useState<"email" | "browser">("email");

  if (!event) return null;

  function save() {
    if (!event?.deadline) return;
    const date = new Date(`${event.deadline}T00:00:00`);
    date.setDate(date.getDate() - Number(lead));
    addReminder({
      eventId: event.id,
      reminderDate: date.toISOString().slice(0, 10),
      channel,
    });
    toast.success("Reminder created.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set a reminder</DialogTitle>
          <DialogDescription>We'll nudge you about "{event.title}".</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Remind me</legend>
            <RadioGroup value={lead} onValueChange={setLead} className="space-y-2">
              {["1", "3", "7", "30"].map((days) => (
                <div key={days} className="flex items-center gap-2">
                  <RadioGroupItem value={days} id={`lead-${days}`} />
                  <Label htmlFor={`lead-${days}`} className="font-normal">
                    {days} {days === "1" ? "day" : "days"} before
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Send it by</legend>
            <RadioGroup
              value={channel}
              onValueChange={(value) => setChannel(value as "email" | "browser")}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="email" id="channel-email" />
                <Label htmlFor="channel-email" className="font-normal">
                  Email
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="browser" id="channel-browser" />
                <Label htmlFor="channel-browser" className="font-normal">
                  Browser notification
                </Label>
              </div>
            </RadioGroup>
          </fieldset>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!event.deadline}>
            Create reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditTaskModal({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: LifeEvent | null;
}) {
  const { updateEvent } = useAppStore();
  const [title, setTitle] = useState(event?.title ?? "");
  const [deadline, setDeadline] = useState(event?.deadline ?? "");

  if (!event) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setTitle(event.title);
          setDeadline(event.deadline ?? "");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Change the wording or the date.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(changeEvent) => setTitle(changeEvent.target.value)}
              required
            />
            {title.trim().length === 0 ? (
              <p className="text-sm text-high">Please give this task a name.</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-deadline">Deadline</Label>
            <Input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(changeEvent) => setDeadline(changeEvent.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={title.trim().length === 0}
            onClick={() => {
              updateEvent(event.id, { title: title.trim(), deadline: deadline || null });
              toast.success("Task updated.");
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlimited documents, unlimited reminders and smart search for $7/month.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          Payments aren't switched on yet. Leave your interest and we'll let you know the moment
          Pro is available.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button
            onClick={() => {
              toast("Thanks — we'll let you know when Pro is available.");
              onOpenChange(false);
            }}
          >
            Keep me posted
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
