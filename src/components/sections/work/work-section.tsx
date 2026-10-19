import { PatternArt } from "@/components/effects/pattern-art";
import { work } from "@/content/work";

import { ProjectCard } from "./project-card";
import { ShowreelTile } from "./showreel-tile";
import { WorkCta } from "./work-cta";
import { WorkReveal } from "./work-reveal";
import { WorkStage } from "./work-stage";

/**
 * Work (DESIGN_SPEC §5): one full screen (pinned while the next section covers it). The reel is a one-third band (cards get two thirds) and carries the intro (title,
 * subtitle, button) on top of it; a single row of project cards sits underneath. Deliberately
 * quiet — hairline borders and soft shadows only, so the work holds the focus. Below `md`
 * the cards stack and the section grows past one screen; that is expected.
 */
function WorkSection() {
  const { delivery, showreel, projects } = work;

  return (
    <WorkStage
      id="work"
      aria-labelledby="work-heading"
      bodyClassName="px-4 pt-20 pb-4 md:px-12 md:pt-24 md:pb-6"
    >
      <WorkReveal className="flex flex-1 flex-col gap-3">
        <div data-work-panel className="flex min-h-56 flex-1">
          <ShowreelTile
            label={showreel.label}
            comingSoon={showreel.comingSoon}
            poster={showreel.poster}
            previewSrc={showreel.previewSrc}
            fallback={
              <PatternArt variant="diamond" seed="showreel" preserveAspectRatio="xMidYMid slice" />
            }
            intro={
              <div className="absolute inset-x-0 top-0 flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between md:p-8">
                <div className="flex flex-col gap-3">
                  <h2 id="work-heading" className="text-display-sm text-on-inverse">
                    {delivery.title}
                  </h2>
                  <p className="text-body text-on-inverse/70">{delivery.note}</p>
                </div>
                <WorkCta label={delivery.cta} className="self-start" />
              </div>
            }
          />
        </div>

        <ul
          aria-label={delivery.projectsLabel}
          className="grid flex-2 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </ul>
      </WorkReveal>
    </WorkStage>
  );
}

export { WorkSection };
