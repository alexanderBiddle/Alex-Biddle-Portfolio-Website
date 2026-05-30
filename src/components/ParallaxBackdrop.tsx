import { useEffect } from 'react';

export default function ParallaxBackdrop() {
  useEffect(() => {
    /* documentElement is the <html> node; CSS reads --scroll-y from it for parallax transforms. */
    const root = document.documentElement;

    /* Each scroll event writes the current viewport offset into a CSS custom property. */
    const updateParallax = () => {
      root.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };

    /* Seed the variable before the user scrolls so the initial DOM paint matches the current position. */
    updateParallax();
    /* Passive listener keeps scrolling responsive because this handler never calls preventDefault(). */
    window.addEventListener('scroll', updateParallax, { passive: true });

    /* Cleanup removes the DOM event listener when React unmounts this backdrop. */
    return () => window.removeEventListener('scroll', updateParallax);
  }, []);

  return (
    /* aria-hidden keeps the decorative layers out of the accessibility tree. */
    <div className="parallax-stage" aria-hidden="true">
      {/* Layer elements are empty on purpose; CSS paints and moves them as the visual background. */}
      <div className="parallax-layer layer-bg"></div>
      <div className="parallax-layer layer-grid"></div>
      <div className="parallax-layer layer-stars"></div>
      <div className="parallax-layer layer-orbit"></div>
      <div className="parallax-scanline"></div>
    </div>
  );
}
