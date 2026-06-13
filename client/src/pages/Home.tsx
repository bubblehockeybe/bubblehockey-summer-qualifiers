/**
 * Design: Rétro Arcade 8-bit Néon
 * Fond noir #0a0a0f, cyan électrique #00f5ff, rouge arcade #ff2d55, jaune score #ffd700
 * Press Start 2P pour titres, Space Mono pour corps
 * Bordures pixel, scan lines, effets néon, compteurs animés
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { QualifiedTeam, NewsItem } from "./Admin";

const QUALIFIED_TEAMS_KEY = "bh_qualified_teams";
const NEWS_KEY = "bh_news";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031771759/Wc8SEqmDGnz6gpuB6cLXPf/superchexx-pixel-v5-R5XxknNrFEABU2QuNQtBMD.webp";
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
      {/* Coins pixel */}
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
      {/* Fond étoilé */}
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
    const t = setInterval(() => setVisible((v) => !v), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={className} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.05s" }}>
      {children}
    </span>
  );
}

// Compteur animé
function SpritePlayer({ frames, glowColor, delay }: { frames: string[]; glowColor: string; delay: number }) {
  const [frameIdx, setFrameIdx] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setFrameIdx(i => (i + 1) % frames.length);
      }, 180);
      return () => clearInterval(interval);
    }, delay * 100);
    return () => clearTimeout(t);
  }, [frames.length, delay]);
  return (
    <img
      src={frames[frameIdx]}
      alt="sprite"
      style={{
        width: 110,
        height: 103,
        imageRendering: "pixelated",
        filter: `drop-shadow(0 0 14px ${glowColor})`,
      }}
    />
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 40);
    return () => clearInterval(t);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

const timelineSteps = [
  { num: "01", label: "5 JUILLET 2026", badge: "INSERT COIN", title: "LANCEMENT", desc: "Premiere soiree. Entrainement gratuit, puis premiers matchs de qualification. Tous les dimanches soir a partir de maintenant.", color: "#00f5ff" },
  { num: "02", label: "JUILLET - AOUT", badge: "LEVEL UP", title: "QUALIFICATIONS", desc: "Chaque dimanche soir, meme format : entrainement gratuit puis matchs payants. 15 EUR la 1re fois, 10 EUR ensuite.", color: "#ff2d55" },
  { num: "03", label: "30 AOUT 2026", badge: "LAST CHANCE", title: "DERNIERE CHANCE", desc: "Dernier dimanche de qualification avant la finale. Les places restantes se jouent ici.", color: "#ffd700" },
  { num: "04", label: "12-13 SEPT 2026", badge: "FINAL BOSS", title: "GRANDE FINALE", desc: "16 equipes, 4 pools, playoffs. Le champion de Bruxelles sera couronné.", color: "#ffd700" },
];

const sessionDates = [
  { date: "05/07", label: "DIM 5 JUILLET", key: "d0507" },
  { date: "12/07", label: "DIM 12 JUILLET", key: "d1207" },
  { date: "19/07", label: "DIM 19 JUILLET", key: "d1907" },
  { date: "26/07", label: "DIM 26 JUILLET", key: "d2607" },
  { date: "02/08", label: "DIM 2 AOUT", key: "d0208" },
  { date: "09/08", label: "DIM 9 AOUT", key: "d0908" },
  { date: "16/08", label: "DIM 16 AOUT", key: "d1608" },
  { date: "23/08", label: "DIM 23 AOUT", key: "d2308" },
  { date: "30/08", label: "DIM 30 AOUT", key: "d3008" },
];

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

const sessionSteps = [
  { icon: "🎮", time: "5-10 MIN", title: "ACCUEIL", desc: "Présentation, règles expliquées en 2 minutes. Tout le monde est le bienvenu.", free: true },
  { icon: "🏒", time: "15-20 MIN", title: "ENTRAINEMENT", desc: "Parties libres, coaching sur place. Revenez autant de fois que vous voulez.", free: true },
  { icon: "🏆", time: "30-45 MIN", title: "MATCHS QUALIF", desc: "2 à 4 matchs comptant pour le classement. 15 EUR (1re tentative) ou 10 EUR (suivantes).", free: false },
  { icon: "📊", time: "5-10 MIN", title: "CLASSEMENT", desc: "Scores du soir annoncés. Les qualifiés pour la finale sont notifiés.", free: false },
];

