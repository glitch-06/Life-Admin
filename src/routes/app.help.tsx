import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/app/help")({
  head: () => ({
    meta: [
      { title: "Help — Life Admin" },
      { name: "description", content: "Answers to the questions people ask us most." },
      { property: "og:title", content: "Help — Life Admin" },
      { property: "og:description", content: "Answers to the questions people ask us most." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I add something?",
    a: "Use the “Add something” button in the top right. You can upload a PDF or image, or paste text from an email.",
  },
  {
    q: "Where do the summaries come from?",
    a: "We read what you add and pull out the dates, amounts and actions. You can always open the original document to check.",
  },
  {
    q: "When will I be reminded?",
    a: "By default, a week and a day before each deadline. You can change the lead times in Settings.",
  },
  {
    q: "What counts towards my monthly limit?",
    a: "Each document you add counts once. Reminders, searches and edits are unlimited on every plan.",
  },
  {
    q: "Can I delete everything?",
    a: "Yes. Delete individual documents at any time, or remove your whole account from Settings.",
  },
];

function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help" description="Answers to the questions we hear most." />

      <Accordion type="single" collapsible className="surface-card px-5">
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q}>
            <AccordionTrigger className="text-left text-[15px]">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-[15px] text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section className="surface-card space-y-3 p-5">
        <h2 className="text-base font-semibold">Still stuck?</h2>
        <p className="text-sm text-muted-foreground">
          Send us a note and we'll get back to you within a day.
        </p>
        <Button asChild variant="outline">
          <a href="mailto:hello@lifeadmin.example">
            <Mail aria-hidden="true" />
            Email support
          </a>
        </Button>
      </section>
    </div>
  );
}
