/**
 * Design: Rétro Arcade 8-bit Néon
 * Fond noir #0a0a0f, cyan électrique #00f5ff, rouge arcade #ff2d55, jaune score #ffd700
 * Press Start 2P pour titres, Space Mono pour corps
 * Bordures pixel, scan lines, effets néon, compteurs animés
 * i18n: FR/EN via lib/i18n.ts
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { QualifiedTeam, NewsItem } from "./Admin";
import { type Lang, t } from "@/lib/i18n";

const QUALIFIED_TEAMS_KEY = "bh_qualified_teams";
const NEWS_KEY = "bh_news";
const LANG_KEY = "bh_lang";

const HERO_IMG =
  "/manus-storage/superchexx-photo_de614c0e.png";
const TROPHY_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031771759/Wc8SEqmDGnz6gpuB6cLXPf/pixel-trophy-8bit-PXBreF3SdxXKf2sKpDiC4Z.webp";

// Composant bordure pixel style arcade
function PixelBorder({ children, color = "#00f5ff", className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        border: `3px solid ${color}`,
        boxShadow: `0 0 8px ${color}, inset 0 0 8px ${color}22`,
        imageRendering: "pixelated",
      }}
    >
      <div className="absolute -top-1 -left-1 w-3 h-3" style={{ background: color }} />
      <div className="absolute -top-1 -right-1 w-3 h-3" style={{ background: color }} />
      <div className="absolute -bottom-1 -left-1 w-3 h-3" style={{ background: color }} />
      <div className="absolute -bottom-1 -right-1 w-3 h-3" style={{ background: color }} />
      {children}
    </div>
  );
}

// Fond avec grille isometrique et etoiles pixel
function PixelBackground() {
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url('/manus-storage/stars-bg-large_32012ab9.jpg')`,
        backgroundRepeat: "repeat",
        backgroundSize: "2400px 2400px",
        opacity: 0.35,
      }} />
    </div>
  );
}

// Particules pixel flottantes
function PixelParticles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: [4, 6, 8][Math.floor(Math.random() * 3)],
    color: ["#00f5ff", "#ff2d55", "#ffd700", "#00ff88"][Math.floor(Math.random() * 4)],
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
  }));
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 1 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            imageRendering: "pixelated",
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// Texte qui clignote style arcade
function BlinkText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const ti = setInterval(() => setVisible((v) => !v), 600);
    return () => clearInterval(ti);
  }, []);
  return (
    <span className={className} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.05s" }}>
      {children}
    </span>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const ti = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(ti); }
      else setCount(start);
    }, 40);
    return () => clearInterval(ti);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

// Sélecteur de langue inline (pour nav desktop)
function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center" style={{ gap: "2px" }}>
      {(["fr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.45rem",
            padding: "5px 8px",
            background: lang === l ? "#ffd700" : "transparent",
            color: lang === l ? "#0a0a0f" : "#ffd70088",
            border: `2px solid ${lang === l ? "#ffd700" : "#ffd70033"}`,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.15s",
            lineHeight: 1,
          }}
          className="active:scale-95"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// Sélecteur de langue pour le menu mobile (plus grand)
function LangSwitcherMobile({ lang, setLang, onClose }: { lang: Lang; setLang: (l: Lang) => void; onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 20px",
        borderBottom: "1px solid #00f5ff11",
      }}
    >
      <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#ffd70066", letterSpacing: "0.1em", marginRight: "4px" }}>
        LANG:
      </span>
      {(["fr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => { setLang(l); onClose(); }}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.55rem",
            padding: "7px 12px",
            background: lang === l ? "#ffd700" : "transparent",
            color: lang === l ? "#0a0a0f" : "#ffd70088",
            border: `2px solid ${lang === l ? "#ffd700" : "#ffd70033"}`,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.15s",
          }}
          className="active:scale-95"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// Heatmap helpers
const HEAT_STORAGE_KEY = "bh_heat_votes";
const HEAT_VOTED_KEY = "bh_heat_voted";

function getHeatColor(count: number, max: number): string {
  if (count === 0 || max === 0) return "transparent";
  const ratio = count / max;
  if (ratio < 0.25) return "rgba(0,245,255,0.08)";
  if (ratio < 0.5) return "rgba(0,245,255,0.18)";
  if (ratio < 0.75) return "rgba(255,165,0,0.22)";
  return "rgba(255,45,85,0.30)";
}

function getHeatBorder(count: number, max: number): string {
  if (count === 0 || max === 0) return "#00f5ff33";
  const ratio = count / max;
  if (ratio < 0.25) return "#00f5ff66";
  if (ratio < 0.5) return "#00f5ffaa";
  if (ratio < 0.75) return "#ffa500cc";
  return "#ff2d55";
}

function getHeatGlow(count: number, max: number): string {
  if (count === 0 || max === 0) return "none";
  const ratio = count / max;
  if (ratio < 0.25) return "0 0 6px #00f5ff44";
  if (ratio < 0.5) return "0 0 10px #00f5ff88";
  if (ratio < 0.75) return "0 0 14px #ffa500aa";
  return "0 0 18px #ff2d55cc";
}

export default function Home() {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem(LANG_KEY) as Lang) || "fr"; } catch { return "fr"; }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [sessionType, setSessionType] = useState("qualification");
  const [sessionDate, setSessionDate] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const [qualifiedTeams, setQualifiedTeams] = useState<QualifiedTeam[]>(() => {
    try { return JSON.parse(localStorage.getItem(QUALIFIED_TEAMS_KEY) || "[]"); } catch { return []; }
  });

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(NEWS_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    const handler = () => {
      try {
        setQualifiedTeams(JSON.parse(localStorage.getItem(QUALIFIED_TEAMS_KEY) || "[]"));
        setNewsItems(JSON.parse(localStorage.getItem(NEWS_KEY) || "[]"));
      } catch {}
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const [heatVotes, setHeatVotes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(HEAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  const [heatVoted, setHeatVoted] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(HEAT_VOTED_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  const handleHeatVote = useCallback((key: string) => {
    if (heatVoted[key]) return;
    const newVotes = { ...heatVotes, [key]: (heatVotes[key] || 0) + 1 };
    const newVoted = { ...heatVoted, [key]: true };
    setHeatVotes(newVotes);
    setHeatVoted(newVoted);
    try {
      localStorage.setItem(HEAT_STORAGE_KEY, JSON.stringify(newVotes));
      localStorage.setItem(HEAT_VOTED_KEY, JSON.stringify(newVoted));
    } catch {}
  }, [heatVotes, heatVoted]);

  const maxHeat = Math.max(1, ...Object.values(heatVotes));

  const PLACES_TOTALES = 16;
  const PLACES_PRISES = qualifiedTeams.length;
  const placesRestantes = PLACES_TOTALES - PLACES_PRISES;

  // Données dynamiques traduites
  const timelineSteps = [
    { num: "01", label: t(lang, "timeline_label1"), badge: t(lang, "timeline_badge1"), title: t(lang, "timeline_title1"), desc: t(lang, "timeline_desc1"), color: "#00f5ff" },
    { num: "02", label: t(lang, "timeline_label2"), badge: t(lang, "timeline_badge2"), title: t(lang, "timeline_title2"), desc: t(lang, "timeline_desc2"), color: "#ff2d55" },
    { num: "03", label: t(lang, "timeline_label3"), badge: t(lang, "timeline_badge3"), title: t(lang, "timeline_title3"), desc: t(lang, "timeline_desc3"), color: "#ffd700" },
    { num: "04", label: t(lang, "timeline_label4"), badge: t(lang, "timeline_badge4"), title: t(lang, "timeline_title4"), desc: t(lang, "timeline_desc4"), color: "#ffd700" },
  ];

  const sessionDates = [
    { date: "05/07", label: t(lang, "date_jul5"), key: "d0507" },
    { date: "12/07", label: t(lang, "date_jul12"), key: "d1207" },
    { date: "19/07", label: t(lang, "date_jul19"), key: "d1907" },
    { date: "26/07", label: t(lang, "date_jul26"), key: "d2607" },
    { date: "02/08", label: t(lang, "date_aug2"), key: "d0208" },
    { date: "09/08", label: t(lang, "date_aug9"), key: "d0908" },
    { date: "16/08", label: t(lang, "date_aug16"), key: "d1608" },
    { date: "23/08", label: t(lang, "date_aug23"), key: "d2308" },
    { date: "30/08", label: t(lang, "date_aug30"), key: "d3008" },
  ];

  const sessionSteps = [
    { icon: "🎮", time: "5-10 MIN", title: t(lang, "session_step1_title"), desc: t(lang, "session_step1_desc"), free: true },
    { icon: "🏒", time: "15-20 MIN", title: t(lang, "session_step2_title"), desc: t(lang, "session_step2_desc"), free: true },
    { icon: "🏆", time: "30-45 MIN", title: t(lang, "session_step3_title"), desc: t(lang, "session_step3_desc"), free: false },
    { icon: "📊", time: "5-10 MIN", title: t(lang, "session_step4_title"), desc: t(lang, "session_step4_desc"), free: false },
  ];

  const faqItems = [
    { q: t(lang, "faq_q1"), a: t(lang, "faq_a1") },
    { q: t(lang, "faq_q2"), a: t(lang, "faq_a2") },
    { q: t(lang, "faq_q3"), a: t(lang, "faq_a3") },
    { q: t(lang, "faq_q4"), a: t(lang, "faq_a4") },
    { q: t(lang, "faq_q5"), a: t(lang, "faq_a5") },
  ];

  const navItems = [
    { key: t(lang, "nav_lejeu"), anchor: "lejeu" },
    { key: t(lang, "nav_sessions"), anchor: "sessions" },
    { key: t(lang, "nav_calendrier"), anchor: "calendrier" },
    ...(newsItems.length > 0 ? [{ key: t(lang, "nav_news"), anchor: "news" }] : []),
    { key: t(lang, "nav_halloffame"), anchor: "halloffame" },
    { key: t(lang, "nav_faq"), anchor: "faq" },
  ];

  const handleSubmit = () => {
    if (!teamName.trim() || !playerEmail.trim() || !rulesAccepted) return;
    const subject = encodeURIComponent(`${t(lang, "email_subject")} - ${teamName}`);
    const typeLabel = sessionType === "qualification" ? t(lang, "email_type_qualif") : t(lang, "email_type_deco");
    const dateLabel = sessionDate || (lang === "fr" ? "Non precisee" : "Not specified");
    const body = encodeURIComponent(
      `${t(lang, "email_team")} : ${teamName}\n${t(lang, "email_email")} : ${playerEmail}\n${t(lang, "email_date")} : ${dateLabel}\n${t(lang, "email_type")} : ${typeLabel}\n\n${t(lang, "email_body")}`
    );
    const mailtoLink = `mailto:brusselspinballmuseum@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
    setTimeout(() => { window.location.href = mailtoLink; }, 300);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0a0a0f",
        color: "#e0e0e0",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <PixelBackground />

      {/* Scan lines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.13) 3px, rgba(0,0,0,0.13) 4px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Bruit CRT */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 49,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          background: "#0a0a0f",
          borderBottom: "2px solid #00f5ff",
          boxShadow: "0 0 12px #00f5ff55",
        }}
      >
        <img
          src="/manus-storage/logo-bpm-transparent_9782de99.png"
          alt="Brussels Pinball Museum"
          style={{ height: "40px", width: "auto", imageRendering: "auto", filter: "brightness(1.1)" }}
        />
        <div className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.anchor}`}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.5rem",
                color: item.anchor === "news" ? "#ffd700" : "#00f5ff",
                textDecoration: "none",
                letterSpacing: "0.1em",
                ...(item.anchor === "news" ? { textShadow: "0 0 8px #ffd70088" } : {}),
              }}
              className="hover:text-yellow-300 transition-colors"
            >
              {item.anchor === "news" ? `\u2605 ${item.key}` : item.key}
            </a>
          ))}
        </div>

        {/* Bouton S'inscrire (desktop) + sélecteur langue + burger (mobile) */}
        <div className="flex items-center gap-3">
          {/* Sélecteur langue desktop */}
          <div className="hidden md:flex">
            <LangSwitcher lang={lang} setLang={setLang} />
          </div>
          <a href="#inscription" className="hidden md:block">
            <button
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.5rem",
                background: "#ff2d55",
                color: "#fff",
                border: "2px solid #ff2d55",
                padding: "8px 14px",
                cursor: "pointer",
                boxShadow: "0 0 10px #ff2d55",
                letterSpacing: "0.05em",
              }}
              className="hover:bg-red-400 transition-colors active:scale-95"
            >
              {t(lang, "nav_inscrire")}
            </button>
          </a>
          {/* Burger button mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#ffd700" : "#00f5ff", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#ffd700" : "#00f5ff", transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#ffd700" : "#00f5ff", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Menu mobile deroulant */}
      {menuOpen && (
        <div
          className="fixed top-[58px] left-0 right-0 z-40 md:hidden flex flex-col"
          style={{ background: "#0a0a0f", borderBottom: "2px solid #00f5ff", boxShadow: "0 8px 24px #00f5ff22" }}
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.anchor}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.55rem",
                color: item.anchor === "news" ? "#ffd700" : "#00f5ff",
                textDecoration: "none",
                letterSpacing: "0.1em",
                padding: "14px 20px",
                borderBottom: "1px solid #00f5ff11",
                display: "block",
              }}
            >
              {item.anchor === "news" ? `\u2605 ${item.key}` : item.key}
            </a>
          ))}
          {/* Sélecteur langue dans le burger */}
          <LangSwitcherMobile lang={lang} setLang={setLang} onClose={() => setMenuOpen(false)} />
          <a
            href="#inscription"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.55rem",
              background: "#ff2d55",
              color: "#fff",
              textDecoration: "none",
              letterSpacing: "0.1em",
              padding: "14px 20px",
              display: "block",
              textAlign: "center",
            }}
          >
            ▶ {t(lang, "nav_inscrire")}
          </a>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-6 overflow-hidden" style={{ minHeight: "auto" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,8,28,0.55) 0%, rgba(10,8,28,0.3) 50%, rgba(10,8,28,0.6) 100%)" }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(1.4rem, 5vw, 3.4rem)",
                lineHeight: 1.2,
                color: "#ffffff",
                textShadow: "-3px 0 #ff2d55, 3px 0 #00f5ff, 0 0 20px rgba(255,255,255,0.3)",
                marginBottom: "0.2rem",
                letterSpacing: "0.05em",
              }}>{t(lang, "hero_title1")}</div>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(1.4rem, 5vw, 3.4rem)",
                lineHeight: 1.2,
                color: "#ffffff",
                textShadow: "-3px 0 #ff2d55, 3px 0 #00f5ff, 0 0 20px rgba(255,255,255,0.3)",
                marginBottom: "0.5rem",
                letterSpacing: "0.05em",
              }}>{t(lang, "hero_title2")}</div>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(0.8rem, 2.5vw, 1.6rem)",
                color: "#ffd700",
                textShadow: "0 0 16px #ffd700, 0 0 30px #ff8800",
                letterSpacing: "0.12em",
                marginBottom: "0.3rem",
              }}>{t(lang, "hero_subtitle")}</div>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(0.45rem, 1.2vw, 0.7rem)",
                color: "#cc44ff",
                letterSpacing: "0.35em",
                marginBottom: "1.2rem",
              }}>{t(lang, "hero_hosted")}</div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#d0d0e0", lineHeight: 1.9, maxWidth: "500px", margin: "0 auto 1.5rem" }}
            >
              {t(lang, "hero_desc1")}{" "}
              {t(lang, "hero_desc2")}{" "}
              <span style={{ color: "#ffd700" }}>{t(lang, "hero_finale")}</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-3 justify-center mb-4"
            >
              <a href="#inscription">
                <button style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", background: "#ff2d55", color: "#fff", border: "3px solid #ff2d55", padding: "12px 20px", cursor: "pointer", boxShadow: "0 0 14px #ff2d55, 4px 4px 0 #8b0000", letterSpacing: "0.05em" }}
                  className="hover:brightness-110 active:scale-95 transition-all">
                  {t(lang, "hero_btn_inscrire")}
                </button>
              </a>
              <a href="#lejeu">
                <button style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", background: "transparent", color: "#00f5ff", border: "3px solid #00f5ff", padding: "12px 20px", cursor: "pointer", boxShadow: "0 0 14px #00f5ff44, 4px 4px 0 #003344", letterSpacing: "0.05em" }}
                  className="hover:bg-cyan-950 active:scale-95 transition-all">
                  {t(lang, "hero_btn_lejeu")}
                </button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Barre inférieure : compteur + stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="relative z-10 mt-6 w-full max-w-3xl px-4"
        >
          <div style={{ border: "2px solid #ffd700", background: "#ffd70008", padding: "10px 16px", boxShadow: "0 0 12px #ffd70055" }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", color: "#ffd700", letterSpacing: "0.12em", marginBottom: "4px" }}>{t(lang, "hero_places_label")}</div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2.5vw, 1.3rem)", color: placesRestantes <= 4 ? "#ff2d55" : "#ffd700", textShadow: `0 0 10px ${placesRestantes <= 4 ? "#ff2d55" : "#ffd700"}` }}>
                  {placesRestantes} / {PLACES_TOTALES}
                </div>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {Array.from({ length: PLACES_TOTALES }).map((_, i) => (
                  <div key={i} style={{ width: "12px", height: "12px", background: i < PLACES_PRISES ? "#303040" : "#ffd700", boxShadow: i < PLACES_PRISES ? "none" : "0 0 4px #ffd700" }} />
                ))}
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: t(lang, "hero_stat1_label"), value: "15€" },
              { label: t(lang, "hero_stat2_label"), value: "10€" },
              { label: t(lang, "hero_stat3_label"), value: "12-13/09" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-3" style={{ border: "2px solid #00f5ff22", background: "#00f5ff06" }}>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.8rem, 2vw, 1.4rem)", color: "#ffd700", textShadow: "0 0 8px #ffd700" }}>{stat.value}</div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: "#9090b0", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── C'EST QUOI ── */}
      <section id="lejeu" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, rgba(10,10,15,0.96) 0%, rgba(13,10,31,0.96) 50%, rgba(10,10,15,0.96) 100%)" }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,245,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            {t(lang, "lejeu_title").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p style={{ fontSize: "0.75rem", lineHeight: 2.2, color: "#d0d0e0", marginBottom: "1.5rem" }}>
                {t(lang, "lejeu_p1")}
              </p>
              <p style={{ fontSize: "0.75rem", lineHeight: 2.2, color: "#d0d0e0", marginBottom: "2rem" }}>
                {t(lang, "lejeu_p2")}
              </p>
              <div className="flex flex-wrap gap-3">
                {([t(lang, "lejeu_tag1"), t(lang, "lejeu_tag2"), t(lang, "lejeu_tag3"), t(lang, "lejeu_tag4")] as string[]).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: "0.4rem",
                      color: "#ffd700",
                      border: "2px solid #ffd700",
                      padding: "6px 10px",
                      background: "#ffd70011",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <PixelBorder color="#ff2d55">
              <img
                src={HERO_IMG}
                alt="Bubble hockey"
                className="w-full object-cover"
                style={{ display: "block", imageRendering: "auto" }}
              />
            </PixelBorder>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="calendrier" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(180deg, rgba(10,10,15,0.96) 0%, rgba(10,16,32,0.96) 40%, rgba(16,10,10,0.96) 100%)", borderTop: "2px solid #ff2d5533", borderBottom: "2px solid #ff2d5533" }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,45,85,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,85,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "3rem", lineHeight: 1.6 }}>
            {t(lang, "timeline_title").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div className="space-y-6">
            {timelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <PixelBorder color={step.color}>
                  <div className="p-5 flex flex-col sm:flex-row gap-4 items-start" style={{ background: `${step.color}08` }}>
                    <div className="flex-shrink-0 text-center" style={{ minWidth: "80px" }}>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "1.8rem", color: step.color, textShadow: `0 0 12px ${step.color}` }}>
                        {step.num}
                      </div>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: step.color, marginTop: "4px", letterSpacing: "0.1em" }}>
                        {step.badge}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#9090b0", marginBottom: "4px", letterSpacing: "0.1em" }}>
                        {step.label}
                      </div>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.75rem", color: step.color, marginBottom: "8px", textShadow: `0 0 8px ${step.color}` }}>
                        {step.title}
                      </div>
                      <p style={{ fontSize: "0.7rem", color: "#d0d0e0", lineHeight: 2 }}>{step.desc}</p>
                    </div>
                  </div>
                </PixelBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMAT SESSIONS ── */}
      <section id="sessions" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, rgba(10,10,15,0.96) 0%, rgba(10,26,10,0.96) 50%, rgba(10,10,15,0.96) 100%)" }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,255,136,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "3rem", lineHeight: 1.6 }}>
            {t(lang, "sessions_title")}
          </h2>
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span style={{ background: "#00f5ff", color: "#0a0a0f", fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", padding: "4px 8px" }}>{t(lang, "sessions_gratuit")}</span>
              <span style={{ fontSize: "0.65rem", color: "#d0d0e0" }}>{t(lang, "sessions_gratuit_desc")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ background: "#ff2d55", color: "#fff", fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", padding: "4px 8px" }}>{t(lang, "sessions_payant")}</span>
              <span style={{ fontSize: "0.65rem", color: "#d0d0e0" }}>{t(lang, "sessions_payant_desc")}</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sessionSteps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PixelBorder color={item.free ? "#00f5ff" : "#ff2d55"}>
                  <div className="p-4 text-center" style={{ background: item.free ? "#00f5ff08" : "#ff2d5508" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{item.icon}</div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", padding: "3px 8px", marginBottom: "8px", display: "inline-block", background: item.free ? "#00f5ff" : "#ff2d55", color: item.free ? "#0a0a0f" : "#fff" }}>
                      {item.free ? t(lang, "sessions_gratuit") : t(lang, "sessions_payant")}
                    </div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", marginBottom: "6px" }}>{item.time}</div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: item.free ? "#00f5ff" : "#ff2d55", marginBottom: "8px", textShadow: `0 0 6px ${item.free ? "#00f5ff" : "#ff2d55"}` }}>{item.title}</div>
                    <p style={{ fontSize: "0.6rem", color: "#c0c0d0", lineHeight: 1.8 }}>{item.desc}</p>
                  </div>
                </PixelBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALENDRIER DATES ── */}
      <section id="calendrier-dates" className="py-16 px-4" style={{ position: "relative", background: "rgba(8,8,18,0.97)", borderTop: "2px solid #ffd70022", borderBottom: "2px solid #ffd70022" }}>
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "0.75rem", lineHeight: 1.6 }}>
            {t(lang, "calendrier_title")}
          </h2>
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1.5rem", marginTop: "-1.5rem" }}>
            {t(lang, "calendrier_subtitle")}
          </div>
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-start gap-3">
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.8rem", color: "#ff2d55" }}>&#9201;</span>
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#00f5ff", marginBottom: "4px" }}>{t(lang, "calendrier_heure_label")}</div>
                <div style={{ fontSize: "0.7rem", color: "#d0d0e0" }}>{t(lang, "calendrier_heure_val")}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.8rem", color: "#ffd700" }}>&#9679;</span>
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#00f5ff", marginBottom: "4px" }}>{t(lang, "calendrier_lieu_label")}</div>
                <a
                  href="https://maps.google.com/?q=1501+chaussee+de+wavre+1160+Auderghem+Bruxelles"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.7rem", color: "#ffd700", textDecoration: "none" }}
                  className="hover:underline"
                >
                  Brussels Pinball Museum<br />
                  <span style={{ color: "#d0d0e0" }}>1501 chaussee de Wavre, 1160 Auderghem</span>
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {sessionDates.map((s, i) => {
              const count = heatVotes[s.key] || 0;
              const voted = heatVoted[s.key] || false;
              const isLastChance = s.date === "30/08";
              const borderColor = isLastChance ? "#ff2d55" : getHeatBorder(count, maxHeat);
              const bgColor = isLastChance ? "#ff2d5511" : getHeatColor(count, maxHeat);
              const glowColor = isLastChance ? "0 0 8px #ff2d5555" : getHeatGlow(count, maxHeat);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="text-center py-3 px-2 flex flex-col gap-2"
                    style={{
                      border: `2px solid ${borderColor}`,
                      background: bgColor,
                      boxShadow: glowColor,
                      transition: "all 0.4s ease",
                    }}
                  >
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2vw, 1.3rem)", color: isLastChance ? "#ff2d55" : "#ffd700", textShadow: `0 0 8px ${isLastChance ? "#ff2d55" : "#ffd700"}` }}>
                      {s.date.split("/")[0]}
                    </div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: isLastChance ? "#ff2d55" : "#606080", letterSpacing: "0.05em" }}>
                      {isLastChance ? t(lang, "calendrier_lastchance") : s.label.split(" ").slice(lang === "fr" ? 2 : 1).join(" ")}
                    </div>
                    {count > 0 && (
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: isLastChance ? "#ff2d55" : "#00f5ff" }}>
                        {count} {count === 1 ? t(lang, "calendrier_equipe") : t(lang, "calendrier_equipes")}
                      </div>
                    )}
                    <button
                      onClick={() => handleHeatVote(s.key)}
                      disabled={voted}
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: "0.3rem",
                        padding: "4px 6px",
                        border: voted ? "1px solid #404060" : `1px solid ${isLastChance ? "#ff2d55" : "#00f5ff"}`,
                        background: voted ? "#ffffff0a" : isLastChance ? "#ff2d5511" : "#00f5ff11",
                        color: voted ? "#404060" : isLastChance ? "#ff2d55" : "#00f5ff",
                        cursor: voted ? "default" : "pointer",
                        transition: "all 0.2s",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {voted ? t(lang, "calendrier_vote_done") : t(lang, "calendrier_vote_btn")}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", border: "2px solid #ffd700", padding: "4px 10px", background: "#ffd70011" }}>{t(lang, "calendrier_finale_badge")}</span>
            <span style={{ fontSize: "0.65rem", color: "#d0d0e0" }}>{t(lang, "calendrier_finale_date")}</span>
          </div>
        </div>
      </section>

      {/* ── QUALIFICATION ── */}
      <section className="py-20 px-4" style={{ background: "rgba(8,8,18,0.99)", borderTop: "2px solid #ff2d5533", borderBottom: "2px solid #ff2d5533" }}>
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ff2d55", textShadow: "0 0 12px #ff2d55", marginBottom: "3rem", lineHeight: 1.6 }}>
            {t(lang, "qualif_title").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <p style={{ fontSize: "0.7rem", color: "#d0d0e0", lineHeight: 2.2, marginBottom: "2.5rem" }}>
            {t(lang, "qualif_desc")}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { icon: "🏆", title: t(lang, "qualif_card1_title"), desc: t(lang, "qualif_card1_desc"), color: "#ffd700" },
              { icon: "🔄", title: t(lang, "qualif_card2_title"), desc: t(lang, "qualif_card2_desc"), color: "#00f5ff" },
              { icon: "⚡", title: t(lang, "qualif_card3_title"), desc: t(lang, "qualif_card3_desc"), color: "#ff2d55" },
              { icon: "🏖️", title: t(lang, "qualif_card4_title"), desc: t(lang, "qualif_card4_desc"), color: "#ffd700" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PixelBorder color={item.color}>
                  <div className="p-5 flex gap-4 items-start" style={{ background: `${item.color}08` }}>
                    <span style={{ fontSize: "1.8rem" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", color: item.color, marginBottom: "8px", textShadow: `0 0 8px ${item.color}` }}>
                        {item.title}
                      </div>
                      <p style={{ fontSize: "0.65rem", color: "#d0d0e0", lineHeight: 2 }}>{item.desc}</p>
                    </div>
                  </div>
                </PixelBorder>
              </motion.div>
            ))}
          </div>

          <PixelBorder color="#ffd700">
            <div className="p-6" style={{ background: "#ffd70008" }}>
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ffd700", marginBottom: "1rem", letterSpacing: "0.15em" }}>
                {t(lang, "qualif_bareme")}
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: t(lang, "qualif_victoire"), pts: "3 PTS", color: "#ffd700" },
                  { label: t(lang, "qualif_egalite"), pts: "1 PT", color: "#00f5ff" },
                  { label: t(lang, "qualif_defaite"), pts: "0 PT", color: "#9090b0" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#d0d0e0" }}>{r.label}</span>
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.7rem", color: r.color, textShadow: `0 0 8px ${r.color}`, background: `${r.color}22`, padding: "4px 10px", border: `2px solid ${r.color}` }}>
                      {r.pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PixelBorder>
        </div>
      </section>

      {/* ── FORMAT FINALE ── */}
      <section className="py-20 px-4" style={{ background: "rgba(8,8,18,0.99)", borderTop: "2px solid #ffd70022" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                {t(lang, "finale_title").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
              <div className="space-y-4">
                {[
                  { num: "01", title: t(lang, "finale_step1_title"), desc: t(lang, "finale_step1_desc") },
                  { num: "02", title: t(lang, "finale_step2_title"), desc: t(lang, "finale_step2_desc") },
                  { num: "03", title: t(lang, "finale_step3_title"), desc: t(lang, "finale_step3_desc") },
                  { num: "04", title: t(lang, "finale_step4_title"), desc: t(lang, "finale_step4_desc") },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "1.2rem", color: "#ff2d55", textShadow: "0 0 10px #ff2d55", minWidth: "40px" }}>
                      {item.num}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", color: "#00f5ff", marginBottom: "4px" }}>{item.title}</div>
                      <p style={{ fontSize: "0.65rem", color: "#c0c0d0", lineHeight: 2 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <PixelBorder color="#ffd700">
                <img src={TROPHY_IMG} alt="Trophy" className="w-full max-w-xs" style={{ imageRendering: "pixelated" }} />
              </PixelBorder>
              <div className="text-center">
                <BlinkText>
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ffd700", textShadow: "0 0 10px #ffd700" }}>
                    {t(lang, "finale_champion")}
                  </div>
                </BlinkText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HALL OF FAME ── */}
      <section id="halloffame" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, rgba(10,10,15,0.96) 0%, rgba(26,15,0,0.96) 50%, rgba(10,10,15,0.96) 100%)", borderTop: "2px solid #ffd70033", borderBottom: "2px solid #ffd70033" }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,215,0,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#ffd700", textShadow: "0 0 20px #ffd700, 0 0 40px #ffd70055", marginBottom: "0.5rem" }}>
            {t(lang, "hof_title")}
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#888", marginBottom: "3rem" }}>
            {t(lang, "hof_subtitle")}
          </p>

          {qualifiedTeams.length === 0 && (
            <div style={{ border: "2px solid #ffd70033", background: "#ffd70008", padding: "3rem 2rem", textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem", filter: "grayscale(0.3)" }}>🏆</div>
              <BlinkText>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.7rem", color: "#ffd700", letterSpacing: "0.15em", textShadow: "0 0 10px #ffd700" }}>
                  {t(lang, "hof_empty")}
                </div>
              </BlinkText>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#555", marginTop: "1.5rem" }}>
                {t(lang, "hof_empty_date")}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#555", marginTop: "0.5rem" }}>
                {t(lang, "hof_empty_rythme")}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => {
              const team = qualifiedTeams.find((t2) => t2.slot === i + 1);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    border: team ? "2px solid #ffd700" : "2px solid #ffd70022",
                    background: team ? "#ffd70014" : "#ffd70006",
                    padding: "12px 8px",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: team ? "0 0 8px #ffd70055" : "none",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ position: "absolute", top: -2, left: -2, width: 6, height: 6, background: team ? "#ffd700" : "#ffd70033" }} />
                  <div style={{ position: "absolute", top: -2, right: -2, width: 6, height: 6, background: team ? "#ffd700" : "#ffd70033" }} />
                  <div style={{ position: "absolute", bottom: -2, left: -2, width: 6, height: 6, background: team ? "#ffd700" : "#ffd70033" }} />
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 6, height: 6, background: team ? "#ffd700" : "#ffd70033" }} />
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: team ? "#ffd70099" : "#ffd70044", marginBottom: "6px" }}>{t(lang, "hof_slot")} {String(i + 1).padStart(2, "0")}</div>
                  {team ? (
                    <>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#ffd700", textShadow: "0 0 6px #ffd700", lineHeight: 1.6, wordBreak: "break-word" }}>{team.name}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: "#888", marginTop: "4px" }}>{t(lang, "hof_qualified_on")} {team.date}</div>
                    </>
                  ) : (
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#2a2a3a" }}>???</div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#444" }}>
              {qualifiedTeams.length} / 16 {t(lang, "hof_places")}{qualifiedTeams.length < 16 ? ` · ${t(lang, "hof_next")}` : ` · ${t(lang, "hof_full")}`}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      {newsItems.length > 0 && (
        <section id="news" className="py-16 px-4" style={{ background: "rgba(10,10,20,0.96)", borderTop: "2px solid #00f5ff33", borderBottom: "2px solid #00f5ff22" }}>
          <div className="max-w-3xl mx-auto">
            <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2rem", lineHeight: 1.6 }}>
              {t(lang, "nav_news")}
            </h2>
            <div className="space-y-4">
              {[...newsItems].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div style={{ border: `2px solid ${n.pinned ? "#ffd70066" : "#00f5ff33"}`, background: n.pinned ? "#ffd70008" : "#00f5ff06", padding: "16px 20px" }}>
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {n.pinned && (
                          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", color: "#ffd700", border: "1px solid #ffd700", padding: "2px 6px" }}>
                            {lang === "fr" ? "EPINGLE" : "PINNED"}
                          </span>
                        )}
                        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", color: n.pinned ? "#ffd700" : "#00f5ff" }}>{n.title}</span>
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#404060", whiteSpace: "nowrap" }}>{n.date}</span>
                    </div>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#d0d0e0", lineHeight: 2, whiteSpace: "pre-wrap" }}>{n.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4" style={{ background: "rgba(13,13,26,0.96)", borderTop: "2px solid #00f5ff22" }}>
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            {t(lang, "faq_title").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <PixelBorder color={openFaq === i ? "#ffd700" : "#00f5ff44"}>
                  <button
                    className="w-full text-left p-5 flex items-start justify-between gap-4"
                    style={{ background: openFaq === i ? "#ffd70008" : "transparent", cursor: "pointer" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: openFaq === i ? "#ffd700" : "#00f5ff", lineHeight: 2 }}>
                      {item.q}
                    </span>
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.7rem", color: "#ffd700", flexShrink: 0 }}>
                      {openFaq === i ? "▲" : "▼"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5" style={{ fontSize: "0.65rem", color: "#d0d0e0", lineHeight: 2.2, borderTop: "1px solid #ffd70033", paddingTop: "12px" }}>
                      {item.a}
                    </div>
                  )}
                </PixelBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSCRIPTION ── */}
      <section id="inscription" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(180deg, rgba(10,10,15,0.96) 0%, rgba(26,10,15,0.96) 60%, rgba(10,10,15,0.96) 100%)" }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px)", backgroundSize: "36px 36px", zIndex: 0 }} />
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ff2d55", textShadow: "0 0 16px #ff2d55", marginBottom: "1rem", lineHeight: 1.6 }}>
            {t(lang, "inscription_title")}
          </h2>
          <p style={{ fontSize: "0.7rem", color: "#c0c0d0", lineHeight: 2.2, marginBottom: "2.5rem" }}>
            {t(lang, "inscription_desc").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </p>

          <PixelBorder color="#ff2d55">
            <div className="p-8 text-left" style={{ background: "#ff2d5508" }}>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    {t(lang, "inscription_label_team")}
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder={t(lang, "inscription_placeholder_team")}
                    style={{
                      width: "100%",
                      background: "#00000080",
                      border: "2px solid #00f5ff44",
                      color: "#e0e0e0",
                      padding: "10px 12px",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                    onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    {t(lang, "inscription_label_email")}
                  </label>
                  <input
                    type="email"
                    value={playerEmail}
                    onChange={(e) => setPlayerEmail(e.target.value)}
                    placeholder="votre@email.com"
                    style={{
                      width: "100%",
                      background: "#00000080",
                      border: "2px solid #00f5ff44",
                      color: "#e0e0e0",
                      padding: "10px 12px",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                    onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")}
                  />
                </div>
              </div>
              <div className="mb-5">
                <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>
                  {t(lang, "inscription_label_date")}
                </label>
                <select
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#00000080",
                    border: "2px solid #00f5ff44",
                    color: sessionDate ? "#e0e0e0" : "#606080",
                    padding: "10px 12px",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                  onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")}
                >
                  <option value="" style={{ background: "#0a0a1f" }}>{t(lang, "inscription_date_placeholder")}</option>
                  <option value="Dimanche 5 juillet" style={{ background: "#0a0a1f" }}>{t(lang, "date_jul5")}</option>
                  <option value="Dimanche 12 juillet" style={{ background: "#0a0a1f" }}>{t(lang, "date_jul12")}</option>
                  <option value="Dimanche 19 juillet" style={{ background: "#0a0a1f" }}>{t(lang, "date_jul19")}</option>
                  <option value="Dimanche 26 juillet" style={{ background: "#0a0a1f" }}>{t(lang, "date_jul26")}</option>
                  <option value="Dimanche 2 aout" style={{ background: "#0a0a1f" }}>{t(lang, "date_aug2")}</option>
                  <option value="Dimanche 9 aout" style={{ background: "#0a0a1f" }}>{t(lang, "date_aug9")}</option>
                  <option value="Dimanche 16 aout" style={{ background: "#0a0a1f" }}>{t(lang, "date_aug16")}</option>
                  <option value="Dimanche 23 aout" style={{ background: "#0a0a1f" }}>{t(lang, "date_aug23")}</option>
                  <option value="Dimanche 30 aout (derniere chance)" style={{ background: "#0a0a1f" }}>{t(lang, "date_aug30_opt")}</option>
                </select>
              </div>
              <div className="mb-6">
                <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>
                  {t(lang, "inscription_label_type")}
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#00000080",
                    border: "2px solid #00f5ff44",
                    color: "#e0e0e0",
                    padding: "10px 12px",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    outline: "none",
                  }}
                >
                  <option value="qualification" style={{ background: "#0a0a1f" }}>{t(lang, "inscription_type_qualif")}</option>
                  <option value="decouverte" style={{ background: "#0a0a1f" }}>{t(lang, "inscription_type_deco")}</option>
                </select>
              </div>
              {/* Case à cocher règles */}
              <div
                className="mb-5"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  background: rulesAccepted ? "#00f5ff08" : "#ff2d5508",
                  border: `2px solid ${rulesAccepted ? "#00f5ff44" : "#ff2d5544"}`,
                  padding: "12px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setRulesAccepted(!rulesAccepted)}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    minWidth: "18px",
                    border: `2px solid ${rulesAccepted ? "#00f5ff" : "#ff2d55"}`,
                    background: rulesAccepted ? "#00f5ff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                    transition: "all 0.15s",
                  }}
                >
                  {rulesAccepted && (
                    <span style={{ color: "#0a0a0f", fontSize: "12px", fontWeight: "bold", lineHeight: 1 }}>✓</span>
                  )}
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: rulesAccepted ? "#a0a0c0" : "#808090", lineHeight: 1.8 }}>
                  {t(lang, "inscription_rules")}{" "}
                  <a
                    href="#faq"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "#00f5ff", textDecoration: "underline" }}
                  >
                    {t(lang, "inscription_rules_link")}
                  </a>
                  {" "}{t(lang, "inscription_rules_after")}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!rulesAccepted}
                style={{
                  width: "100%",
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.6rem",
                  background: rulesAccepted ? "#ff2d55" : "#3a1a22",
                  color: rulesAccepted ? "#fff" : "#604050",
                  border: `3px solid ${rulesAccepted ? "#ff2d55" : "#3a1a22"}`,
                  padding: "14px",
                  cursor: rulesAccepted ? "pointer" : "not-allowed",
                  boxShadow: rulesAccepted ? "0 0 16px #ff2d55, 4px 4px 0 #8b0000" : "none",
                  letterSpacing: "0.05em",
                  transition: "all 0.2s",
                }}
                className="active:scale-95 transition-all"
              >
                {t(lang, "inscription_btn")}
              </button>
              <p style={{ fontSize: "0.55rem", color: "#9090b0", textAlign: "center", marginTop: "12px", lineHeight: 1.8 }}>
                {t(lang, "inscription_note")}
              </p>
            </div>
          </PixelBorder>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-10 px-4 text-center"
        style={{ background: "#050508", borderTop: "2px solid #00f5ff33" }}
      >
        <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#00f5ff", textShadow: "0 0 8px #00f5ff", marginBottom: "0.5rem" }}>
          {t(lang, "footer_title")}
        </div>
        <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#404060", marginBottom: "0.5rem" }}>
          {t(lang, "footer_sub")}
        </div>
        <div style={{ fontSize: "0.6rem", color: "#404060", marginBottom: "1rem" }}>
          {t(lang, "footer_addr")} &nbsp;|&nbsp; {t(lang, "footer_hours")}
        </div>
        <a
          href="https://bubblehockey.be"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#9090b0" }}
          className="hover:text-cyan-400 transition-colors"
        >
          bubblehockey.be
        </a>
        <div className="mt-6">
          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#303050" }}>
            {t(lang, "footer_copy")}
          </span>
        </div>
      </footer>
    </div>
  );
}
