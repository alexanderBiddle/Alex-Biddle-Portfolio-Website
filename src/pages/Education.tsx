const honors = ["Dean's List", 'ODAC All-Academic Award', 'ODAC All-Conference Award'];
const certifications: string[] = [];

const courseGroups = [
  {
    title: 'Computer Science and Cybersecurity',
    summary: 'Completed work spanning software design, low-level systems, network protocols, secure software, attack defense, and applied machine learning.',
    courses: [
      'Data Structures',
      'Systems Programming',
      'Computer Organization',
      'Object-Oriented Programming',
      'Algorithms',
      'Machine Learning',
      'Privacy and Security',
      'Software Security',
      'Network Architecture and Protocols',
      'Computer and Data Security',
      'Operating Systems',
      'System Security & Defense',
    ],
  },
  {
    title: 'Mathematics and Engineering Physics',
    summary: 'Completed quantitative study covering calculus, differential-equation modeling, linear algebra, geometry, physics, statics, dynamics, and solid mechanics.',
    courses: [
      'Calculus I & II',
      'Differential Equations',
      'Multivariable Calculus',
      'Higher Geometry',
      'Linear Algebra',
      'Mathematical Physics',
      'Physics I & II',
      'Engineering Statics',
      'Mechanics of Solids',
      'Dynamics of Engineering Mechanics',
      'Modern Physics',
    ],
  },
];

export default function Education() {
  return (
    <section className="page-shell education" id="education">
      <div className="section-heading">
        <p className="eyebrow">Education</p>
        <h1>Cybersecurity and<br />computer science,<br />supported by<br />engineering physics<br />and mathematics.</h1>
      </div>

      <div className="education-record glass-panel spotlight-card">
        <p className="panel-kicker">Randolph-Macon College</p>
        <h2>Cybersecurity and Computer Science</h2>
        <p>Graduated February 2026</p>
        <dl className="credential-grid">
          <div>
            <dt>Majors</dt>
            <dd>Cybersecurity & Computer Science</dd>
          </div>
          <div>
            <dt>Minors</dt>
            <dd>Engineering Physics & Mathematics</dd>
          </div>
          <div>
            <dt>Academic Record</dt>
            <dd>CS & Cybersecurity GPA: 4.0</dd>
          </div>
        </dl>
      </div>

      <div className="archive-section-grid">
        <section className="glass-panel spotlight-card">
          <p className="panel-kicker">Honors</p>
          <h2>Academic and athletic recognition</h2>
          <div className="archive-tags">
            {honors.map((honor) => (
              <span className="honor-tag" key={honor}>{honor}</span>
            ))}
          </div>
        </section>

        {certifications.length > 0 && (
          <section className="glass-panel spotlight-card">
            <p className="panel-kicker">Certifications</p>
            <h2>CompTIA credentials</h2>
            <div className="archive-tags">
              {certifications.map((certification) => (
                <span className="cert-tag" key={certification}>{certification}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="glass-panel spotlight-card coursework-panel">
        <p className="panel-kicker">Completed Coursework</p>
        <h2>Course archive by discipline</h2>
        <div className="coursework-grid">
          {courseGroups.map((group) => (
            <article className="coursework-group" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
              <ul className="archive-list">
                {group.courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};
