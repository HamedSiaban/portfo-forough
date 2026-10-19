import { notFound } from "next/navigation";

import { Halftone } from "@/components/effects/halftone";
import { PatternArt, type PatternArtVariant } from "@/components/effects/pattern-art";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepRow } from "@/components/ui/step-row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { LiveState } from "./_components/live-state";
import { ToastDemo } from "./_components/toast-demo";

const COLOR_TOKENS = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-muted", className: "bg-surface-muted" },
  { name: "surface-inverse", className: "bg-surface-inverse" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "subtle-foreground", className: "bg-subtle-foreground" },
  { name: "border", className: "bg-border" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-soft-1", className: "bg-accent-soft-1" },
  { name: "accent-soft-2", className: "bg-accent-soft-2" },
  { name: "accent-soft-3", className: "bg-accent-soft-3" },
] as const;

const TYPE_SPECIMENS = [
  { name: "display-xl", className: "text-display-xl", sample: "Creative type" },
  { name: "display-lg", className: "text-display-lg", sample: "Selected work" },
  { name: "display-md", className: "text-display-md", sample: "Clean, well finished" },
  { name: "heading", className: "text-heading", sample: "Start to finish" },
  { name: "title", className: "text-title", sample: "How do you work with agencies?" },
  {
    name: "body-lg",
    className: "text-body-lg",
    sample: "A short subline that introduces the section.",
  },
  {
    name: "body",
    className: "text-body",
    sample: "Body copy for FAQ answers and legal prose, set in the Book weight.",
  },
  { name: "label", className: "text-label", sample: "Your project" },
  { name: "mono-ui", className: "text-mono-ui", sample: "Projects" },
] as const;

const RADII = [
  { name: "input", className: "rounded-input" },
  { name: "card", className: "rounded-card" },
  { name: "panel", className: "rounded-panel" },
  { name: "full (chip/pill)", className: "rounded-full" },
] as const;

const PATTERN_VARIANTS: readonly PatternArtVariant[] = ["steps", "circles", "diamond", "snake"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 border-b border-border py-12 first:pt-0 last:border-b-0">
      <h2 className="text-heading">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-12">
      <header className="flex items-center justify-between border-b border-border py-6">
        <p className="text-label text-muted-foreground">Phase 01 · Design system</p>
        <ThemeToggle />
      </header>

      <Section title="Color tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {COLOR_TOKENS.map((token) => (
            <div key={token.name} className="space-y-2">
              <div className={`h-16 rounded-input ring-1 ring-border ${token.className}`} />
              <p className="text-label text-muted-foreground">{token.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type specimen">
        <div className="space-y-8">
          {TYPE_SPECIMENS.map((style) => (
            <div key={style.name} className="space-y-1">
              <p className="text-label text-muted-foreground">{style.name}</p>
              <p className={style.className}>{style.sample}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-border pt-8 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-label text-muted-foreground">Frama — ss01 (used)</p>
            <p className="text-display-md">Creative agency type</p>
          </div>
          <div className="space-y-1">
            <p className="text-label text-muted-foreground">Frama — without ss01</p>
            <p className="text-display-md" style={{ fontFeatureSettings: "normal" }}>
              Creative agency type
            </p>
          </div>
        </div>
        <p className="text-body text-muted-foreground">
          The two samples above render identically with the current dev font files — see the phase
          decisions log.
        </p>
      </Section>

      <Section title="Radii">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {RADII.map((radius) => (
            <div key={radius.name} className="space-y-2">
              <div className={`h-28 bg-surface-muted ring-1 ring-border ${radius.className}`} />
              <p className="text-label text-muted-foreground">{radius.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="space-y-6">
          {(["solid", "outline"] as const).map((variant) => (
            <div key={variant} className="space-y-3">
              <p className="text-label text-muted-foreground">{variant}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={variant} size="sm">
                  Work
                </Button>
                <Button variant={variant} size="md">
                  Projects
                </Button>
                <Button variant={variant} size="md" shape="pill">
                  Build your next project
                </Button>
                <Button variant={variant} size="md" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Form fields">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="sg-name">Name*</Label>
            <Input id="sg-name" placeholder="Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sg-name-disabled">Disabled</Label>
            <Input id="sg-name-disabled" placeholder="Jane Doe" disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sg-email">Invalid</Label>
            <Input id="sg-email" placeholder="Email*" aria-invalid defaultValue="not-an-email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sg-budget">Budget range*</Label>
            <Select>
              <SelectTrigger id="sg-budget" className="w-full">
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s">€5k – €15k</SelectItem>
                <SelectItem value="m">€15k – €40k</SelectItem>
                <SelectItem value="l">€40k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sg-message">My project is…</Label>
            <Textarea id="sg-message" placeholder="Tell us more" />
          </div>
        </div>
      </Section>

      <Section title="Accordion">
        <Accordion>
          <AccordionItem value="a">
            <AccordionTrigger>How do you work with agencies?</AccordionTrigger>
            <AccordionContent>
              We plug into your process as an extra senior hand, async-first and timezone-flexible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>What&rsquo;s the typical turnaround?</AccordionTrigger>
            <AccordionContent>Most single projects start within two weeks.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Tabs (segmented pill)">
        <Tabs defaultValue="single">
          <TabsList>
            <TabsTrigger value="single">Single project</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="pt-4 text-body text-muted-foreground">
            For clearly defined projects, with a fixed scope, timeline and budget.
          </TabsContent>
          <TabsContent value="recurring" className="pt-4 text-body text-muted-foreground">
            For ongoing needs, with flexible capacity and continuous delivery over time.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Dialog & toasts">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Let&rsquo;s talk</DialogTitle>
                <DialogDescription>
                  Share your project details and timeline, and we&rsquo;ll get back to you shortly.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
          <ToastDemo />
        </div>
      </Section>

      <Section title="Step row">
        <div className="max-w-md space-y-5">
          <StepRow step={1} label="Project type" active />
          <StepRow step={2} label="Project size" active={false} disabled />
        </div>
      </Section>

      <Section title="Chips">
        <div className="flex flex-wrap gap-2">
          <Chip font="sans">Europe</Chip>
          <Chip font="sans">6 weeks</Chip>
          <Chip font="mono">NDA</Chip>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card variant="surface">
            <p className="text-label text-muted-foreground">surface</p>
            <p className="text-title">Six pages b2b site</p>
          </Card>
          <Card variant="muted">
            <p className="text-label text-muted-foreground">muted</p>
            <p className="text-title">Creative landing page</p>
          </Card>
          <Card variant="inverse">
            <p className="text-label text-on-inverse/70">inverse</p>
            <p className="text-title">Brochure site</p>
          </Card>
        </div>
      </Section>

      <Section title="Panel + Halftone">
        <Panel className="relative h-48">
          <div className="relative flex h-full items-center p-8">
            <p className="text-display-md">Hero panel</p>
          </div>
        </Panel>
      </Section>

      <Section title="PatternArt">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PATTERN_VARIANTS.map((variant) => (
            <div key={variant} className="space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-card bg-surface-muted">
                <Halftone density="sm" />
                <PatternArt variant={variant} className="relative" />
              </div>
              <p className="text-label text-muted-foreground">{variant}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Motion & input preferences">
        <LiveState />
      </Section>
    </main>
  );
}
