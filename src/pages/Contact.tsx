/* A single contact channel: the icon, the human label, the value shown, and where it points. */
type Channel = {
  icon: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

const channels: Channel[] = [
  {
    icon: 'fa-solid fa-envelope',
    label: 'Email',
    value: 'Alexbid2004@gmail.com',
    href: 'mailto:Alexbid2004@gmail.com',
  },
  {
    icon: 'fa-brands fa-linkedin-in',
    label: 'LinkedIn',
    value: 'in/alex-biddle12',
    href: 'https://www.linkedin.com/in/alex-biddle12',
    external: true,
  },
  {
    icon: 'fa-brands fa-github',
    label: 'GitHub',
    value: 'AlexanderBiddle',
    href: 'https://github.com/AlexanderBiddle',
    external: true,
  },
];

/* Focus areas reused from the page intro so the chips stay grounded in the same offering. */
const focusAreas = [
  'Cybersecurity engineering',
  'Red-teaming',
  'Security reviews and audits',
  'Secure frontend design',
  'Analyst reports',
  'Requirements documentation',
  'System design',
  'Secure software development',
];

export default function Contact() {
  return (
    <section className="page-shell contact" id="contact">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Let's work on security that is clear, defensible, and useful.</h1>
        <p>
          Reach out for cybersecurity engineering, red-team practice, defensive review, analyst-style documentation, secure frontend work, or technical problem solving where evidence and execution both matter.
        </p>
      </div>

      <div className="contact-hub">
        {/* Left: availability, value proposition, focus chips, and the primary call to action. */}
        <aside className="contact-intro spotlight-card">
          <span className="contact-status">
            <span className="contact-status-dot" aria-hidden="true"></span>
            Open to new opportunities
          </span>

          <h2 className="contact-intro-title">Let&rsquo;s start a conversation.</h2>
          <p className="contact-intro-lead">
            Whether it&rsquo;s a role, a project, or a problem worth digging into, the fastest way to reach
            me is a direct message. I usually reply within a day.
          </p>

          <ul className="contact-focus" aria-label="Areas of focus">
            {focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>

          <a className="contact-cta" href="mailto:Alexbid2004@gmail.com">
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            <span>Send a message</span>
          </a>
        </aside>

        {/* Right: each channel is a tappable card carrying the site's blue spotlight glow. */}
        <div className="contact-channels">
          {channels.map((channel) => (
            <a
              key={channel.label}
              className="channel-card spotlight-card"
              href={channel.href}
              {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="channel-icon" aria-hidden="true">
                <i className={channel.icon}></i>
              </span>
              <span className="channel-body">
                <span className="channel-label">{channel.label}</span>
                <span className="channel-value">{channel.value}</span>
              </span>
              <i className="channel-arrow fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
