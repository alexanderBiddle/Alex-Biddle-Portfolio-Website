import { useEffect } from 'react';

const SPOTLIGHT_SELECTOR = '.spotlight-card';

export default function SpotlightCards() {
  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeCard: HTMLElement | null = null;

    const clearActiveCard = () => {
      activeCard?.classList.remove('is-spotlit');
      activeCard?.style.removeProperty('--spotlight-x');
      activeCard?.style.removeProperty('--spotlight-y');
      activeCard = null;
    };

    const syncPointer = ({ clientX, clientY, target }: PointerEvent) => {
      if (!finePointerQuery.matches || reducedMotionQuery.matches) {
        clearActiveCard();
        return;
      }

      const nextCard = target instanceof Element
        ? target.closest<HTMLElement>(SPOTLIGHT_SELECTOR)
        : null;

      if (!nextCard) {
        clearActiveCard();
        return;
      }

      if (activeCard !== nextCard) {
        clearActiveCard();
        activeCard = nextCard;
        activeCard.classList.add('is-spotlit');
      }

      const bounds = nextCard.getBoundingClientRect();
      nextCard.style.setProperty('--spotlight-x', `${clientX - bounds.left}px`);
      nextCard.style.setProperty('--spotlight-y', `${clientY - bounds.top}px`);
    };

    const syncPreference = () => {
      if (!finePointerQuery.matches || reducedMotionQuery.matches) {
        clearActiveCard();
      }
    };

    document.addEventListener('pointermove', syncPointer, { passive: true });
    document.addEventListener('pointerleave', clearActiveCard);
    window.addEventListener('blur', clearActiveCard);
    finePointerQuery.addEventListener('change', syncPreference);
    reducedMotionQuery.addEventListener('change', syncPreference);

    return () => {
      document.removeEventListener('pointermove', syncPointer);
      document.removeEventListener('pointerleave', clearActiveCard);
      window.removeEventListener('blur', clearActiveCard);
      finePointerQuery.removeEventListener('change', syncPreference);
      reducedMotionQuery.removeEventListener('change', syncPreference);
      clearActiveCard();
    };
  }, []);

  return null;
}
