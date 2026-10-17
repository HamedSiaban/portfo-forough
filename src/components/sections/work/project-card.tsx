import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { Chip } from "@/components/ui/chip";
import type { Project } from "@/content/work";

/** One "Latest delivery" card. Only the link icon is interactive, so dragging the row is safe. */
function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="flex w-72 shrink-0 flex-col justify-between gap-8 rounded-card bg-surface p-5 md:w-80">
      <h3 className="text-body-lg text-foreground">{project.title}</h3>
      <div className="flex items-center gap-2">
        <Chip>{project.region}</Chip>
        <Chip>{project.duration}</Chip>
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open project: ${project.title}`}
            className="ml-auto rounded-full p-1.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowUpRightIcon className="size-4" />
          </a>
        ) : (
          <span className="ml-auto text-label text-muted-foreground">NDA</span>
        )}
      </div>
    </li>
  );
}

export { ProjectCard };
