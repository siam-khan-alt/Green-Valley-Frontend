"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { heroSlides } from "@/data/site";
import { cn } from "@/lib/cn";

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 6000, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <section className="relative flex min-h-[55vh] items-center overflow-hidden">
      <div ref={emblaRef} className="absolute inset-0">
        <div className="flex h-full">
          {heroSlides.map((slide, i) => (
            <div key={slide.image} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[18rem] sm:min-h-[15rem]">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.image}
              className={cn(
                "absolute inset-0 flex flex-col justify-center gap-6 transition-opacity duration-700",
                selected === i ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={selected !== i}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-soft">{slide.kicker}</p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
                {slide.title}
              </h1>
              <p className="max-w-xl text-lg text-white/80">{slide.description}</p>
              <div className="mt-2 flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover shadow-lg shadow-primary/30"
                >
                  View Our Projects
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:flex"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:flex"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              selected === i ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}