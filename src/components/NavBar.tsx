/* React Router provides declarative links and active-route state for the persistent navigation. */
import { NavLink } from 'react-router';
import LiquidGlassSurface from './ui/LiquidGlassSurface';

/* Each navigation entry keeps its URL and visible label together for the repeated link markup. */
type NavigationLink = {
  to: string;
  label: string;
};

/* Central link data lives at module scope, matching how the page components define their data. */
const links: NavigationLink[] = [
  { to: '/', label: 'Home' },
  { to: '/About', label: 'About' },
  { to: '/Experience', label: 'Experience' },
  { to: '/Skills', label: 'Skills' },
  { to: '/Education', label: 'Education' },
  { to: '/Projects', label: 'Projects' },
  { to: '/Contact', label: 'Contact' },
];

export default function NavBar() {
  return (
    <nav className="site-nav">
      {/* Mapping link data creates one NavLink per route and lets React Router mark the active page. */}
      <div className="nav-links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (
              <LiquidGlassSurface
                role="button"
                shape="pill"
                isActive={isActive}
                className="nav-link-glass"
              >
                <span>{link.label}</span>
              </LiquidGlassSurface>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
