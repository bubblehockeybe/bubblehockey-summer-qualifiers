/**
 * Bubble Hockey - Simple Training Interface
 * Design: Rétro Arcade 8-bit Néon
 * Fond noir #0a0a0f, cyan électrique #00f5ff, rouge arcade #ff2d55, jaune score #ffd700
 * Press Start 2P pour titres, Space Mono pour corps
 * Compteur en direct des entraînements depuis Supabase
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { type Lang, t } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

const LANG_KEY = "bh_lang";

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

// Fond avec grille et étoiles pixel
function PixelBackground() {
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(0,245,255,0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        opacity: 0.3,
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(0deg, rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        opacity: 0.2,
      }} />
    </div>
  );
}

// Sélecteur de langue
function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-2">
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

export default function Home() {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem(LANG_KEY) as Lang) || "fr"; } catch { return "fr"; }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  };

  // États pour l'inscription
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Compteur en direct des entraînements
  const [trainingSignups, setTrainingSignups] = useState<Record<string, number>>({});

  // Dates des entraînements
  const trainingDates = [
    { date: "19/07", key: "19_july", label: lang === "fr" ? "19 juillet" : "July 19" },
    { date: "26/07", key: "26_july", label: lang === "fr" ? "26 juillet" : "July 26" },
    { date: "02/08", key: "2_aug", label: lang === "fr" ? "2 août" : "Aug 2" },
    { date: "09/08", key: "9_aug", label: lang === "fr" ? "9 août" : "Aug 9" },
    { date: "16/08", key: "16_aug", label: lang === "fr" ? "16 août" : "Aug 16" },
    { date: "23/08", key: "23_aug", label: lang === "fr" ? "23 août" : "Aug 23" },
    { date: "30/08", key: "30_aug", label: lang === "fr" ? "30 août" : "Aug 30" },
  ];

  // Charger les compteurs en temps réel
  useEffect(() => {
    const fetchTrainingSessions = async () => {
      const { data } = await supabase
        .from("training_sessions")
        .select("date");
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((row: any) => {
          // Normaliser la date pour correspondre aux clés
          const dateStr = row.date;
          const dateKey = trainingDates.find(d => d.label === dateStr)?.key;
          if (dateKey) {
            counts[dateKey] = (counts[dateKey] || 0) + 1;
          }
        });
        setTrainingSignups(counts);
      }
    };
    fetchTrainingSessions();
    // Realtime updates
    const channel = supabase
      .channel("training_sessions_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "training_sessions" }, () => {
        fetchTrainingSessions();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Soumettre l'inscription
  const handleSubmit = async () => {
    if (!playerName.trim() || !playerEmail.trim() || !sessionDate) {
      setSubmitMessage(lang === "fr" ? "Remplissez tous les champs" : "Fill all fields");
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const { error } = await supabase
        .from("training_sessions")
        .insert([{ date: sessionDate, name: playerName, email: playerEmail }]);
      if (!error) {
        setPlayerName("");
        setPlayerEmail("");
        setSessionDate("");
        setSubmitMessage(lang === "fr" ? "Inscription confirmée !" : "Registration confirmed!");
        setTimeout(() => setSubmitMessage(""), 3000);
      } else {
        setSubmitMessage(lang === "fr" ? "Erreur lors de l'inscription" : "Registration error");
      }
    } catch (err) {
      setSubmitMessage(lang === "fr" ? "Erreur" : "Error");
    } finally {
      setIsSubmitting(false);
    }
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
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
          zIndex: 1,
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500 border-opacity-30" style={{ background: "rgba(10,10,15,0.95)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src="/manus-storage/logo-bpm_36460586.webp" alt="Brussels Pinball Museum" style={{ height: "clamp(2rem, 6vw, 3.5rem)", width: "auto", objectFit: "contain" }} />
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h2 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(1.2rem, 4vw, 2.2rem)", color: "#ff2d55", textShadow: "0 0 16px #ff2d55", marginBottom: "1rem", lineHeight: 1.4 }}>
            {lang === "fr" ? "ENTRAINEMENTS GRATUITS" : "FREE TRAINING"}
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#b0b0c0", lineHeight: 2, marginBottom: "2rem" }}>
            {lang === "fr"
              ? "Chaque dimanche soir au Brussels Pinball Museum. Inscrivez-vous pour que nous sachions que vous venez."
              : "Every Sunday evening at Brussels Pinball Museum. Sign up so we know you're coming."}
          </p>
        </section>

        {/* Calendrier avec compteur */}
        <section className="mb-16">
          <h3 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "1rem", color: "#ffd700", textShadow: "0 0 8px #ffd700", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
            {lang === "fr" ? "DIMANCHES DISPONIBLES" : "AVAILABLE SUNDAYS"}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {trainingDates.map((d) => {
              const count = trainingSignups[d.key] || 0;
              const confirmed = count >= 4;
              const borderColor = confirmed ? "#ff2d55" : count > 0 ? "#ffa500" : "#00f5ff33";
              const bgColor = confirmed ? "#ff2d5511" : count > 0 ? "rgba(255,165,0,0.08)" : "transparent";
              const glowColor = confirmed ? "0 0 10px #ff2d5588" : count > 0 ? "0 0 8px #ffa50055" : "none";

              return (
                <motion.div
                  key={d.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
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
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.9rem", color: "#ffd700", textShadow: "0 0 6px #ffd700" }}>
                      {d.date.split("/")[0]}
                    </div>
                    <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.25rem", color: confirmed ? "#ff2d55" : "#606080", letterSpacing: "0.05em" }}>
                      {confirmed ? "✓ GO" : `${count}/4`}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p style={{ fontSize: "0.6rem", color: "#9090b0", marginTop: "1rem", textAlign: "center" }}>
            {lang === "fr" ? "À partir de 4 inscrits, la session est confirmée" : "Session confirmed with 4+ registrations"}
          </p>
        </section>

        {/* Formulaire d'inscription */}
        <section>
          <h3 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "1rem", color: "#00f5ff", textShadow: "0 0 8px #00f5ff", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
            {lang === "fr" ? "S'INSCRIRE" : "SIGN UP"}
          </h3>
          <PixelBorder color="#00f5ff">
            <div className="p-6" style={{ background: "#00f5ff08" }}>
              <div className="space-y-4">
                <div>
                  <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>
                    {lang === "fr" ? "NOM" : "NAME"}
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder={lang === "fr" ? "Votre nom" : "Your name"}
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
                  <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>
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

                <div>
                  <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>
                    {lang === "fr" ? "DIMANCHE" : "SUNDAY"}
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
                    <option value="" style={{ background: "#0a0a1f" }}>
                      {lang === "fr" ? "Choisir une date" : "Choose a date"}
                    </option>
                    {trainingDates.map((d) => (
                      <option key={d.key} value={d.label} style={{ background: "#0a0a1f" }}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "0.6rem",
                    background: "#ff2d55",
                    color: "#fff",
                    border: "3px solid #ff2d55",
                    padding: "12px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 0 16px #ff2d55, 4px 4px 0 #8b0000",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s",
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                  className="active:scale-95"
                >
                  {isSubmitting ? (lang === "fr" ? "..." : "...") : (lang === "fr" ? "S'INSCRIRE" : "SIGN UP")}
                </button>

                {submitMessage && (
                  <p style={{ fontSize: "0.6rem", color: submitMessage.includes("confirmée") || submitMessage.includes("confirmed") ? "#00f5ff" : "#ff2d55", textAlign: "center", marginTop: "8px" }}>
                    {submitMessage}
                  </p>
                )}
              </div>
            </div>
          </PixelBorder>
        </section>

        {/* Info Footer */}
        <section className="mt-16 text-center" style={{ borderTop: "2px solid #ffd70033", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.65rem", color: "#9090b0", lineHeight: 2 }}>
            {lang === "fr" ? (
              <>
                <strong>Brussels Pinball Museum</strong><br />
                1501 Chaussée de Wavre, 1160 Auderghem<br />
                Dimanche 19h-20h (entraînement) + 20h-21h (qualification les 26/07 et 30/08)
              </>
            ) : (
              <>
                <strong>Brussels Pinball Museum</strong><br />
                1501 Chaussée de Wavre, 1160 Auderghem<br />
                Sunday 7-8 PM (training) + 8-9 PM (qualification on 7/26 and 8/30)
              </>
            )}
          </p>
        </section>
      </main>
    </div>
  );
}