const faqItems = [
  { q: "ON NE CONNAIT PAS LE JEU. ON PEUT VENIR ?", a: "Oui, et c'est fait pour ca. L'entrainement du debut de soiree est gratuit et ouvert a tous. Vous apprenez les regles en 2 minutes, vous jouez des parties libres avec du coaching, et vous decidez ensuite si vous voulez tenter votre qualification." },
  { q: "C'EST GRATUIT OU PAYANT ?", a: "L'accueil et l'entrainement sont 100% gratuits. Vous pouvez revenir autant de dimanches que vous voulez sans payer. Les matchs de qualification coutent 15 EUR pour votre premiere tentative, puis 10 EUR pour chaque tentative suivante." },
  { q: "ON DOIT ETRE DEUX POUR VENIR ?", a: "Pour les matchs de qualification, oui : le bubble hockey se joue en equipe de deux. Pour l'entrainement gratuit, vous pouvez venir seul. On peut aussi vous trouver un partenaire sur place selon les disponibilites." },
  { q: "QUAND CA SE PASSE ?", a: "Tous les dimanches soir du 5 juillet au 30 aout 2026, a partir de 19h00. Au Brussels Pinball Museum, 1501 chaussee de Wavre, 1160 Auderghem. La grande finale aura lieu les 12 et 13 septembre 2026." },
  { q: "COMMENT ON SE QUALIFIE ?", a: "Chaque dimanche, les equipes presentes s'affrontent en matchs BO3 (premier a 2 victoires). En general, les 2 meilleures equipes de la soiree decrochent leur ticket finale. Exception : si seulement 2 equipes sont presentes, seule la gagnante est qualifiee. Si vous n'etes pas qualifie, revenez le dimanche suivant pour 10 EUR. 16 equipes en tout seront qualifiees pour la grande finale." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [sessionType, setSessionType] = useState("qualification");
  const [sessionDate, setSessionDate] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);

  // Equipes qualifiees depuis admin
  const [qualifiedTeams, setQualifiedTeams] = useState<QualifiedTeam[]>(() => {
    try { return JSON.parse(localStorage.getItem(QUALIFIED_TEAMS_KEY) || "[]"); } catch { return []; }
  });

  // News depuis admin
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(NEWS_KEY) || "[]"); } catch { return []; }
  });

  // Ecouter les changements localStorage (mise a jour depuis onglet admin)
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

  // Heatmap : votes par date (localStorage)
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

  const handleSubmit = () => {
    if (!teamName.trim() || !playerEmail.trim() || !rulesAccepted) return;
    const subject = encodeURIComponent(`Inscription Bubble Hockey - ${teamName}`);
    const typeLabel = sessionType === 'qualification' ? 'Session de qualification (15 EUR - paiement sur place)' : 'Session decouverte (gratuit - entrainement)';
    const dateLabel = sessionDate || 'Non precisee';
    const body = encodeURIComponent(
      `Nom de l'equipe : ${teamName}\nEmail : ${playerEmail}\nDate souhaitee : ${dateLabel}\nType : ${typeLabel}\n\nNous souhaitons participer aux Bubble Hockey Summer Qualifiers 2026.\n\nNote : le paiement se fait sur place. La place est confirmee apres reglement.`
    );
    window.location.href = `mailto:brusselspinballmuseum@gmail.com?subject=${subject}&body=${body}`;
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
      {/* Fond pattern hockey tuilé */}
      <PixelBackground />

      {/* Scan lines overlay plus prononcees */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.13) 3px, rgba(0,0,0,0.13) 4px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Bruit CRT leger */}
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
        <div className="hidden md:flex gap-8">
          {["LE JEU", "SESSIONS", "CALENDRIER", ...(newsItems.length > 0 ? ["NEWS"] : []), "HALL OF FAME", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item === "LE JEU" ? "lejeu" : item.toLowerCase().replace(/ /g, "")}`}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.5rem",
                color: item === "NEWS" ? "#ffd700" : "#00f5ff",
                textDecoration: "none",
                letterSpacing: "0.1em",
                ...(item === "NEWS" ? { textShadow: "0 0 8px #ffd70088" } : {}),
              }}
              className="hover:text-yellow-300 transition-colors"
            >
              {item === "NEWS" ? "\u2605 NEWS" : item}
            </a>
          ))}
        </div>

        {/* Bouton S'inscrire (desktop) + burger (mobile) */}
        <div className="flex items-center gap-3">
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
              S'INSCRIRE
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
          {["LE JEU", "SESSIONS", "CALENDRIER", ...(newsItems.length > 0 ? ["NEWS"] : []), "HALL OF FAME", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item === "LE JEU" ? "lejeu" : item.toLowerCase().replace(/ /g, "")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.55rem",
                color: item === "NEWS" ? "#ffd700" : "#00f5ff",
                textDecoration: "none",
                letterSpacing: "0.1em",
                padding: "14px 20px",
                borderBottom: "1px solid #00f5ff11",
                display: "block",
              }}
            >
              {item === "NEWS" ? "\u2605 NEWS" : item}
            </a>
          ))}
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
            ▶ S'INSCRIRE
          </a>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-6 overflow-hidden" style={{ minHeight: "auto" }}>
        {/* Assombrissement central du hero pour lisibilite */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,8,28,0.55) 0%, rgba(10,8,28,0.3) 50%, rgba(10,8,28,0.6) 100%)" }} />

        {/* Layout principal : texte centre pleine largeur */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
              {/* Titre style glitch blanc avec ombre rouge+bleue comme l'image de référence */}
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(1.4rem, 5vw, 3.4rem)",
                lineHeight: 1.2,
                color: "#ffffff",
                textShadow: "-3px 0 #ff2d55, 3px 0 #00f5ff, 0 0 20px rgba(255,255,255,0.3)",
                marginBottom: "0.2rem",
                letterSpacing: "0.05em",
              }}>BUBBLE HOCKEY</div>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(1.4rem, 5vw, 3.4rem)",
                lineHeight: 1.2,
                color: "#ffffff",
                textShadow: "-3px 0 #ff2d55, 3px 0 #00f5ff, 0 0 20px rgba(255,255,255,0.3)",
                marginBottom: "0.5rem",
                letterSpacing: "0.05em",
              }}>SUMMER QUALIFIERS</div>
              {/* Sous-titre jaune vif style SUMMER ON ICE */}
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(0.8rem, 2.5vw, 1.6rem)",
                color: "#ffd700",
                textShadow: "0 0 16px #ffd700, 0 0 30px #ff8800",
                letterSpacing: "0.12em",
                marginBottom: "0.3rem",
              }}>BRUSSELS 2026</div>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "clamp(0.45rem, 1.2vw, 0.7rem)",
                color: "#cc44ff",
                letterSpacing: "0.35em",
                marginBottom: "1.2rem",
              }}>HOSTED BY BRUSSELS PINBALL MUSEUM</div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#a0a0c0", lineHeight: 1.9, maxWidth: "500px", margin: "0 auto 1.5rem" }}
            >
              Chaque dimanche soir au Brussels Pinball Museum.
              Entrainement gratuit, puis qualifications.{" "}
              <span style={{ color: "#ffd700" }}>Grande finale les 12 et 13 septembre 2026.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-3 justify-center mb-4"
            >
              <a href="#inscription">
                <button style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", background: "#ff2d55", color: "#fff", border: "3px solid #ff2d55", padding: "12px 20px", cursor: "pointer", boxShadow: "0 0 14px #ff2d55, 4px 4px 0 #8b0000", letterSpacing: "0.05em" }}
                  className="hover:brightness-110 active:scale-95 transition-all">
                  ▶ S'INSCRIRE
                </button>
              </a>
              <a href="#lejeu">
                <button style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", background: "transparent", color: "#00f5ff", border: "3px solid #00f5ff", padding: "12px 20px", cursor: "pointer", boxShadow: "0 0 14px #00f5ff44, 4px 4px 0 #003344", letterSpacing: "0.05em" }}
                  className="hover:bg-cyan-950 active:scale-95 transition-all">
                  ? C'EST QUOI LE JEU
                </button>
              </a>
            </motion.div>


          </div>
        </div>

        {/* Barre inferieure : compteur + stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="relative z-10 mt-6 w-full max-w-3xl px-4"
        >
          <div style={{ border: "2px solid #ffd700", background: "#ffd70008", padding: "10px 16px", boxShadow: "0 0 12px #ffd70055" }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", color: "#ffd700", letterSpacing: "0.12em", marginBottom: "4px" }}>PLACES FINALE</div>
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
              { label: "1RE TENTATIVE", value: "15€" },
              { label: "TENTATIVES SUIV.", value: "10€" },
              { label: "GRANDE FINALE", value: "12-13/09" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-3" style={{ border: "2px solid #00f5ff22", background: "#00f5ff06" }}>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.8rem, 2vw, 1.4rem)", color: "#ffd700", textShadow: "0 0 8px #ffd700" }}>{stat.value}</div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: "#606080", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── C'EST QUOI ── */}
      <section id="lejeu" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, rgba(10,10,15,0.96) 0%, rgba(13,10,31,0.96) 50%, rgba(10,10,15,0.96) 100%)" }}>
        {/* Motif losanges pixel */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,245,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            C'EST QUOI<br />LE BUBBLE HOCKEY ?
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p style={{ fontSize: "0.75rem", lineHeight: 2.2, color: "#a0a0c0", marginBottom: "1.5rem" }}>
                Le bubble hockey, c'est un hockey sur table sous dôme de plexiglas. Deux joueurs par équipe, des figurines articulées, un palet et beaucoup d'adrénaline.
              </p>
              <p style={{ fontSize: "0.75rem", lineHeight: 2.2, color: "#a0a0c0", marginBottom: "2rem" }}>
                Le Brussels Pinball Museum possede l'une des rares machines de bubble hockey en Belgique. Le jeu est simple a comprendre, difficile a maitriser : exactement ce qu'il faut pour un tournoi estival.
              </p>
              <div className="flex flex-wrap gap-3">
                {["EQUIPES DE 2", "DEBUTANTS OK", "15€ / EQUIPE", "COACHING INCLUS"].map((tag) => (
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
                alt="Bubble hockey pixel art"
                className="w-full object-cover"
                style={{ display: "block", imageRendering: "pixelated" }}
              />
            </PixelBorder>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="calendrier" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(180deg, rgba(10,10,15,0.96) 0%, rgba(10,16,32,0.96) 40%, rgba(16,10,10,0.96) 100%)", borderTop: "2px solid #ff2d5533", borderBottom: "2px solid #ff2d5533" }}>
        {/* Grille rouge subtile */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,45,85,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,85,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "3rem", lineHeight: 1.6 }}>
            UN ETE POUR APPRENDRE.<br />12-13 SEPT POUR GAGNER.
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
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#606080", marginBottom: "4px", letterSpacing: "0.1em" }}>
                        {step.label}
                      </div>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.75rem", color: step.color, marginBottom: "8px", textShadow: `0 0 8px ${step.color}` }}>
                        {step.title}
                      </div>
                      <p style={{ fontSize: "0.7rem", color: "#a0a0c0", lineHeight: 2 }}>{step.desc}</p>
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
        {/* Motif croix pixel vert */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,255,136,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "3rem", lineHeight: 1.6 }}>
            UNE SOIREE, DEUX PHASES.
          </h2>
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span style={{ background: "#00f5ff", color: "#0a0a0f", fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", padding: "4px 8px" }}>GRATUIT</span>
              <span style={{ fontSize: "0.65rem", color: "#a0a0c0" }}>Accueil + entrainement - revenez autant de fois que vous voulez</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ background: "#ff2d55", color: "#fff", fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", padding: "4px 8px" }}>PAYANT</span>
              <span style={{ fontSize: "0.65rem", color: "#a0a0c0" }}>Matchs de qualification - 15 EUR (1re fois) / 10 EUR (suivantes)</span>
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
                      {item.free ? "GRATUIT" : "PAYANT"}
                    </div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", marginBottom: "6px" }}>{item.time}</div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: item.free ? "#00f5ff" : "#ff2d55", marginBottom: "8px", textShadow: `0 0 6px ${item.free ? "#00f5ff" : "#ff2d55"}` }}>{item.title}</div>
                    <p style={{ fontSize: "0.6rem", color: "#808090", lineHeight: 1.8 }}>{item.desc}</p>
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
            TOUS LES DIMANCHES SOIR
          </h2>
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1.5rem", marginTop: "-1.5rem" }}>
            JUILLET &amp; AOÛT 2026
          </div>
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-start gap-3">
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.8rem", color: "#ff2d55" }}>&#9201;</span>
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#00f5ff", marginBottom: "4px" }}>HEURE</div>
                <div style={{ fontSize: "0.7rem", color: "#a0a0c0" }}>A partir de 19h00</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.8rem", color: "#ff2d55" }}>&#9679;</span>
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#00f5ff", marginBottom: "4px" }}>LIEU</div>
                <a
                  href="https://maps.google.com/?q=1501+chaussee+de+wavre+1160+Auderghem+Bruxelles"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.7rem", color: "#ffd700", textDecoration: "none" }}
                  className="hover:underline"
                >
                  Brussels Pinball Museum<br />
                  <span style={{ color: "#a0a0c0" }}>1501 chaussee de Wavre, 1160 Auderghem</span>
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
                      {isLastChance ? "LAST CHANCE" : s.label.split(" ").slice(2).join(" ")}
                    </div>
                    {count > 0 && (
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: isLastChance ? "#ff2d55" : "#00f5ff" }}>
                        {count} {count === 1 ? "EQUIPE" : "EQUIPES"}
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
                      {voted ? "OK !" : "PARTICIPE"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", border: "2px solid #ffd700", padding: "4px 10px", background: "#ffd70011" }}>GRANDE FINALE</span>
            <span style={{ fontSize: "0.65rem", color: "#a0a0c0" }}>12 et 13 septembre 2026</span>
          </div>
        </div>
      </section>

      {/* ── QUALIFICATION ── */}
      <section className="py-20 px-4" style={{ background: "rgba(8,8,18,0.99)", borderTop: "2px solid #ff2d5533", borderBottom: "2px solid #ff2d5533" }}>
        <div className="max-w-5xl mx-auto">

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ff2d55", textShadow: "0 0 12px #ff2d55", marginBottom: "3rem", lineHeight: 1.6 }}>
            CHAQUE SOIR,<br />2 EQUIPES SE QUALIFIENT.
          </h2>
          <p style={{ fontSize: "0.7rem", color: "#a0a0c0", lineHeight: 2.2, marginBottom: "2.5rem" }}>
            Les equipes presentes ce soir-la s'affrontent entre elles en matchs BO3 (premier a 2 victoires). Les 2 meilleures equipes decrochent leur ticket finale. Exception : si seulement 2 equipes sont presentes, seule la gagnante est qualifiee. Les autres peuvent revenir le dimanche suivant pour 10 EUR.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { icon: "🏆", title: "2 QUALIFIES PAR SOIREE", desc: "Chaque dimanche, les 2 meilleures equipes de la soiree decrochent leur ticket finale. Directement, sans leaderboard.", color: "#ffd700" },
              { icon: "🔄", title: "RETENTER SA CHANCE", desc: "Pas qualifie ce soir ? Revenez le dimanche suivant pour 10 EUR. Autant de fois que vous voulez jusqu'au 30 aout.", color: "#00f5ff" },
              { icon: "⚡", title: "LAST CHANCE - 30 AOUT", desc: "Dernier dimanche de qualification. Les places restantes pour la finale se jouent ce soir-la.", color: "#ff2d55" },
              { icon: "🏖️", title: "GRANDE FINALE", desc: "16 equipes qualifiees, 4 pools, matchs en BO3. Le champion de Bruxelles est couronné les 12 et 13 septembre.", color: "#ffd700" },
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
                      <p style={{ fontSize: "0.65rem", color: "#a0a0c0", lineHeight: 2 }}>{item.desc}</p>
                    </div>
                  </div>
                </PixelBorder>
              </motion.div>
            ))}
          </div>

          {/* Barème */}
          <PixelBorder color="#ffd700">
            <div className="p-6" style={{ background: "#ffd70008" }}>
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ffd700", marginBottom: "1rem", letterSpacing: "0.15em" }}>
                ★ BAREME DES POINTS ★
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "VICTOIRE", pts: "3 PTS", color: "#ffd700" },
                  { label: "EGALITE", pts: "1 PT", color: "#00f5ff" },
                  { label: "DEFAITE", pts: "0 PT", color: "#606080" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#a0a0c0" }}>{r.label}</span>
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
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>

              <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                LA GRANDE FINALE<br />12 ET 13 SEPTEMBRE.
              </h2>
              <div className="space-y-4">
                {[
                  { num: "01", title: "POOLS", desc: "4 groupes de 4 equipes. Chaque match en BO3. Les 2 meilleures de chaque pool passent." },
                  { num: "02", title: "QUARTS DE FINALE", desc: "8 equipes, elimination directe en BO3." },
                  { num: "03", title: "DEMI-FINALES", desc: "4 equipes, elimination directe en BO3." },
                  { num: "04", title: "GRANDE FINALE", desc: "Les 2 finalistes s'affrontent en BO3. Le champion de Bruxelles est couronné." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "1.2rem", color: "#ff2d55", textShadow: "0 0 10px #ff2d55", minWidth: "40px" }}>
                      {item.num}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", color: "#00f5ff", marginBottom: "4px" }}>{item.title}</div>
                      <p style={{ fontSize: "0.65rem", color: "#808090", lineHeight: 2 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <PixelBorder color="#ffd700">
                <img src={TROPHY_IMG} alt="Trophée pixel art" className="w-full max-w-xs" style={{ imageRendering: "pixelated" }} />
              </PixelBorder>
              <div className="text-center">
                <BlinkText>
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ffd700", textShadow: "0 0 10px #ffd700" }}>
                    ★ CHAMPION DE BRUXELLES ★
                  </div>
                </BlinkText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HALL OF FAME ── */}
      <section id="halloffame" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, rgba(10,10,15,0.96) 0%, rgba(26,15,0,0.96) 50%, rgba(10,10,15,0.96) 100%)", borderTop: "2px solid #ffd70033", borderBottom: "2px solid #ffd70033" }}>
        {/* Motif etoiles pixel */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,215,0,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#ffd700", textShadow: "0 0 20px #ffd700, 0 0 40px #ffd70055", marginBottom: "0.5rem" }}>
            HALL OF FAME
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#888", marginBottom: "3rem" }}>
            Les equipes qui ont decroché leur ticket pour la grande finale des 12 et 13 septembre 2026.
          </p>

          {/* Etat vide */}
          {qualifiedTeams.length === 0 && (
            <div style={{ border: "2px solid #ffd70033", background: "#ffd70008", padding: "3rem 2rem", textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem", filter: "grayscale(0.3)" }}>🏆</div>
              <BlinkText>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.7rem", color: "#ffd700", letterSpacing: "0.15em", textShadow: "0 0 10px #ffd700" }}>
                  AUCUN QUALIFIE POUR L'INSTANT
                </div>
              </BlinkText>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#555", marginTop: "1.5rem" }}>
                La premiere soiree de qualification a lieu le dimanche 5 juillet 2026.
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#555", marginTop: "0.5rem" }}>
                2 equipes se qualifieront chaque dimanche soir.
              </div>
            </div>
          )}

          {/* Grille des 16 slots */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => {
              const team = qualifiedTeams.find((t) => t.slot === i + 1);
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
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: team ? "#ffd70099" : "#ffd70044", marginBottom: "6px" }}>SLOT {String(i + 1).padStart(2, "0")}</div>
                  {team ? (
                    <>
                      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.45rem", color: "#ffd700", textShadow: "0 0 6px #ffd700", lineHeight: 1.6, wordBreak: "break-word" }}>{team.name}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: "#606080", marginTop: "4px" }}>{team.date}</div>
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
              {qualifiedTeams.length} / 16 places attribuees{qualifiedTeams.length < 16 ? " · Prochaine session : 5 juillet 2026" : " · TABLEAU COMPLET !"}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      {newsItems.length > 0 && (
        <section id="news" className="py-16 px-4" style={{ background: "rgba(10,10,20,0.96)", borderTop: "2px solid #00f5ff33", borderBottom: "2px solid #00f5ff22" }}>
          <div className="max-w-3xl mx-auto">
            <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2rem", lineHeight: 1.6 }}>
              NEWS
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
                          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", color: "#ffd700", border: "1px solid #ffd700", padding: "2px 6px" }}>EPINGLE</span>
                        )}
                        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", color: n.pinned ? "#ffd700" : "#00f5ff" }}>{n.title}</span>
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#404060", whiteSpace: "nowrap" }}>{n.date}</span>
                    </div>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#a0a0c0", lineHeight: 2, whiteSpace: "pre-wrap" }}>{n.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="faq" className="py-20 px-4" style={{ background: "rgba(13,13,26,0.96)", borderTop: "2px solid #00f5ff22" }}>
        <div className="max-w-3xl mx-auto">

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            TOUT CE QUE VOUS<br />VOULEZ SAVOIR.
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
                    <div className="px-5 pb-5" style={{ fontSize: "0.65rem", color: "#a0a0c0", lineHeight: 2.2, borderTop: "1px solid #ffd70033", paddingTop: "12px" }}>
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
        {/* Grille jaune subtile */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px)", backgroundSize: "36px 36px", zIndex: 0 }} />
        <div className="max-w-2xl mx-auto text-center">

          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ff2d55", textShadow: "0 0 16px #ff2d55", marginBottom: "1rem", lineHeight: 1.6 }}>
            INSCRIS TON EQUIPE.
          </h2>
          <p style={{ fontSize: "0.7rem", color: "#808090", lineHeight: 2.2, marginBottom: "2.5rem" }}>
            Inscription en ligne ci-dessous. Paiement sur place le soir de votre session.<br />
            Votre place est confirmee apres reglement : 15 EUR pour la 1re qualification, 10 EUR ensuite. Entrainement gratuit.
          </p>

          <PixelBorder color="#ff2d55">
              <div className="p-8 text-left" style={{ background: "#ff2d5508" }}>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>
                      NOM DE L'EQUIPE
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Ex: Les Pucherons"
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
                      EMAIL
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
                    DATE SOUHAITEE
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
                    <option value="" style={{ background: "#0a0a1f" }}>-- CHOISIR UNE DATE --</option>
                    <option value="Dimanche 5 juillet" style={{ background: "#0a0a1f" }}>DIMANCHE 5 JUILLET</option>
                    <option value="Dimanche 12 juillet" style={{ background: "#0a0a1f" }}>DIMANCHE 12 JUILLET</option>
                    <option value="Dimanche 19 juillet" style={{ background: "#0a0a1f" }}>DIMANCHE 19 JUILLET</option>
                    <option value="Dimanche 26 juillet" style={{ background: "#0a0a1f" }}>DIMANCHE 26 JUILLET</option>
                    <option value="Dimanche 2 aout" style={{ background: "#0a0a1f" }}>DIMANCHE 2 AOÛT</option>
                    <option value="Dimanche 9 aout" style={{ background: "#0a0a1f" }}>DIMANCHE 9 AOÛT</option>
                    <option value="Dimanche 16 aout" style={{ background: "#0a0a1f" }}>DIMANCHE 16 AOÛT</option>
                    <option value="Dimanche 23 aout" style={{ background: "#0a0a1f" }}>DIMANCHE 23 AOÛT</option>
                    <option value="Dimanche 30 aout (derniere chance)" style={{ background: "#0a0a1f" }}>DIMANCHE 30 AOÛT — DERNIERE CHANCE</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    TYPE D'INSCRIPTION
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
                    <option value="qualification" style={{ background: "#0a0a1f" }}>SESSION DE QUALIFICATION (15 EUR)</option>
                    <option value="decouverte" style={{ background: "#0a0a1f" }}>SESSION DECOUVERTE (GRATUIT)</option>
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
                    J'ai lu et j'accepte les{" "}
                    <a
                      href="#faq"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: "#00f5ff", textDecoration: "underline" }}
                    >
                      règles du tournoi
                    </a>
                    {" "}avant de m'inscrire.
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
                  ▶ S'INSCRIRE EN LIGNE
                </button>
                <p style={{ fontSize: "0.55rem", color: "#606080", textAlign: "center", marginTop: "12px", lineHeight: 1.8 }}>
                  Paiement sur place le soir de la session. Votre place est reservee apres reglement.
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
          BUBBLE HOCKEY SUMMER QUALIFIERS
        </div>
        <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#404060", marginBottom: "0.5rem" }}>
          BRUSSELS PINBALL MUSEUM - ETE 2026
        </div>
        <div style={{ fontSize: "0.6rem", color: "#404060", marginBottom: "1rem" }}>
          1501 chaussee de Wavre, 1160 Auderghem &nbsp;|&nbsp; Dimanches a partir de 19h00
        </div>
        <a
          href="https://bubblehockey.be"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#606080" }}
          className="hover:text-cyan-400 transition-colors"
        >
          bubblehockey.be
        </a>
        <div className="mt-6">
          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#303050" }}>
            © 2026 BUBBLE HOCKEY SUMMER QUALIFIERS
          </span>
        </div>
      </footer>
    </div>
  );
}
