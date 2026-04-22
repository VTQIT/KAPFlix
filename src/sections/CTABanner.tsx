import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelector('.cta-headline'), {
        scrollTrigger: { trigger: section, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
      gsap.from(section.querySelector('.cta-subtext'), {
        scrollTrigger: { trigger: section, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });
      gsap.from(section.querySelector('.cta-button'), {
        scrollTrigger: { trigger: section, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-24 px-6 md:px-12"
      style={{
        background: 'linear-gradient(to bottom, #0f0f0f, #1a1209)',
      }}
    >
      <div className="max-w-[700px] mx-auto text-center">
        <h2 className="cta-headline font-display text-3xl md:text-5xl font-bold text-[#f5f0e6]">
          Start Your Cinematic Journey
        </h2>
        <p className="cta-subtext mt-4 text-lg text-[#8a8278]">
          Unlimited access to thousands of films. No commitments.
        </p>
        <button className="cta-button mt-8 inline-flex items-center bg-[#e2b13c] text-[#0a0a0a] text-base font-semibold px-12 py-4 rounded-md hover:bg-[#f0c04a] hover:scale-[1.03] transition-all duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
}
