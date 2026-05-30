import { NavLink } from 'react-router';

type NavigationLink = {
  to: string;
  label: string;
};

export default function NavBar() {
  /* Central link data keeps the repeated navigation anchors consistent across the DOM. */
  const links: NavigationLink[] = [
    { to: '/', label: 'Home' },
    { to: '/About', label: 'About' },
    { to: '/Skills', label: 'Skills' },
    { to: '/Projects', label: 'Projects' },
    { to: '/Contact', label: 'Contact' },
  ];

  return (
    <nav className="site-nav">
      {/* Brand link doubles as the home affordance and receives focus/active routing behavior. */}
      <NavLink to="/" className="nav-brand" aria-label="Go to home">
        <span>AB</span>
        <strong>BiddleSec</strong>
      </NavLink>
      {/* Mapping link data creates one NavLink per route and lets React Router mark the active page. */}
      <div className="nav-links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
