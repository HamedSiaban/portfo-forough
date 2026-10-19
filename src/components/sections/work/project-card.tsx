import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { Chip } from "@/components/ui/chip";
import type { Project } from "@/content/work";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const staticClass =
  "relative flex w-full min-h-44 flex-col justify-between gap-8 overflow-hidden rounded-card border border-border bg-surface p-5 shadow-xs";

const linkClass = cn(
  staticClass,
  "group",
  "transition-[border-color,box-shadow,transform] duration-(--duration-ui) ease-(--ease-ui)",
  // Hairline that draws in from the left on hover / focus: the only "effect" besides the arrow.
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-500 after:ease-(--ease-entrance) after:content-['']",
  "hover:border-foreground/25 hover:shadow-lg hover:after:scale-x-100 focus-visible:after:scale-x-100",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px",
);

/**
 * One project, an `<li>` wrapping either an `<a>` (case study) or a static block (NDA). The whole
 * card is the hit area; pressing it nudges it down a pixel. NDA cards are static and get no hover state. Imagery can slot into the gap above the
 * title once Foro supplies it (OPEN_QUESTIONS Q8).
 */
function ProjectCard({ project, index }: ProjectCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-6">
        <span className="text-mono-ui text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        {project.href ? (
          <ArrowUpRightIcon
            aria-hidden
            className="size-5 text-muted-foreground transition-[transform,color] duration-(--duration-ui) ease-(--ease-ui) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
          />
        ) : (
          <span className="text-label text-muted-foreground">NDA</span>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-title text-foreground">{project.title}</h3>
        <div className="flex items-center gap-2">
          <Chip>{project.region}</Chip>
          <Chip>{project.duration}</Chip>
        </div>
      </div>
    </>
  );

  return (
    <li className="flex">
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open project: ${project.title}`}
          className={linkClass}
        >
          {body}
        </a>
      ) : (
        <div className={staticClass}>{body}</div>
      )}
    </li>
  );
}

export { ProjectCard };
