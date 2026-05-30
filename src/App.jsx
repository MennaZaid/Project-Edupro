import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const tokens = {
  dark: {
    bg0: "#030f08", bg1: "#071510", bg2: "#0d2018", bg3: "#122a20",
    fg0: "#e8f5ee", fg1: "#a8d4b8", fg2: "#6aaa85", fg3: "#3d6b52",
    accent: "#22c55e", accent2: "#4ade80", accent3: "#86efac",
    teal: "#14b8a6", amber: "#f59e0b", red: "#ef4444", blue: "#3b82f6",
    card: "#0a1e12", border: "#153322", border2: "#1f4a33",
    shadow: "0 2px 20px rgba(0,0,0,.5)", shadowLg: "0 8px 48px rgba(0,0,0,.6)",
  },
  light: {
    bg0: "#f0faf4", bg1: "#ffffff", bg2: "#e8f5ed", bg3: "#d4edd9",
    fg0: "#0a2216", fg1: "#1a4a2e", fg2: "#2d7a4a", fg3: "#6aaa85",
    accent: "#16a34a", accent2: "#15803d", accent3: "#166534",
    teal: "#0d9488", amber: "#d97706", red: "#dc2626", blue: "#2563eb",
    card: "#ffffff", border: "#c4e0cc", border2: "#9ecfab",
    shadow: "0 2px 20px rgba(0,0,0,.06)", shadowLg: "0 8px 48px rgba(0,0,0,.1)",
  },
};

// ─── Icons (Inline SVG) ─────────────────────────────────────────────────────
const ICONS = {
  recycle: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M7 7 5 10l2 3" />
      <path d="M5 10h5" />
      <path d="M17 7l2 3-2 3" />
      <path d="M19 10h-5" />
      <path d="M10 17l2 3 2-3" />
      <path d="M12 20v-5" />
      <path d="M7 7a6 6 0 0 1 10 0" />
      <path d="M17 17a6 6 0 0 1-10 0" />
    </svg>
  ),
  plug: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M9 3v6" />
      <path d="M15 3v6" />
      <path d="M7 9h10" />
      <path d="M12 9v4a5 5 0 0 1-5 5" />
      <path d="M12 13a5 5 0 0 0 5 5" />
    </svg>
  ),
  chip: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3" />
    </svg>
  ),
  cog: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      <path d="M4 12h2M18 12h2M12 4v2M12 18v2" />
      <path d="m6.5 6.5 1.4 1.4M16.1 16.1l1.4 1.4M17.5 6.5l-1.4 1.4M7.9 16.1l-1.4 1.4" />
    </svg>
  ),
  antenna: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 12v8" />
      <path d="M8 20h8" />
      <path d="M5.5 9.5a9 9 0 0 1 13 0" />
      <path d="M8.5 12.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  leaf: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 14c6-7 13-8 16-8-1 8-7 13-12 14-2 .4-4-1.6-4-4z" />
      <path d="M9 15c2-1 4-3 7-6" />
    </svg>
  ),
  seedling: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 21v-7" />
      <path d="M12 14c-4 0-7-3-7-7 4 0 7 3 7 7z" />
      <path d="M12 14c4 0 7-2 7-6-4 0-7 2-7 6z" />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  wifi: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4.5 9.5a10 10 0 0 1 15 0" />
      <path d="M7.5 12.5a6 6 0 0 1 9 0" />
      <path d="M10.5 15.5a2 2 0 0 1 3 0" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  ),
  battery: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="8" width="16" height="8" rx="2" />
      <path d="M21 10v4" />
      <path d="M6 12h7" />
    </svg>
  ),
  microscope: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 20h12" />
      <path d="M9 13h6" />
      <path d="M9 3 12 6l-2 2-3-3 2-2z" />
      <path d="M12 6l4 4-4 4" />
      <path d="M7 17a5 5 0 0 1 5-5" />
    </svg>
  ),
  puzzle: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M8 3h3a2 2 0 1 1 0 4H8v4h4a2 2 0 1 0 4 0V7h4v10h-4a2 2 0 1 1 0 4H8v-4H4V7h4V3z" />
    </svg>
  ),
  swirl: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M16 7h4v4" />
      <path d="M8 17H4v-4" />
    </svg>
  ),
  warning: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3 2 20h20L12 3z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  sun: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M19.5 4.5l-2.1 2.1M6.6 17.4l-2.1 2.1" />
    </svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M20.8 7.6a4.8 4.8 0 0 0-6.8 0L12 9.6l-2-2a4.8 4.8 0 0 0-6.8 6.8l2 2 6.8 6.8 6.8-6.8 2-2a4.8 4.8 0 0 0 0-6.8z" />
    </svg>
  ),
  heartOutline: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M20.8 7.6a4.8 4.8 0 0 0-6.8 0L12 9.6l-2-2a4.8 4.8 0 0 0-6.8 6.8l2 2 6.8 6.8 6.8-6.8 2-2a4.8 4.8 0 0 0 0-6.8z" fill="none" />
    </svg>
  ),
  cart: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 6h14l-2 8H7L6 4H3" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  ),
  bell: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-2 7-2 7h16s-2 0-2-7" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  ),
  globe: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a12 12 0 0 1 0 18" />
      <path d="M12 3a12 12 0 0 0 0 18" />
    </svg>
  ),
  upload: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 16V6" />
      <path d="M8 10l4-4 4 4" />
      <path d="M4 18h16" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  handshake: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M8 13l3 3a3 3 0 0 0 4.2 0l3.8-3.8" />
      <path d="M2 10l4-4 6 6" />
      <path d="M22 10l-4-4-5 5" />
    </svg>
  ),
  location: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  cash: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 9h.01M17 15h.01" />
    </svg>
  ),
  package: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3 3 7l9 4 9-4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </svg>
  ),
  tag: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 12V4h8l10 10-8 8L3 12z" />
      <circle cx="7" cy="8" r="1.5" />
    </svg>
  ),
  message: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  ),
  chart: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-6" />
    </svg>
  ),
  grid: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  door: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 3h10a2 2 0 0 1 2 2v16H6z" />
      <path d="M10 12h.01" />
    </svg>
  ),
  calendar: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 9h18" />
    </svg>
  ),
  trophy: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 4h12v3a6 6 0 0 1-12 0V4z" />
      <path d="M4 4h2v3a4 4 0 0 1-2-3z" />
      <path d="M18 4h2a4 4 0 0 1-2 3V4z" />
      <path d="M8 20h8" />
      <path d="M12 13v7" />
    </svg>
  ),
  campus: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 10 12 5l9 5-9 5-9-5z" />
      <path d="M5 12v6h14v-6" />
      <path d="M9 18v-4h6v4" />
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  ),
};

