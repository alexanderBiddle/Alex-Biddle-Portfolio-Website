import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, RadioTower, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

const operatingModes = [
  'Red-team thinking',
  'Defensive engineering',
  'Threat analysis',
  'Secure automation',
];

export default function AetherGalaxyHero() {
  const shouldReduceMotion = useReducedMotion();
  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="aether-hero" aria-labelledby="aether-title">
      <div className="aether-content">
        <motion.div
          {...reveal}
          transition={{ delay: 0.12, duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
          className="aether-status"
        >
          <RadioTower aria-hidden="true" />
          <span>Interactive threat observatory</span>
        </motion.div>

        <motion.p
          {...reveal}
          transition={{ delay: 0.22, duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
          className="aether-kicker"
        >
          Aether flow / security engineering
        </motion.p>

        <motion.h1
          {...reveal}
          transition={{ delay: 0.32, duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
          id="aether-title"
        >
          Mapping risk
          <span>across the signal.</span>
        </motion.h1>

        <motion.p
          {...reveal}
          transition={{ delay: 0.42, duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
          className="aether-copy"
        >
          I bring red-team curiosity, defensive engineering, analyst discipline, and software
          development together to surface hidden paths and build systems that hold.
        </motion.p>

        <motion.div
          {...reveal}
          transition={{ delay: 0.52, duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
          className="aether-actions"
        >
          <Link className="aether-action primary" to="/Projects">
            Review project scope
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="aether-action secondary" to="/Contact">
            <ShieldCheck aria-hidden="true" />
            Discuss security work
          </Link>
        </motion.div>
      </div>

      <motion.aside
        {...reveal}
        transition={{ delay: 0.62, duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
        className="aether-modes"
        aria-label="Core operating modes"
      >
        <p>Signal map / 04</p>
        <ul>
          {operatingModes.map((mode, index) => (
            <li key={mode}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {mode}
            </li>
          ))}
        </ul>
      </motion.aside>

      <div className="aether-scroll-cue" aria-hidden="true">Scroll to inspect</div>
    </section>
  );
}
