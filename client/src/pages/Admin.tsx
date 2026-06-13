/**
 * Page Admin - Bubble Hockey Summer Qualifiers
 * Accès protégé par mot de passe
 * Gestion : équipes qualifiées (Hall of Fame) + news
 * Stockage : localStorage (clés partagées avec Home.tsx)
 */

import { useState, useEffect } from "react";

// Clés localStorage partagées avec Home.tsx
export const QUALIFIED_TEAMS_KEY = "bh_qualified_teams";
export const NEWS_KEY = "bh_news";

const ADMIN_PASSWORD = "bpm2026";

export interface QualifiedTeam {
  id: string;
  name: string;
  date: string; // ex: "5 juillet"
  slot: number; // 1-16
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

const sessionDates = [
  "5 juillet", "12 juillet", "19 juillet", "26 juillet",
  "2 aout", "9 aout", "16 aout", "23 aout", "30 aout",
];

function PixelBorder({ children, color = "#00f5ff", className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ border: `2px solid ${color}`, boxShadow: `0 0 8px ${color}44` }}>
      <div className="absolute -top-1 -left-1 w-2 h-2" style={{ background: color }} />
      <div className="absolute -top-1 -right-1 w-2 h-2" style={{ background: color }} />
      <div className="absolute -bottom-1 -left-1 w-2 h-2" style={{ background: color }} />
      <div className="absolute -bottom-1 -right-1 w-2 h-2" style={{ background: color }} />
      {children}
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) {
      onLogin();
      setError(false);
    } else {
      setError(true);
      setPwd("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0f", fontFamily: "'Space Mono', monospace" }}>
      <div className="w-full max-w-sm">
        <PixelBorder color="#ff2d55">
          <div className="p-8" style={{ background: "#ff2d5508" }}>
            <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.7rem", color: "#ff2d55", textShadow: "0 0 10px #ff2d55", marginBottom: "0.5rem", textAlign: "center" }}>
              ADMIN
            </div>
            <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#606080", textAlign: "center", marginBottom: "2rem", letterSpacing: "0.1em" }}>
              BUBBLE HOCKEY SUMMER QUALIFIERS
            </div>

            <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", color: "#00f5ff", display: "block", marginBottom: "8px" }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{
                width: "100%",
                background: "#00000080",
                border: `2px solid ${error ? "#ff2d55" : "#00f5ff44"}`,
                color: "#e0e0e0",
                padding: "10px 12px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.8rem",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "8px",
              }}
              autoFocus
            />
            {error && (
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: "#ff2d55", marginBottom: "12px" }}>
                MOT DE PASSE INCORRECT
              </div>
            )}
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.5rem",
                background: "#ff2d55",
                color: "#fff",
                border: "2px solid #ff2d55",
                padding: "12px",
                cursor: "pointer",
                boxShadow: "0 0 12px #ff2d55",
                marginTop: "8px",
              }}
            >
              ▶ ENTRER
            </button>
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

