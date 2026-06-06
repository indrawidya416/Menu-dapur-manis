import { useEffect } from "react";

/**
 * Adds the `is-visible` class to every `.reveal` element once it scrolls
 * into view, triggering the float-up animation defined in index.css.
 */
export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            el.style.animationDelay = `${delay}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
