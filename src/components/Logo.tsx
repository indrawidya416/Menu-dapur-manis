import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-rindu-400/50 bg-coal-800">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 text-rindu-300"
          aria-hidden="true"
        >
          <path
            d="M4 14c0-3.5 3.6-9 8-9s8 5.5 8 9a8 8 0 1 1-16 0Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 5c0 2.5-2 3.5-2 6a2 2 0 0 0 4 0c0-2.5-2-3.5-2-6Z"
            fill="currentColor"
            opacity="0.55"
          />
        </svg>
      </span>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold tracking-wide text-rindu-50">
          Dapur Harum Rindu
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-rindu-400">
          Rasa Nusantara
        </p>
      </div>
    </div>
  );
}
