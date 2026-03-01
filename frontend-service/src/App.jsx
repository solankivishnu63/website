import { useState, useEffect, useRef } from "react";

// ─── Mock Backend API ─────────────────────────────────────────────────────────
const api = {
  async getStats() {
    return new Promise(res => setTimeout(() => res([
      { label: "Products Shipped", value: "2.4M+", suffix: "" },
      { label: "Enterprise Clients", value: "840", suffix: "+" },
      { label: "Uptime SLA", value: "99.99", suffix: "%" },
      { label: "Engineers Worldwide", value: "1,200", suffix: "+" },
    ]), 600));
  },
  async submitContact(data) {
    return new Promise((res, rej) => setTimeout(() => {
      if (data.email && data.message) res({ success: true });
      else rej({ error: "Missing fields" });
    }, 1000));
  },
  async getTestimonials() {
    return new Promise(res => setTimeout(() => res([
      { name: "Priya Sharma", role: "CTO, Finova", text: "Chromosoft's infrastructure slashed our latency by 60%. Unprecedented reliability.", avatar: "PS" },
      { name: "Marcus Webb", role: "VP Engineering, Orbital", text: "The developer experience is leagues ahead. Our team ships twice as fast now.", avatar: "MW" },
      { name: "Leila Nouri", role: "Founder, Stackbloom", text: "Migrating to Chromosoft was the best technical decision we've made this decade.", avatar: "LN" },
    ]), 500));
  }
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const G = {
  fontDisplay: "'Syne', sans-serif",
  fontBody: "'DM Sans', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  black: "#060608",
  white: "#F5F4EF",
  accent: "#00FF88",
  accentDim: "#00CC6A",
  gray1: "#0E0E12",
  gray2: "#1A1A22",
  gray3: "#2A2A38",
  gray4: "#5A5A72",
  gray5: "#9090A8",
};

// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// ─── Font Injection ───────────────────────────────────────────────────────────
const injectFonts = () => {
  if (document.getElementById("cs-fonts")) return;
  const link = document.createElement("link");
  link.id = "cs-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);

  // Inject global reset styles
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { overflow-x: hidden; }
    button { cursor: pointer; }
    input, textarea { -webkit-appearance: none; }
    @keyframes blink { 50% { opacity: 0 } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
};

// ─── Shared Components ────────────────────────────────────────────────────────
const GlowDot = ({ x, y, size = 300, color = G.accent, opacity = 0.06 }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: size, height: size,
    borderRadius: "50%", background: color, opacity,
    filter: `blur(${size / 2}px)`, pointerEvents: "none", zIndex: 0,
  }} />
);

