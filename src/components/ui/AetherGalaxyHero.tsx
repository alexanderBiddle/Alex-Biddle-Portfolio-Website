/* Motion utilities animate the hero while respecting the visitor's reduced-motion preference. */
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

/* The resume PDF lives in public/documents and is served under Vite's configured base path. */
const resumeUrl = `${import.meta.env.BASE_URL}documents/Resume.pdf`;

export default function AetherGalaxyHero() {
  /* Reduced-motion visitors receive the same content without staged position or opacity changes. */
  const shouldReduceMotion = useReducedMotion();
  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="aether-hero" aria-labelledby="aether-title">
      {/* Foreground copy and route actions sit above the decorative canvases mounted by App. */}
      <div className="aether-content">
        <motion.h1
          {...reveal}
          transition={{ delay: 0.32, duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
          id="aether-title"
        >
          Alex Biddle
          <span>Security Engineer | Developer | Analyst</span>
        </motion.h1>

        {/* Route links direct visitors to evidence-oriented projects or the contact page. */}
        <motion.div
          {...reveal}
          transition={{ delay: 0.52, duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
          className="aether-actions"
        >
          {/* The two primary actions share a row; the Resume button below spans their combined width. */}
          <div className="aether-action-pair">
            <Link className="aether-action primary" to="/Projects">
              Review project scope
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="aether-action secondary" to="/Contact">
              <ShieldCheck aria-hidden="true" />
              Discuss security work
            </Link>
          </div>

          {/* Full-width tertiary action spanning both buttons; opens the resume PDF in a new tab. */}
          <a
            className="aether-action resume"
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FileText aria-hidden="true" />
            Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
