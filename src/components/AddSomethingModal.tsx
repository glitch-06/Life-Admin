import { useEffect, useRef, useState } from "react";
import { Camera, Check, FileUp, Forward, Loader2, Type, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { processingSteps } from "@/services";
import { useAppStore } from "@/lib/store";
import { DEMO_TODAY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Mode = "choose" | "upload" | "photo" | "paste" | "forward" | "processing" | "done";

const options: { id: Mode; title: string; description: string; icon: typeof FileUp }[] = [
  { id: "upload", title: "Upload document", description: "PDF, JPG, PNG", icon: FileUp },
  { id: "photo", title: "Take a photo", description: "Scan physical paperwork", icon: Camera },
  { id: "paste", title: "Paste text", description: "Paste email or document content", icon: Type },
  {
    id: "forward",
    title: "Forward email",
    description: "Send important emails to your Life Admin inbox",
    icon: Forward,
  },
];

export function AddSomethingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addDocument } = useAppStore();
  const [mode, setMode] = useState<Mode>("choose");
  const [fileName, setFileName] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setMode("choose");
        setFileName("");
        setPastedText("");
        setStepIndex(0);
      }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (mode !== "processing") return undefined;
    if (stepIndex >= processingSteps.length) {
      const timer = setTimeout(() => setMode("done"), 400);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setStepIndex((index) => index + 1), 650);
    return () => clearTimeout(timer);
  }, [mode, stepIndex]);

  function startProcessing(name: string) {
    setFileName(name);
    setStepIndex(0);
    setMode("processing");
  }

  function finish() {
    const id = `doc_local_${Date.now()}`;
    addDocument({
      id,
      userId: "user_demo",
      title: fileName.replace(/\.[^.]+$/, "") || "New document",
      type: "other",
      category: "other",
      company: "Added by you",
      source: mode === "paste" ? "text" : "upload",
      fileUrl: null,
      fileName: fileName || "Pasted text",
      receivedAt: DEMO_TODAY,
      status: "needs_review",
      summary: "We found 2 things that may need your attention.",
      meaning: "This is a document you added yourself. Review the details we picked out.",
      requiredAction: "Check the dates and amounts we found.",
    });
    toast.success("Document added successfully.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "processing"
              ? "Analyzing your document..."
              : mode === "done"
                ? "Your document is ready"
                : "Add something"}
          </DialogTitle>
          <DialogDescription>
            {mode === "processing"
              ? "This usually takes a few seconds."
              : mode === "done"
                ? "Here's what we noticed."
                : "Add a bill, contract, receipt or anything else worth remembering."}
          </DialogDescription>
        </DialogHeader>

        {mode === "choose" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMode(option.id)}
                className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-ring hover:bg-accent"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <option.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold">{option.title}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </button>
            ))}
          </div>
        ) : null}

        {mode === "upload" ? (
          <div className="space-y-4">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const file = event.dataTransfer.files[0];
                if (file) startProcessing(file.name);
              }}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors",
                dragging && "border-ring bg-accent",
              )}
            >
              <UploadCloud className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-medium">Drop a file here</p>
              <p className="text-xs text-muted-foreground">PDF, JPG or PNG</p>
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Choose a file
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="sr-only"
                aria-label="Choose a document to upload"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) startProcessing(file.name);
                }}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setMode("choose")}>
              Back
            </Button>
          </div>
        ) : null}

        {mode === "photo" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/50 p-6 text-center">
              <Camera className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium">Camera scanning is coming soon</p>
              <p className="mt-1 text-sm text-muted-foreground">
                For now you can take a photo with your phone and upload it.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMode("upload")}>
                Upload a photo instead
              </Button>
              <Button variant="ghost" onClick={() => setMode("choose")}>
                Back
              </Button>
            </div>
          </div>
        ) : null}

        {mode === "paste" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paste-content">Email or document content</Label>
              <Textarea
                id="paste-content"
                rows={7}
                placeholder="Paste the text here..."
                value={pastedText}
                onChange={(event) => setPastedText(event.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                disabled={pastedText.trim().length < 10}
                onClick={() => startProcessing("Pasted text")}
              >
                Analyze this
              </Button>
              <Button variant="ghost" onClick={() => setMode("choose")}>
                Back
              </Button>
            </div>
            {pastedText.length > 0 && pastedText.trim().length < 10 ? (
              <p className="text-sm text-high">Please paste a little more text.</p>
            ) : null}
          </div>
        ) : null}

        {mode === "forward" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/50 p-5">
              <p className="text-sm text-muted-foreground">Your personal forwarding address</p>
              <p className="mt-1 font-mono text-sm font-medium">alex.j7f2@in.lifeadmin.app</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Forwarding is coming soon. We'll email you as soon as it's switched on.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  toast("We'll let you know when forwarding is ready.");
                  onOpenChange(false);
                }}
              >
                Notify me
              </Button>
              <Button variant="ghost" onClick={() => setMode("choose")}>
                Back
              </Button>
            </div>
          </div>
        ) : null}

        {mode === "processing" ? (
          <ol className="space-y-3" aria-live="polite">
            {processingSteps.map((step, index) => {
              const done = index < stepIndex;
              const active = index === stepIndex;
              return (
                <li key={step.id} className="flex items-center gap-3 text-sm">
                  {done ? (
                    <Check className="size-4 text-success" aria-hidden="true" />
                  ) : active ? (
                    <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
                  ) : (
                    <span
                      className="size-4 rounded-full border border-border"
                      aria-hidden="true"
                    />
                  )}
                  <span className={done || active ? "text-foreground" : "text-muted-foreground"}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : null}

        {mode === "done" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-success-soft p-4">
              <p className="text-sm font-medium">We found 2 things that may need your attention.</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>A date you'll want to remember</li>
                <li>An amount worth checking</li>
              </ul>
            </div>
            <Button onClick={finish} className="w-full">
              Done
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
