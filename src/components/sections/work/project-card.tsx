import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { Chip } from "@/components/ui/chip";
import type { Project } from "@/content/work";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const staticClass =
  "relative flex w-full flex-col lg:flex-row justify-between gap-6 overflow-hidden rounded-card border border-border bg-surface p-3 shadow-xs md:p-4";

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
 * One project, an `<li>` wrapping either an `<Link>` (case study) or a static block (NDA). The whole
 * card is the hit area; pressing it nudges it down a pixel. NDA cards are static and get no hover state. Covers are 4:3 and carry their own title art, so they are shown uncropped.
 */
function ProjectCard({ project, index }: ProjectCardProps) {
  const { cover } = project;
  const coverImage = (src: string, className?: string) => (
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
      className={cn("object-cover", className)}
    />
  );
  const arrow = project.slug ? (
    <ArrowUpRightIcon
      aria-hidden
      className="size-6 shrink-0 text-muted-foreground transition-[transform,color] duration-(--duration-ui) ease-(--ease-ui) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground lg:mt-0"
    />
  ) : (
    <span className="text-label text-muted-foreground">NDA</span>
  );

  const body = cover ? (
    <>
      <div
        aria-hidden
        className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-card lg:h-full lg:w-auto"
      >
        {coverImage(cover.src, cover.srcDark && "dark:hidden")}
        {cover.srcDark && coverImage(cover.srcDark, "hidden dark:block")}
      </div>
      <div className="flex items-start justify-between gap-4 px-2 pb-2 lg:min-w-0 lg:flex-1 lg:flex-col lg:px-4 lg:py-3">
        <h3 className="text-body-lg font-medium text-balance text-foreground">
          <span className="mb-2 block text-mono-ui font-normal text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.title}
        </h3>
        {arrow}
      </div>
    </>
  ) : (
    <>
      <div className="flex items-start justify-between gap-6">
        <span className="text-mono-ui text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        {arrow}
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-title text-foreground">{project.title}</h3>
        <div className="flex items-center gap-2">
          {project.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <li className="flex">
      {project.slug ? (
        <Link
          href={`/work/${project.slug}`}
          aria-label={`Open case study: ${project.title}`}
          className={cn(linkClass, cover && "justify-start")}
        >
          {body}
        </Link>
      ) : (
        <div className={cn(staticClass, cover && "justify-start")}>{body}</div>
      )}
    </li>
  );
}

export { ProjectCard };
