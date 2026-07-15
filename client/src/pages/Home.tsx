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
import { MapView } from "@/components/Map";

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

        {/* Infos pratiques */}
        <section className="mt-16" style={{ borderTop: "2px solid #ffd70033", paddingTop: "2rem" }}>
          <h3 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "1rem", color: "#ffd700", textShadow: "0 0 8px #ffd700", marginBottom: "1.5rem", letterSpacing: "0.05em", textAlign: "center" }}>
            {lang === "fr" ? "INFOS PRATIQUES" : "PRACTICAL INFO"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Adresse et horaires */}
            <PixelBorder color="#ffd700">
              <div className="p-6" style={{ background: "#ffd70008" }}>
                <p style={{ fontSize: "0.65rem", color: "#9090b0", lineHeight: 2 }}>
                  {lang === "fr" ? (
                    <>
                      <strong style={{ color: "#ffd700" }}>Brussels Pinball Museum</strong><br />
                      1501 Chaussée de Wavre<br />
                      1160 Auderghem, Bruxelles<br /><br />
                      <strong style={{ color: "#00f5ff" }}>Horaires</strong><br />
                      Dimanche 19h-20h (entraînement)<br />
                      20h-21h (qualification 26/07 & 30/08)
                    </>
                  ) : (
                    <>
                      <strong style={{ color: "#ffd700" }}>Brussels Pinball Museum</strong><br />
                      1501 Chaussée de Wavre<br />
                      1160 Auderghem, Brussels<br /><br />
                      <strong style={{ color: "#00f5ff" }}>Hours</strong><br />
                      Sunday 7-8 PM (training)<br />
                      8-9 PM (qualification 7/26 & 8/30)
                    </>
                  )}
                </p>
              </div>
            </PixelBorder>
            
            {/* Google Maps */}
            <PixelBorder color="#ff2d55">
              <div style={{ background: "#ff2d5508", minHeight: "400px", padding: 0, display: "flex", flexDirection: "column" }}>
                <MapView
                  className="flex-1"
                  initialCenter={{ lat: 50.8235, lng: 4.4015 }}
                  initialZoom={16}
                  onMapReady={(map) => {
                    try {
                      // Ajouter un marqueur pour le Brussels Pinball Museum
                      const marker = new google.maps.Marker({
                        position: { lat: 50.8235, lng: 4.4015 },
                        map: map,
                        title: "Brussels Pinball Museum",
                        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      });
                      
                      // Info window au clic sur le marqueur
                      const infoWindow = new google.maps.InfoWindow({
                        content: `<div style="color: #000; font-weight: bold;">Brussels Pinball Museum<br/>1501 Chaussée de Wavre<br/>1160 Auderghem</div>`,
                      });
                      
                      marker.addListener("click", () => {
                        infoWindow.open(map, marker);
                      });
                    } catch (error) {
                      console.error("Error setting up map marker:", error);
                    }
                  }}
                />
              </div>
            </PixelBorder>
          </div>
          
          {/* Boutons de partage social */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p style={{ fontSize: "0.6rem", color: "#00f5ff", marginBottom: "1rem", fontFamily: "'Press Start 2P', cursive", letterSpacing: "0.05em" }}>
              {lang === "fr" ? "PARTAGER" : "SHARE"}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/brusselspinballmuseum"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  border: "2px solid #ff2d55",
                  color: "#ff2d55",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ff2d5520";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/brusselspinballmuseum"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  border: "2px solid #00f5ff",
                  color: "#00f5ff",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#00f5ff20";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@brusselspinballmuseum"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  border: "2px solid #ffd700",
                  color: "#ffd700",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffd70020";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.498 3.094c1.356-.027 2.463-.264 3.15-.804v2.905c-.584.403-1.282.692-2.022.887.912.85 1.453 2.118 1.453 3.511 0 5.027-4.065 9.09-9.09 9.09-5.027 0-9.1-4.063-9.1-9.09 0-4.795 3.708-8.776 8.409-8.944-.168-.556-.275-1.148-.275-1.764 0-2.792 2.258-5.05 5.05-5.05 1.995 0 3.73 1.163 4.596 2.857.822-.127 1.596-.38 2.309-.753-.27.847-.843 1.555-1.584 2.001.73-.087 1.427-.28 2.084-.567-.482.713-1.091 1.343-1.779 1.85zm-7.508 15.384c3.169 0 5.788-2.616 5.788-5.785 0-3.17-2.619-5.786-5.788-5.786-3.17 0-5.787 2.616-5.787 5.786 0 3.169 2.617 5.785 5.787 5.785z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
