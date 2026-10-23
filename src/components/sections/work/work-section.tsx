import { work } from "@/content/work";

import { ProjectCard } from "./project-card";
import { WorkCta } from "./work-cta";
import { WorkReveal } from "./work-reveal";

/**
 * Work (DESIGN_SPEC §5): the intro (title, note, button) above a 2×2 grid of large project cards
 * (horizontal from `lg`). Deliberately quiet — hairline borders and soft shadows only, so the
 * work holds the focus. A plain section that scrolls like the rest of the page; below `md` the
 * cards stack and it grows taller than one screen.
 */
function WorkSection() {
  const { delivery, projects } = work;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="flex min-h-svh flex-col px-4 pt-20 pb-6 md:px-12 md:pb-8"
    >
      <WorkReveal className="flex flex-1 flex-col gap-6 md:gap-8">
        <div
          data-work-panel
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex max-w-3xl flex-col gap-2">
            <h2 id="work-heading" className="text-display-sm text-foreground">
              {delivery.title}
            </h2>
            <p className="text-body text-muted-foreground">{delivery.note}</p>
          </div>
          <WorkCta label={delivery.cta} className="self-start" />
        </div>

        <ul
          data-work-panel
          aria-label={delivery.projectsLabel}
          className="grid grid-cols-1 gap-4 md:flex-1 md:grid-cols-2 md:grid-rows-2 md:gap-4"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </ul>
      </WorkReveal>
    </section>
  );
}

export { WorkSection };