// ── GESTION EQUIPES ────────────────────────────────────────────────────────
function TeamsManager() {
  const [teams, setTeams] = useState<QualifiedTeam[]>(() => {
    try { return JSON.parse(localStorage.getItem(QUALIFIED_TEAMS_KEY) || "[]"); } catch { return []; }
  });
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState(sessionDates[0]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  const save = (updated: QualifiedTeam[]) => {
    setTeams(updated);
    localStorage.setItem(QUALIFIED_TEAMS_KEY, JSON.stringify(updated));
  };

  const addTeam = () => {
    if (!newName.trim()) return;
    const nextSlot = teams.length + 1;
    if (nextSlot > 16) return;
    const team: QualifiedTeam = {
      id: Date.now().toString(),
      name: newName.trim(),
      date: newDate,
      slot: nextSlot,
    };
    save([...teams, team]);
    setNewName("");
  };

  const removeTeam = (id: string) => {
    const updated = teams.filter((t) => t.id !== id).map((t, i) => ({ ...t, slot: i + 1 }));
    save(updated);
  };

  const startEdit = (team: QualifiedTeam) => {
    setEditId(team.id);
    setEditName(team.name);
    setEditDate(team.date);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    save(teams.map((t) => t.id === editId ? { ...t, name: editName.trim(), date: editDate } : t));
    setEditId(null);
  };

  const inputStyle = {
    background: "#00000080",
    border: "2px solid #00f5ff44",
    color: "#e0e0e0",
    padding: "8px 10px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.7rem",
    outline: "none",
  };

  return (
    <div>
      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ffd700", textShadow: "0 0 8px #ffd700", marginBottom: "1.5rem" }}>
        EQUIPES QUALIFIEES ({teams.length}/16)
      </div>

      {/* Formulaire ajout */}
      {teams.length < 16 && (
        <PixelBorder color="#00f5ff" className="mb-6">
          <div className="p-4" style={{ background: "#00f5ff08" }}>
            <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", color: "#00f5ff", marginBottom: "12px" }}>
              AJOUTER UNE EQUIPE
            </div>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1" style={{ minWidth: "180px" }}>
                <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.32rem", color: "#606080", display: "block", marginBottom: "6px" }}>NOM</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTeam()}
                  placeholder="Nom de l'equipe"
                  style={{ ...inputStyle, width: "100%" }}
                  onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                  onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")}
                />
              </div>
              <div style={{ minWidth: "160px" }}>
                <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.32rem", color: "#606080", display: "block", marginBottom: "6px" }}>DATE QUALIF</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {sessionDates.map((d) => (
                    <option key={d} value={d} style={{ background: "#0a0a1f" }}>{d.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addTeam}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.4rem",
                  background: "#00f5ff",
                  color: "#0a0a0f",
                  border: "2px solid #00f5ff",
                  padding: "10px 16px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                + AJOUTER
              </button>
            </div>
          </div>
        </PixelBorder>
      )}

      {/* Liste des équipes */}
      {teams.length === 0 ? (
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#404060", textAlign: "center", padding: "2rem" }}>
          Aucune equipe qualifiee pour l'instant.
        </div>
      ) : (
        <div className="space-y-2">
          {teams.map((team) => (
            <div key={team.id}>
              {editId === team.id ? (
                <PixelBorder color="#ffd700">
                  <div className="p-3 flex flex-wrap gap-3 items-center" style={{ background: "#ffd70008" }}>
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#ffd700", minWidth: "40px" }}>
                      #{String(team.slot).padStart(2, "0")}
                    </span>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ ...inputStyle, flex: 1, minWidth: "140px" }}
                      autoFocus
                    />
                    <select
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      style={{ ...inputStyle, minWidth: "140px" }}
                    >
                      {sessionDates.map((d) => (
                        <option key={d} value={d} style={{ background: "#0a0a1f" }}>{d.toUpperCase()}</option>
                      ))}
                    </select>
                    <button onClick={saveEdit} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", background: "#ffd700", color: "#0a0a0f", border: "none", padding: "8px 12px", cursor: "pointer" }}>OK</button>
                    <button onClick={() => setEditId(null)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", background: "transparent", color: "#606080", border: "1px solid #606080", padding: "8px 12px", cursor: "pointer" }}>ANNULER</button>
                  </div>
                </PixelBorder>
              ) : (
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ border: "2px solid #ffd70033", background: "#ffd70008" }}
                >
                  <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#ffd700", minWidth: "40px" }}>
                    #{String(team.slot).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#e0e0e0", flex: 1 }}>
                    {team.name}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#606080" }}>
                    {team.date}
                  </span>
                  <button onClick={() => startEdit(team)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#00f5ff", border: "1px solid #00f5ff44", padding: "5px 8px", cursor: "pointer" }}>EDIT</button>
                  <button onClick={() => removeTeam(team.id)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#ff2d55", border: "1px solid #ff2d5544", padding: "5px 8px", cursor: "pointer" }}>X</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── GESTION NEWS ───────────────────────────────────────────────────────────
function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(NEWS_KEY) || "[]"); } catch { return []; }
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const save = (updated: NewsItem[]) => {
    setNews(updated);
    localStorage.setItem(NEWS_KEY, JSON.stringify(updated));
  };

  const today = () => new Date().toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });

  const addNews = () => {
    if (!title.trim() || !body.trim()) return;
    if (editId) {
      save(news.map((n) => n.id === editId ? { ...n, title: title.trim(), body: body.trim(), pinned } : n));
      setEditId(null);
    } else {
      const item: NewsItem = { id: Date.now().toString(), title: title.trim(), body: body.trim(), date: today(), pinned };
      save([item, ...news]);
    }
    setTitle("");
    setBody("");
    setPinned(false);
  };

  const startEdit = (n: NewsItem) => {
    setEditId(n.id);
    setTitle(n.title);
    setBody(n.body);
    setPinned(n.pinned);
  };

  const removeNews = (id: string) => save(news.filter((n) => n.id !== id));
  const togglePin = (id: string) => save(news.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const inputStyle = {
    width: "100%",
    background: "#00000080",
    border: "2px solid #00f5ff44",
    color: "#e0e0e0",
    padding: "8px 10px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.7rem",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div>
      <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#00f5ff", textShadow: "0 0 8px #00f5ff", marginBottom: "1.5rem" }}>
        NEWS & ANNONCES
      </div>

      {/* Formulaire */}
      <PixelBorder color="#00f5ff" className="mb-6">
        <div className="p-4" style={{ background: "#00f5ff08" }}>
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", color: "#00f5ff", marginBottom: "12px" }}>
            {editId ? "MODIFIER LA NEWS" : "NOUVELLE ANNONCE"}
          </div>
          <div className="space-y-3">
            <div>
              <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.32rem", color: "#606080", display: "block", marginBottom: "6px" }}>TITRE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Resultats du 5 juillet"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.32rem", color: "#606080", display: "block", marginBottom: "6px" }}>CONTENU</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Contenu de l'annonce..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")}
              />
            </div>
            <div className="flex items-center gap-3">
              <div
                onClick={() => setPinned(!pinned)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
                  border: `2px solid ${pinned ? "#ffd700" : "#404060"}`,
                  padding: "6px 12px",
                  background: pinned ? "#ffd70011" : "transparent",
                }}
              >
                <div style={{ width: "14px", height: "14px", border: `2px solid ${pinned ? "#ffd700" : "#606080"}`, background: pinned ? "#ffd700" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pinned && <span style={{ color: "#0a0a0f", fontSize: "10px", fontWeight: "bold" }}>✓</span>}
                </div>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: pinned ? "#ffd700" : "#606080" }}>EPINGLER</span>
              </div>
              <button
                onClick={addNews}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.4rem",
                  background: "#00f5ff",
                  color: "#0a0a0f",
                  border: "2px solid #00f5ff",
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                {editId ? "SAUVEGARDER" : "+ PUBLIER"}
              </button>
              {editId && (
                <button
                  onClick={() => { setEditId(null); setTitle(""); setBody(""); setPinned(false); }}
                  style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", background: "transparent", color: "#606080", border: "1px solid #606080", padding: "10px 12px", cursor: "pointer" }}
                >
                  ANNULER
                </button>
              )}
            </div>
          </div>
        </div>
      </PixelBorder>

      {/* Liste des news */}
      {news.length === 0 ? (
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#404060", textAlign: "center", padding: "2rem" }}>
          Aucune news publiee.
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((n) => (
            <div key={n.id} style={{ border: `2px solid ${n.pinned ? "#ffd70066" : "#00f5ff22"}`, background: n.pinned ? "#ffd70008" : "#00f5ff06", padding: "14px" }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  {n.pinned && <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", color: "#ffd700", border: "1px solid #ffd700", padding: "2px 6px", marginRight: "8px" }}>EPINGLE</span>}
                  <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.5rem", color: "#e0e0e0" }}>{n.title}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#404060", whiteSpace: "nowrap" }}>{n.date}</span>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#808090", lineHeight: 1.8, marginBottom: "10px" }}>{n.body}</p>
              <div className="flex gap-2">
                <button onClick={() => togglePin(n.id)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#ffd700", border: "1px solid #ffd70044", padding: "4px 8px", cursor: "pointer" }}>
                  {n.pinned ? "DESEPINGLER" : "EPINGLER"}
                </button>
                <button onClick={() => startEdit(n)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#00f5ff", border: "1px solid #00f5ff44", padding: "4px 8px", cursor: "pointer" }}>EDIT</button>
                <button onClick={() => removeNews(n.id)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#ff2d55", border: "1px solid #ff2d5544", padding: "4px 8px", cursor: "pointer" }}>SUPPRIMER</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PAGE ADMIN PRINCIPALE ──────────────────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return sessionStorage.getItem("bh_admin_auth") === "1";
  });
  const [tab, setTab] = useState<"teams" | "news">("teams");

  const handleLogin = () => {
    sessionStorage.setItem("bh_admin_auth", "1");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("bh_admin_auth");
    setLoggedIn(false);
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f", color: "#e0e0e0", fontFamily: "'Space Mono', monospace" }}>
      {/* Header admin */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
        style={{ background: "#0a0a0f", borderBottom: "2px solid #ff2d55", boxShadow: "0 0 12px #ff2d5544" }}>
        <div className="flex items-center gap-4">
          <a href="/" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#606080", textDecoration: "none" }}>
            ← SITE
          </a>
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.55rem", color: "#ff2d55", textShadow: "0 0 8px #ff2d55" }}>
            ADMIN
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", background: "transparent", color: "#606080", border: "1px solid #404060", padding: "6px 12px", cursor: "pointer" }}
        >
          DECONNEXION
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Onglets */}
        <div className="flex gap-2 mb-8">
          {(["teams", "news"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.45rem",
                padding: "10px 18px",
                background: tab === t ? (t === "teams" ? "#ffd700" : "#00f5ff") : "transparent",
                color: tab === t ? "#0a0a0f" : "#606080",
                border: `2px solid ${tab === t ? (t === "teams" ? "#ffd700" : "#00f5ff") : "#404060"}`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t === "teams" ? "EQUIPES" : "NEWS"}
            </button>
          ))}
        </div>

        {tab === "teams" ? <TeamsManager /> : <NewsManager />}
      </div>
    </div>
  );
}
