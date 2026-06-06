import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gadogado from "@/assets/gadogado.jpg";
import sate from "@/assets/sate.jpg";
import { SectionHeading } from "@/components/Section";

const images = [
  { src: gallery1, alt: "Suasana ruang makan Dapur Harum Rindu", span: "lg:col-span-2 lg:row-span-2" },
  { src: gallery2, alt: "Rempah-rempah segar khas Nusantara", span: "" },
  { src: sate, alt: "Sate ayam panggang arang", span: "" },
  { src: gadogado, alt: "Gado-gado dengan saus kacang", span: "lg:col-span-2" },
];

export function Gallery() {
  return (
    <section id="galeri" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Galeri"
          title="Kehangatan dalam setiap bingkai"
          description="Sekilas suasana, sajian, dan cerita di balik dapur kami."
        />

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-4">
          {images.map((img, i) => (
            <figure
              key={img.alt}
              className={`reveal group relative overflow-hidden rounded-2xl border border-rindu-900/50 ${img.span}`}
              data-delay={`${i * 80}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coal-900/85 via-coal-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="absolute bottom-0 left-0 translate-y-3 p-5 text-sm font-medium text-rindu-50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {img.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
