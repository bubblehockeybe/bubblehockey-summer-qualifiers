/*
 * Page Admin - Bubble Hockey Summer Qualifiers
 * Accès protégé par login Google via Supabase Auth
 * Gestion : équipes qualifiées (Hall of Fame, stockées en Supabase) + news (localStorage)
 */

import { useState, useEffect } from "react";
import { supabase, ADMIN_EMAIL } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// Clés localStorage pour les news (inchangé)
export const QUALIFIED_TEAMS_KEY = "bh_qualified_teams";
export const NEWS_KEY = "bh_news";

export interface QualifiedTeam {
  id: string;
  name: string;
  date: string;
  slot: number;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

const sessionDates = [
  "6 juillet", "13 juillet", "20 juillet", "26 juillet",
  "3 aout", "10 aout", "17 aout", "24 aout", "30 aout",
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

// ── LOGIN GOOGLE ───────────────────────────────────────────────────────────
function LoginScreen({ loading }: { loading: boolean }) {
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/admin",
      },
    });
    if (error) {
      console.error("Login error:", error.message);
      setSigningIn(false);
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
            <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#606080", textAlign: "center", marginBottom: "2.5rem", letterSpacing: "0.1em" }}>
              BUBBLE HOCKEY SUMMER QUALIFIERS
            </div>

            {loading ? (
              <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", textAlign: "center", padding: "1rem" }}>
                CONNEXION EN COURS...
              </div>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={signingIn}
                  style={{
                    width: "100%",
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "0.45rem",
                    background: signingIn ? "#333" : "#ff2d55",
                    color: "#fff",
                    border: "2px solid #ff2d55",
                    padding: "14px",
                    cursor: signingIn ? "default" : "pointer",
                    boxShadow: signingIn ? "none" : "0 0 12px #ff2d55",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {signingIn ? "REDIRECTION..." : "SE CONNECTER AVEC GOOGLE"}
                </button>
                <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", color: "#404060", textAlign: "center", marginTop: "1.5rem" }}>
                  ACCES RESERVE A L'ORGANISATEUR
                </div>
              </>
            )}
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

// ── ACCES REFUSE ───────────────────────────────────────────────────────────
function AccessDenied({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0f", fontFamily: "'Space Mono', monospace" }}>
      <div className="w-full max-w-sm text-center">
        <PixelBorder color="#ff2d55">
          <div className="p-8" style={{ background: "#ff2d5508" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚫</div>
            <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.6rem", color: "#ff2d55", marginBottom: "1rem" }}>
              ACCES REFUSE
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#606080", marginBottom: "2rem" }}>
              {email} n'est pas autorise.
            </div>
            <button
              onClick={onLogout}
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", background: "transparent", color: "#ff2d55", border: "2px solid #ff2d55", padding: "10px 16px", cursor: "pointer" }}
            >
              SE DECONNECTER
            </button>
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

// ── GESTION EQUIPES (Supabase) ─────────────────────────────────────────────
function TeamsManager() {
  const [teams, setTeams] = useState<QualifiedTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState(sessionDates[0]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("qualified_teams")
      .select("*")
      .order("slot", { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setTeams((data || []).map((r: any) => ({
        id: String(r.id),
        name: r.name,
        date: r.date,
        slot: r.slot,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchTeams(); }, []);

  const addTeam = async () => {
    if (!newName.trim()) return;
    const nextSlot = teams.length + 1;
    if (nextSlot > 16) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("qualified_teams").insert({
      slot: nextSlot,
      name: newName.trim(),
      date: newDate,
    });
    if (error) {
      setError(error.message);
    } else {
      setNewName("");
      await fetchTeams();
    }
    setSaving(false);
  };

  const removeTeam = async (id: string, slot: number) => {
    setSaving(true);
    setError(null);
    // Supprimer l'équipe
    await supabase.from("qualified_teams").delete().eq("id", parseInt(id));
    // Réassigner les slots des équipes suivantes
    const remaining = teams.filter((t) => t.id !== id).sort((a, b) => a.slot - b.slot);
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].slot !== i + 1) {
        await supabase.from("qualified_teams").update({ slot: i + 1 }).eq("id", parseInt(remaining[i].id));
      }
    }
    await fetchTeams();
    setSaving(false);
  };

  const startEdit = (team: QualifiedTeam) => {
    setEditId(team.id);
    setEditName(team.name);
    setEditDate(team.date);
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editId) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("qualified_teams").update({
      name: editName.trim(),
      date: editDate,
    }).eq("id", parseInt(editId));
    if (error) {
      setError(error.message);
    } else {
      setEditId(null);
      await fetchTeams();
    }
    setSaving(false);
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

      {error && (
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#ff2d55", background: "#ff2d5511", border: "1px solid #ff2d5544", padding: "10px", marginBottom: "1rem" }}>
          ERREUR: {error}
        </div>
      )}

      {loading ? (
        <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", color: "#00f5ff", textAlign: "center", padding: "2rem" }}>
          CHARGEMENT...
        </div>
      ) : (
        <>
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
                    disabled={saving}
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: "0.4rem",
                      background: saving ? "#333" : "#00f5ff",
                      color: "#0a0a0f",
                      border: "2px solid #00f5ff",
                      padding: "10px 16px",
                      cursor: saving ? "default" : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {saving ? "..." : "+ AJOUTER"}
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
                        <button onClick={saveEdit} disabled={saving} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", background: "#ffd700", color: "#0a0a0f", border: "none", padding: "8px 12px", cursor: "pointer" }}>OK</button>
                        <button onClick={() => setEditId(null)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", background: "transparent", color: "#606080", border: "1px solid #606080", padding: "8px 12px", cursor: "pointer" }}>ANNULER</button>
                      </div>
                    </PixelBorder>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3" style={{ border: "2px solid #ffd70033", background: "#ffd70008" }}>
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
                      <button onClick={() => removeTeam(team.id, team.slot)} disabled={saving} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#ff2d55", border: "1px solid #ff2d5544", padding: "5px 8px", cursor: "pointer" }}>X</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── GESTION NEWS (localStorage, inchangé) ─────────────────────────────────
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
      <PixelBorder color="#00f5ff" className="mb-6">
        <div className="p-4" style={{ background: "#00f5ff08" }}>
          <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", color: "#00f5ff", marginBottom: "12px" }}>
            {editId ? "MODIFIER LA NEWS" : "NOUVELLE ANNONCE"}
          </div>
          <div className="space-y-3">
            <div>
              <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.32rem", color: "#606080", display: "block", marginBottom: "6px" }}>TITRE</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Resultats du 6 juillet" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#00f5ff")} onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")} />
            </div>
            <div>
              <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.32rem", color: "#606080", display: "block", marginBottom: "6px" }}>CONTENU</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Contenu de l'annonce..." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#00f5ff")} onBlur={(e) => (e.target.style.borderColor = "#00f5ff44")} />
            </div>
            <div className="flex items-center gap-3">
              <div onClick={() => setPinned(!pinned)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", border: `2px solid ${pinned ? "#ffd700" : "#404060"}`, padding: "6px 12px", background: pinned ? "#ffd70011" : "transparent" }}>
                <div style={{ width: "14px", height: "14px", border: `2px solid ${pinned ? "#ffd700" : "#606080"}`, background: pinned ? "#ffd700" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pinned && <span style={{ color: "#0a0a0f", fontSize: "10px", fontWeight: "bold" }}>✓</span>}
                </div>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", color: pinned ? "#ffd700" : "#606080" }}>EPINGLER</span>
              </div>
              <button onClick={addNews} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.4rem", background: "#00f5ff", color: "#0a0a0f", border: "2px solid #00f5ff", padding: "10px 16px", cursor: "pointer" }}>
                {editId ? "SAUVEGARDER" : "+ PUBLIER"}
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setTitle(""); setBody(""); setPinned(false); }} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.35rem", background: "transparent", color: "#606080", border: "1px solid #606080", padding: "10px 12px", cursor: "pointer" }}>
                  ANNULER
                </button>
              )}
            </div>
          </div>
        </div>
      </PixelBorder>
      {news.length === 0 ? (
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#404060", textAlign: "center", padding: "2rem" }}>Aucune news publiee.</div>
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
                <button onClick={() => togglePin(n.id)} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.3rem", background: "transparent", color: "#ffd700", border: "1px solid #ffd70044", padding: "4px 8px", cursor: "pointer" }}>{n.pinned ? "DESEPINGLER" : "EPINGLER"}</button>
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"teams" | "news">("teams");

  useEffect(() => {
    // Récupérer la session courante (y compris après redirect OAuth)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Pas encore chargé
  if (loading) return <LoginScreen loading={true} />;

  // Non connecté
  if (!user) return <LoginScreen loading={false} />;

  // Connecté mais pas l'admin autorisé
  if (user.email !== ADMIN_EMAIL) return <AccessDenied email={user.email || ""} onLogout={handleLogout} />;

  // Admin autorisé
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f", color: "#e0e0e0", fontFamily: "'Space Mono', monospace" }}>
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
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#404060" }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.38rem", background: "transparent", color: "#606080", border: "1px solid #404060", padding: "6px 12px", cursor: "pointer" }}
          >
            DECONNEXION
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
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
