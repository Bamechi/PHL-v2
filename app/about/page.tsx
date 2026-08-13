import type { Metadata } from "next";
import Link from "next/link";
import AboutInvoiceButton from "./AboutInvoiceButton";

export const metadata: Metadata = {
  title: "About Project High-Lvl — Our Story, Mission, and Founders",
  description: "Meet Project High-Lvl co-founders 19Keys and B. Amechi and learn the mission, vision, and values behind the work.",
};

const STRIPE_CUSTOM = "https://buy.stripe.com/aFa00j78U0vh9GF9AM1Nu04";

const values = [
  {
    title: "Access into ability",
    copy: "Access matters when people leave with practical knowledge, confidence, and something they can use.",
  },
  {
    title: "Whole-person growth",
    copy: "Wellness, financial literacy, and technology belong in one conversation about sustainable progress.",
  },
  {
    title: "Build, not browse",
    copy: "We favor applied learning: making, testing, practicing, and turning ideas into useful outcomes.",
  },
  {
    title: "Community ownership",
    copy: "Programs should strengthen the people in the room and the communities they return to.",
  },
  {
    title: "Cultural relevance",
    copy: "Learning works better when it respects lived experience, speaks plainly, and meets people where they are.",
  },
  {
    title: "Proof over promises",
    copy: "We measure reach, participation, completed builds, and community engagement—and publish what we learn.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <a className="skip-link" href="#about-main">Skip to main content</a>
      <header className="site-header about-header">
        <Link className="brand" href="/" aria-label="Project High-Lvl home">
          <img src="/logo.png" alt="" />
          <span><b>PROJECT HIGH-LVL</b><small>WELLNESS · LITERACY · AI</small></span>
        </Link>
        <nav className="about-simple-nav" aria-label="About page navigation">
          <Link href="/">Back home</Link>
          <a className="nav-give" href={STRIPE_CUSTOM} target="_blank" rel="noreferrer">Support PHL</a>
        </nav>
      </header>

      <main className="about-main" id="about-main">
        <section className="about-hero">
          <div className="about-hero-copy">
            <p className="eyebrow">OUR STORY</p>
            <h1>Built to help our people reach their <em>highest level.</em></h1>
            <p>Project High-Lvl turns access to wellness, financial knowledge, and emerging technology into practical ability people can carry forward.</p>
          </div>
        </section>

        <section className="story-section">
          <div className="story-grid">
            <div>
              <p className="eyebrow">WHY WE BEGAN</p>
              <h2>The gap became a call to build.</h2>
            </div>
            <div className="story-copy">
              <p>Project High-Lvl began with a shared conviction: communities should not have to discover life-changing knowledge after opportunity has already moved on. The systems shaping health, wealth, work, and technology are changing quickly, and our people deserve to be present while that future is being built.</p>
              <p>Co-founders 19Keys and B. Amechi created Project High-Lvl to connect cultural leadership with durable systems. The work brings practical education, mentorship, wellness, and community into the same room—then lowers the barriers that keep people out of it.</p>
              <p>What started as a response to the access gap is becoming a platform for whole-person advancement: experiences where people can learn, build, connect, and leave more prepared to shape what comes next.</p>
            </div>
          </div>
        </section>

        <section className="founders-section">
          <div className="founders-intro">
            <div>
              <p className="eyebrow">THE FOUNDERS</p>
              <h2>Vision meets infrastructure.</h2>
            </div>
            <p>Project High-Lvl is led by two complementary disciplines: the cultural vision to move people and the operational architecture to make the work last.</p>
          </div>
          <div className="founder-ledger">
            <article className="founder-bio">
              <div className="founder-name"><span>CO-FOUNDER</span><h3>19Keys</h3></div>
              <p>19Keys is a cultural thought leader, educator, and entrepreneur whose work connects self-mastery, economic empowerment, technology, and the future of community. He shapes Project High-Lvl&apos;s public vision and learning philosophy, translating complex shifts into ideas people can understand, act on, and build from.</p>
            </article>
            <article className="founder-bio">
              <div className="founder-name"><span>CO-FOUNDER</span><h3>B. Amechi</h3></div>
              <p>B. Amechi is a creative strategist, producer, and systems builder focused on turning ambitious ideas into clear, durable experiences. He leads the operational and creative architecture behind Project High-Lvl—connecting programs, partnerships, storytelling, and the infrastructure required to deliver the mission with intention.</p>
            </article>
          </div>
        </section>

        <section className="purpose-section">
          <div className="purpose-block">
            <p className="eyebrow">OUR NORTH STAR</p>
            <h2>Access is the opening.<br />Ability is the outcome.</h2>
            <div className="purpose-row">
              <h3>Mission</h3>
              <p>Project High-Lvl equips communities—with a focus on Black men and women in historically underserved communities—with practical wellness, financial-literacy, AI, and digital-literacy education. Through free and affordable programs, mentorship, and community experiences, we turn access into confidence and usable ability.</p>
            </div>
            <div className="purpose-row">
              <h3>Vision</h3>
              <p>We envision communities at the front of technological and economic change: AI-literate, financially confident, well, connected, and equipped to create opportunity rather than wait for it.</p>
            </div>
          </div>
          <div className="values-grid" aria-label="Project High-Lvl values">
            {values.map((value, index) => (
              <article className="value" key={value.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{value.title}</h3>
                <p>{value.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <h2>Help build the rooms where the future becomes reachable.</h2>
          <div className="about-cta-actions">
            <a className="button" href={STRIPE_CUSTOM} target="_blank" rel="noreferrer">Support the mission</a>
            <a className="text-link light" href="mailto:phlnonprofit@gmail.com?subject=Project%20High-Lvl%20Partnership">Partner with us</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-mark"><img src="/logo.png" alt="" /><span>PROJECT<br />HIGH-LVL</span></div>
        <p>The future should be something our communities help build.</p>
        <div className="footer-links"><Link href="/">Home</Link><Link href="/#work">Programs</Link><Link href="/#impact">Impact</Link><Link href="/#join">Get involved</Link><a href="mailto:phlnonprofit@gmail.com">Contact</a><AboutInvoiceButton /></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Project High-Lvl</span><span>501(c)(3) · EIN 33-2614564 · Los Angeles, CA</span></div>
      </footer>
    </div>
  );
}
