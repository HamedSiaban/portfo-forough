import { PatternArt } from "@/components/effects/pattern-art";
import { work } from "@/content/work";

import { DeliveryRow } from "./delivery-row";
import { ProjectCard } from "./project-card";
import { QuotePanel } from "./quote-panel";
import { ShowreelTile } from "./showreel-tile";
import { TrailPanel } from "./trail-panel";
import { WorkReveal } from "./work-reveal";

/**
 * Work (DESIGN_SPEC §5): a bento grid — image trail | quote on top, showreel | latest delivery
 * below; one column under `lg`. Copy is server-rendered; the interactive leaves are client.
 * Self-contained: it references no neighbour and fits at any position in the section list.
 */
function WorkSection() {
  const { heading, trail, quote, showreel, delivery, projects } = work;

  return (
    <section id="work" aria-labelledby="work-heading" className="px-4 py-3 md:px-12">
      <WorkReveal className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <TrailPanel
          heading={
            <h2 id="work-heading" className="text-display-lg text-foreground">
              {heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          }
          images={trail.images.map((image) => (
            <PatternArt key={image.seed} variant={image.pattern} seed={image.seed} />
          ))}
        />
        <QuotePanel lines={quote.text} author={quote.author} role={quote.role} />
        <div className="grid min-w-0 gap-3 lg:col-span-2 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
          <ShowreelTile
            label={showreel.label}
            comingSoon={showreel.comingSoon}
            poster={showreel.poster}
            previewSrc={showreel.previewSrc}
            fallback={
              <PatternArt variant="diamond" seed="showreel" preserveAspectRatio="xMidYMid slice" />
            }
          />
          <DeliveryRow
            title={delivery.title}
            note={delivery.note}
            cta={delivery.cta}
            projectsLabel={delivery.projectsLabel}
          >
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </DeliveryRow>
        </div>
      </WorkReveal>
    </section>
  );
}

export { WorkSection };