const Tag = ({ children }) => (
  <span style={{
    fontFamily: G.fontMono, fontSize: 11, letterSpacing: "0.12em",
    textTransform: "uppercase", color: G.accent, background: "rgba(0,255,136,0.08)",
    border: `1px solid rgba(0,255,136,0.2)`, borderRadius: 4,
    padding: "4px 10px", display: "inline-block", whiteSpace: "nowrap",
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", fullWidth = false, style: s = {} }) => {
  const [hov, setHov] = useState(false);
  const base = variant === "primary"
    ? { background: hov ? G.accentDim : G.accent, color: G.black, border: "none" }
    : { background: "transparent", color: hov ? G.accent : G.white, border: `1px solid ${hov ? G.accent : G.gray3}` };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...base,
        fontFamily: G.fontBody, fontWeight: 500, fontSize: 14,
        padding: "13px 28px", borderRadius: 8,
        transition: "all 0.2s", letterSpacing: "0.04em",
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        ...s,
      }}
    >{children}</button>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Nav({ activeSection, setSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const showHamburger = isMobile || isTablet;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => { if (!showHamburger) setMenuOpen(false); }, [showHamburger]);

  const links = ["Home", "Products", "About", "Testimonials", "Contact"];

  const handleNav = (section) => {
    setSection(section.toLowerCase());
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || menuOpen ? "rgba(6,6,8,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled || menuOpen ? `1px solid ${G.gray2}` : "none",
        transition: "all 0.3s",
        padding: isMobile ? "0 20px" : "0 clamp(20px, 5vw, 80px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        {/* Logo */}
        <div
          onClick={() => handleNav("home")}
          style={{ fontFamily: G.fontDisplay, fontWeight: 800, fontSize: isMobile ? 18 : 22, color: G.white, letterSpacing: "-0.02em", cursor: "pointer", userSelect: "none" }}
        >
          Chromo<span style={{ color: G.accent }}>soft</span>
          <span style={{ fontSize: isMobile ? 10 : 12, color: G.gray5, fontFamily: G.fontBody, fontWeight: 300, marginLeft: 6 }}>Technology</span>
        </div>

        {/* Desktop links */}
        {!showHamburger && (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {links.map(l => (
              <button key={l} onClick={() => handleNav(l)}
                style={{
                  background: "none", border: "none",
                  fontFamily: G.fontBody, fontSize: 14, fontWeight: 400,
                  color: activeSection === l.toLowerCase() ? G.accent : G.gray5,
                  padding: "8px 14px", borderRadius: 6, transition: "color 0.2s",
                }}
              >{l}</button>
            ))}
            <Btn s={{ marginLeft: 8, padding: "9px 20px" }} onClick={() => handleNav("contact")}>Get Started</Btn>
          </div>
        )}

        {/* Hamburger */}
        {showHamburger && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "none", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 2, background: G.white, borderRadius: 2,
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                    : i === 1 ? "scaleX(0)"
                      : "rotate(-45deg) translate(5px, -5px)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {showHamburger && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 190,
          background: "rgba(6,6,8,0.98)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${G.gray2}`,
          padding: "16px 20px 28px",
          transform: menuOpen ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}>
          {links.map(l => (
            <button key={l} onClick={() => handleNav(l)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none",
                fontFamily: G.fontBody, fontSize: 18, fontWeight: activeSection === l.toLowerCase() ? 600 : 400,
                color: activeSection === l.toLowerCase() ? G.accent : G.white,
                padding: "14px 8px", borderBottom: `1px solid ${G.gray2}`,
              }}
            >{l}</button>
          ))}
          <div style={{ marginTop: 20 }}>
            <Btn fullWidth onClick={() => handleNav("contact")}>Get Started →</Btn>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ setSection }) {
  const [typed, setTyped] = useState("");
  const words = ["Infrastructure", "Intelligence", "Innovation", "Impact"];
  const [wi, setWi] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  useEffect(() => {
    const word = words[wi];
    const delay = deleting ? 50 : 90;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < word.length) { setTyped(word.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
        else { setTimeout(() => setDeleting(true), 1800); }
      } else {
        if (charIdx > 0) { setTyped(word.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
        else { setDeleting(false); setWi(w => (w + 1) % words.length); }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wi]);

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: isMobile
        ? "100px 20px 60px"
        : isTablet
          ? "110px 40px 80px"
          : "120px clamp(40px,5vw,80px) 80px",
    }}>
      <GlowDot x={isMobile ? "-80px" : "-100px"} y="10%" size={isMobile ? 300 : 600} />
      <GlowDot x="60%" y="-50px" size={isMobile ? 200 : 400} color="#4040FF" opacity={0.05} />

      {/* Grid lines — hidden on mobile */}
      {!isMobile && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${i * 14}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.025)" }} />
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: isDesktop ? 700 : "100%" }}>
        <Tag>Chromosoft Technology · v4.2 Released</Tag>

        <h1 style={{
          fontFamily: G.fontDisplay, fontWeight: 800,
          fontSize: isMobile ? 40 : isTablet ? 56 : 80,
          lineHeight: 1.0, letterSpacing: "-0.04em", color: G.white,
          margin: isMobile ? "20px 0 0" : "28px 0 0",
        }}>
          Building the<br />
          Future of<br />
          <span style={{ color: G.accent }}>
            {typed}
            <span style={{
              display: "inline-block", width: 3, height: "0.85em", background: G.accent,
              marginLeft: 3, verticalAlign: "middle", animation: "blink 1s step-end infinite",
            }} />
          </span>
        </h1>

        <p style={{
          fontFamily: G.fontBody, fontWeight: 300,
          fontSize: isMobile ? 15 : 17,
          lineHeight: 1.75, color: G.gray5,
          maxWidth: 500, margin: isMobile ? "20px 0 32px" : "28px 0 44px",
        }}>
          Chromosoft Technology delivers enterprise cloud infrastructure, AI-powered developer tools, and
          edge computing solutions that scale from startup to global enterprise.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn onClick={() => setSection("products")}>Explore Products</Btn>
          <Btn variant="outline" onClick={() => setSection("contact")}>Talk to Sales</Btn>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 10, marginTop: isMobile ? 36 : 52, flexWrap: "wrap" }}>
          {["SOC 2 Type II", "ISO 27001", "GDPR Ready", "99.99% SLA"].map(b => (
            <span key={b} style={{
              fontFamily: G.fontMono, fontSize: 10, color: G.gray4,
              border: `1px solid ${G.gray3}`, borderRadius: 4, padding: "5px 10px",
            }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Stats cards — inline on mobile, floating on desktop */}
      {isDesktop ? (
        <div style={{
          position: "absolute", right: "clamp(20px, 6vw, 100px)", top: "50%",
          transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 14,
        }}>
          {[
            { label: "Deployments Today", val: "14,832", delta: "+3.2%" },
            { label: "Avg Latency", val: "1.4ms", delta: "↓ 8%" },
            { label: "Active Regions", val: "42", delta: "global" },
          ].map(c => (
            <div key={c.label} style={{ background: G.gray1, border: `1px solid ${G.gray2}`, borderRadius: 12, padding: "16px 20px", minWidth: 190 }}>
              <div style={{ fontFamily: G.fontMono, fontSize: 10, color: G.gray4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{c.label}</div>
              <div style={{ fontFamily: G.fontDisplay, fontWeight: 700, fontSize: 26, color: G.white, margin: "6px 0 4px" }}>{c.val}</div>
              <div style={{ fontFamily: G.fontMono, fontSize: 11, color: G.accent }}>{c.delta}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)",
          gap: 12, marginTop: 40,
        }}>
          {[
            { label: "Deployments Today", val: "14,832", delta: "+3.2%" },
            { label: "Avg Latency", val: "1.4ms", delta: "↓ 8%" },
            { label: "Active Regions", val: "42", delta: "global" },
          ].map(c => (
            <div key={c.label} style={{ background: G.gray1, border: `1px solid ${G.gray2}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: G.fontMono, fontSize: 9, color: G.gray4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.label}</div>
              <div style={{ fontFamily: G.fontDisplay, fontWeight: 700, fontSize: 20, color: G.white, margin: "5px 0 3px" }}>{c.val}</div>
              <div style={{ fontFamily: G.fontMono, fontSize: 10, color: G.accent }}>{c.delta}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function Stats() {
  const [stats, setStats] = useState([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    api.getStats().then(setStats);
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: isMobile ? "50px 20px" : "70px clamp(20px,5vw,80px)",
      borderTop: `1px solid ${G.gray2}`, borderBottom: `1px solid ${G.gray2}`,
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
        gap: isMobile ? 32 : 20,
        maxWidth: 900, margin: "0 auto",
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.6s ease ${i * 0.1}s`,
          }}>
            <div style={{ fontFamily: G.fontDisplay, fontWeight: 800, fontSize: isMobile ? 32 : 44, color: G.white, letterSpacing: "-0.03em" }}>
              {s.value}<span style={{ color: G.accent, fontSize: isMobile ? 24 : 32 }}>{s.suffix}</span>
            </div>
            <div style={{ fontFamily: G.fontBody, fontSize: 13, color: G.gray5, marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
function Products() {
  const { isMobile } = useBreakpoint();
  const products = [
    { icon: "⬡", name: "Chromo Cloud", tag: "Infrastructure", desc: "Globally distributed cloud compute with sub-2ms inter-region latency and automated scaling.", features: ["48 global PoPs", "Auto-scaling to millions", "Bare metal option"] },
    { icon: "◈", name: "Chromo AI", tag: "Intelligence", desc: "Embedded AI APIs for production workloads — inference, fine-tuning, and vector search at scale.", features: ["GPU clusters on-demand", "LLM gateway", "RAG-ready vector DB"], highlight: true },
    { icon: "⬢", name: "Chromo Edge", tag: "Edge Computing", desc: "Deploy logic at the edge in milliseconds. Serverless functions with global instant propagation.", features: ["< 5ms cold start", "V8 isolates", "KV storage at edge"] },
    { icon: "◉", name: "Chromo Ops", tag: "Observability", desc: "Full-stack monitoring, distributed tracing, and anomaly detection powered by ML.", features: ["Real-time dashboards", "AI-driven alerts", "Incident automation"] },
  ];

  return (
    <section style={{ padding: isMobile ? "70px 20px" : "100px clamp(20px,5vw,80px)", position: "relative" }}>
      <GlowDot x="50%" y="0" size={isMobile ? 300 : 500} />

      <div style={{ textAlign: "center", marginBottom: isMobile ? 44 : 64, position: "relative", zIndex: 1 }}>
        <Tag>Products</Tag>
        <h2 style={{
          fontFamily: G.fontDisplay, fontWeight: 800,
          fontSize: isMobile ? 30 : "clamp(32px,5vw,56px)",
          color: G.white, letterSpacing: "-0.03em", margin: "18px 0 14px",
        }}>Everything you need to scale</h2>
        <p style={{ fontFamily: G.fontBody, fontSize: isMobile ? 14 : 17, color: G.gray5, maxWidth: 460, margin: "0 auto", padding: "0 10px" }}>
          One platform. Infinite scale. Zero compromise on performance or reliability.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 18, maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1,
      }}>
        {products.map(p => (
          <div key={p.name} style={{
            background: p.highlight ? "linear-gradient(135deg, rgba(0,255,136,0.07), rgba(0,200,100,0.03))" : G.gray1,
            border: `1px solid ${p.highlight ? "rgba(0,255,136,0.25)" : G.gray2}`,
            borderRadius: 16, padding: isMobile ? "24px 20px" : "32px 28px",
            position: "relative", overflow: "hidden", transition: "transform 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {p.highlight && (
              <div style={{
                position: "absolute", top: 14, right: 14,
                fontFamily: G.fontMono, fontSize: 10, color: G.black,
                background: G.accent, padding: "3px 10px", borderRadius: 4,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Popular</div>
            )}
            <div style={{ fontSize: 28, marginBottom: 14 }}>{p.icon}</div>
            <Tag>{p.tag}</Tag>
            <h3 style={{ fontFamily: G.fontDisplay, fontWeight: 700, fontSize: 22, color: G.white, margin: "12px 0 8px", letterSpacing: "-0.02em" }}>{p.name}</h3>
            <p style={{ fontFamily: G.fontBody, fontSize: 14, color: G.gray5, lineHeight: 1.65, marginBottom: 20 }}>{p.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontFamily: G.fontBody, fontSize: 13, color: G.gray4, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: G.accent }}>→</span>{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const { isMobile, isTablet } = useBreakpoint();
  const timeline = [
    { year: "2016", event: "Founded in Bangalore by ex-Google & Microsoft engineers" },
    { year: "2018", event: "Series A — $40M to build global edge network" },
    { year: "2020", event: "Chromo AI launched — 10k developers in 30 days" },
    { year: "2022", event: "Series C — $280M. Expanded to 42 global regions" },
    { year: "2024", event: "1M+ developers. $1B ARR milestone reached" },
    { year: "2026", event: "Chromo Edge 4.0 and real-time AI inference platform" },
  ];

  return (
    <section style={{ padding: isMobile ? "70px 20px" : "100px clamp(20px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <GlowDot x="-10%" y="30%" size={400} color="#4040FF" opacity={0.04} />

      <div style={{
        display: "flex",
        flexDirection: isMobile || isTablet ? "column" : "row",
        gap: isMobile ? 48 : 80,
        alignItems: "flex-start",
        maxWidth: 1100, margin: "0 auto",
      }}>
        {/* Left */}
        <div style={{ flex: "1 1 340px", width: "100%" }}>
          <Tag>Our Story</Tag>
          <h2 style={{
            fontFamily: G.fontDisplay, fontWeight: 800,
            fontSize: isMobile ? 28 : "clamp(28px,4vw,48px)",
            color: G.white, letterSpacing: "-0.03em", margin: "18px 0 20px",
          }}>
            Built by engineers,<br />for engineers
          </h2>
          <p style={{ fontFamily: G.fontBody, fontSize: isMobile ? 14 : 16, color: G.gray5, lineHeight: 1.8, marginBottom: 16 }}>
            Chromosoft Technology was born from frustration. Our founders spent years fighting unreliable infrastructure,
            opaque pricing, and developer tooling that felt like it was designed by committee.
          </p>
          <p style={{ fontFamily: G.fontBody, fontSize: isMobile ? 14 : 16, color: G.gray5, lineHeight: 1.8 }}>
            We built the platform we always wanted — transparent, blazing fast, and genuinely developer-first.
            Today we power 840+ enterprise teams and over a million individual developers worldwide.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: isMobile ? 28 : 40, flexWrap: "wrap" }}>
            {[{ n: "42", l: "Regions" }, { n: "1M+", l: "Developers" }, { n: "12", l: "Yrs Experience" }].map(x => (
              <div key={x.l}>
                <div style={{ fontFamily: G.fontDisplay, fontWeight: 800, fontSize: isMobile ? 26 : 32, color: G.accent }}>{x.n}</div>
                <div style={{ fontFamily: G.fontBody, fontSize: 13, color: G.gray5, marginTop: 4 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Timeline */}
        <div style={{ flex: "1 1 320px", width: "100%" }}>
          <h3 style={{ fontFamily: G.fontDisplay, fontWeight: 700, fontSize: 20, color: G.white, marginBottom: 28, letterSpacing: "-0.02em" }}>Milestones</h3>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 38, top: 8, bottom: 8, width: 1, background: G.gray2 }} />
            {timeline.map(t => (
              <div key={t.year} style={{ display: "flex", gap: 18, marginBottom: 24, alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: G.fontMono, fontSize: 10, color: G.black, background: G.accent,
                  padding: "4px 6px", borderRadius: 4, minWidth: 40, textAlign: "center",
                  position: "relative", zIndex: 1, fontWeight: 600, flexShrink: 0,
                }}>{t.year}</div>
                <p style={{ fontFamily: G.fontBody, fontSize: 13, color: G.gray5, lineHeight: 1.6, margin: "3px 0 0" }}>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const { isMobile } = useBreakpoint();

  useEffect(() => { api.getTestimonials().then(setTestimonials); }, []);
  if (!testimonials.length) return null;

  return (
    <section style={{
      padding: isMobile ? "70px 20px" : "100px clamp(20px,5vw,80px)",
      background: G.gray1, borderTop: `1px solid ${G.gray2}`, borderBottom: `1px solid ${G.gray2}`,
    }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 60 }}>
        <Tag>Testimonials</Tag>
        <h2 style={{
          fontFamily: G.fontDisplay, fontWeight: 800,
          fontSize: isMobile ? 28 : "clamp(28px,4vw,48px)",
          color: G.white, letterSpacing: "-0.03em", margin: "18px 0",
        }}>Trusted by builders</h2>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", padding: isMobile ? "0" : "0 20px" }}>
        <div style={{ position: "relative", minHeight: isMobile ? 200 : 160 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              position: "absolute", inset: 0,
              opacity: active === i ? 1 : 0,
              transform: active === i ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.5s ease",
              pointerEvents: active === i ? "auto" : "none",
              padding: isMobile ? "0 10px" : 0,
            }}>
              <p style={{
                fontFamily: G.fontBody,
                fontSize: isMobile ? 15 : "clamp(16px,2.2vw,20px)",
                color: G.white, lineHeight: 1.7, fontWeight: 300, fontStyle: "italic",
              }}>"{t.text}"</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: isMobile ? 16 : 24, flexWrap: "wrap" }}>
          {testimonials.map((t, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              opacity: active === i ? 1 : 0.35, transition: "opacity 0.3s",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: active === i ? G.accent : G.gray3,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: G.fontDisplay, fontWeight: 700, fontSize: 13,
                color: active === i ? G.black : G.gray5,
              }}>{t.avatar}</div>
              <div style={{ fontFamily: G.fontBody, fontSize: 12, color: G.white, fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontFamily: G.fontBody, fontSize: 11, color: G.gray5 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch { setStatus("error"); }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "#0a0a0e", border: `1px solid ${G.gray2}`,
    borderRadius: 8, padding: "13px 16px", color: G.white,
    fontFamily: G.fontBody, fontSize: 14, outline: "none",
    transition: "border-color 0.2s", WebkitAppearance: "none",
  };

  return (
    <section style={{ padding: isMobile ? "70px 20px" : "100px clamp(20px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <GlowDot x="70%" y="20%" size={400} />

      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex",
        flexDirection: isMobile || isTablet ? "column" : "row",
        gap: isMobile ? 48 : 72,
        alignItems: "flex-start",
      }}>
        {/* Left info */}
        <div style={{ flex: "1 1 300px", width: "100%" }}>
          <Tag>Contact Sales</Tag>
          <h2 style={{
            fontFamily: G.fontDisplay, fontWeight: 800,
            fontSize: isMobile ? 28 : "clamp(28px,4vw,46px)",
            color: G.white, letterSpacing: "-0.03em", margin: "18px 0 18px",
            lineHeight: 1.15,
          }}>
            Let's build something<br />
            <span style={{ color: G.accent }}>extraordinary</span>
          </h2>
          <p style={{ fontFamily: G.fontBody, fontSize: isMobile ? 14 : 16, color: G.gray5, lineHeight: 1.7 }}>
            Whether you're scaling a startup or modernizing enterprise infrastructure — our team is ready to help.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "✉", label: "hello@chromosoft.com" },
              { icon: "📍", label: "Bangalore · San Francisco · London · Singapore" },
              { icon: "⏱", label: "Response within 2 business hours" },
            ].map(i => (
              <div key={i.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 17, lineHeight: 1.5 }}>{i.icon}</span>
                <span style={{ fontFamily: G.fontBody, fontSize: 14, color: G.gray5, lineHeight: 1.5 }}>{i.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{
          flex: "1 1 380px", width: "100%",
          background: G.gray1, border: `1px solid ${G.gray2}`,
          borderRadius: 16, padding: isMobile ? "28px 20px" : "40px 36px",
        }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontFamily: G.fontDisplay, fontWeight: 700, fontSize: 24, color: G.accent }}>Message Sent!</h3>
              <p style={{ fontFamily: G.fontBody, fontSize: 15, color: G.gray5, marginTop: 12 }}>We'll be in touch within 2 business hours.</p>
              <Btn s={{ marginTop: 24 }} onClick={() => setStatus(null)}>Send Another</Btn>
            </div>
          ) : (
            <>
              {/* Name + Email row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 14, marginBottom: 14,
              }}>
                {[["name", "Full Name"], ["email", "Work Email"]].map(([k, ph]) => (
                  <input key={k} placeholder={ph} value={form[k]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = G.accent}
                    onBlur={e => e.target.style.borderColor = G.gray2}
                  />
                ))}
              </div>
              <input placeholder="Company Name" value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                style={{ ...inputStyle, marginBottom: 14 }}
                onFocus={e => e.target.style.borderColor = G.accent}
                onBlur={e => e.target.style.borderColor = G.gray2}
              />
              <textarea placeholder="Tell us about your project..." value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={isMobile ? 4 : 5}
                style={{ ...inputStyle, resize: "vertical", marginBottom: 18 }}
                onFocus={e => e.target.style.borderColor = G.accent}
                onBlur={e => e.target.style.borderColor = G.gray2}
              />
              {status === "error" && (
                <p style={{ fontFamily: G.fontBody, fontSize: 13, color: "#FF5555", marginBottom: 12 }}>
                  Please fill in email and message fields.
                </p>
              )}
              <Btn fullWidth onClick={handleSubmit}>
                {loading ? "Sending..." : "Send Message →"}
              </Btn>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setSection }) {
  const { isMobile } = useBreakpoint();
  const cols = [
    { title: "Products", links: ["Chromo Cloud", "Chromo AI", "Chromo Edge", "Chromo Ops"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { title: "Developers", links: ["Documentation", "API Reference", "Status", "Community"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "DPA", "Security"] },
  ];

  return (
    <footer style={{ borderTop: `1px solid ${G.gray2}`, padding: isMobile ? "48px 20px 32px" : "64px clamp(20px,5vw,80px) 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr 1fr",
          gap: isMobile ? 32 : 24,
          marginBottom: isMobile ? 40 : 60,
        }}>
          {/* Brand */}
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ fontFamily: G.fontDisplay, fontWeight: 800, fontSize: 22, color: G.white, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Chromo<span style={{ color: G.accent }}>soft</span>
            </div>
            <p style={{ fontFamily: G.fontBody, fontSize: 13, color: G.gray5, lineHeight: 1.7, maxWidth: 220 }}>
              The developer-first cloud platform powering the next generation of technology.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(c => (
            <div key={c.title}>
              <h4 style={{ fontFamily: G.fontBody, fontWeight: 500, fontSize: 12, color: G.gray5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>{c.title}</h4>
              {c.links.map(l => (
                <div key={l} style={{ fontFamily: G.fontBody, fontSize: 13, color: G.gray4, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = G.white}
                  onMouseLeave={e => e.target.style.color = G.gray4}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${G.gray2}`, paddingTop: 24,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 10,
        }}>
          <div style={{ fontFamily: G.fontBody, fontSize: 12, color: G.gray4 }}>© 2026 Chromosoft Technology. All rights reserved.</div>
          <div style={{ fontFamily: G.fontMono, fontSize: 10, color: G.gray4 }}>BLR · SFO · LHR · SIN · NYC · SYD</div>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("home");

  useEffect(() => { injectFonts(); }, []);

  useEffect(() => {
    const el = document.getElementById(`section-${section}`);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [section]);

  return (
    <div style={{ background: G.black, minHeight: "100vh", color: G.white, overflowX: "hidden" }}>
      <Nav activeSection={section} setSection={setSection} />
      <div id="section-home"><Hero setSection={setSection} /></div>
      <Stats />
      <div id="section-products"><Products /></div>
      <div id="section-about"><About /></div>
      <div id="section-testimonials"><Testimonials /></div>
      <div id="section-contact"><Contact /></div>
      <Footer setSection={setSection} />
    </div>
  );
}
