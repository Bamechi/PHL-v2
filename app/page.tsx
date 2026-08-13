"use client";

import { FormEvent, useEffect, useState } from "react";
import stats from "./data/stats.json";

const STRIPE = {
  custom: "https://buy.stripe.com/aFa00j78U0vh9GF9AM1Nu04",
  fiveSeats: "https://buy.stripe.com/cNi4gzfFq4Lx0657sE1Nu03",
  classroom: "https://buy.stripe.com/7sY7sL0Kwem73ih5kw1Nu02",
  workshop: "https://buy.stripe.com/28E8wPdxicdZ8CB9AM1Nu01",
};

const PARTNER_FORM_URL = "https://script.google.com/macros/s/AKfycbz__QqtcSPHK4sUX_mDnqtxKphXPUmH9-xzpBljJk9UwX24S_419NwyZH1qD9RIb1SxuA/exec";

const chapters = ["Ascent", "Gap", "Work", "Blueprint", "Proof", "Support", "House"];

const impactMetrics = [
  {
    label: "Access funded",
    value: stats.seatsFunded,
    description: "Tracks support directed toward participant access and free or affordable program delivery.",
  },
  {
    label: "People reached",
    value: stats.peopleServed,
    description: "Counts unique participants served across learning, mentorship, and wellness experiences.",
  },
  {
    label: "Participant builds",
    value: stats.buildsShipped,
    description: "Records practical projects completed during AI and digital-literacy programming.",
  },
  {
    label: "Communities engaged",
    value: stats.citiesReached,
    description: "Shows the cities and communities where Project High-Lvl programs are delivered.",
  },
];

const programs = [
  {
    code: "LAB",
    title: "High Lvl Lab",
    copy: "Free AI hackathon-webinars where people leave having built something — not just heard about it.",
    image: "/photos/lab.jpg",
    alt: "An AI literacy lesson projected above a live Project High-Lvl audience",
  },
  {
    code: "DAY",
    title: "High Lvl Day",
    copy: "Community education days bringing practical AI and money skills into the room, open to everyone.",
    image: "/photos/day.jpg",
    alt: "Community members gathered for a live Project High-Lvl education day",
  },
  {
    code: "OUTSIDE",
    title: "High Lvl Outside",
    copy: "Hikes, bonfires, and wellness experiences that make nature and connection part of the foundation.",
    image: "/photos/outside.jpg",
    alt: "19Keys speaking with a community outdoors during a Project High-Lvl program",
  },
  {
    code: "ACADEMY",
    title: "High Lvl Academy",
    copy: "AI literacy training for companies and schools. Earned revenue helps put free seats in community rooms.",
    image: "/photos/academy.jpg",
    alt: "A full auditorium participating in a live Project High-Lvl learning session",
  },
];

function Arrow() {
  return <span aria-hidden="true" className="arrow"><i /></span>;
}