function Icon({ name, size = 18, color = "currentColor" }) {
  const IconSvg = ICONS[name];
  if (!IconSvg) return null;
  return (
    <span style={{ display: "inline-flex", width: size, height: size, color }} aria-hidden="true">
      {IconSvg({ width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}
    </span>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const WASTE_ITEMS = [
  { id:1, name:"Arduino Uno R3 Kit", category:"electronics", price:120, unit:"EGP", condition:"Good", availability:"available", provider:"Omar K.", rating:4.8, reviews:23, icon:"plug", tags:["Arduino","PCB","Embedded"], description:"Complete Arduino Uno kit with breadboard, 65 jumper wires, and 20+ sensors. Diverted from landfill — tested and working.", location:"AUC New Cairo", campus:"auc-nc", listed:"2 days ago", views:142, wasteKg:0.28 },
  { id:2, name:"Raspberry Pi 4 (4GB)", category:"electronics", price:650, unit:"EGP", condition:"Excellent", availability:"available", provider:"Sara M.", rating:4.9, reviews:11, icon:"chip", tags:["RPi","Linux","IoT"], description:"Raspberry Pi 4 Model B, 4GB RAM. Includes official case, heatsinks, and micro-HDMI cable. Keeps 112g of e-waste out of landfills.", location:"AUC Tahrir", campus:"auc-t", listed:"1 day ago", views:98, wasteKg:0.11 },
  { id:3, name:"Acrylic Sheet Set (A3)", category:"materials", price:85, unit:"EGP", condition:"New", availability:"available", provider:"Faculty Store", rating:4.5, reviews:7, icon:"recycle", tags:["Acrylic","Laser-cut","Structure"], description:"5x A3 clear acrylic sheets, 3mm. Surplus stock — unused, sealed. Circular reuse over disposal.", location:"AUC New Cairo", campus:"auc-nc", listed:"Today", views:34, wasteKg:0.60 },
  { id:4, name:"L298N Motor Driver x3", category:"components", price:60, unit:"EGP", condition:"Good", availability:"reserved", provider:"Karim A.", rating:4.7, reviews:15, icon:"cog", tags:["Motor","Driver","DC"], description:"Three L298N dual H-bridge motor drivers. Fully tested, prevents 45g of circuit board waste.", location:"GUC", campus:"guc", listed:"3 days ago", views:78, wasteKg:0.045 },
  { id:5, name:"HC-SR04 Ultrasonic x5", category:"sensors", price:75, unit:"EGP", condition:"Good", availability:"available", provider:"Nour H.", rating:4.6, reviews:9, icon:"antenna", tags:["Sensor","Ultrasonic","Distance"], description:"Pack of 5 ultrasonic sensors, all calibrated. Sharing sensors reduces manufacturing demand.", location:"AUC New Cairo", campus:"auc-nc", listed:"Today", views:56, wasteKg:0.03 },
  { id:6, name:"PLA Filament 1kg (White)", category:"materials", price:180, unit:"EGP", condition:"New", availability:"available", provider:"Mona S.", rating:4.4, reviews:6, icon:"leaf", tags:["3D-Print","PLA","Biodegradable"], description:"1kg PLA filament, 1.75mm — unopened. PLA is plant-based and compostable. Sharing unused spools reduces virgin plastic use.", location:"BUE", campus:"bue", listed:"2 days ago", views:44, wasteKg:1.0 },
  { id:7, name:"SG90 Servo Motor x6", category:"components", price:90, unit:"EGP", condition:"Excellent", availability:"available", provider:"Ali R.", rating:4.8, reviews:18, icon:"bolt", tags:["Servo","Motor","Robotics"], description:"Six SG90 9g mini servos, full 180° range. Includes extension cables and mounting hardware.", location:"AUC New Cairo", campus:"auc-nc", listed:"5 days ago", views:203, wasteKg:0.06 },
  { id:8, name:"ESP32 Dev Board x2", category:"electronics", price:200, unit:"EGP", condition:"Good", availability:"available", provider:"Layla F.", rating:4.7, reviews:12, icon:"wifi", tags:["ESP32","WiFi","BLE","IoT"], description:"Two ESP32-WROOM-32 boards, WiFi and BT verified. Giving these a second life extends e-waste lifespan.", location:"AUC New Cairo", campus:"auc-nc", listed:"1 day ago", views:115, wasteKg:0.04 },
  { id:9, name:"LiPo Battery Pack 2200mAh", category:"components", price:110, unit:"EGP", condition:"Good", availability:"available", provider:"Hassan B.", rating:4.5, reviews:8, icon:"battery", tags:["Battery","LiPo","Power"], description:"2200mAh 3S 11.1V LiPo. Proper reuse prevents toxic battery chemicals from reaching soil.", location:"Cairo University", campus:"cu", listed:"4 days ago", views:67, wasteKg:0.185 },
  { id:10, name:"Logic Analyzer 8-Ch USB", category:"equipment", price:160, unit:"EGP", condition:"Excellent", availability:"available", provider:"Rania T.", rating:4.9, reviews:4, icon:"microscope", tags:["Logic","Analyzer","Debug"], description:"8-channel USB logic analyzer, compatible with PulseView and Saleae. Sharing lab equipment = lower per-student carbon footprint.", location:"AUC New Cairo", campus:"auc-nc", listed:"Today", views:29, wasteKg:0.08 },
  { id:11, name:"Breadboard + Jumper Kit", category:"components", price:45, unit:"EGP", condition:"Good", availability:"available", provider:"Dina M.", rating:4.3, reviews:21, icon:"puzzle", tags:["Breadboard","Jumper","Prototyping"], description:"Full-size 830-point breadboard plus 120-piece jumper wire set. Pass-it-on culture reduces demand for new units.", location:"AUC New Cairo", campus:"auc-nc", listed:"1 week ago", views:189, wasteKg:0.12 },
  { id:12, name:"Stepper Motor + Driver Set", category:"components", price:135, unit:"EGP", condition:"Good", availability:"reserved", provider:"Youssef A.", rating:4.6, reviews:7, icon:"swirl", tags:["Stepper","NEMA17","CNC"], description:"NEMA17 stepper with A4988 driver and heatsink. Removed from a CNC project, all tested.", location:"Ain Shams", campus:"ashu", listed:"3 days ago", views:51, wasteKg:0.22 },
];

const CATEGORIES = ["all","electronics","components","sensors","materials","equipment"];

const CAMPUSES = [
  { id:"auc-nc", name:"AUC New Cairo", x:"62%", y:"55%", count:7 },
  { id:"auc-t",  name:"AUC Tahrir",   x:"28%", y:"35%", count:1 },
  { id:"guc",    name:"GUC",          x:"55%", y:"72%", count:1 },
  { id:"bue",    name:"BUE",          x:"80%", y:"42%", count:1 },
  { id:"cu",     name:"Cairo Uni",    x:"20%", y:"55%", count:1 },
  { id:"ashu",   name:"Ain Shams",    x:"38%", y:"20%", count:1 },
];

const LEADERBOARD = [
  { rank:1, name:"Ahmed M.", uni:"AUC", wasteKg:5.2, items:12, co2:3.4, avatar:"A" },
  { rank:2, name:"Sara M.",  uni:"AUC", wasteKg:4.1, items:9,  co2:2.7, avatar:"S" },
  { rank:3, name:"Omar K.",  uni:"AUC", wasteKg:3.6, items:8,  co2:2.3, avatar:"O" },
  { rank:4, name:"Layla F.", uni:"AUC", wasteKg:3.0, items:7,  co2:1.9, avatar:"L" },
  { rank:5, name:"Hassan B.",uni:"CU",  wasteKg:2.7, items:6,  co2:1.8, avatar:"H" },
  { rank:6, name:"Nour H.",  uni:"AUC", wasteKg:2.4, items:6,  co2:1.6, avatar:"N" },
  { rank:7, name:"Rania T.", uni:"AUC", wasteKg:2.1, items:5,  co2:1.4, avatar:"R" },
  { rank:8, name:"Karim A.", uni:"GUC", wasteKg:1.8, items:4,  co2:1.2, avatar:"K" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useThemeStyles(theme) {
  const t = tokens[theme];
  return {
    "--bg0": t.bg0, "--bg1": t.bg1, "--bg2": t.bg2, "--bg3": t.bg3,
    "--fg0": t.fg0, "--fg1": t.fg1, "--fg2": t.fg2, "--fg3": t.fg3,
    "--accent": t.accent, "--accent2": t.accent2, "--accent3": t.accent3,
    "--teal": t.teal, "--amber": t.amber, "--red": t.red, "--blue": t.blue,
    "--card": t.card, "--border": t.border, "--border2": t.border2,
    "--shadow": t.shadow, "--shadowLg": t.shadowLg,
  };
}

// ─── Micro Components ─────────────────────────────────────────────────────────
function Badge({ variant = "green", children }) {
  const colors = {
    green:  { bg: "rgba(34,197,94,.15)",  color: "var(--accent)" },
    amber:  { bg: "rgba(245,158,11,.12)", color: "var(--amber)" },
    red:    { bg: "rgba(239,68,68,.12)",  color: "var(--red)" },
    blue:   { bg: "rgba(59,130,246,.12)", color: "var(--blue)" },
    teal:   { bg: "rgba(20,184,166,.12)", color: "var(--teal)" },
    muted:  { bg: "rgba(255,255,255,.06)",color: "var(--fg2)" },
  };
  const s = colors[variant] || colors.green;
  return (
    <span style={{
      fontSize:11, fontFamily:"'DM Mono',monospace", padding:"2px 8px",
      borderRadius:4, fontWeight:500, letterSpacing:".02em", whiteSpace:"nowrap",
      background: s.bg, color: s.color,
    }}>
      {children}
    </span>
  );
}

function Avatar({ name, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--accent), var(--teal))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "#fff",
      flexShrink: 0, border: "2px solid var(--border2)",
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}

function ProgressBar({ pct, color = "var(--accent)", height = 4 }) {
  return (
    <div style={{ height, background: "var(--bg3)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        height: "100%", background: color, borderRadius: 4,
        width: `${pct}%`, transition: "width .8s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="toast-container" style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 400,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "var(--bg2)", border: "1px solid var(--border2)",
          borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 10, maxWidth: 320,
          boxShadow: "var(--shadowLg)", pointerEvents: "auto",
          animation: "toastIn .22s ease",
          borderLeft: `3px solid ${t.type === "error" ? "var(--red)" : t.type === "info" ? "var(--blue)" : "var(--accent)"}`,
        }}>
          <span>
            <Icon name={t.type === "error" ? "warning" : t.type === "info" ? "info" : "check"} size={16} />
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function GreenLoop() {
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState({});
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [toasts, setToasts] = useState([]);
  const [notifPanel, setNotifPanel] = useState(false);
  const [dashPage, setDashPage] = useState("overview");
  const [listStep, setListStep] = useState(1);
  const [searchQ, setSearchQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    { id:1, title:"Your reservation for Arduino Uno Kit is confirmed", time:"2 min ago", read:false },
    { id:2, title:"Ahmed M. sent you a message about the Raspberry Pi", time:"1 hr ago", read:false },
    { id:3, title:"New e-waste items listed near your campus", time:"3 hr ago", read:true },
    { id:4, title:"Semester end: 40+ items needing a new home this week", time:"Yesterday", read:true },
    { id:5, title:"Nour H. accepted your wishlist match request", time:"2 days ago", read:true },
  ]);
  const [modalContent, setModalContent] = useState(null);
  const [activeMapPin, setActiveMapPin] = useState(null);
  const toastIdRef = useRef(0);
  const themeStyles = useThemeStyles(theme);

  const addToast = useCallback((msg, type = "success") => {
    const id = ++toastIdRef.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3400);
  }, []);

  const navigate = useCallback((p, data = {}) => {
    setPage(p); setPageData(data); setNotifPanel(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = useCallback((id) => {
    const item = WASTE_ITEMS.find(r => r.id === id);
    setCart(c => {
      if (c.some(x => x.id === id)) {
        addToast("Removed from basket", "info");
        return c.filter(x => x.id !== id);
      }
      addToast(`Added to basket — ${item.wasteKg}kg e-waste saved!`);
      return [...c, item];
    });
  }, [addToast]);

  const toggleWish = useCallback((id) => {
    const item = WASTE_ITEMS.find(r => r.id === id);
    setWishlist(w => {
      if (w.some(x => x.id === id)) { addToast("Removed from wishlist", "info"); return w.filter(x => x.id !== id); }
      addToast("Saved to wishlist");
      return [...w, item];
    });
  }, [addToast]);

  const doLogin = useCallback(() => {
    setUser({ name: "Ahmed Mohamed", email: "demo@aucegypt.edu" });
    setGuest(false); addToast("Welcome back, Ahmed!");
    navigate("dashboard");
  }, [addToast, navigate]);

  const doSignup = useCallback((firstName, lastName, email) => {
    setUser({ name: `${firstName} ${lastName}`, email });
    setGuest(false);
    addToast(`Welcome to GreenLoop, ${firstName}!`);
    navigate("dashboard");
  }, [addToast, navigate]);

  const doLogout = useCallback(() => {
    setUser(null); setGuest(false); setCart([]); setWishlist([]);
    setDashPage("overview"); addToast("Signed out successfully", "info");
    navigate("home");
  }, [addToast, navigate]);

  const markAllRead = useCallback(() => {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    setNotifPanel(false); addToast("All notifications marked read");
  }, [addToast]);

  const unread = notifications.filter(n => !n.read).length;
  const inCart = (id) => cart.some(c => c.id === id);
  const inWish = (id) => wishlist.some(w => w.id === id);

  const baseStyle = {
    ...themeStyles,
    fontFamily: "'DM Sans', sans-serif",
    background: "var(--bg0)", color: "var(--fg0)",
    minHeight: "100vh", fontSize: 14, lineHeight: 1.6,
    transition: "background .3s, color .3s",
  };

  // ─── Render Pages ─────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case "home":       return <PageHome navigate={navigate} />;
      case "browse":     return <PageBrowse navigate={navigate} searchQ={searchQ} setSearchQ={setSearchQ} activeFilter={activeFilter} setActiveFilter={setActiveFilter} inCart={inCart} inWish={inWish} addToCart={addToCart} toggleWish={toggleWish} />;
      case "item":       return <PageItem navigate={navigate} pageData={pageData} inCart={inCart} inWish={inWish} addToCart={addToCart} toggleWish={toggleWish} setModalContent={setModalContent} />;
      case "login":      return <PageLogin navigate={navigate} doLogin={doLogin} setGuest={setGuest} addToast={addToast} />;
      case "signup":     return <PageSignup navigate={navigate} doSignup={doSignup} setGuest={setGuest} addToast={addToast} />;
      case "dashboard":  return <PageDashboard navigate={navigate} user={user} guest={guest} dashPage={dashPage} setDashPage={setDashPage} cart={cart} wishlist={wishlist} doLogout={doLogout} addToast={addToast} setModalContent={setModalContent} />;
      case "cart":       return <PageCart navigate={navigate} cart={cart} setCart={setCart} addToast={addToast} setNotifications={setNotifications} user={user} />;
      case "wishlist":   return <PageWishlist navigate={navigate} wishlist={wishlist} toggleWish={toggleWish} addToCart={addToCart} inCart={inCart} />;
      case "checkout":   return <PageCheckout navigate={navigate} cart={cart} setCart={setCart} addToast={addToast} setNotifications={setNotifications} />;
      case "impact":     return <PageImpact navigate={navigate} />;
      case "campus-map": return <PageCampusMap navigate={navigate} activeMapPin={activeMapPin} setActiveMapPin={setActiveMapPin} />;
      case "leaderboard":return <PageLeaderboard navigate={navigate} />;
      case "list-item":  return <PageListItem navigate={navigate} listStep={listStep} setListStep={setListStep} addToast={addToast} setNotifications={setNotifications} />;
      case "settings":   return <PageSettings navigate={navigate} theme={theme} setTheme={setTheme} />;
      case "profile":    return <PageProfile navigate={navigate} user={user} doLogout={doLogout} />;
      default:           return <PageHome navigate={navigate} />;
    }
  };

  const showFooter = !["dashboard","login","signup","checkout","list-item"].includes(page);

  return (
    <div style={baseStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; font-size: 14px; color: inherit; }
        input, select, textarea { font-family: inherit; font-size: 14px; background: var(--bg2); color: var(--fg0); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; width: 100%; outline: none; transition: all .2s; }
        input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(34,197,94,.12); }
        select option { background: var(--bg1); color: var(--fg0); }
        a { color: inherit; text-decoration: none; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100% { opacity:.6 } 50% { opacity:1 } }
        @keyframes leafFloat { 0%,100% { transform:translateY(0) rotate(0deg) } 50% { transform:translateY(-12px) rotate(8deg) } }
        @keyframes mobileMenuIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .page-anim { animation: fadeIn .28s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg1); }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
        .hover-card:hover { border-color: var(--accent) !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(34,197,94,.12); }
        .hover-row:hover { background: var(--bg2) !important; }
        .hover-scale:hover { transform: scale(1.05); }
        input::placeholder { color: var(--fg3); }
        .leaderboard-table { width: 100%; }
        .nav-desktop-links { display: flex; align-items: center; gap: 4px; margin-left: 16px; }
        .nav-desktop-actions { display: flex; align-items: center; gap: 6px; }
        .nav-mobile-toggle { display: none; }
        .nav-mobile-menu { display: none; }
        .hero-h1 { font-size: 56px; }
        .hero-stats { gap: 48px; }
        @media (max-width: 960px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .item-grid { grid-template-columns: 1fr !important; }
          .thumbs-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .dashboard-layout { grid-template-columns: 1fr !important; }
          .dashboard-sidebar { position: relative !important; top: 0 !important; height: auto !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .impact-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .impact-grid-2 { grid-template-columns: 1fr !important; }
          .map-grid { grid-template-columns: 1fr !important; }
          .leaderboard-head, .leaderboard-row { grid-template-columns: 40px 1fr 90px 70px 70px !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-actions { display: none !important; }
          .nav-mobile-toggle { display: flex !important; align-items: center; justify-content: center; padding: 8px; border-radius: 8px; border: 1px solid var(--border); color: var(--fg2); margin-left: auto; }
          .nav-mobile-menu { display: block !important; position: absolute; top: 60px; left: 0; right: 0; background: var(--bg1); border-bottom: 1px solid var(--border); z-index: 99; animation: mobileMenuIn .2s ease; box-shadow: var(--shadowLg); }
          .hero-h1 { font-size: 36px !important; letter-spacing: -0.02em !important; }
          .hero-stats { gap: 24px !important; flex-wrap: wrap; justify-content: center; }
          .hero-stats > div { min-width: 120px; }
          .hero-buttons { flex-direction: column !important; align-items: stretch !important; }
          .hero-buttons button { width: 100%; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-sidebar { display: none !important; }
          .dashboard-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .stats-grid-3 { grid-template-columns: 1fr !important; }
          .impact-grid { grid-template-columns: 1fr !important; }
          .card-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
          .leaderboard-table { overflow-x: auto; }
          .leaderboard-head, .leaderboard-row { min-width: 520px; }
          .page-pad { padding: 24px 16px !important; }
          .item-price-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .item-price-row button { width: 100%; }
          .checkout-item { flex-wrap: wrap; }
          .toast-container { left: 16px !important; right: 16px !important; bottom: 16px !important; }
          .notif-panel { width: calc(100vw - 32px) !important; right: -8px !important; }
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
          .dash-impact { grid-template-columns: 1fr !important; }
          .profile-stats { grid-template-columns: 1fr 1fr 1fr !important; }
        }
      `}</style>

      <Navbar
        navigate={navigate} page={page} user={user} guest={guest}
        theme={theme} setTheme={setTheme} cart={cart} wishlist={wishlist}
        notifPanel={notifPanel} setNotifPanel={setNotifPanel}
        notifications={notifications} markAllRead={markAllRead} unread={unread}
        doLogout={doLogout}
      />

      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      {showFooter && <Footer navigate={navigate} />}
      <Toast toasts={toasts} />

      {modalContent && (
        <div
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(6px)" }}
          onClick={() => setModalContent(null)}
        >
          <div onClick={e => e.stopPropagation()}>{modalContent(() => setModalContent(null), addToast)}</div>
        </div>
      )}
    </div>
  );
}

// ─── Hamburger Icon ────────────────────────────────────────────────────────────
function HamburgerIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (<><path d="M4 4l12 12M16 4L4 16" /></>) : (<><path d="M3 6h14M3 10h14M3 14h14" /></>)}
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ navigate, page, user, guest, theme, setTheme, cart, wishlist, notifPanel, setNotifPanel, notifications, markAllRead, unread, doLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { id:"browse", label:"Browse" },
    { id:"impact", label:"Impact" },
    { id:"campus-map", label:"Map" },
    { id:"leaderboard", label:"Leaderboard" },
    ...(user || guest ? [{ id:"dashboard", label:"Dashboard" }] : []),
  ];
  const go = (id) => { navigate(id); setMobileOpen(false); };

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      background: theme === "dark" ? "rgba(3,15,8,.95)" : "rgba(240,250,244,.97)",
      backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)",
    }}>
      {/* Main bar */}
      <div style={{ padding:"0 16px", height:60, display:"flex", alignItems:"center", gap:8 }}>
        {/* Logo */}
        <div onClick={() => go("home")} style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",flexShrink:0 }}>
          <div style={{
            width:32, height:32, borderRadius:"50%",
            background:"linear-gradient(135deg,var(--accent),var(--teal))",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}><Icon name="recycle" size={16} /></div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, letterSpacing:"-.02em", color:"var(--fg0)" }}>
            GreenLoop
          </span>
          <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--accent)", background:"rgba(34,197,94,.1)", padding:"2px 6px", borderRadius:4 }}>
            beta
          </span>
        </div>

        {/* Desktop Links */}
        <div className="nav-desktop-links">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              padding:"6px 11px", borderRadius:8, fontSize:13, fontWeight:500,
              color: page === l.id ? "var(--fg0)" : "var(--fg2)",
              background: page === l.id ? "var(--bg2)" : "transparent",
              transition:"all .2s",
            }}>{l.label}</button>
          ))}
        </div>

        <div style={{ flex:1 }} />

        {/* Desktop Actions */}
        <div className="nav-desktop-actions">
          <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{
            padding:"7px 10px", borderRadius:8, border:"1px solid var(--border)",
            color:"var(--fg2)", fontSize:14, transition:"all .2s", display:"flex", alignItems:"center",
          }}>
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
          </button>

          {user ? (<>
            <button onClick={() => go("list-item")} style={{
              padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600,
              background:"var(--accent)", color:"#fff", border:"1px solid transparent",
            }}>+ List Item</button>
            <button onClick={() => go("wishlist")} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid var(--border)", color:"var(--fg2)", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="heart" size={14} />{wishlist.length > 0 ? ` (${wishlist.length})` : ""}
            </button>
            <button onClick={() => go("cart")} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid var(--border)", color:"var(--fg2)", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="cart" size={14} />{cart.length > 0 ? ` (${cart.length})` : ""}
            </button>
            <div style={{ position:"relative" }}>
              <button onClick={() => setNotifPanel(p => !p)} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid var(--border)", color:"var(--fg2)", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="bell" size={14} />
                {unread > 0 ? <span style={{ fontSize:10, background:"var(--accent)", color:"#fff", borderRadius:10, padding:"1px 5px", marginLeft:3 }}>{unread}</span> : ""}
              </button>
              {notifPanel && (
                <div className="notif-panel" style={{
                  position:"absolute", top:"calc(100% + 8px)", right:0, width:340,
                  background:"var(--bg1)", border:"1px solid var(--border2)", borderRadius:12,
                  boxShadow:"var(--shadowLg)", overflow:"hidden", zIndex:200,
                }}>
                  <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>Notifications</span>
                    <button onClick={markAllRead} style={{ fontSize:12, color:"var(--accent)", padding:"4px 8px", borderRadius:6, border:"1px solid var(--border)" }}>Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      display:"flex", gap:12, padding:"12px 16px",
                      borderBottom:"1px solid var(--border)",
                      background: n.read ? "transparent" : "rgba(34,197,94,.04)",
                    }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background: n.read ? "var(--bg3)" : "var(--accent)", marginTop:5, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:500 }}>{n.title}</div>
                        <div style={{ fontSize:11, color:"var(--fg3)", fontFamily:"'DM Mono',monospace", marginTop:2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding:"10px 16px" }}>
                    <button onClick={() => setNotifPanel(false)} style={{ width:"100%", padding:"7px", border:"1px solid var(--border)", borderRadius:8, color:"var(--fg2)", fontSize:13 }}>Close</button>
                  </div>
                </div>
              )}
            </div>
            <Avatar name={user.name} size={32} />
          </>) : guest ? (<>
            <button onClick={() => go("cart")} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid var(--border)", color:"var(--fg2)", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="cart" size={14} />{cart.length > 0 ? ` (${cart.length})` : ""}
            </button>
            <button onClick={() => go("login")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid var(--border)", color:"var(--fg1)", fontSize:13 }}>Sign In</button>
            <button onClick={() => go("signup")} style={{ padding:"7px 14px", borderRadius:8, background:"var(--accent)", color:"#fff", fontSize:13 }}>Sign Up</button>
          </>) : (<>
            <button onClick={() => go("login")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid var(--border)", color:"var(--fg1)", fontSize:13 }}>Sign In</button>
            <button onClick={() => go("signup")} style={{ padding:"7px 14px", borderRadius:8, background:"var(--accent)", color:"#fff", fontSize:13 }}>Get Started</button>
          </>)}
        </div>

        {/* Mobile: quick cart/bell + hamburger */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }} className="nav-mobile-toggle-group">
          {user && (
            <button onClick={() => go("cart")} style={{ display:"none" }} className="mob-cart-btn">
              <Icon name="cart" size={18} />{cart.length > 0 ? <span style={{ fontSize:10, background:"var(--accent)", color:"#fff", borderRadius:10, padding:"1px 5px" }}>{cart.length}</span> : ""}
            </button>
          )}
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          {/* Nav links */}
          <div style={{ padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)} style={{
                display:"block", width:"100%", textAlign:"left",
                padding:"12px 20px", fontSize:15, fontWeight:500,
                color: page === l.id ? "var(--accent)" : "var(--fg1)",
                background: page === l.id ? "rgba(34,197,94,.06)" : "transparent",
                borderLeft: page === l.id ? "3px solid var(--accent)" : "3px solid transparent",
              }}>{l.label}</button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding:"12px 20px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {user ? (<>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid var(--border)", marginBottom:4 }}>
                <Avatar name={user.name} size={32} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{user.name}</div>
                  <div style={{ fontSize:11, color:"var(--fg3)" }}>{user.email}</div>
                </div>
              </div>
              <button onClick={() => go("list-item")} style={{ padding:"11px 16px", background:"var(--accent)", color:"#fff", borderRadius:10, fontWeight:600, fontSize:14, textAlign:"center" }}>+ List an Item</button>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <button onClick={() => go("wishlist")} style={{ padding:"10px", border:"1px solid var(--border)", borderRadius:8, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Icon name="heart" size={14} /> Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ""}</button>
                <button onClick={() => go("cart")} style={{ padding:"10px", border:"1px solid var(--border)", borderRadius:8, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Icon name="cart" size={14} /> Basket {cart.length > 0 ? `(${cart.length})` : ""}</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{ padding:"10px", border:"1px solid var(--border)", borderRadius:8, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Icon name={theme === "dark" ? "sun" : "moon"} size={14} /> {theme === "dark" ? "Light" : "Dark"}</button>
                <button onClick={() => { doLogout(); setMobileOpen(false); }} style={{ padding:"10px", background:"rgba(239,68,68,.1)", color:"var(--red)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, fontSize:13 }}>Sign out</button>
              </div>
            </>) : guest ? (<>
              <button onClick={() => go("cart")} style={{ padding:"11px", border:"1px solid var(--border)", borderRadius:8, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Icon name="cart" size={16} /> Basket {cart.length > 0 ? `(${cart.length})` : ""}</button>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <button onClick={() => go("login")} style={{ padding:"11px", border:"1px solid var(--border)", borderRadius:8, fontSize:14 }}>Sign In</button>
                <button onClick={() => go("signup")} style={{ padding:"11px", background:"var(--accent)", color:"#fff", borderRadius:8, fontSize:14, fontWeight:600 }}>Sign Up</button>
              </div>
            </>) : (<>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <button onClick={() => go("login")} style={{ padding:"11px", border:"1px solid var(--border)", borderRadius:8, fontSize:14 }}>Sign In</button>
                <button onClick={() => go("signup")} style={{ padding:"11px", background:"var(--accent)", color:"#fff", borderRadius:8, fontSize:14, fontWeight:600 }}>Get Started</button>
              </div>
              <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{ padding:"10px", border:"1px solid var(--border)", borderRadius:8, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><Icon name={theme === "dark" ? "sun" : "moon"} size={14} /> {theme === "dark" ? "Light mode" : "Dark mode"}</button>
            </>)}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer style={{ background:"var(--bg1)", borderTop:"1px solid var(--border)", padding:"40px 16px 28px", marginTop:"auto" }}>
      <div style={{ maxWidth:1140, margin:"0 auto" }}>
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:8, color:"var(--fg0)" }}>
              <Icon name="recycle" size={18} /> GreenLoop
            </div>
            <p style={{ fontSize:13, color:"var(--fg3)", lineHeight:1.7, maxWidth:240 }}>
              A circular economy platform connecting students across Egyptian universities to share, sell, and rescue reusable components — fighting e-waste one component at a time.
            </p>
            <div style={{ marginTop:14 }}>
              <Badge variant="green"><span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Icon name="globe" size={12} />92 kg e-waste diverted this semester</span></Badge>
            </div>
          </div>
          {[
            { title:"Platform", items:[["Browse","browse"],["Impact","impact"],["Campus Map","campus-map"],["Leaderboard","leaderboard"],["List an Item","list-item"]] },
            { title:"Account",  items:[["Sign Up","signup"],["Sign In","login"],["Dashboard","dashboard"],["Profile","profile"],["Settings","settings"]] },
            { title:"About",    items:[["How It Works",null],["Waste Goals",null],["Partner Unis",null],["Team EcoLoop",null],["EduPro 2026",null]] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--fg3)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>{col.title}</h4>
              {col.items.map(([label, link]) => (
                <div key={label} onClick={() => link && navigate(link)} style={{
                  fontSize:13, color:"var(--fg2)", padding:"3px 0", cursor: link ? "pointer" : "default",
                  transition:"color .2s",
                }} className="hover-link"
                  onMouseEnter={e => { if(link) e.target.style.color = "var(--fg0)"; }}
                  onMouseLeave={e => e.target.style.color = "var(--fg2)"}
                >{label}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, color:"var(--fg3)", flexWrap:"wrap", gap:8 }}>
          <span>© 2026 GreenLoop · Five-Nines Sustainability · AUC</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11 }}>EduPro Competition 2026 · Theme 1: Circular Economy</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page: Home ───────────────────────────────────────────────────────────────
function PageHome({ navigate }) {
  return (
    <div className="page-anim">
      {/* Hero */}
      <div style={{
        position:"relative", padding:"80px 24px 64px", textAlign:"center", overflow:"hidden",
        background:"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,.15) 0%, transparent 70%)",
      }}>
        {/* Floating leaves decoration */}
        {[["leaf",26],["leaf",26],["recycle",26],["seedling",26]].map(([l, size], i) => (
          <div key={i} style={{
            position:"absolute", fontSize:28, opacity:.15,
            top:`${15 + i * 18}%`, left: i % 2 === 0 ? `${5 + i * 3}%` : `${80 + i * 3}%`,
            animation:`leafFloat ${3 + i}s ease-in-out infinite`,
            animationDelay:`${i * 0.7}s`,
          }}><Icon name={l} size={size} /></div>
        ))}

        <div style={{ maxWidth:1140, margin:"0 auto" }}>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:".12em",
            color:"var(--accent)", textTransform:"uppercase", marginBottom:16,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          }}>
            <span style={{ width:32, height:1, background:"var(--accent)", opacity:.4, display:"inline-block" }} />
            Green Circular Economy Platform · Egypt
            <span style={{ width:32, height:1, background:"var(--accent)", opacity:.4, display:"inline-block" }} />
          </div>
          <h1 className="hero-h1" style={{
            fontFamily:"'Playfair Display',serif", fontSize:56, fontWeight:700,
            letterSpacing:"-.03em", lineHeight:1.05, marginBottom:20,
          }}>
            Rescue components.<br/>
            <em style={{ fontStyle:"italic", color:"var(--accent)", fontWeight:400 }}>Close the loop.</em>
          </h1>
          <p style={{ color:"var(--fg2)", fontSize:17, maxWidth:540, margin:"0 auto 36px", lineHeight:1.75, padding:"0 8px" }}>
            GreenLoop connects university students to share, sell, and discover reusable engineering components — keeping e-waste out of landfills, one project at a time.
          </p>
          <div className="hero-buttons" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap", padding:"0 16px" }}>
            <button onClick={() => navigate("signup")} style={{
              padding:"13px 28px", borderRadius:12, background:"var(--accent)", color:"#fff",
              fontWeight:600, fontSize:15, border:"1px solid transparent",
              boxShadow:"0 4px 24px rgba(34,197,94,.35)", transition:"all .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >Start for free →</button>
            <button onClick={() => { navigate("browse"); }} style={{
              padding:"13px 28px", borderRadius:12, border:"1px solid var(--border2)", color:"var(--fg1)",
              fontWeight:500, fontSize:15, transition:"all .2s",
            }}>Browse as Guest</button>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{
            display:"flex", justifyContent:"center", gap:48, marginTop:56,
            paddingTop:28, borderTop:"1px solid var(--border)", flexWrap:"wrap", padding:"28px 16px 0",
          }}>
            {[
              { num:"1,240+", label:"Components listed" },
              { num:"380+",   label:"Active students" },
              { num:"92 kg",  label:"E-waste diverted" },
              { num:"8 unis", label:"Partner campuses" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:"var(--accent2)", letterSpacing:"-.02em" }}>{s.num}</div>
                <div style={{ fontSize:12, color:"var(--fg3)", marginTop:2, fontFamily:"'DM Mono',monospace", letterSpacing:".04em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding:"40px 16px", maxWidth:1140, margin:"0 auto" }}>
        <div style={{
          background:"linear-gradient(135deg,rgba(34,197,94,.1),rgba(20,184,166,.07))",
          border:"1px solid rgba(34,197,94,.2)", borderRadius:12, padding:"14px 20px",
          display:"flex", alignItems:"center", gap:12, marginBottom:24,
        }}>
          <span style={{ display:"inline-flex" }}><Icon name="globe" size={20} /></span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:13, color:"var(--accent)" }}>Semester End — May 2026</div>
            <div style={{ fontSize:12, color:"var(--fg2)" }}>40+ components need rescuing this week as seniors wrap up graduation projects</div>
          </div>
          <button onClick={() => navigate("browse")} style={{
            padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:600,
            background:"rgba(34,197,94,.15)", color:"var(--accent)",
            border:"1px solid rgba(34,197,94,.25)",
          }}>Browse deals →</button>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, letterSpacing:"-.02em" }}>Featured rescues</h2>
            <p style={{ color:"var(--fg2)", fontSize:14 }}>Components ready for pickup — give them a second life</p>
          </div>
          <button onClick={() => navigate("browse")} style={{ padding:"7px 14px", border:"1px solid var(--border)", borderRadius:8, color:"var(--fg2)", fontSize:13 }}>View all →</button>
        </div>

        <div className="card-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {WASTE_ITEMS.slice(0, 8).map(r => (
            <ResourceCard key={r.id} r={r} navigate={navigate} inCart={() => false} inWish={() => false} addToCart={() => {}} toggleWish={() => {}} />
          ))}
        </div>

        {/* How it works */}
        <div style={{
          marginTop:48, background:"linear-gradient(135deg,rgba(34,197,94,.08),rgba(20,184,166,.05))",
          border:"1px solid rgba(34,197,94,.18)", borderRadius:16, padding:40, textAlign:"center",
        }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--accent)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>How it works</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:32 }}>Three steps to close the loop</h2>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, textAlign:"left" }}>
            {[
              { n:"01", t:"List your components", d:"Upload photos and set a fair price for your old project parts. Takes under 2 minutes.", icon:"upload" },
              { n:"02", t:"Match with students",  d:"Junior students discover exactly what they need via smart search and wishlist matching.", icon:"search" },
              { n:"03", t:"Exchange on campus",   d:"Meet safely on campus. Seller recoups costs; buyer saves money. Zero landfill.", icon:"handshake" },
            ].map(s => (
              <div key={s.n} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
                <div style={{ marginBottom:10 }}><Icon name={s.icon} size={26} /></div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--accent)", opacity:.6, marginBottom:4 }}>{s.n}</div>
                <div style={{ fontWeight:600, marginBottom:8 }}>{s.t}</div>
                <div style={{ color:"var(--fg2)", fontSize:13, lineHeight:1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"0 16px 48px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:8 }}>Ready to loop in?</h2>
        <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:20 }}>Join 380+ students already making their campus more circular.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={() => navigate("signup")} style={{ padding:"12px 24px", borderRadius:12, background:"var(--accent)", color:"#fff", fontWeight:600, fontSize:15 }}>Create free account →</button>
          <button onClick={() => navigate("impact")} style={{ padding:"12px 24px", borderRadius:12, border:"1px solid var(--border2)", color:"var(--fg1)", fontSize:15, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="recycle" size={16} /> See our impact
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Resource Card ─────────────────────────────────────────────────────────────
function ResourceCard({ r, navigate, inCart, inWish, addToCart, toggleWish }) {
  const cInCart = inCart(r.id);
  const cInWish = inWish(r.id);
  return (
    <div className="hover-card" onClick={() => navigate("item", { id: r.id })} style={{
      background:"var(--card)", border:"1px solid var(--border)", borderRadius:12,
      overflow:"hidden", cursor:"pointer", transition:"all .2s",
    }}>
      <div style={{
        height:140, background:"linear-gradient(135deg,var(--bg2),var(--bg3))",
        position:"relative", display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{ fontSize:44, opacity:.85 }}><Icon name={r.icon} size={40} /></span>
        <div style={{ position:"absolute", top:8, right:8 }} onClick={e => { e.stopPropagation(); toggleWish(r.id); }}>
          <button style={{
            padding:"4px 7px", borderRadius:6, background:"var(--bg1)",
            border:"1px solid var(--border)", fontSize:14,
          }}>{cInWish ? <Icon name="heart" size={14} /> : <Icon name="heartOutline" size={14} />}</button>
        </div>
        <div style={{ position:"absolute", bottom:8, left:8 }}>
          <Badge variant={r.availability === "available" ? "green" : "amber"}>{r.availability}</Badge>
        </div>
        {/* Waste saved label */}
        <div style={{
          position:"absolute", bottom:8, right:8,
          fontSize:10, background:"rgba(34,197,94,.18)", color:"var(--accent)",
          borderRadius:4, padding:"2px 6px", fontFamily:"'DM Mono',monospace",
        }}>↑ {r.wasteKg}kg saved</div>
      </div>
      <div style={{ padding:14 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{r.name}</div>
        <div style={{ color:"var(--fg2)", fontSize:12, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
          <Icon name="location" size={12} /> {r.location} · {r.provider}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
          <span style={{ color:"var(--amber)", fontSize:13 }}>{"★".repeat(Math.floor(r.rating))}</span>
          <span style={{ fontSize:12, color:"var(--fg2)" }}>{r.rating} ({r.reviews})</span>
          <span style={{ fontSize:11, color:"var(--fg3)", marginLeft:"auto", fontFamily:"'DM Mono',monospace" }}>{r.views}v</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:15, fontWeight:600, color:"var(--accent2)" }}>
            {r.price} <span style={{ fontSize:11, color:"var(--fg3)", fontWeight:400 }}>{r.unit}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); if (r.availability === "available") addToCart(r.id); }}
            style={{
              padding:"5px 10px", borderRadius:8, fontSize:12, fontWeight:600,
              background: cInCart ? "var(--teal)" : "var(--accent)",
              color:"#fff", transition:"all .2s", opacity: r.availability !== "available" ? .5 : 1,
            }}
          >{r.availability !== "available" ? "Reserved" : cInCart ? "✓ Added" : "+ Rescue"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Browse ─────────────────────────────────────────────────────────────
function PageBrowse({ navigate, searchQ, setSearchQ, activeFilter, setActiveFilter, inCart, inWish, addToCart, toggleWish }) {
  const filtered = WASTE_ITEMS.filter(r => {
    const q = searchQ.toLowerCase();
    const mQ = !q || r.name.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)) || r.location.toLowerCase().includes(q);
    const mC = activeFilter === "all" || r.category === activeFilter;
    return mQ && mC;
  });

  return (
    <div className="page-anim" style={{ padding:"24px 16px", maxWidth:1140, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, letterSpacing:"-.02em" }}>Browse rescued items</h1>
          <p style={{ color:"var(--fg2)", fontSize:14 }}>{filtered.length} of {WASTE_ITEMS.length} components · 8 campuses</p>
        </div>
        <div style={{
          display:"flex", gap:8, background:"var(--bg2)", border:"1px solid var(--border)",
          borderRadius:12, padding:"6px 6px 6px 16px", alignItems:"center", maxWidth:380, width:"100%",
        }}>
          <span style={{ color:"var(--fg3)" }}><Icon name="search" size={14} /></span>
          <input
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Arduino, sensors, motors…"
            style={{ background:"none", border:"none", flex:1, padding:"6px 0", outline:"none", boxShadow:"none" }}
          />
          {searchQ && <button onClick={() => setSearchQ("")} style={{ fontSize:12, padding:"4px 6px", border:"1px solid var(--border)", borderRadius:6, color:"var(--fg3)" }}><Icon name="close" size={12} /></button>}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20, alignItems:"center" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveFilter(c)} style={{
            padding:"6px 14px", borderRadius:24, border:"1px solid var(--border)",
            fontSize:12, fontWeight:500, cursor:"pointer", transition:"all .2s",
            background: activeFilter === c ? "var(--accent)" : "transparent",
            borderColor: activeFilter === c ? "var(--accent)" : "var(--border)",
            color: activeFilter === c ? "#fff" : "var(--fg2)",
          }}>
            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
        <button onClick={() => navigate("campus-map")} style={{
          marginLeft:"auto", padding:"6px 14px", borderRadius:24,
          border:"1px solid var(--border)", fontSize:12, color:"var(--fg2)",
          display:"flex", alignItems:"center", gap:6,
        }}><Icon name="location" size={12} /> Map view</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"var(--fg3)" }}>
          <div style={{ fontSize:48, marginBottom:16 }}><Icon name="leaf" size={40} /></div>
          <div style={{ fontSize:18, fontWeight:600, marginBottom:8, color:"var(--fg1)" }}>No items found for "{searchQ}"</div>
          <div style={{ fontSize:14, marginBottom:24 }}>Try different keywords or clear your filters</div>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button onClick={() => { setSearchQ(""); setActiveFilter("all"); }} style={{ padding:"8px 16px", border:"1px solid var(--border)", borderRadius:8, color:"var(--fg1)" }}>Clear filters</button>
            <button onClick={() => navigate("list-item")} style={{ padding:"8px 16px", background:"var(--accent)", color:"#fff", borderRadius:8 }}>List this component</button>
          </div>
        </div>
      ) : (
        <div className="card-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {filtered.map(r => <ResourceCard key={r.id} r={r} navigate={navigate} inCart={inCart} inWish={inWish} addToCart={addToCart} toggleWish={toggleWish} />)}
        </div>
      )}
    </div>
  );
}

// ─── Page: Item ───────────────────────────────────────────────────────────────
function PageItem({ navigate, pageData, inCart, inWish, addToCart, toggleWish, setModalContent }) {
  const r = WASTE_ITEMS.find(x => x.id === pageData?.id) || WASTE_ITEMS[0];
  const related = WASTE_ITEMS.filter(x => x.id !== r.id && x.category === r.category).slice(0, 4);
  const cInCart = inCart(r.id), cInWish = inWish(r.id);

  return (
    <div className="page-anim" style={{ padding:"24px 16px", maxWidth:1140, margin:"0 auto" }}>
      <button onClick={() => navigate("browse")} style={{ padding:"7px 14px", border:"1px solid var(--border)", borderRadius:8, marginBottom:20, color:"var(--fg2)", fontSize:13 }}>← Back to browse</button>
      <div className="item-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
        <div>
          <div style={{
            background:"linear-gradient(135deg,var(--bg2),var(--bg3))", borderRadius:16,
            height:280, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:80, border:"1px solid var(--border)",
          }}><Icon name={r.icon} size={64} /></div>
          <div className="thumbs-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                background:"var(--bg2)", borderRadius:8, height:64,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, border:"1px solid var(--border)", cursor:"pointer", transition:"all .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              ><Icon name={r.icon} size={24} /></div>
            ))}
          </div>
          {/* Waste impact card */}
          <div style={{
            marginTop:16, background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)",
            borderRadius:12, padding:16,
          }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--accent)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="recycle" size={12} /> Rescue impact
            </div>
            <div style={{ display:"flex", gap:16 }}>
              {[
                { val:`${r.wasteKg} kg`, label:"E-waste saved" },
                { val:`${(r.wasteKg * 2.3).toFixed(1)} kg`, label:"CO₂ avoided" },
                { val:"1", label:"Item rescued" },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center", flex:1 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"var(--accent)" }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"var(--fg3)", fontFamily:"'DM Mono',monospace" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <Badge variant="green">{r.category}</Badge>
            <Badge variant={r.availability === "available" ? "green" : "amber"}>{r.availability}</Badge>
            <Badge variant="blue">Condition: {r.condition}</Badge>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, letterSpacing:"-.02em", marginBottom:8 }}>{r.name}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <span style={{ color:"var(--amber)", fontSize:15 }}>{"★".repeat(Math.floor(r.rating))}</span>
            <span style={{ fontSize:13, color:"var(--fg2)" }}>{r.rating} · {r.reviews} reviews · {r.views} views</span>
          </div>
          <p style={{ color:"var(--fg2)", fontSize:14, lineHeight:1.7, marginBottom:20 }}>{r.description}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
            {r.tags.map(t => (
              <span key={t} style={{ fontSize:11, padding:"3px 8px", borderRadius:4, background:"var(--bg3)", color:"var(--fg2)", fontFamily:"'DM Mono',monospace" }}>{t}</span>
            ))}
          </div>
          {/* Provider */}
          <div style={{
            display:"flex", alignItems:"center", gap:16, padding:16,
            background:"var(--bg2)", borderRadius:12, marginBottom:20, border:"1px solid var(--border)",
          }}>
            <Avatar name={r.provider} size={40} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{r.provider}</div>
              <div style={{ fontSize:12, color:"var(--fg2)", display:"flex", alignItems:"center", gap:6 }}><Icon name="location" size={12} /> {r.location} · Listed {r.listed}</div>
            </div>
            <button onClick={() => setModalContent((onClose, addToast) => <ContactModal onClose={onClose} addToast={addToast} provider={r.provider} />)} style={{
              padding:"6px 14px", borderRadius:8, border:"1px solid var(--border)", fontSize:13, color:"var(--fg1)",
            }}>Contact</button>
          </div>
          {/* Price */}
          <div className="item-price-row" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:"var(--accent2)" }}>
              {r.price} <span style={{ fontSize:18, color:"var(--fg2)", fontWeight:400 }}>{r.unit}</span>
            </div>
            <div style={{ fontSize:12, color:"var(--accent)", background:"rgba(34,197,94,.08)", borderRadius:4, padding:"4px 8px", border:"1px solid rgba(34,197,94,.15)" }}>
              ↓ vs. new price
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => addToCart(r.id)} style={{
              flex:1, padding:12, fontSize:15, fontWeight:600, borderRadius:10,
              background: cInCart ? "var(--teal)" : "var(--accent)", color:"#fff", transition:"all .2s",
            }}>{cInCart ? "✓ In Basket — Remove" : "+ Rescue this item"}</button>
            <button onClick={() => toggleWish(r.id)} style={{ padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", transition:"all .2s" }}>
              {cInWish ? <Icon name="heart" size={18} /> : <Icon name="heartOutline" size={18} />}
            </button>
          </div>
          <p style={{ fontSize:12, color:"var(--fg3)", marginTop:10, textAlign:"center", display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
            <Icon name="cash" size={12} /> Cash on pickup. No platform fees.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop:48 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:16 }}>More in {r.category}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
            {related.map(r2 => <ResourceCard key={r2.id} r={r2} navigate={() => {}} inCart={() => false} inWish={() => false} addToCart={() => {}} toggleWish={() => {}} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────────
function ContactModal({ onClose, addToast, provider }) {
  return (
    <div style={{ background:"var(--bg1)", border:"1px solid var(--border2)", borderRadius:16, padding:28, maxWidth:480, width:"100%", position:"relative" }}>
      <button onClick={onClose} style={{ position:"absolute", top:16, right:16, padding:6, borderRadius:8, color:"var(--fg2)", fontSize:16 }}><Icon name="close" size={16} /></button>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:6 }}>Contact {provider}</h2>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:20 }}>Send a message about this component</p>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>Your message</label>
        <textarea rows={4} defaultValue="Hi! I'm interested in rescuing this component. Is it still available?" style={{ resize:"none" }} />
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={() => { onClose(); addToast("Message sent!"); }} style={{ flex:1, padding:"10px", background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600 }}>Send message</button>
        <button onClick={onClose} style={{ padding:"10px 16px", border:"1px solid var(--border)", borderRadius:8, color:"var(--fg1)" }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Page: Login ──────────────────────────────────────────────────────────────
function PageLogin({ navigate, doLogin, setGuest, addToast }) {
  return (
    <div className="page-anim" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 60px)", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div onClick={() => navigate("home")} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24, cursor:"pointer" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--teal))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}><Icon name="recycle" size={14} /></div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700 }}>GreenLoop</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, letterSpacing:"-.02em", marginBottom:6 }}>Welcome back</h1>
        <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:28 }}>Sign in to your account to continue rescuing components</p>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:24, boxShadow:"var(--shadow)" }}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>University Email</label>
            <input type="email" id="login-email" placeholder="you@university.edu.eg" defaultValue="demo@aucegypt.edu" />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>Password</label>
            <input type="password" placeholder="••••••••" defaultValue="password123" />
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button onClick={() => addToast("Password reset link sent!", "info")} style={{ fontSize:12, color:"var(--accent)", padding:"4px 8px", borderRadius:6 }}>Forgot password?</button>
          </div>
          <button onClick={doLogin} style={{ width:"100%", padding:12, background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:15 }}>Sign in →</button>
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0", color:"var(--fg3)", fontSize:12 }}>
            <span style={{ flex:1, height:1, background:"var(--border)" }} />or<span style={{ flex:1, height:1, background:"var(--border)" }} />
          </div>
          <button onClick={() => { setGuest(true); addToast("Browsing as guest — sign up to rescue items", "info"); navigate("browse"); }} style={{ width:"100%", padding:12, border:"1px solid var(--border)", borderRadius:8, color:"var(--fg1)", fontSize:13 }}>Continue as Guest</button>
        </div>
        <p style={{ textAlign:"center", fontSize:13, color:"var(--fg2)", marginTop:16 }}>
          No account?{" "}
          <button onClick={() => navigate("signup")} style={{ color:"var(--accent)", fontSize:13, fontWeight:600 }}>Sign up free →</button>
        </p>
      </div>
    </div>
  );
}

// ─── Page: Signup ─────────────────────────────────────────────────────────────
function PageSignup({ navigate, doSignup, setGuest, addToast }) {
  const [form, setForm] = useState({ fn:"", ln:"", email:"", uni:"", pw:"" });
  return (
    <div className="page-anim" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 60px)", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div onClick={() => navigate("home")} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24, cursor:"pointer" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--teal))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}><Icon name="recycle" size={14} /></div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700 }}>GreenLoop</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, letterSpacing:"-.02em", marginBottom:6 }}>Join GreenLoop</h1>
        <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:28 }}>Join 380+ students fighting e-waste on campus</p>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:24, boxShadow:"var(--shadow)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            {[["First name","Ahmed","fn"],["Last name","Mohamed","ln"]].map(([label, ph, key]) => (
              <div key={key}>
                <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>{label}</label>
                <input placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          {[
            ["University Email","you@university.edu.eg","email","email"],
          ].map(([label, ph, type, key]) => (
            <div key={key} style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              <div style={{ fontSize:11, color:"var(--fg3)", marginTop:4 }}>Must be a .edu.eg address</div>
            </div>
          ))}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>University</label>
            <select value={form.uni} onChange={e => setForm(f => ({ ...f, uni: e.target.value }))}>
              {["The American University in Cairo","Cairo University","German University in Cairo","Ain Shams University","British University in Egypt","Nile University"].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>Password</label>
            <input type="password" placeholder="Min. 8 characters" value={form.pw} onChange={e => setForm(f => ({ ...f, pw: e.target.value }))} />
          </div>
          <button onClick={() => doSignup(form.fn || "Ahmed", form.ln || "Mohamed", form.email || "ahmed@aucegypt.edu")} style={{ width:"100%", padding:12, background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:15 }}>
            Create account →
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0", color:"var(--fg3)", fontSize:12 }}>
            <span style={{ flex:1, height:1, background:"var(--border)" }} />or<span style={{ flex:1, height:1, background:"var(--border)" }} />
          </div>
          <button onClick={() => { setGuest(true); addToast("Browsing as guest", "info"); navigate("browse"); }} style={{ width:"100%", padding:12, border:"1px solid var(--border)", borderRadius:8, color:"var(--fg1)", fontSize:13 }}>Continue as Guest</button>
        </div>
        <p style={{ textAlign:"center", fontSize:13, color:"var(--fg2)", marginTop:16 }}>
          Already have an account?{" "}
          <button onClick={() => navigate("login")} style={{ color:"var(--accent)", fontSize:13, fontWeight:600 }}>Sign in →</button>
        </p>
      </div>
    </div>
  );
}

// ─── Page: Dashboard ──────────────────────────────────────────────────────────
function PageDashboard({ navigate, user, guest, dashPage, setDashPage, cart, wishlist, doLogout, addToast, setModalContent }) {
  const name = user?.name || "Guest";
  const items = [
    { id:"overview",     icon:"grid", label:"Overview" },
    { id:"reservations", icon:"package", label:"Reservations", badge:2 },
    { id:"listings",     icon:"tag",  label:"My Listings" },
    { id:"messages",     icon:"message", label:"Messages", badge:3 },
    { id:"analytics",    icon:"chart", label:"Analytics" },
    { id:"wishlist2",    icon:"heart",  label:"Wishlist", badge: wishlist.length || null },
  ];

  return (
    <div className="page-anim">
      {/* Mobile Tab Bar */}
      <div style={{
        display:"none", overflowX:"auto", borderBottom:"1px solid var(--border)",
        background:"var(--bg1)", padding:"0 8px", scrollbarWidth:"none",
      }} className="dash-mobile-tabs">
        <style>{`.dash-mobile-tabs { display: flex !important; } @media (min-width: 769px) { .dash-mobile-tabs { display: none !important; } }`}</style>
        {items.map(s => (
          <button key={s.id} onClick={() => setDashPage(s.id)} style={{
            padding:"12px 14px", fontSize:12, fontWeight:500, whiteSpace:"nowrap", flexShrink:0,
            color: dashPage === s.id ? "var(--accent)" : "var(--fg2)",
            borderBottom: dashPage === s.id ? "2px solid var(--accent)" : "2px solid transparent",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <Icon name={s.icon} size={14} />{s.label}
            {s.badge ? <span style={{ fontSize:10, background:"var(--accent)", color:"#fff", padding:"1px 5px", borderRadius:4 }}>{s.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="dashboard-layout" style={{ display:"grid", gridTemplateColumns:"224px 1fr", minHeight:"calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <div className="dashboard-sidebar" style={{ background:"var(--bg1)", borderRight:"1px solid var(--border)", padding:"16px 0", position:"sticky", top:60, height:"calc(100vh - 60px)", overflowY:"auto" }}>
        <div style={{ padding:"8px 16px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:8, background:"var(--bg2)", borderRadius:8 }}>
            <Avatar name={name} size={36} />
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{name}</div>
              <div style={{ fontSize:11, color:"var(--fg3)", fontFamily:"'DM Mono',monospace" }}>{user?.email || "guest@loop.com"}</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"8px 16px", fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--fg3)", letterSpacing:".08em", textTransform:"uppercase" }}>Menu</div>
        {items.map(s => (
          <button key={s.id} onClick={() => setDashPage(s.id)} style={{
            display:"flex", alignItems:"center", gap:10, padding:"9px 16px", width:"100%",
            color: dashPage === s.id ? "var(--fg0)" : "var(--fg2)",
            fontSize:13, fontWeight:500, margin:"1px 8px", borderRadius:8,
            background: dashPage === s.id ? "var(--bg2)" : "transparent",
            transition:"all .2s", textAlign:"left",
          }}>
            <span><Icon name={s.icon} size={14} /></span><span>{s.label}</span>
            {s.badge ? <span style={{ marginLeft:"auto", fontSize:10, background:"var(--accent)", color:"#fff", padding:"1px 6px", borderRadius:4 }}>{s.badge}</span> : null}
          </button>
        ))}
        <div style={{ padding:"8px 16px", fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--fg3)", letterSpacing:".08em", textTransform:"uppercase", marginTop:8 }}>Account</div>
        {[["plus","List an Item","list-item"],["leaf","Impact","impact"],["cog","Settings","settings"]].map(([icon, label, path]) => (
          <button key={path} onClick={() => navigate(path)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 16px", width:"100%", color:"var(--fg2)", fontSize:13, margin:"1px 8px", borderRadius:8, background:"transparent", textAlign:"left" }}><Icon name={icon} size={14} /> {label}</button>
        ))}
        <button onClick={doLogout} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 16px", width:"100%", color:"var(--fg2)", fontSize:13, margin:"1px 8px", borderRadius:8, textAlign:"left" }}><Icon name="door" size={14} /> Sign out</button>
      </div>

      {/* Content */}
      <div style={{ padding:"20px 16px", overflowY:"auto" }}>
        <DashContent id={dashPage} name={name} navigate={navigate} wishlist={wishlist} addToast={addToast} setModalContent={setModalContent} />
      </div>
    </div>
    </div>
  );
}

function DashContent({ id, name, navigate, wishlist, addToast, setModalContent }) {
  if (id === "overview") return (
    <div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, marginBottom:4, display:"flex", alignItems:"center", gap:8 }}>
        Good morning, {name.split(" ")[0]} <Icon name="leaf" size={18} />
      </h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:28 }}>Your sustainability dashboard for this semester.</p>
      <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          { l:"Components rescued", v:"12", u:"units",         c:"green" },
          { l:"EGP saved",         v:"1,240", u:"this semester", c:"accent" },
          { l:"E-waste diverted",  v:"3.2", u:"kg",            c:"teal" },
          { l:"Listings active",   v:"4",   u:"components",    c:"blue" },
        ].map(s => (
          <div key={s.l} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, color:"var(--fg3)", fontFamily:"'DM Mono',monospace", marginBottom:6 }}>{s.l}</div>
            <div style={{ fontSize:24, fontWeight:700, fontFamily:"'Playfair Display',serif", color:`var(--${s.c})` }}>{s.v}</div>
            <div style={{ fontSize:11, color:"var(--fg3)" }}>{s.u}</div>
          </div>
        ))}
      </div>
      <div className="impact-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>Active Reservations</span><Badge variant="green">2 active</Badge>
          </div>
          {[
            { name:"Arduino Uno R3 Kit", status:"Confirmed", price:"120 EGP", icon:"plug", date:"May 30" },
            { name:"HC-SR04 Sensors x5", status:"Pending",   price:"75 EGP",  icon:"antenna", date:"Jun 1" },
          ].map(r => (
            <div key={r.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:22 }}><Icon name={r.icon} size={20} /></span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{r.name}</div>
                <div style={{ fontSize:12, color:"var(--fg2)" }}>{r.price} · Pickup {r.date}</div>
              </div>
              <Badge variant={r.status === "Confirmed" ? "green" : "amber"}>{r.status}</Badge>
            </div>
          ))}
        </div>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
          <div style={{ fontWeight:600, marginBottom:16 }}>Waste rescue tracker</div>
          {[
            { label:"Semester goal",    pct:72, color:"var(--accent)" },
            { label:"E-waste diverted", pct:48, color:"var(--teal)" },
            { label:"Community score",  pct:85, color:"var(--blue)" },
          ].map(b => (
            <div key={b.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
                <span style={{ color:"var(--fg2)" }}>{b.label}</span>
                <span style={{ fontFamily:"'DM Mono',monospace" }}>{b.pct}%</span>
              </div>
              <ProgressBar pct={b.pct} color={b.color} />
            </div>
          ))}
          <button onClick={() => navigate("impact")} style={{ width:"100%", marginTop:4, padding:"7px", border:"1px solid var(--border)", borderRadius:8, color:"var(--fg2)", fontSize:12 }}>Full impact report →</button>
        </div>
      </div>
    </div>
  );

  if (id === "reservations") return (
    <div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:4 }}>My Reservations</h2>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:20 }}>Track and manage your active rescues</p>
      {[
        { name:"Arduino Uno R3 Kit", provider:"Omar K.",  price:120, status:"Confirmed", date:"May 30, 2026", icon:"plug", location:"AUC New Cairo — Main Gate" },
        { name:"HC-SR04 Sensors x5", provider:"Nour H.",  price:75,  status:"Pending",   date:"Jun 1, 2026",  icon:"antenna", location:"AUC New Cairo — Engineering" },
        { name:"ESP32 Dev Board x2", provider:"Layla F.", price:200, status:"Completed",  date:"May 15, 2026", icon:"wifi", location:"AUC New Cairo" },
      ].map(r => (
        <div key={r.name} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:20, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:36 }}><Icon name={r.icon} size={28} /></span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, marginBottom:2 }}>{r.name}</div>
              <div style={{ fontSize:12, color:"var(--fg2)" }}>From {r.provider} · {r.location}</div>
              <div style={{ fontSize:12, color:"var(--fg3)", fontFamily:"'DM Mono',monospace", marginTop:2 }}>Pickup: {r.date}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:16, fontWeight:600, color:"var(--accent2)", marginBottom:4 }}>{r.price} EGP</div>
              <Badge variant={r.status === "Confirmed" ? "green" : r.status === "Pending" ? "amber" : "blue"}>{r.status}</Badge>
            </div>
          </div>
          {r.status !== "Completed" && (
            <div style={{ display:"flex", gap:8, marginTop:12, borderTop:"1px solid var(--border)", paddingTop:12 }}>
              <button onClick={() => addToast("Message sent!")} style={{ padding:"5px 12px", border:"1px solid var(--border)", borderRadius:8, fontSize:12, color:"var(--fg1)", display:"flex", alignItems:"center", gap:6 }}><Icon name="message" size={12} /> Message</button>
              <button onClick={() => addToast("Reschedule requested", "info")} style={{ padding:"5px 12px", border:"1px solid var(--border)", borderRadius:8, fontSize:12, color:"var(--fg1)", display:"flex", alignItems:"center", gap:6 }}><Icon name="calendar" size={12} /> Reschedule</button>
              <button onClick={() => addToast("Reservation cancelled", "error")} style={{ marginLeft:"auto", padding:"5px 12px", background:"rgba(239,68,68,.1)", color:"var(--red)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, fontSize:12 }}>Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (id === "listings") return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:4 }}>My Listings</h2>
          <p style={{ color:"var(--fg2)", fontSize:14 }}>Manage your listed components</p>
        </div>
        <button onClick={() => navigate("list-item")} style={{ padding:"8px 16px", background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:13 }}>+ New Listing</button>
      </div>
      <div className="stats-grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[{ l:"Active listings", v:"4", c:"green" }, { l:"Total views", v:"428", c:"blue" }, { l:"EGP earned", v:"840", c:"accent" }].map(s => (
          <div key={s.l} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:16, textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Playfair Display',serif", color:`var(--${s.c})`, marginBottom:4 }}>{s.v}</div>
            <div style={{ fontSize:11, color:"var(--fg3)", fontFamily:"'DM Mono',monospace" }}>{s.l}</div>
          </div>
        ))}
      </div>
      {WASTE_ITEMS.slice(0, 4).map(r => (
        <div key={r.id} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:20, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:32 }}><Icon name={r.icon} size={26} /></span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, marginBottom:2 }}>{r.name}</div>
              <div style={{ fontSize:12, color:"var(--fg2)" }}>{r.price} EGP · {r.location} · Listed {r.listed}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                <Badge variant={r.availability === "available" ? "green" : "amber"}>{r.availability}</Badge>
                <span style={{ fontSize:11, color:"var(--fg3)", fontFamily:"'DM Mono',monospace" }}>{r.views} views · {r.reviews} inquiries</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => addToast("Edit coming soon", "info")} style={{ padding:"5px 12px", border:"1px solid var(--border)", borderRadius:8, fontSize:12, color:"var(--fg1)" }}>Edit</button>
              <button onClick={() => addToast("Listing removed", "error")} style={{ padding:"5px 12px", background:"rgba(239,68,68,.1)", color:"var(--red)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, fontSize:12 }}>Remove</button>
            </div>
          </div>
          <div style={{ marginTop:10, borderTop:"1px solid var(--border)", paddingTop:10 }}>
            <ProgressBar pct={Math.round(r.reviews / 30 * 100)} />
            <div style={{ fontSize:11, color:"var(--fg3)", marginTop:4 }}>{r.reviews} of ~30 expected inquiries before rescue</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ textAlign:"center", padding:"60px 0", color:"var(--fg3)" }}>
      <div style={{ fontSize:40, marginBottom:12 }}><Icon name="leaf" size={36} /></div>
      <div style={{ fontSize:16, fontWeight:600, color:"var(--fg2)" }}>Section coming soon</div>
    </div>
  );
}

// ─── Page: Cart ───────────────────────────────────────────────────────────────
function PageCart({ navigate, cart, setCart, addToast, setNotifications, user }) {
  const total = cart.reduce((s, r) => s + r.price, 0);
  const totalWaste = cart.reduce((s, r) => s + r.wasteKg, 0);
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:760, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:4 }}>My Basket</h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:24 }}>{cart.length} {cart.length === 1 ? "item" : "items"} · {totalWaste.toFixed(2)} kg of e-waste being rescued</p>
      {cart.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"var(--fg3)" }}>
          <div style={{ fontSize:48, marginBottom:16 }}><Icon name="recycle" size={40} /></div>
          <div style={{ fontSize:18, fontWeight:600, color:"var(--fg1)", marginBottom:8 }}>Your basket is empty</div>
          <button onClick={() => navigate("browse")} style={{ padding:"10px 20px", background:"var(--accent)", color:"#fff", borderRadius:8, marginTop:12 }}>Browse rescued items</button>
        </div>
      ) : (
        <>
          {cart.map(r => (
            <div key={r.id} style={{ display:"flex", gap:14, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
              <div style={{ width:52, height:52, borderRadius:8, background:"var(--bg2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}><Icon name={r.icon} size={22} /></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600 }}>{r.name}</div>
                <div style={{ fontSize:12, color:"var(--fg2)" }}>{r.provider} · {r.location}</div>
                <div style={{ fontSize:11, color:"var(--accent)", marginTop:4, display:"flex", alignItems:"center", gap:6 }}><Icon name="recycle" size={12} /> Saves {r.wasteKg} kg e-waste</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:16, fontWeight:600, color:"var(--accent2)", marginBottom:6 }}>{r.price} EGP</div>
                <button onClick={() => { setCart(c => c.filter(x => x.id !== r.id)); addToast("Removed from basket", "info"); }} style={{ fontSize:12, color:"var(--red)", padding:"3px 8px", border:"1px solid rgba(239,68,68,.2)", borderRadius:6 }}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", borderRadius:12, padding:20, marginTop:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontWeight:600 }}>Total</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:20, fontWeight:700, color:"var(--accent2)" }}>{total} EGP</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--fg2)", marginBottom:4 }}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="globe" size={12} /> E-waste rescued</span><span style={{ color:"var(--accent)" }}>{totalWaste.toFixed(2)} kg</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--fg2)", marginBottom:16 }}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="seedling" size={12} /> CO₂ avoided</span><span style={{ color:"var(--teal)" }}>{(totalWaste * 2.3).toFixed(2)} kg</span>
            </div>
            {user ? (
              <button onClick={() => navigate("checkout")} style={{ width:"100%", padding:12, background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:15 }}>Confirm reservation →</button>
            ) : (
              <button onClick={() => navigate("login")} style={{ width:"100%", padding:12, background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:15 }}>Sign in to reserve →</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page: Wishlist ────────────────────────────────────────────────────────────
function PageWishlist({ navigate, wishlist, toggleWish, addToCart, inCart }) {
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:1140, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:4 }}>Wishlist</h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:24 }}>{wishlist.length} saved items</p>
      {wishlist.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"var(--fg3)" }}>
          <div style={{ fontSize:48, marginBottom:16 }}><Icon name="leaf" size={40} /></div>
          <div style={{ fontSize:18, fontWeight:600, color:"var(--fg1)", marginBottom:8 }}>Your wishlist is empty</div>
          <button onClick={() => navigate("browse")} style={{ padding:"10px 20px", background:"var(--accent)", color:"#fff", borderRadius:8, marginTop:12 }}>Browse rescued items</button>
        </div>
      ) : (
        <div className="card-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {wishlist.map(r => <ResourceCard key={r.id} r={r} navigate={navigate} inCart={inCart} inWish={() => true} addToCart={addToCart} toggleWish={toggleWish} />)}
        </div>
      )}
    </div>
  );
}

// ─── Page: Checkout ────────────────────────────────────────────────────────────
function PageCheckout({ navigate, cart, setCart, addToast, setNotifications }) {
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:600, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:4 }}>Confirm reservation</h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:28 }}>Review your items and confirm pickup details</p>
      {cart.map(r => (
        <div key={r.id} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
          <span style={{ fontSize:24 }}><Icon name={r.icon} size={20} /></span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
            <div style={{ fontSize:12, color:"var(--fg2)" }}>{r.provider} · {r.location}</div>
          </div>
          <span style={{ fontFamily:"'DM Mono',monospace", fontWeight:600, color:"var(--accent2)" }}>{r.price} EGP</span>
        </div>
      ))}
      <div style={{ marginTop:20 }}>
        <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>Pickup preference</label>
        <select><option>On campus — arrange via chat</option><option>Main Gate</option><option>Engineering Building</option></select>
      </div>
      <button onClick={() => {
        setCart([]);
        addToast("Reservation confirmed! Check your messages");
        setNotifications(n => [{ id: Date.now(), title:"Your reservation is confirmed — check pickup details", time:"Just now", read:false }, ...n]);
        navigate("dashboard");
      }} style={{ width:"100%", padding:14, background:"var(--accent)", color:"#fff", borderRadius:10, fontWeight:700, fontSize:16, marginTop:20, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        <Icon name="recycle" size={16} /> Confirm reservation
      </button>
    </div>
  );
}

// ─── Page: Impact ─────────────────────────────────────────────────────────────
function PageImpact({ navigate }) {
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:1140, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--accent)", textTransform:"uppercase", letterSpacing:".12em", marginBottom:12 }}>Environmental Impact</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:700, letterSpacing:"-.02em", marginBottom:16 }}>Our collective <em style={{ fontStyle:"italic", color:"var(--accent)" }}>green impact</em></h1>
        <p style={{ color:"var(--fg2)", fontSize:16, maxWidth:540, margin:"0 auto" }}>Every component rescued is a victory for the environment. Here's what our community has achieved together.</p>
      </div>

      <div className="impact-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:40 }}>
        {[
          { icon:"recycle", val:"92 kg",  label:"E-waste diverted",  sub:"from Cairo landfills" },
          { icon:"leaf", val:"211 kg", label:"CO₂ avoided",       sub:"equivalent" },
          { icon:"cash", val:"45k EGP",label:"Student savings",   sub:"across all campuses" },
          { icon:"campus", val:"1,240+", label:"Components rescued", sub:"and counting" },
        ].map(s => (
          <div key={s.label} style={{
            background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:24, textAlign:"center",
            background:"linear-gradient(135deg,rgba(34,197,94,.06),rgba(20,184,166,.04))",
          }}>
            <div style={{ fontSize:36, marginBottom:12 }}><Icon name={s.icon} size={32} /></div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:"var(--accent)", marginBottom:4 }}>{s.val}</div>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:12, color:"var(--fg3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="impact-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:40 }}>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:28 }}>
          <h3 style={{ fontWeight:700, marginBottom:20 }}>Waste diverted by category</h3>
          {[
            { cat:"Electronics (PCBs, boards)", pct:68, kg:62.6 },
            { cat:"Components (sensors, motors)", pct:18, kg:16.6 },
            { cat:"Materials (acrylic, filament)", pct:9, kg:8.3 },
            { cat:"Equipment (analyzers, tools)", pct:5, kg:4.6 },
          ].map(c => (
            <div key={c.cat} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                <span style={{ color:"var(--fg2)" }}>{c.cat}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", color:"var(--accent)" }}>{c.kg} kg</span>
              </div>
              <ProgressBar pct={c.pct} color="var(--accent)" />
            </div>
          ))}
        </div>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:28 }}>
          <h3 style={{ fontWeight:700, marginBottom:20 }}>Semester progress</h3>
          {[
            { label:"Semester rescue goal (100 kg)", pct:92, color:"var(--accent)" },
            { label:"Active students sharing",        pct:76, color:"var(--teal)" },
            { label:"Partner campus coverage",        pct:60, color:"var(--blue)" },
            { label:"Zero-waste listings target",     pct:45, color:"var(--amber)" },
          ].map(b => (
            <div key={b.label} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
                <span style={{ color:"var(--fg2)" }}>{b.label}</span>
                <span style={{ fontFamily:"'DM Mono',monospace" }}>{b.pct}%</span>
              </div>
              <ProgressBar pct={b.pct} color={b.color} height={6} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:"center", background:"linear-gradient(135deg,rgba(34,197,94,.1),rgba(20,184,166,.07))", border:"1px solid rgba(34,197,94,.2)", borderRadius:16, padding:40 }}>
        <div style={{ fontSize:40, marginBottom:16 }}><Icon name="globe" size={34} /></div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:12 }}>Help us reach 200 kg diverted this year</h2>
        <p style={{ color:"var(--fg2)", fontSize:15, maxWidth:480, margin:"0 auto 24px", lineHeight:1.7 }}>Every component you list or rescue brings our community closer to the goal. Together, we make Egyptian campuses circular.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => navigate("list-item")} style={{ padding:"12px 24px", background:"var(--accent)", color:"#fff", borderRadius:10, fontWeight:600, fontSize:15 }}>List a component →</button>
          <button onClick={() => navigate("browse")} style={{ padding:"12px 24px", border:"1px solid var(--border2)", color:"var(--fg1)", borderRadius:10, fontSize:15 }}>Browse & rescue</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Campus Map ─────────────────────────────────────────────────────────
function PageCampusMap({ navigate, activeMapPin, setActiveMapPin }) {
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:1140, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, marginBottom:4 }}>Campus map</h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:24 }}>Find rescued components near your campus</p>
      <div className="map-grid" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>
        <div style={{ position:"relative", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", height:460 }}>
          {/* Grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
          {/* Map label */}
          <div style={{ position:"absolute", top:12, left:12, fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--fg3)", letterSpacing:".08em", textTransform:"uppercase" }}>Greater Cairo · Campus network</div>
          {CAMPUSES.map(c => (
            <div key={c.id} onClick={() => setActiveMapPin(activeMapPin === c.id ? null : c.id)} style={{
              position:"absolute", width:38, height:38, borderRadius:"50%",
              background: c.count > 3 ? "rgba(34,197,94,.2)" : "rgba(74,72,98,.15)",
              border: `2px solid ${c.count > 3 ? "var(--accent)" : "var(--fg3)"}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
              cursor:"pointer", transform:"translate(-50%,-50%)", transition:"all .2s",
              top: c.y, left: c.x, zIndex: activeMapPin === c.id ? 10 : 2,
            }}>
              <Icon name="campus" size={16} />
              {activeMapPin === c.id && (
                <div style={{
                  position:"absolute", bottom:"110%", left:"50%", transform:"translateX(-50%)",
                  background:"var(--bg1)", border:"1px solid var(--border2)", borderRadius:10,
                  padding:"10px 14px", whiteSpace:"nowrap", fontSize:12, zIndex:20,
                  boxShadow:"var(--shadowLg)",
                }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{c.name}</div>
                  <div style={{ color:"var(--accent)" }}>{c.count} items available</div>
                  <button onClick={() => navigate("browse")} style={{ marginTop:8, fontSize:11, color:"var(--accent)", padding:"3px 8px", border:"1px solid rgba(34,197,94,.3)", borderRadius:6 }}>Browse →</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ fontWeight:700, marginBottom:12, fontSize:15 }}>Campus availability</h3>
          {CAMPUSES.map(c => (
            <div key={c.id} className="hover-row" onClick={() => navigate("browse")} style={{
              display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
              borderRadius:10, cursor:"pointer", transition:"all .2s", marginBottom:4,
            }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: c.count > 3 ? "var(--accent)" : "var(--fg3)", flexShrink:0 }} />
              <span style={{ fontSize:13, flex:1 }}>{c.name}</span>
              <Badge variant={c.count > 3 ? "green" : "muted"}>{c.count} items</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page: Leaderboard ────────────────────────────────────────────────────────
function PageLeaderboard({ navigate }) {
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:900, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--accent)", textTransform:"uppercase", letterSpacing:".12em", marginBottom:12 }}>Community</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, letterSpacing:"-.02em", marginBottom:8 }}>Rescue Champions</h1>
        <p style={{ color:"var(--fg2)", fontSize:14 }}>Students making the biggest environmental impact this semester</p>
      </div>
      <div className="leaderboard-table" style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
        <div className="leaderboard-head" style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)", display:"grid", gridTemplateColumns:"48px 1fr 100px 100px 80px", gap:16, fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--fg3)", textTransform:"uppercase", letterSpacing:".06em" }}>
          <span>Rank</span><span>Student</span><span>E-waste (kg)</span><span>Items</span><span>CO₂ (kg)</span>
        </div>
        {LEADERBOARD.map(row => (
          <div key={row.rank} className="hover-row leaderboard-row" style={{
            padding:"14px 20px", borderBottom:"1px solid var(--border)",
            display:"grid", gridTemplateColumns:"48px 1fr 100px 100px 80px", gap:16,
            alignItems:"center", transition:"all .2s",
          }}>
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:700, textAlign:"center",
              color: row.rank === 1 ? "var(--amber)" : row.rank === 2 ? "var(--fg2)" : row.rank === 3 ? "#cd7f32" : "var(--fg3)",
              display:"inline-flex", alignItems:"center", gap:6, justifyContent:"center",
            }}>{row.rank <= 3 ? <><Icon name="trophy" size={14} />{row.rank}</> : `#${row.rank}`}</span>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar name={row.name} size={30} />
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{row.name}</div>
                <div style={{ fontSize:11, color:"var(--fg3)" }}>{row.uni}</div>
              </div>
            </div>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:14, color:"var(--accent)" }}>{row.wasteKg} kg</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"var(--fg2)" }}>{row.items}</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"var(--teal)" }}>{row.co2} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page: List Item ──────────────────────────────────────────────────────────
function PageListItem({ navigate, listStep, setListStep, addToast, setNotifications }) {
  const [draft, setDraft] = useState({});
  const update = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:680, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:4 }}>List a component</h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:28 }}>Rescue your old project parts from landfill — list them in under 2 minutes</p>

      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
        {[1,2].map((s, i) => (<>
          <div key={s} style={{
            width:28, height:28, borderRadius:"50%",
            border: `2px solid ${listStep >= s ? "var(--accent)" : "var(--border2)"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:700, fontFamily:"'DM Mono',monospace",
            color: listStep >= s ? "var(--accent)" : "var(--fg3)",
            background: listStep >= s ? "rgba(34,197,94,.1)" : "transparent",
          }}>{s}</div>
          {i === 0 && <div key={`line${s}`} style={{ flex:1, height:1, background: listStep >= 2 ? "var(--accent)" : "var(--border)" }} />}
        </>))}
      </div>

      {listStep === 1 ? (
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:28 }}>
          <h3 style={{ fontWeight:700, marginBottom:20 }}>Component details</h3>
          {[
            ["Component name","li-name","text","e.g. Arduino Uno R3 Kit"],
            ["Description","li-desc","text","What does it do? What's included?"],
            ["Tags","li-tags","text","e.g. Arduino, Robotics, Sensor"],
          ].map(([label, id, type, ph]) => (
            <div key={id} style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>{label}</label>
              {id === "li-desc" ? <textarea rows={3} placeholder={ph} onChange={e => update(id, e.target.value)} style={{ resize:"vertical" }} /> : <input type={type} id={id} placeholder={ph} onChange={e => update(id, e.target.value)} />}
            </div>
          ))}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>Category</label>
            <select id="li-cat" onChange={e => update("cat", e.target.value)}>
              {CATEGORIES.filter(c => c !== "all").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => { if (!draft["li-name"] || draft["li-name"].trim().length < 3) { addToast("Please enter a component name (min 3 chars)", "error"); return; } setListStep(2); }} style={{ width:"100%", padding:12, background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:15, marginTop:4 }}>
            Continue →
          </button>
        </div>
      ) : (
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:28 }}>
          <h3 style={{ fontWeight:700, marginBottom:20 }}>Pricing & pickup</h3>
          {[
            ["Price (EGP)","li-price","number","e.g. 120"],
            ["Condition","","select",null],
            ["Pickup location","li-loc","text","e.g. AUC New Cairo — Main Gate"],
          ].map(([label, id, type, ph]) => (
            <div key={label} style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:"var(--fg2)", display:"block", marginBottom:6 }}>{label}</label>
              {type === "select" ? (
                <select onChange={e => update("cond", e.target.value)}>
                  {["New","Excellent","Good","Fair"].map(c => <option key={c}>{c}</option>)}
                </select>
              ) : <input type={type} id={id} placeholder={ph} onChange={e => update(id, e.target.value)} />}
            </div>
          ))}
          <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", borderRadius:10, padding:14, marginBottom:20, fontSize:13, color:"var(--fg2)" }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><Icon name="globe" size={14} /> By listing this, you're preventing e-waste from reaching Cairo's landfills. Thank you for being part of the circular economy.</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => setListStep(1)} style={{ padding:"10px 16px", border:"1px solid var(--border)", borderRadius:8, color:"var(--fg1)", fontSize:13 }}>← Back</button>
            <button onClick={() => {
              setListStep(1);
              addToast("Listing published! Your component is now visible");
              setNotifications(n => [{ id: Date.now(), title:"Your listing is live — students can now find and rescue it", time:"Just now", read:false }, ...n]);
              navigate("dashboard");
            }} style={{ flex:1, padding:"10px", background:"var(--accent)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:15 }}>
              Publish listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page: Settings ───────────────────────────────────────────────────────────
function PageSettings({ navigate, theme, setTheme }) {
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:640, margin:"0 auto" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:4 }}>Settings</h1>
      <p style={{ color:"var(--fg2)", fontSize:14, marginBottom:28 }}>Manage your preferences</p>
      {[
        { label:"Dark mode",       sub:"Switch between light and dark theme",       val: theme === "dark", cb: () => setTheme(t => t === "dark" ? "light" : "dark") },
        { label:"Email notifications", sub:"Receive updates about your reservations", val: true, cb: () => {} },
        { label:"Wishlist alerts",  sub:"Get notified when wished items become available", val: true, cb: () => {} },
        { label:"Impact reports",   sub:"Weekly summary of your environmental impact", val: false, cb: () => {} },
      ].map(s => (
        <div key={s.label} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14 }}>{s.label}</div>
            <div style={{ fontSize:13, color:"var(--fg3)" }}>{s.sub}</div>
          </div>
          <div onClick={s.cb} style={{
            width:36, height:20, borderRadius:10, cursor:"pointer",
            background: s.val ? "var(--accent)" : "var(--bg3)",
            border: `1px solid ${s.val ? "var(--accent)" : "var(--border)"}`,
            position:"relative", transition:"all .2s",
          }}>
            <div style={{
              position:"absolute", width:14, height:14, borderRadius:"50%", background:"#fff",
              top:2, left: s.val ? 18 : 2, transition:"left .2s",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page: Profile ────────────────────────────────────────────────────────────
function PageProfile({ navigate, user, doLogout }) {
  if (!user) { navigate("login"); return null; }
  return (
    <div className="page-anim" style={{ padding:"32px 16px", maxWidth:640, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32 }}>
        <Avatar name={user.name} size={64} />
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, marginBottom:4 }}>{user.name}</h1>
          <p style={{ color:"var(--fg2)", fontSize:14 }}>{user.email}</p>
          <div style={{ marginTop:8 }}>
            <Badge variant="green"><span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Icon name="leaf" size={12} /> Eco Champion</span></Badge>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[{ val:"12", label:"Rescued" }, { val:"4", label:"Listed" }, { val:"3.2 kg", label:"E-waste saved" }].map(s => (
          <div key={s.label} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:16, textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"var(--accent)", marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:11, color:"var(--fg3)" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={doLogout} style={{ width:"100%", padding:12, background:"rgba(239,68,68,.1)", color:"var(--red)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, fontWeight:600 }}>Sign out</button>
    </div>
  );
}
