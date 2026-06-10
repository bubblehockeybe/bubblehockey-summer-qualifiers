/**
 * Design: Été Bruxellois Vivant
 * Fond crème #faf6ef, bleu cobalt #1a3a6b, orange #f47c20
 * Bebas Neue pour titres, Nunito pour corps
 * Layout aéré, sections alternées crème/cobalt, badges de festival, timeline estivale
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  CalendarDays,
  Users,
  Star,
  ChevronDown,
  MapPin,
  Clock,
  Zap,
  Target,
  Award,
} from "lucide-react";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031771759/Wc8SEqmDGnz6gpuB6cLXPf/hero-bubble-hockey-XjyhBbzqRU8g5rHoUGUFtq.webp";
const TRAINING_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031771759/Wc8SEqmDGnz6gpuB6cLXPf/session-training-aaaUg63J5qe4TdYpXTSvgf.webp";
const TROPHY_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031771759/Wc8SEqmDGnz6gpuB6cLXPf/finale-trophy-HVijnS2tP3yZ5yNaJg4exB.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1 },
  }),
};

const timelineSteps = [
  {
    label: "Mi-juin",
    badge: "LANCEMENT",
    title: "On annonce la saison",
    desc: "Le nouveau format est lancé. Sessions découverte ouvertes à tous, aucune expérience requise.",
    color: "bg-[#f47c20]",
    textColor: "text-[#f47c20]",
  },
  {
    label: "Fin juin – Juillet",
    badge: "DÉCOUVERTE",
    title: "Viens essayer",
    desc: "Soirées d'initiation au Brussels Pinball Museum. On t'explique le jeu en 2 minutes, tu joues, tu rigoles.",
    color: "bg-[#1a3a6b]",
    textColor: "text-[#1a3a6b]",
  },
  {
    label: "Juillet – Août",
    badge: "QUALIFICATIONS",
    title: "Joue et grimpe au classement",
    desc: "Chaque soirée, des matchs comptent pour le leaderboard estival. Les meilleures équipes décrochent leur place en finale.",
    color: "bg-[#f47c20]",
    textColor: "text-[#f47c20]",
  },
  {
    label: "Fin août",
    badge: "LAST CHANCE",
    title: "Dernière opportunité",
    desc: "Une soirée spéciale pour les équipes qui n'ont pas encore leur ticket. Les dernières places s'envolent ici.",
    color: "bg-[#1a3a6b]",
    textColor: "text-[#1a3a6b]",
  },
  {
    label: "Début septembre",
    badge: "GRANDE FINALE",
    title: "Le grand soir",
    desc: "Top 8 ou Top 16 selon la participation. Playoffs, trophée, photos, ambiance de feu. Qui sera champion de Bruxelles ?",
    color: "bg-[#c0392b]",
    textColor: "text-[#c0392b]",
  },
];

const sessionFormat = [
  { icon: Clock, title: "Accueil", duration: "5–10 min", desc: "Présentation, formation des équipes, mise à l'aise." },
  { icon: Zap, title: "Démo express", duration: "5 min", desc: "On vous montre les contrôles et les règles de base en une partie." },
  { icon: Target, title: "Entraînement libre", duration: "15–20 min", desc: "Vous testez la machine avec conseils du staff. Coaching autorisé." },
  { icon: Trophy, title: "Matchs de qualification", duration: "30–45 min", desc: "2 à 4 matchs par équipe selon l'affluence. Scores notés." },
  { icon: Star, title: "Clôture", duration: "5–10 min", desc: "Classement du soir, invitation à revenir, photos." },
];

const qualifRules = [
  { label: "Victoire", points: "3 pts", color: "bg-[#f47c20]" },
  { label: "Égalité", points: "1 pt", color: "bg-[#1a3a6b]" },
  { label: "Défaite", points: "0 pt", color: "bg-gray-400" },
];

const faqItems = [
  {
    q: "On ne connaît pas du tout le bubble hockey. On peut quand même venir ?",
    a: "C'est exactement pour ça qu'on a créé ces sessions. Le jeu s'apprend en quelques minutes, le staff est là pour vous guider, et vous jouerez plusieurs matchs dès la première soirée.",
  },
  {
    q: "On doit être deux pour s'inscrire ?",
    a: "Oui, le bubble hockey se joue en équipe de deux. Si vous venez seul, on peut vous trouver un partenaire sur place selon les disponibilités.",
  },
  {
    q: "Combien coûte une session ?",
    a: "15 € par équipe, crédits d'entraînement inclus. Vous pouvez vous inscrire en ligne ou directement sur place.",
  },
  {
    q: "Comment sait-on si on est qualifié pour la finale ?",
    a: "Le leaderboard estival est mis à jour après chaque soirée. Les équipes qualifiées sont annoncées sur le site et les réseaux. Une soirée Last Chance Qualifier fin août donne une dernière chance.",
  },
  {
    q: "Où se passe tout ça ?",
    a: "Au Brussels Pinball Museum. L'adresse exacte et les horaires des sessions sont publiés sur cette page et sur les réseaux sociaux.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [inscriptionStep, setInscriptionStep] = useState<"idle" | "sent">("idle");

  return (
    <div className="min-h-screen bg-[#faf6ef] font-[Nunito,sans-serif]">
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf6ef]/90 backdrop-blur-sm border-b border-[#1a3a6b]/10">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a3a6b] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>BH</span>
            </div>
            <span className="font-bold text-[#1a3a6b] text-sm tracking-wide hidden sm:block">
              BUBBLE HOCKEY BXL
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1a3a6b]">
            <a href="#comment" className="hover:text-[#f47c20] transition-colors">Comment ça marche</a>
            <a href="#sessions" className="hover:text-[#f47c20] transition-colors">Sessions</a>
            <a href="#calendrier" className="hover:text-[#f47c20] transition-colors">Calendrier</a>
            <a href="#faq" className="hover:text-[#f47c20] transition-colors">FAQ</a>
          </div>
          <a href="#inscription">
            <Button className="bg-[#f47c20] hover:bg-[#d96a10] text-white font-bold text-sm px-5 py-2 rounded-sm transition-all active:scale-95">
              S'inscrire
            </Button>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end pb-16 pt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f3c]/90 via-[#0d1f3c]/40 to-transparent" />
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp} className="mb-4">
              <span
                className="inline-block bg-[#f47c20] text-white text-xs font-bold px-3 py-1 tracking-widest"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.15em" }}
              >
                BRUSSELS PINBALL MUSEUM · ÉTÉ 2026
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-white leading-none mb-4"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 10vw, 8rem)",
                lineHeight: 0.95,
              }}
            >
              BUBBLE HOCKEY<br />
              <span className="text-[#f47c20]">SUMMER</span><br />
              QUALIFIERS
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-white/80 text-lg max-w-xl mb-8 leading-relaxed"
            >
              Tout l'été, viens découvrir le bubble hockey au Brussels Pinball Museum.
              Entraîne-toi, qualifie ton équipe, et tente ta chance lors de la{" "}
              <strong className="text-white">grande finale début septembre</strong>.
              Débutants bienvenus.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a href="#inscription">
                <Button
                  className="bg-[#f47c20] hover:bg-[#d96a10] text-white font-bold text-base px-8 py-4 h-auto rounded-sm transition-all active:scale-95"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", fontSize: "1.1rem" }}
                >
                  S'INSCRIRE À UNE SESSION
                </Button>
              </a>
              <a href="#comment">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#1a3a6b] font-bold text-base px-8 py-4 h-auto rounded-sm bg-transparent transition-all active:scale-95"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", fontSize: "1.1rem" }}
                >
                  COMMENT ÇA MARCHE ?
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
        <a
          href="#comment"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── PITCH RAPIDE ── */}
      <section id="comment" className="bg-[#1a3a6b] py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              C'EST QUOI LE BUBBLE HOCKEY ?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-white mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              UN JEU RARE À BRUXELLES.<br />QUI S'APPREND EN 2 MINUTES.
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp}>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  Le bubble hockey, c'est un hockey sur table sous dôme de plexiglas. Deux joueurs par équipe, des figurines articulées, un palet et beaucoup d'adrénaline. Le Brussels Pinball Museum possède l'une des rares machines de Bruxelles.
                </p>
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  Le jeu est simple à comprendre, difficile à maîtriser — exactement ce qu'il faut pour un tournoi estival. Pas besoin d'expérience pour participer. Le staff est là pour vous lancer.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Équipes de 2", "Débutants OK", "15 € / équipe", "Entraînement inclus"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="relative">
                <img
                  src={TRAINING_IMG}
                  alt="Deux joueurs au bubble hockey au Brussels Pinball Museum"
                  className="w-full rounded-sm object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-4 -left-4 bg-[#f47c20] text-white px-4 py-3">
                  <p className="font-bold text-sm" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
                    BRUSSELS PINBALL MUSEUM
                  </p>
                  <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> Bruxelles
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ESTIVALE ── */}
      <section id="calendrier" className="bg-[#faf6ef] py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              LE PARCOURS
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-[#1a3a6b] mb-12"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              UN ÉTÉ POUR APPRENDRE,<br />SEPTEMBRE POUR GAGNER.
            </motion.h2>
            <div className="relative">
              {/* Ligne verticale */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#1a3a6b]/15 hidden md:block" />
              <div className="space-y-8">
                {timelineSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    className="flex gap-6 items-start"
                  >
                    {/* Badge rond */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg relative z-10`}
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-white rounded-sm p-6 shadow-sm border border-[#1a3a6b]/8">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 ${step.color} text-white`}
                          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.12em" }}
                        >
                          {step.badge}
                        </span>
                        <span className="text-sm text-gray-400 font-semibold">{step.label}</span>
                      </div>
                      <h3
                        className={`text-xl font-bold mb-1 ${step.textColor}`}
                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FORMAT DES SESSIONS ── */}
      <section id="sessions" className="bg-[#1a3a6b] py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              CE QUI SE PASSE LE SOIR
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-white mb-12"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              UNE SESSION, C'EST 60 À 90 MIN.<br />STRUCTURÉES COMME ÇA.
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {sessionFormat.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white/8 border border-white/15 rounded-sm p-5 hover:bg-white/12 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#f47c20] rounded-sm flex items-center justify-center">
                      <item.icon size={16} className="text-white" />
                    </div>
                    <span className="text-[#f47c20] text-xs font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
                      {item.duration}
                    </span>
                  </div>
                  <h4 className="text-white font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.05em" }}>
                    {item.title}
                  </h4>
                  <p className="text-white/65 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── QUALIFICATION & POINTS ── */}
      <section className="bg-[#faf6ef] py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p
                variants={fadeUp}
                className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
              >
                COMMENT SE QUALIFIER
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-[#1a3a6b] mb-6"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
              >
                QUATRE FAÇONS DE DÉCROCHER SA PLACE EN FINALE.
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-4">
                {[
                  { icon: Trophy, title: "Ticket du soir", desc: "L'équipe gagnante de chaque session obtient une place directe en finale." },
                  { icon: Star, title: "Leaderboard estival", desc: "Les meilleures équipes non encore qualifiées sont repêchées via le classement général." },
                  { icon: Award, title: "Wild cards BPM", desc: "Le musée attribue 1 ou 2 places à des équipes particulièrement engagées." },
                  { icon: Zap, title: "Last Chance Qualifier", desc: "Une soirée spéciale fin août pour les dernières places. Pas de deuxième chance après ça." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1a3a6b] rounded-sm flex items-center justify-center">
                      <item.icon size={18} className="text-[#f47c20]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a3a6b] mb-0.5" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.05em" }}>
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.div variants={fadeUp} className="bg-[#1a3a6b] rounded-sm p-8 mb-6">
                <p
                  className="text-[#f47c20] font-bold tracking-widest text-xs mb-4"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
                >
                  BARÈME DES POINTS
                </p>
                <div className="space-y-3">
                  {qualifRules.map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-white font-semibold">{r.label}</span>
                      <span className={`${r.color} text-white font-bold px-4 py-1 text-sm`} style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}>
                        {r.points}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="relative">
                <img
                  src={TROPHY_IMG}
                  alt="Trophée de la grande finale Bubble Hockey"
                  className="w-full rounded-sm object-cover aspect-[3/4] max-h-72 object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/80 to-transparent rounded-sm flex items-end p-6">
                  <div>
                    <p
                      className="text-white font-bold text-2xl"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
                    >
                      GRANDE FINALE
                    </p>
                    <p className="text-[#f47c20] font-bold text-sm">Début septembre 2026</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FORMAT FINALE ── */}
      <section className="bg-[#1a3a6b] py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              LA GRANDE FINALE
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-white mb-10"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              LE FORMAT COMPÉTITIF<br />QUI RÉCOMPENSE L'ÉTÉ.
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Pools de qualification", desc: "4 groupes de 4 équipes. Chaque équipe joue 3 matchs. Les 2 meilleures de chaque pool passent." },
                { step: "02", title: "Top 8 — Playoffs", desc: "Élimination directe en BO3. Quarts de finale, demi-finales. Chaque match compte double." },
                { step: "03", title: "Finale BO5", desc: "La grande finale se joue en 5 matchs. Tension maximale jusqu'au bout." },
                { step: "04", title: "Duel final 1v1", desc: "En cas d'égalité, les deux joueurs s'affrontent individuellement pour le titre ultime." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white/8 border border-white/15 rounded-sm p-6"
                >
                  <div
                    className="text-[#f47c20] text-5xl font-bold mb-4 leading-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.step}
                  </div>
                  <h4
                    className="text-white font-bold mb-2"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.05em" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-white/65 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-[#faf6ef] py-20">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              QUESTIONS FRÉQUENTES
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-[#1a3a6b] mb-10"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              TOUT CE QUE VOUS VOULEZ SAVOIR.
            </motion.h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white rounded-sm border border-[#1a3a6b]/10 overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a3a6b]/3 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-[#1a3a6b] pr-4">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-[#f47c20] transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-[#1a3a6b]/8 pt-4">
                      {item.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INSCRIPTION ── */}
      <section id="inscription" className="bg-[#1a3a6b] py-20">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#f47c20] font-bold tracking-widest text-xs mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              PRÊT À JOUER ?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)" }}
            >
              INSCRIS TON ÉQUIPE.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mb-10 text-lg">
              15 € par équipe de deux. Crédits d'entraînement inclus. Inscription en ligne ou sur place au Brussels Pinball Museum.
            </motion.p>
            {inscriptionStep === "idle" ? (
              <motion.div variants={fadeUp} className="bg-white/8 border border-white/15 rounded-sm p-8">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="text-left">
                    <label className="text-white/70 text-xs font-bold block mb-1.5" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
                      NOM DE L'ÉQUIPE
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Les Pucherons"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-sm focus:outline-none focus:border-[#f47c20] transition-colors"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-white/70 text-xs font-bold block mb-1.5" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
                      EMAIL DE CONTACT
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-sm focus:outline-none focus:border-[#f47c20] transition-colors"
                    />
                  </div>
                </div>
                <div className="text-left mb-6">
                  <label className="text-white/70 text-xs font-bold block mb-1.5" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
                    TYPE D'INSCRIPTION
                  </label>
                  <select className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-[#f47c20] transition-colors">
                    <option value="session" className="bg-[#1a3a6b]">Session découverte</option>
                    <option value="qualification" className="bg-[#1a3a6b]">Session de qualification</option>
                    <option value="finale" className="bg-[#1a3a6b]">Grande finale (sur invitation)</option>
                  </select>
                </div>
                <Button
                  className="w-full bg-[#f47c20] hover:bg-[#d96a10] text-white font-bold py-4 h-auto rounded-sm transition-all active:scale-95"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", fontSize: "1.1rem" }}
                  onClick={() => setInscriptionStep("sent")}
                >
                  ENVOYER MA DEMANDE D'INSCRIPTION
                </Button>
                <p className="text-white/40 text-xs mt-4">
                  Vous recevrez une confirmation par email avec les détails pratiques.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white/8 border border-[#f47c20]/40 rounded-sm p-10"
              >
                <div className="w-16 h-16 bg-[#f47c20] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy size={28} className="text-white" />
                </div>
                <h3
                  className="text-white text-3xl mb-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
                >
                  INSCRIPTION REÇUE !
                </h3>
                <p className="text-white/70">
                  On revient vers vous rapidement avec les détails de votre session. À très vite au Brussels Pinball Museum !
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d1f3c] py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p
              className="text-white font-bold text-lg"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
            >
              BUBBLE HOCKEY SUMMER QUALIFIERS
            </p>
            <p className="text-white/40 text-sm">Brussels Pinball Museum · Été 2026</p>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <MapPin size={14} />
            <a
              href="https://bubblehockey.be"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f47c20] transition-colors"
            >
              bubblehockey.be
            </a>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#comment" className="hover:text-white transition-colors">Comment ça marche</a>
            <a href="#sessions" className="hover:text-white transition-colors">Sessions</a>
            <a href="#inscription" className="hover:text-white transition-colors">S'inscrire</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