export default function Home() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 }
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLevel(Number((entry.target as HTMLElement).dataset.level || 0));
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: 0 }
    );
    document.querySelectorAll("[data-level]").forEach((node) => sectionObserver.observe(node));

    let scrollRaf = 0;
    const updateScroll = () => {
      scrollRaf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      document.documentElement.style.setProperty("--scroll", String(window.scrollY));
      document.documentElement.style.setProperty("--hero-scale", String(1.04 + Math.min(window.scrollY * .000035, .06)));
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScroll);
    };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!reduce && window.matchMedia("(pointer:fine)").matches) {
      const dot = document.querySelector<HTMLElement>(".cursor-dot");
      const ring = document.querySelector<HTMLElement>(".cursor-ring");
      let x = -100;
      let y = -100;
      let rx = x;
      let ry = y;
      let cursorRaf = 0;
      const move = (event: MouseEvent) => {
        x = event.clientX;
        y = event.clientY;
        if (dot) dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      };
      const animate = () => {
        rx += (x - rx) * 0.14;
        ry += (y - ry) * 0.14;
        if (ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        cursorRaf = requestAnimationFrame(animate);
      };
      window.addEventListener("mousemove", move);
      animate();
      return () => {
        revealObserver.disconnect();
        sectionObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(scrollRaf);
        cancelAnimationFrame(cursorRaf);
      };
    }

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
    };
  }, []);

  async function handleLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const city = String(form.get("city") || "");
    const segment = String(form.get("segment") || "Participant");
    const website = String(form.get("website") || "");
    const subject = `Project High-Lvl — ${segment} inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nCity: ${city}\nPath: ${segment}\n\nI would like to take the next step with Project High-Lvl.`;

    if (!PARTNER_FORM_URL) {
      window.location.href = `mailto:phlnonprofit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setFormState("submitting");
    try {
      await fetch(PARTNER_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ name, email, city, segment, website }),
      });
      setFormState("submitted");
      event.currentTarget.reset();
    } catch {
      setFormState("error");
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="mobile-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Project High-Lvl home">
          <img src="/logo.png" alt="" />
          <span><b>PROJECT HIGH-LVL</b><small>WELLNESS · LITERACY · AI</small></span>
        </a>
        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /> <span />
        </button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Primary navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>The work</a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>Impact</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#join" onClick={() => setMenuOpen(false)}>Get involved</a>
          <a className="nav-partner" href="mailto:phlnonprofit@gmail.com?subject=Project%20High-Lvl%20Partnership">Partner</a>
          <a className="nav-give" href={STRIPE.custom} target="_blank" rel="noreferrer">Support PHL</a>
        </nav>
      </header>

      <aside className="level-rail" aria-label="Page chapters">
        <div className="rail-line"><i style={{ height: `${progress * 100}%` }} /></div>
        {chapters.map((chapter, index) => (
          <a key={chapter} className={activeLevel === index ? "active" : ""} href={index === 0 ? "#top" : `#lvl-${index}`}>
            <span>LVL {String(index).padStart(2, "0")}</span><b>{chapter}</b>
          </a>
        ))}
      </aside>

      <main id="main">
        <section className="hero" id="top" data-level="0">
          <div className="hero-backdrop" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">A 501(c)(3) nonprofit · Los Angeles</p>
            <h1>Rise above<br />the <em>gap.</em></h1>
            <p className="hero-lede">AI literacy is the new financial literacy. Project High-Lvl puts the tools, teaching, and room within reach.</p>
            <div className="hero-actions">
              <a className="button button-gold" href={STRIPE.custom} target="_blank" rel="noreferrer">Name your contribution <Arrow /></a>
              <a className="text-link light" href="#join">Get a free seat <Arrow /></a>
            </div>
            <p className="hero-trust">501(c)(3) · EIN 33-2614564 · Contributions tax-deductible</p>
          </div>
          <a className="scroll-cue" href="#lvl-1"><span>Scroll to ascend</span><i /></a>
        </section>

        <section className="chapter gap" id="lvl-1" data-level="1">
          <div className="chapter-number" aria-hidden="true">01</div>
          <div className="chapter-grid">
            <div data-reveal>
              <p className="eyebrow">LVL 01 — THE GAP</p>
              <h2>The future does not wait for permission.</h2>
            </div>
            <div className="body-copy" data-reveal>
              <p>Too often, financial education reached our communities after the wealth had already moved. AI is another door opening — right now.</p>
              <p>Project High-Lvl exists so our people are in the room while the future is being built, not studying it afterward.</p>
              <a className="text-link" href="#work">See how we close the gap <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="chapter work" id="lvl-2" data-level="2">
          <div className="chapter-number" aria-hidden="true">02</div>
          <div className="section-heading" data-reveal>
            <p className="eyebrow">LVL 02 — THE WORK</p>
            <h2>Four programs.<br />One ladder.</h2>
            <p>We do not talk about the future. We put the tools in our community&apos;s hands.</p>
          </div>
          <div className="program-grid">
            {programs.map((program, index) => (
              <article className="program-card" key={program.code} data-reveal style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
                <img src={program.image} alt={program.alt} />
                <div className="program-card-shade" />
                <div className="program-content">
                  <span>{program.code}</span>
                  <h3>{program.title}</h3>
                  <p>{program.copy}</p>
                  <a href="#join" aria-label={`Get involved with ${program.title}`}>Find your door <Arrow /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blueprint" id="lvl-3" data-level="3">
          <div className="blueprint-photo"><img src="/photos/blueprint.jpg" alt="19Keys standing with community members after a Project High-Lvl event" /></div>
          <div className="blueprint-copy" data-reveal>
            <p className="eyebrow">LVL 03 — THE BLUEPRINT</p>
            <h2>Partner-funded.<br /><em>Community-owned.</em></h2>
            <p className="blueprint-lede">Access is what we offer partners. Ability is what we give away.</p>
            <ol className="steps">
              <li><span>01</span><p>Partners fund free and affordable programs for students and community.</p></li>
              <li><span>02</span><p>We teach practical AI, digital, and money skills.</p></li>
              <li><span>03</span><p>Participants build, apply, and show what changed.</p></li>
              <li><span>04</span><p>Proof attracts stronger partners — and the cycle climbs.</p></li>
            </ol>
            <a className="button button-outline-light" href="mailto:phlnonprofit@gmail.com?subject=Project%20High-Lvl%20Partner%20Brief">Request the partner brief <Arrow /></a>
          </div>
        </section>

        <section className="chapter proof" id="lvl-4" data-level="4">
          <div className="chapter-number" aria-hidden="true">04</div>
          <div className="proof-intro" id="impact" data-reveal>
            <p className="eyebrow">LVL 04 — THE PROOF</p>
            <h2>We show<br />our work.</h2>
            <p>Our first public impact report will count the same measures every year — whether they flatter us or not.</p>
          </div>
          <div className="proof-ledger" data-reveal>
            {impactMetrics.map(({ label, value, description }) => (
              <div className="metric" key={label}>
                <b>{value ?? "—"}</b>
                <span>{label}</span>
                <small>{description}</small>
              </div>
            ))}
          </div>
          <figure className="proof-photo" data-reveal>
            <img src="/photos/proof.jpg" alt="Students and community members filling an auditorium during a Project High-Lvl event" />
            <figcaption>Real rooms. Real learning. Published results.</figcaption>
          </figure>
        </section>

        <section className="chapter seat" id="lvl-5" data-level="5">
          <div className="chapter-number" aria-hidden="true">05</div>
          <div className="seat-copy" data-reveal>
            <p className="eyebrow">LVL 05 — THE SUPPORT</p>
            <h2><span>$50</span> puts one person in the room.</h2>
            <p>It also helps us pay for the people, planning, spaces, technology, and program delivery that keep Project High-Lvl free or affordable for the communities at the center of our mission.</p>
          </div>
          <div className="give-grid" data-reveal>
            <a className="give-card featured" href={STRIPE.custom} target="_blank" rel="noreferrer">
              <span className="give-kicker">Flexible support</span><b>Any $</b><strong>Name your contribution</strong><small>Give what feels right—every amount supports the mission</small><Arrow />
            </a>
            <a className="give-card" href={STRIPE.fiveSeats} target="_blank" rel="noreferrer">
              <span className="give-kicker">Build momentum</span><b>$250</b><strong>Support program delivery</strong><small>Flexible mission support</small><Arrow />
            </a>
            <a className="give-card" href={STRIPE.classroom} target="_blank" rel="noreferrer">
              <span className="give-kicker">Back the work</span><b>$1K</b><strong>Expand reach and resources</strong><small>Program and operating support</small><Arrow />
            </a>
            <a className="give-card" href={STRIPE.workshop} target="_blank" rel="noreferrer">
              <span className="give-kicker">Underwrite impact</span><b>$10K</b><strong>Strengthen a full program</strong><small>Major mission support</small><Arrow />
            </a>
          </div>
          <div className="seat-note" data-reveal>
            <p>Want to build recurring impact?</p>
            <a href="mailto:phlnonprofit@gmail.com?subject=Project%20High-Lvl%20Monthly%20Giving">Start a monthly commitment <Arrow /></a>
          </div>
          <p className="legal-line">Project High-Lvl is a 501(c)(3) nonprofit (EIN 33-2614564). Contributions are tax-deductible to the extent allowed by law.</p>
        </section>

        <section className="join" id="join" data-level="5">
          <div className="join-photo"><img src="/photos/join.jpg" alt="Project High-Lvl participants celebrating together after an event" /></div>
          <div className="join-panel" data-reveal>
            <p className="eyebrow">FIND YOUR DOOR</p>
            <h2>Learn. Mentor.<br />Partner. Build.</h2>
            <p>Tell us how you want to enter and where you are. We&apos;ll route you to the right next step.</p>
            <form onSubmit={handleLead}>
              <label className="intake-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
              <label>Your name<input required name="name" autoComplete="name" /></label>
              <label>Email<input required name="email" type="email" autoComplete="email" /></label>
              <label>City<input required name="city" autoComplete="address-level2" /></label>
              <label>I want to
                <select name="segment" defaultValue="Participant">
                  <option>Participant</option><option>Mentor</option><option>Sponsor</option><option>Partner</option>
                </select>
              </label>
              <button className="button button-green" type="submit" disabled={formState === "submitting"}>{formState === "submitting" ? "Sending…" : "Take the next step"} <Arrow /></button>
            </form>
            <small aria-live="polite">
              {formState === "submitted" && "Thank you — your information has been received."}
              {formState === "error" && "We could not send that form. Please email phlnonprofit@gmail.com."}
              {formState === "idle" && (PARTNER_FORM_URL ? "Your information goes directly to the Project High-Lvl team." : "Submitting opens a pre-addressed email with your details.")}
            </small>
          </div>
        </section>

        <section className="chapter house" id="lvl-6" data-level="6">
          <div className="chapter-number" aria-hidden="true">06</div>
          <div className="house-intro" id="house" data-reveal>
            <p className="eyebrow">LVL 06 — THE HOUSE</p>
            <h2>Built in<br />the open.</h2>
            <p>We ask people to trust us with resources for a future they cannot see yet. The least we can do is show the foundation under the work.</p>
          </div>
          <div className="ledger" data-reveal>
            <div><span>Legal name</span><b>Project High-Lvl</b></div>
            <div><span>Status</span><b>501(c)(3) public charity</b></div>
            <div><span>EIN</span><b>33-2614564</b></div>
            <div><span>Exemption effective</span><b>December 15, 2024</b></div>
            <div><span>Location</span><b>1360 S Figueroa St, Ste D119, Los Angeles, CA 90015</b></div>
            <div><span>Contact</span><a href="mailto:phlnonprofit@gmail.com">phlnonprofit@gmail.com</a></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-mark"><img src="/logo.png" alt="" /><span>PROJECT<br />HIGH-LVL</span></div>
        <p>AI literacy is the new financial literacy.</p>
        <div className="footer-links">
          <a href="#work">Programs</a><a href="#impact">Impact</a><a href="/about">About</a><a href="#join">Get involved</a><a href={STRIPE.custom} target="_blank" rel="noreferrer">Give</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Project High-Lvl</span>
          <span>501(c)(3) · EIN 33-2614564 · Los Angeles, CA</span>
        </div>
      </footer>

      <div className="mobile-give" aria-label="Quick actions">
        <a href={STRIPE.custom} target="_blank" rel="noreferrer">Give · Your amount</a>
        <a href="#join">Get a free seat</a>
      </div>
    </>
  );
}
