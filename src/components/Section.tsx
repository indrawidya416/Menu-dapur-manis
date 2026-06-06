import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="reveal inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rindu-400">
          <span className="h-px w-6 bg-rindu-400/60" />
          {eyebrow}
        </span>
      )}
      <h2 className="reveal mt-4 font-display text-3xl leading-tight text-rindu-50 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="reveal mt-5 text-base leading-relaxed text-rindu-100/70">
          {description}
        </p>
      )}
    </div>
  );
}
