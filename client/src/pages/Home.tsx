/**
 * Design: Rétro Arcade 8-bit Néon
 * Fond noir #0a0a0f, cyan électrique #00f5ff, rouge arcade #ff2d55, jaune score #ffd700
 * Press Start 2P pour titres, Space Mono pour corps
 * Bordures pixel, scan lines, effets néon, compteurs animés
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031771759/Wc8SEqmDGnz6gpuB6cLXPf/hero-8bit-arcade-NcEBc79PKd4aoiweZCR8tU.webp";
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
      {/* Grille perspective */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 30%, transparent 100%)",
      }} />
      {/* Vignette radiale */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
      }} />
      {/* Bande horizontale de lueur en bas */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "200px",
        background: "linear-gradient(to top, rgba(0,245,255,0.06), transparent)",
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
  { num: "04", label: "DEBUT SEPTEMBRE", badge: "FINAL BOSS", title: "GRANDE FINALE", desc: "16 equipes, 4 pools, playoffs. Le champion de Bruxelles sera couronné.", color: "#ffd700" },
];

const sessionDates = [
  { date: "05/07", label: "DIM 5 JUILLET" },
  { date: "12/07", label: "DIM 12 JUILLET" },
  { date: "19/07", label: "DIM 19 JUILLET" },
  { date: "26/07", label: "DIM 26 JUILLET" },
  { date: "02/08", label: "DIM 2 AOUT" },
  { date: "09/08", label: "DIM 9 AOUT" },
  { date: "16/08", label: "DIM 16 AOUT" },
  { date: "23/08", label: "DIM 23 AOUT" },
  { date: "30/08", label: "DIM 30 AOUT" },
];

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
  { q: "QUAND CA SE PASSE ?", a: "Tous les dimanches soir du 5 juillet au 30 aout 2026, a partir de 19h00. Au Brussels Pinball Museum, 1501 chaussee de Wavre, 1160 Auderghem. La grande finale aura lieu debut septembre, date exacte a confirmer." },
  { q: "COMMENT ON SE QUALIFIE ?", a: "Chaque dimanche, les equipes presentes s'affrontent en matchs BO3 (premier a 2 victoires). En general, les 2 meilleures equipes de la soiree decrochent leur ticket finale. Exception : si seulement 2 equipes sont presentes, seule la gagnante est qualifiee. Si vous n'etes pas qualifie, revenez le dimanche suivant pour 10 EUR. 16 equipes en tout seront qualifiees pour la grande finale." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [sessionType, setSessionType] = useState("qualification");

  const PLACES_TOTALES = 16;
  const PLACES_PRISES = 0; // Mettre a jour apres chaque soiree de qualification
  const placesRestantes = PLACES_TOTALES - PLACES_PRISES;

  const handleSubmit = () => {
    if (!teamName.trim() || !playerEmail.trim()) return;
    const subject = encodeURIComponent(`Inscription Bubble Hockey - ${teamName}`);
    const body = encodeURIComponent(
      `Nom de l'equipe : ${teamName}\nEmail : ${playerEmail}\nType : ${sessionType === 'qualification' ? 'Session de qualification (15 EUR)' : 'Session decouverte (gratuit)'}\n\nNous souhaitons participer aux Bubble Hockey Summer Qualifiers 2026.`
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
      {/* Fond pixel avec grille et particules */}
      <PixelBackground />
      <PixelParticles />

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
        <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.65rem", color: "#00f5ff", textShadow: "0 0 8px #00f5ff" }}>
          BH<span style={{ color: "#ff2d55" }}>▶</span>BXL
        </div>
        <div className="hidden md:flex gap-8">
          {["COMMENT", "SESSIONS", "CALENDRIER", "HALL OF FAME", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "")}`}
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#00f5ff", textDecoration: "none", letterSpacing: "0.1em" }}
              className="hover:text-yellow-300 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <a href="#inscription">
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
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        {/* Image hero en fond avec mix-blend */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})`, opacity: 0.18, mixBlendMode: "screen" }}
        />
        {/* Dégradé radial profond */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 40%, #0d0d2f 0%, #0a0a0f 75%)" }} />
        {/* Lignes horizontales de lueur arcade */}
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(0,245,255,0.025) 60px, rgba(0,245,255,0.025) 61px)",
        }} />
        {/* Bandes de couleur verticales tres subtiles */}
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,45,85,0.015) 80px, rgba(255,45,85,0.015) 81px)",
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ffd700", letterSpacing: "0.2em", marginBottom: "1.5rem", textShadow: "0 0 8px #ffd700" }}
            >
              ★ BRUSSELS PINBALL MUSEUM · ETE 2026 ★
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "clamp(1.4rem, 5vw, 3.5rem)",
              lineHeight: 1.4,
              color: "#00f5ff",
              textShadow: "0 0 20px #00f5ff, 0 0 40px #00f5ff55",
              marginBottom: "0.5rem",
            }}
          >
            BUBBLE HOCKEY
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "clamp(1.4rem, 5vw, 3.5rem)",
              lineHeight: 1.4,
              color: "#ff2d55",
              textShadow: "0 0 20px #ff2d55, 0 0 40px #ff2d5555",
              marginBottom: "0.5rem",
            }}
          >
            SUMMER
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "clamp(1.4rem, 5vw, 3.5rem)",
              lineHeight: 1.4,
              color: "#ffd700",
              textShadow: "0 0 20px #ffd700, 0 0 40px #ffd70055",
              marginBottom: "2rem",
            }}
          >
            QUALIFIERS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#a0a0c0", lineHeight: 2, maxWidth: "600px", margin: "0 auto 2.5rem" }}
          >
            Tout l'été, viens découvrir le bubble hockey au Brussels Pinball Museum.
            Entraîne-toi, qualifie ton équipe, et tente ta chance lors de la{" "}
            <span style={{ color: "#ffd700" }}>grande finale début septembre</span>.
            Débutants bienvenus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a href="#inscription">
              <button
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.6rem",
                  background: "#ff2d55",
                  color: "#fff",
                  border: "3px solid #ff2d55",
                  padding: "14px 24px",
                  cursor: "pointer",
                  boxShadow: "0 0 16px #ff2d55, 4px 4px 0 #8b0000",
                  letterSpacing: "0.05em",
                }}
                className="hover:brightness-110 active:scale-95 transition-all"
              >
                ▶ S'INSCRIRE
              </button>
            </a>
            <a href="#comment">
              <button
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.6rem",
                  background: "transparent",
                  color: "#00f5ff",
                  border: "3px solid #00f5ff",
                  padding: "14px 24px",
                  cursor: "pointer",
                  boxShadow: "0 0 16px #00f5ff55, 4px 4px 0 #003344",
                  letterSpacing: "0.05em",
                }}
                className="hover:bg-cyan-950 active:scale-95 transition-all"
              >
                ? COMMENT CA MARCHE
              </button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <BlinkText>
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ffd700" }}>
                ▼ INSERT COIN TO CONTINUE ▼
              </span>
            </BlinkText>
          </motion.div>
        </div>

        {/* Compteur de places finale */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="relative z-10 mt-10 w-full max-w-2xl px-4"
        >
          <div style={{ border: "2px solid #ffd700", background: "#ffd70008", padding: "12px 20px", boxShadow: "0 0 12px #ffd70055" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", letterSpacing: "0.15em", marginBottom: "6px" }}>PLACES FINALE DISPONIBLES</div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.5rem)", color: placesRestantes <= 4 ? "#ff2d55" : "#ffd700", textShadow: `0 0 10px ${placesRestantes <= 4 ? "#ff2d55" : "#ffd700"}` }}>
                  {placesRestantes} / {PLACES_TOTALES}
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: PLACES_TOTALES }).map((_, i) => (
                  <div key={i} style={{ width: "14px", height: "14px", background: i < PLACES_PRISES ? "#303040" : "#ffd700", boxShadow: i < PLACES_PRISES ? "none" : "0 0 4px #ffd700" }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats arcade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 mt-6 grid grid-cols-3 gap-4 w-full max-w-2xl px-4"
        >
          {[
            { label: "1RE TENTATIVE", value: "15", suffix: "€" },
            { label: "TENTATIVES SUIV.", value: "10", suffix: "€" },
            { label: "GRANDE FINALE", value: "SEPT", suffix: "" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center py-4 px-2"
              style={{ border: "2px solid #00f5ff33", background: "#00f5ff08" }}
            >
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 10px #ffd700" }}>
                {stat.value}{stat.suffix}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#606080", marginTop: "6px", letterSpacing: "0.1em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── C'EST QUOI ── */}
      <section id="comment" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, #0a0a0f 0%, #0d0a1f 50%, #0a0a0f 100%)" }}>
        {/* Motif losanges pixel */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,245,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // NIVEAU 0 - TUTORIEL
          </div>
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#00f5ff", textShadow: "0 0 12px #00f5ff", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            C'EST QUOI<br />LE BUBBLE HOCKEY ?
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p style={{ fontSize: "0.75rem", lineHeight: 2.2, color: "#a0a0c0", marginBottom: "1.5rem" }}>
                Le bubble hockey, c'est un hockey sur table sous dôme de plexiglas. Deux joueurs par équipe, des figurines articulées, un palet et beaucoup d'adrénaline.
              </p>
              <p style={{ fontSize: "0.75rem", lineHeight: 2.2, color: "#a0a0c0", marginBottom: "2rem" }}>
                Le Brussels Pinball Museum possède l'une des rares machines de Bruxelles. Le jeu est simple à comprendre, difficile à maîtriser — exactement ce qu'il faut pour un tournoi estival.
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
      <section id="calendrier" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(180deg, #0a0a0f 0%, #0a1020 40%, #100a0a 100%)", borderTop: "2px solid #ff2d5533", borderBottom: "2px solid #ff2d5533" }}>
        {/* Grille rouge subtile */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,45,85,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,85,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // SELECTION DE NIVEAU
          </div>
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "3rem", lineHeight: 1.6 }}>
            UN ETE POUR APPRENDRE.<br />SEPTEMBRE POUR GAGNER.
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
      <section id="sessions" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, #0a0a0f 0%, #0a1a0a 50%, #0a0a0f 100%)" }}>
        {/* Motif croix pixel vert */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,255,136,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // DEROULEMENT D'UNE SOIREE
          </div>
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
      <section id="calendrier-dates" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // SELECT STAGE
          </div>
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "0.75rem", lineHeight: 1.6 }}>
            TOUS LES DIMANCHES SOIR
          </h2>
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
            {sessionDates.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className="text-center py-4 px-2"
                  style={{
                    border: s.date === "30/08" ? "2px solid #ff2d55" : "2px solid #00f5ff33",
                    background: s.date === "30/08" ? "#ff2d5511" : "#00f5ff08",
                    boxShadow: s.date === "30/08" ? "0 0 8px #ff2d5555" : "none",
                  }}
                >
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(0.9rem, 2vw, 1.3rem)", color: s.date === "30/08" ? "#ff2d55" : "#ffd700", textShadow: `0 0 8px ${s.date === "30/08" ? "#ff2d55" : "#ffd700"}` }}>
                    {s.date.split("/")[0]}
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: s.date === "30/08" ? "#ff2d55" : "#606080", marginTop: "4px", letterSpacing: "0.05em" }}>
                    {s.date === "30/08" ? "LAST CHANCE" : s.label.split(" ").slice(2).join(" ")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", border: "2px solid #ffd700", padding: "4px 10px", background: "#ffd70011" }}>GRANDE FINALE</span>
            <span style={{ fontSize: "0.65rem", color: "#a0a0c0" }}>Debut septembre 2026 - date exacte annoncee prochainement</span>
          </div>
        </div>
      </section>

      {/* ── QUALIFICATION ── */}
      <section className="py-20 px-4" style={{ background: "#0d0d1a", borderTop: "2px solid #ff2d5522", borderBottom: "2px solid #ff2d5522" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // FORMAT DE QUALIFICATION
          </div>
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
              { icon: "🏖️", title: "GRANDE FINALE", desc: "16 equipes qualifiees, 4 pools, matchs en BO3. Le champion de Bruxelles est couronné debut septembre.", color: "#ffd700" },
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
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
                // FINAL BOSS
              </div>
              <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ffd700", textShadow: "0 0 12px #ffd700", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                LA GRANDE FINALE<br />DEBUT SEPTEMBRE.
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
      <section id="halloffame" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(135deg, #0a0a0f 0%, #1a0f00 50%, #0a0a0f 100%)", borderTop: "2px solid #ffd70033", borderBottom: "2px solid #ffd70033" }}>
        {/* Motif etoiles pixel */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,215,0,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", zIndex: 0 }} />
        <div className="max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // QUALIFIES POUR LA FINALE
          </div>
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#ffd700", textShadow: "0 0 20px #ffd700, 0 0 40px #ffd70055", marginBottom: "0.5rem" }}>
            HALL OF FAME
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#888", marginBottom: "3rem" }}>
            Les equipes qui ont decroché leur ticket pour la grande finale de septembre.
          </p>

          {/* Etat vide - aucun qualifie pour l'instant */}
          <div style={{ border: "2px solid #ffd70033", background: "#ffd70008", padding: "3rem 2rem", textAlign: "center" }}>
            {/* Trophee pixel */}
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

          {/* Grille des 16 slots */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                style={{
                  border: "2px solid #ffd70022",
                  background: "#ffd70006",
                  padding: "12px 8px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Coins pixel */}
                <div style={{ position: "absolute", top: -2, left: -2, width: 6, height: 6, background: "#ffd70033" }} />
                <div style={{ position: "absolute", top: -2, right: -2, width: 6, height: 6, background: "#ffd70033" }} />
                <div style={{ position: "absolute", bottom: -2, left: -2, width: 6, height: 6, background: "#ffd70033" }} />
                <div style={{ position: "absolute", bottom: -2, right: -2, width: 6, height: 6, background: "#ffd70033" }} />
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: "#ffd70044", marginBottom: "6px" }}>SLOT {String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#333" }}>???</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#444" }}>
              0 / 16 places attribuees · Prochaine session : 5 juillet 2026
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4" style={{ background: "#0d0d1a", borderTop: "2px solid #00f5ff22" }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // AIDE & QUESTIONS
          </div>
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
      <section id="inscription" className="py-20 px-4" style={{ position: "relative", background: "linear-gradient(180deg, #0a0a0f 0%, #1a0a0f 60%, #0a0a0f 100%)" }}>
        {/* Grille jaune subtile */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px)", backgroundSize: "36px 36px", zIndex: 0 }} />
        <div className="max-w-2xl mx-auto text-center">
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ff2d55", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            // PLAYER REGISTRATION
          </div>
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1rem, 3vw, 1.8rem)", color: "#ff2d55", textShadow: "0 0 16px #ff2d55", marginBottom: "1rem", lineHeight: 1.6 }}>
            INSCRIS TON EQUIPE.
          </h2>
          <p style={{ fontSize: "0.7rem", color: "#808090", lineHeight: 2.2, marginBottom: "2.5rem" }}>
            Entrainement gratuit chaque dimanche soir. 15 EUR pour votre 1re tentative de qualification, 10 EUR ensuite.<br />
            Inscription en ligne ou sur place au Brussels Pinball Museum.
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
                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "0.6rem",
                    background: "#ff2d55",
                    color: "#fff",
                    border: "3px solid #ff2d55",
                    padding: "14px",
                    cursor: "pointer",
                    boxShadow: "0 0 16px #ff2d55, 4px 4px 0 #8b0000",
                    letterSpacing: "0.05em",
                  }}
                  className="hover:brightness-110 active:scale-95 transition-all"
                >
                  ▶ ENVOYER MA DEMANDE
                </button>
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
          <BlinkText>
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#303050" }}>
              © 2026 GAME OVER? NO - INSERT COIN.
            </span>
          </BlinkText>
        </div>
      </footer>
    </div>
  );
}
