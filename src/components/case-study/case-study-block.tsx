import type { CaseStudyBlock } from "@/content/case-studies";
import { cn } from "@/lib/cn";

import { CaseStudyImage, CaseStudyVideo } from "./case-study-media";

const textColumn = "max-w-2xl";

function Figure({
  caption,
  wide,
  children,
}: {
  caption?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", !wide && textColumn)}>
      {children}
      {caption && <figcaption className="text-label text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

/** Renders one content block. Text blocks stay in a ~65ch column; media may break out wide. */
function CaseStudyBlockView({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "p":
      return <p className={cn(textColumn, "text-body-lg")}>{block.text}</p>;
    case "subheading":
      return <h3 className="text-title">{block.text}</h3>;
    case "list":
      return (
        <ul className={cn(textColumn, "list-disc space-y-2 pl-6 text-body-lg")}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className={cn(textColumn, "border-l-2 border-accent pl-6")}>
          <p className="text-title">{block.text}</p>
          {block.author && (
            <footer className="mt-3 text-label text-muted-foreground">{block.author}</footer>
          )}
        </blockquote>
      );
    case "metrics":
      return (
        <dl className="grid gap-4 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="rounded-card bg-surface p-6">
              <dt className="order-2 mt-3 text-label text-muted-foreground">{item.label}</dt>
              <dd className="text-display-sm">{item.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "image":
      return (
        <Figure caption={block.caption} wide={block.size === "wide"}>
          <CaseStudyImage block={block} />
        </Figure>
      );
    case "video":
      return (
        <Figure caption={block.caption ?? block.title} wide>
          <CaseStudyVideo block={block} />
        </Figure>
      );
  }
}

export { CaseStudyBlockView };
