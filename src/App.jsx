import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const USERS = [
  { id: "U1", name: "Dr. Admin Singh", email: "admin@med.com", password: "admin123", role: "admin" },
  { id: "U2", name: "Dr. Suresh Patel", email: "doctor@med.com", password: "doctor123", role: "doctor", doctorId: "D001" },
  { id: "U3", name: "Aryan Sharma", email: "patient@med.com", password: "patient123", role: "patient", linkedId: "PHC-001" },
];

const SEED_PATIENTS = [
  {
    id: "PHC-001", name: "Aryan Sharma", age: 34, gender: "Male", blood: "B+",
    location: "Andheri, Mumbai", contact: "98765 43210", disease: "Dengue",
    prescription: "Paracetamol 500mg · ORS · Rest", date: "2026-02-10",
    status: "Recovered", doctor: "Dr. Suresh Patel", doctorId: "D001",
    allergies: "Penicillin", chronic: "Hypertension", emergencyContact: "Neha Sharma – 98765 43211",
    currentMeds: "Amlodipine 5mg",
    history: [
      { date: "2025-08-20", disease: "Viral Fever", prescription: "Paracetamol 650mg", doctor: "Dr. Suresh Patel", notes: "Resolved in 4 days" },
      { date: "2026-02-10", disease: "Dengue", prescription: "Paracetamol 500mg · ORS", doctor: "Dr. Suresh Patel", notes: "Platelet count 80k – monitored" },
    ],
  },
  {
    id: "PHC-002", name: "Priya Verma", age: 28, gender: "Female", blood: "A+",
    location: "Bandra, Mumbai", contact: "91234 56780", disease: "Malaria",
    prescription: "Chloroquine · Primaquine", date: "2026-03-01",
    status: "Under Treatment", doctor: "Dr. Anjali Rao", doctorId: "D002",
    allergies: "Sulfa drugs", chronic: "None", emergencyContact: "Raj Verma – 91234 56781",
    currentMeds: "None",
    history: [
      { date: "2026-03-01", disease: "Malaria", prescription: "Chloroquine · Primaquine", doctor: "Dr. Anjali Rao", notes: "Fever 104°F" },
    ],
  },
  {
    id: "PHC-003", name: "Rohit Gupta", age: 45, gender: "Male", blood: "O−",
    location: "Pune", contact: "99887 76655", disease: "Typhoid",
    prescription: "Azithromycin 500mg · ORS", date: "2026-03-05",
    status: "Under Treatment", doctor: "Dr. Suresh Patel", doctorId: "D001",
    allergies: "None", chronic: "Diabetes Type 2", emergencyContact: "Sunita Gupta – 99887 76656",
    currentMeds: "Metformin 500mg",
    history: [
      { date: "2026-03-05", disease: "Typhoid", prescription: "Azithromycin 500mg", doctor: "Dr. Suresh Patel", notes: "" },
    ],
  },
  {
    id: "PHC-004", name: "Sneha Pillai", age: 22, gender: "Female", blood: "AB+",
    location: "Thane, Mumbai", contact: "90011 22334", disease: "Chikungunya",
    prescription: "NSAIDs · Physiotherapy", date: "2026-03-08",
    status: "Critical", doctor: "Dr. Suresh Patel", doctorId: "D001",
    allergies: "Aspirin", chronic: "None", emergencyContact: "Mohan Pillai – 90011 22335",
    currentMeds: "Ibuprofen 400mg",
    history: [
      { date: "2026-03-08", disease: "Chikungunya", prescription: "NSAIDs · Physiotherapy", doctor: "Dr. Suresh Patel", notes: "Severe joint pain" },
    ],
  },
];

const SEED_APTS = [
  { id: "APT-001", patientId: "PHC-001", patientName: "Aryan Sharma", doctorId: "D001", doctor: "Dr. Suresh Patel", date: "2026-03-18", time: "10:00 AM", status: "confirmed", reason: "Dengue follow-up" },
  { id: "APT-002", patientId: "PHC-003", patientName: "Rohit Gupta", doctorId: "D001", doctor: "Dr. Suresh Patel", date: "2026-03-14", time: "11:30 AM", status: "pending", reason: "Typhoid check" },
  { id: "APT-003", patientId: "PHC-002", patientName: "Priya Verma", doctorId: "D002", doctor: "Dr. Anjali Rao", date: "2026-03-15", time: "02:00 PM", status: "pending", reason: "Malaria follow-up" },
];

const SEED_REMINDERS = [
  { id: "REM-001", patientId: "PHC-001", medicine: "Amlodipine 5mg", dosage: "1 tablet", time: "08:00 AM", duration: "30 days", active: true },
  { id: "REM-002", patientId: "PHC-001", medicine: "Paracetamol 500mg", dosage: "2 tablets", time: "06:00 PM", duration: "5 days", active: true },
];

const SEED_ALERTS = [
  { id: "ALT-001", disease: "Dengue", location: "Andheri, Mumbai", cases: 58, threshold: 50, timestamp: "2026-03-12 08:30", severity: "high" },
  { id: "ALT-002", disease: "Chikungunya", location: "Thane, Mumbai", cases: 36, threshold: 30, timestamp: "2026-03-11 19:10", severity: "medium" },
];

const TREND = [
  { month: "Oct", Dengue: 18, Malaria: 12, Covid: 8, Chikungunya: 3 },
  { month: "Nov", Dengue: 25, Malaria: 10, Covid: 14, Chikungunya: 6 },
  { month: "Dec", Dengue: 15, Malaria: 8, Covid: 20, Chikungunya: 4 },
  { month: "Jan", Dengue: 10, Malaria: 14, Covid: 18, Chikungunya: 5 },
  { month: "Feb", Dengue: 22, Malaria: 18, Covid: 11, Chikungunya: 9 },
  { month: "Mar", Dengue: 30, Malaria: 22, Covid: 7, Chikungunya: 14 },
];
const LOC = [
  { location: "Andheri", cases: 58 }, { location: "Bandra", cases: 28 },
  { location: "Thane", cases: 36 }, { location: "Pune", cases: 19 },
  { location: "Dadar", cases: 23 }, { location: "Kurla", cases: 31 },
];
const PIE = [
  { name: "Dengue", value: 30, color: "#f59e0b" },
  { name: "Malaria", value: 22, color: "#34d399" },
  { name: "Covid-19", value: 18, color: "#f87171" },
  { name: "Typhoid", value: 14, color: "#a78bfa" },
  { name: "Chikungunya", value: 16, color: "#38bdf8" },
];
const AI_RISK = [
  { disease: "Dengue", location: "Andheri", risk: 87, delta: "+43% / 3 days", level: "OUTBREAK" },
  { disease: "Chikungunya", location: "Thane", risk: 64, delta: "+38% / 3 days", level: "WARNING" },
  { disease: "Malaria", location: "Bandra", risk: 51, delta: "+21% / 3 days", level: "WATCH" },
];

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#0e1117;
  --surface:#161b27;
  --card:#1c2333;
  --card-hov:#212840;
  --border:#2a3448;
  --border-act:#3d4f70;
  --accent:#3b82f6;
  --accent-soft:rgba(59,130,246,0.12);
  --accent-glow:rgba(59,130,246,0.25);
  --green:#10b981;
  --green-soft:rgba(16,185,129,0.12);
  --orange:#f59e0b;
  --orange-soft:rgba(245,158,11,0.12);
  --red:#ef4444;
  --red-soft:rgba(239,68,68,0.12);
  --purple:#8b5cf6;
  --cyan:#06b6d4;
  --text-primary:#f1f5f9;
  --text-secondary:#8b9ec7;
  --text-muted:#4a5a7a;
}

body{background:var(--bg);color:var(--text-primary);font-family:'Inter',sans-serif;min-height:100vh;line-height:1.5}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:6px}

/* ── LANDING ── */
.land{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;overflow:hidden}
.land::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%);pointer-events:none}
.land-box{width:100%;max-width:400px;padding:0 20px;position:relative;z-index:1}
.land-logo{text-align:center;margin-bottom:32px}
.land-icon{width:56px;height:56px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 12px;box-shadow:0 8px 32px rgba(59,130,246,0.3)}
.land-name{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:800;color:var(--text-primary)}
.land-sub{font-size:11px;color:var(--text-muted);margin-top:4px;letter-spacing:0.05em}
.land-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px}
.tabs{display:flex;background:var(--surface);border-radius:10px;padding:3px;margin-bottom:22px;gap:3px}
.tab{flex:1;padding:8px;text-align:center;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--text-secondary);transition:all .2s}
.tab.on{background:var(--card-hov);color:var(--text-primary);box-shadow:0 1px 4px rgba(0,0,0,0.3)}
.role-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.role-opt{border:1px solid var(--border);border-radius:10px;background:var(--surface);padding:12px 6px;text-align:center;cursor:pointer;transition:all .2s}
.role-opt:hover{border-color:var(--accent);background:var(--accent-soft)}
.role-opt.sel{border-color:var(--accent);background:var(--accent-soft);box-shadow:0 0 0 2px var(--accent-glow)}
.role-emoji{font-size:20px;display:block;margin-bottom:4px}
.role-lbl{font-size:11px;font-weight:600;color:var(--text-primary)}
.demo-hint{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:10px;padding:12px;margin-top:14px}
.demo-title{font-size:10px;color:var(--accent);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px}
.demo-item{display:flex;justify-content:space-between;padding:4px 0;font-size:11px;cursor:pointer;border-radius:4px;transition:background .15s}
.demo-item:hover{background:rgba(59,130,246,0.06)}
.demo-item span:first-child{color:var(--text-secondary);font-weight:500}
.demo-item span:last-child{color:var(--accent);font-family:monospace}

/* ── SHELL ── */
.shell{display:flex;min-height:100vh}
.sidebar{width:220px;min-height:100vh;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto}
.sb-head{padding:18px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.sb-logo-icon{width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.sb-brand{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;color:var(--text-primary);line-height:1.2}
.sb-ver{font-size:9px;color:var(--text-muted);margin-top:1px}
.nav-group-title{padding:16px 16px 5px;font-size:9px;font-weight:600;color:var(--text-muted);letter-spacing:0.12em;text-transform:uppercase}
.nav-link{display:flex;align-items:center;gap:9px;padding:8px 12px;margin:1px 8px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:var(--text-secondary);transition:all .15s;border:1px solid transparent;position:relative}
.nav-link:hover{background:var(--card);color:var(--text-primary)}
.nav-link.active{background:var(--accent-soft);color:var(--accent);border-color:rgba(59,130,246,0.2);font-weight:600}
.nav-link .nav-icon{width:16px;text-align:center;font-size:14px;flex-shrink:0}
.nav-link .nav-badge{margin-left:auto;background:var(--red);color:white;font-size:9px;font-weight:700;border-radius:20px;padding:1px 6px;min-width:18px;text-align:center}
.sb-footer{margin-top:auto;padding:14px;border-top:1px solid var(--border)}
.sb-user-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:8px}
.sb-user-name{font-size:13px;font-weight:600;color:var(--text-primary)}
.sb-user-role{font-size:10px;margin-top:2px;font-weight:600}
.sb-logout{width:100%;padding:7px;background:transparent;border:1px solid var(--border);border-radius:7px;color:var(--text-secondary);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}
.sb-logout:hover{border-color:var(--red);color:var(--red)}
.main-content{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:13px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.page-title{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:var(--text-primary)}
.page-sub{font-size:11px;color:var(--text-muted);margin-top:1px}
.alert-tag{display:flex;align-items:center;gap:5px;background:var(--red-soft);border:1px solid rgba(239,68,68,0.3);color:var(--red);font-size:10px;font-weight:600;border-radius:20px;padding:4px 10px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
.page-body{padding:24px;flex:1}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;transition:border-color .2s}
.card:hover{border-color:var(--border-act)}
.card-title{font-size:12px;font-weight:600;color:var(--text-secondary);display:flex;align-items:center;gap:7px;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.06em}
.card-title::before{content:'';width:3px;height:14px;border-radius:2px;background:var(--accent);flex-shrink:0}

/* ── STAT CARDS ── */
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;position:relative;overflow:hidden}
.stat-bar{position:absolute;top:0;left:0;right:0;height:2px}
.stat-label{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em}
.stat-value{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;color:var(--text-primary);margin:5px 0 2px}
.stat-change{font-size:10px;color:var(--green);font-weight:500}
.stat-icon{position:absolute;right:14px;top:14px;font-size:24px;opacity:0.08}

/* ── GRID ── */
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.mb-4{margin-bottom:16px}.mb-5{margin-bottom:20px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}

/* ── FORM ── */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.span-2{grid-column:1/-1}
.field{display:flex;flex-direction:column;gap:5px}
.label{font-size:10px;font-weight:600;color:var(--text-muted);letter-spacing:0.06em;text-transform:uppercase}
.input{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text-primary);font-size:13px;outline:none;transition:border-color .2s;width:100%;font-family:'Inter',sans-serif}
.input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
.input::placeholder{color:var(--text-muted)}
select.input{cursor:pointer}

/* ── BUTTONS ── */
.btn{padding:9px 16px;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px;transition:all .2s;font-family:'Inter',sans-serif}
.btn-primary{background:var(--accent);color:white}
.btn-primary:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 16px var(--accent-glow)}
.btn-success{background:var(--green);color:white}
.btn-success:hover{background:#059669;transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text-secondary)}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
.btn-danger{background:var(--red-soft);border:1px solid rgba(239,68,68,0.3);color:var(--red)}
.btn-danger:hover{background:rgba(239,68,68,0.2)}
.btn-sm{padding:5px 10px;font-size:11px;border-radius:6px}
.btn-warn{background:var(--orange-soft);border:1px solid rgba(245,158,11,0.3);color:var(--orange)}

/* ── BADGE ── */
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
.badge-green{background:var(--green-soft);color:var(--green)}
.badge-orange{background:var(--orange-soft);color:var(--orange)}
.badge-red{background:var(--red-soft);color:var(--red)}
.badge-blue{background:var(--accent-soft);color:var(--accent)}
.badge-purple{background:rgba(139,92,246,0.12);color:var(--purple)}

/* ── TABLE ── */
.table-wrap{overflow-x:auto;border-radius:12px}
table{width:100%;border-collapse:collapse;font-size:13px}
thead tr{border-bottom:1px solid var(--border)}
th{padding:10px 14px;text-align:left;font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;white-space:nowrap}
td{padding:12px 14px;border-bottom:1px solid rgba(42,52,72,0.5);vertical-align:middle}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover td{background:rgba(59,130,246,0.03)}

/* ── QR HEALTH CARD ── */
.qr-card{background:linear-gradient(145deg,#1c2333,#212840);border:1px solid rgba(59,130,246,0.3);border-radius:16px;padding:22px;width:300px;position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
.qr-card::before{content:'';position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.08),transparent);top:-60px;right:-60px;pointer-events:none}
.qr-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
.qr-card-label{font-size:9px;font-weight:700;color:var(--accent);letter-spacing:0.15em;text-transform:uppercase}
.qr-card-id{font-size:10px;color:var(--text-muted);margin-top:2px;font-family:monospace}
.qr-status{font-size:10px;color:var(--green);font-weight:600;display:flex;align-items:center;gap:4px}
.qr-name{font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:800;color:white;margin-bottom:4px}
.qr-meta{display:flex;gap:12px;font-size:10px;color:var(--text-muted);margin-bottom:16px;font-family:monospace;flex-wrap:wrap}
.qr-image-box{background:white;border-radius:10px;padding:10px;display:flex;justify-content:center;align-items:center;margin-bottom:12px}
.qr-footer{display:flex;justify-content:space-between;font-size:9px;color:var(--text-muted);font-family:monospace}

/* ── ALERTS ── */
.alert-banner{background:var(--red-soft);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--red);font-weight:500;margin-bottom:16px}
.success-banner{background:var(--green-soft);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--green);font-weight:500;margin-bottom:14px}
.info-banner{background:var(--accent-soft);border:1px solid rgba(59,130,246,0.25);border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--accent);font-weight:500;margin-bottom:14px}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(14,17,23,0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:300;padding:16px}
.modal{background:var(--card);border:1px solid var(--border-act);border-radius:16px;padding:24px;max-width:620px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.7)}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.modal-title{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700}
.divider{border:none;border-top:1px solid var(--border);margin:16px 0}

/* ── TIMELINE ── */
.timeline{padding-left:18px;position:relative}
.timeline::before{content:'';position:absolute;left:4px;top:6px;bottom:6px;width:1px;background:var(--border)}
.tl-item{position:relative;margin-bottom:14px}
.tl-dot{position:absolute;left:-15px;top:5px;width:9px;height:9px;border-radius:50%;border:2px solid var(--bg)}
.tl-date{font-size:10px;color:var(--text-muted);font-family:monospace;margin-bottom:4px}
.tl-body{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:12px}
.tl-disease{font-weight:600;margin-bottom:2px}
.tl-rx{color:var(--text-secondary);font-size:11px}
.tl-doc{color:var(--text-muted);font-size:10px;margin-top:3px;font-family:monospace}

/* ── HEATMAP ── */
.hm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.hm-cell{border-radius:9px;padding:12px;text-align:center;border:1px solid transparent}
.hm-name{font-size:11px;font-weight:600;color:white;margin-bottom:2px}
.hm-count{font-size:20px;font-weight:800;color:white}
.hm-label{font-size:8px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em}

/* ── RISK BAR ── */
.risk-track{background:var(--bg);height:5px;border-radius:10px;overflow:hidden;margin:5px 0}
.risk-fill{height:100%;border-radius:10px;transition:width .6s ease}

/* ── EMERGENCY ── */
.emg-header{background:linear-gradient(135deg,rgba(239,68,68,0.12),rgba(239,68,68,0.05));border:2px solid rgba(239,68,68,0.4);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:16px}
.emg-icon{font-size:28px}
.emg-title{font-size:15px;font-weight:700;color:var(--red)}
.emg-sub{font-size:11px;color:rgba(239,68,68,0.6);margin-top:1px}
.emg-table{background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.15);border-radius:10px;overflow:hidden}
.emg-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid rgba(239,68,68,0.08);font-size:13px}
.emg-row:last-child{border-bottom:none}
.emg-key{font-size:10px;font-weight:600;color:rgba(239,68,68,0.6);text-transform:uppercase;letter-spacing:0.06em}
.emg-val{font-weight:600}

/* ── REMINDER ITEM ── */
.rem-card{display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:8px;transition:border-color .2s}
.rem-card:hover{border-color:var(--border-act)}
.rem-name{font-size:13px;font-weight:600}
.rem-info{font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace}
.rem-time{font-size:15px;font-weight:700;color:var(--accent);font-family:monospace;margin-right:10px}

/* ── ALERT ITEM ── */
.alert-item{border-radius:11px;padding:14px 16px;margin-bottom:10px;border:1px solid}
.alert-item-high{background:rgba(239,68,68,0.05);border-color:rgba(239,68,68,0.3)}
.alert-item-medium{background:rgba(245,158,11,0.05);border-color:rgba(245,158,11,0.3)}
.alert-item-title{font-size:14px;font-weight:700;margin-bottom:6px}
.alert-item-meta{display:flex;gap:14px;font-size:11px;color:var(--text-secondary);flex-wrap:wrap}

/* ── AVATAR ── */
.avatar{width:48px;height:48px;border-radius:11px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:white;flex-shrink:0;font-family:'Space Grotesk',sans-serif}

/* ── SEARCH ── */
.search-wrap{position:relative}
.search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:14px;pointer-events:none}
.search-input{padding-left:34px}

/* ── UTIL ── */
.flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}
.text-muted{color:var(--text-muted)}.text-sm{font-size:12px}.text-xs{font-size:11px}
.mono{font-family:monospace}.fw-700{font-weight:700}.fw-800{font-weight:800}
.text-green{color:var(--green)}.text-red{color:var(--red)}.text-orange{color:var(--orange)}.text-accent{color:var(--accent)}
`;

// ─────────────────────────────────────────────
// QR IMAGE — Local generation for offline support
// ─────────────────────────────────────────────
function QRImage({ data, size = 120 }) {
  return (
    <div style={{ width: size, height: size, background: "white", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <QRCodeSVG value={data} size={size - 8} level="M" />
    </div>
  );
}





// ─────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === "Recovered") return <span className="badge badge-green">● Recovered</span>;
  if (status === "Under Treatment") return <span className="badge badge-orange">● Under Treatment</span>;
  if (status === "Critical") return <span className="badge badge-red">● Critical</span>;
  if (status === "confirmed") return <span className="badge badge-green">● Confirmed</span>;
  if (status === "pending") return <span className="badge badge-orange">● Pending</span>;
  if (status === "cancelled") return <span className="badge badge-red">● Cancelled</span>;
  return <span className="badge badge-purple">● {status}</span>;
}

function HealthCard({ patient: p, onScan }) {
  const qrData = `PATIENT_ID:${p.id}|NAME:${p.name}|AGE:${p.age}|BLOOD:${p.blood}|LOCATION:${p.location}|DOCTOR:${p.doctor}`;
  return (
    <div className="qr-card">
      <div className="qr-card-header">
        <div>
          <div className="qr-card-label">⚕ Smart Health Card</div>
          <div className="qr-card-id">{p.id}</div>
        </div>
        <div className="qr-status"><span>●</span> Active</div>
      </div>
      <div className="qr-name">{p.name}</div>
      <div className="qr-meta">
        <span>Age {p.age}</span>
        <span>·</span>
        <span>{p.gender}</span>
        <span>·</span>
        <span>Blood {p.blood}</span>
      </div>
      <div className="qr-image-box">
        <QRImage data={qrData} size={130} />
      </div>
      <div className="qr-footer">
        <span>📍 {p.location}</span>
        <span>Scan to view records</span>
      </div>
      {onScan && (
        <button
          className="btn btn-primary btn-sm"
          style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
          onClick={onScan}
        >
          🔍 View Full Health Record
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LANDING / AUTH PAGE
// ─────────────────────────────────────────────
function LandingPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [allUsers, setAllUsers] = useState(USERS);
  const [reg, setReg] = useState({ name: "", email: "", password: "", role: "patient" });

  const doLogin = () => {
    const u = allUsers.find(u => u.email === email && u.password === pass);
    if (!u) { setErr("Incorrect email or password."); return; }
    setErr(""); onLogin(u);
  };

  const doRegister = () => {
    if (!reg.name || !reg.email || !reg.password) { setErr("All fields are required."); return; }
    if (reg.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (allUsers.find(u => u.email === reg.email)) { setErr("An account with this email already exists."); return; }
    // Give patient users a linkedId so they can see their records after a doctor registers them
    const linkedId = reg.role === "patient" ? `PHC-${Date.now().toString().slice(-5)}` : undefined;
    const newUser = { ...reg, id: `U${Date.now()}`, ...(linkedId ? { linkedId } : {}) };
    setAllUsers(p => [...p, newUser]);
    setErr(""); setTab("login"); setEmail(reg.email); setPass(reg.password);
  };

  const ROLES = [
    { r: "admin", emoji: "🛡️", label: "Admin" },
    { r: "doctor", emoji: "👨‍⚕️", label: "Doctor" },
    { r: "patient", emoji: "🧑", label: "Patient" },
  ];

  const DEMO = [
    ["Admin", "admin@med.com", "admin123"],
    ["Doctor", "doctor@med.com", "doctor123"],
    ["Patient", "patient@med.com", "patient123"],
  ];

  return (
    <div className="land">
      <div className="land-box">
        <div className="land-logo">
          <div className="land-icon">⚕</div>
          <div className="land-name">MedSurveillance</div>
          <div className="land-sub">Smart Healthcare & Disease Surveillance System</div>
        </div>
        <div className="land-card">
          <div className="tabs">
            {["login", "register"].map(t => (
              <div key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => { setTab(t); setErr("") }}>
                {t === "login" ? "Sign In" : "Register"}
              </div>
            ))}
          </div>

          {err && <div className="alert-banner">⚠ {err}</div>}

          {tab === "login" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="field">
                <label className="label">Email Address</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={doLogin}>
                Sign In →
              </button>
              <div className="demo-hint">
                <div className="demo-title">Quick Login — Click Any Row</div>
                {DEMO.map(([role, em, pw]) => (
                  <div key={role} className="demo-item" onClick={() => { setEmail(em); setPass(pw) }}>
                    <span>{role}</span>
                    <span>{em}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="label" style={{ display: "block", marginBottom: 8 }}>Select Role</label>
                <div className="role-grid">
                  {ROLES.map(({ r, emoji, label }) => (
                    <div key={r} className={`role-opt ${reg.role === r ? "sel" : ""}`} onClick={() => setReg(f => ({ ...f, role: r }))}>
                      <span className="role-emoji">{emoji}</span>
                      <span className="role-lbl">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="label">Full Name</label>
                <input className="input" placeholder="Your full name" value={reg.name} onChange={e => setReg(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label className="label">Email Address</label>
                <input className="input" type="email" placeholder="you@example.com" value={reg.email} onChange={e => setReg(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min 6 characters" value={reg.password} onChange={e => setReg(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button className="btn btn-success" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={doRegister}>
                Create Account →
              </button>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 4 }}>
                After registering, sign in with your new credentials.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────
function DashboardPage({ user, patients, alerts }) {
  // Role-based filter
  const visible = user.role === "doctor"
    ? patients.filter(p => p.doctorId === user.doctorId)
    : patients;

  const active = visible.filter(p => p.status === "Under Treatment").length;
  const recovered = visible.filter(p => p.status === "Recovered").length;
  const critical = visible.filter(p => p.status === "Critical").length;

  return (
    <div>
      {alerts.length > 0 && (
        <div className="alert-banner">
          🚨 <strong>{alerts.length} active outbreak alert{alerts.length > 1 ? "s" : ""}:</strong>&nbsp;
          {alerts.map(a => `${a.disease} in ${a.location}`).join("  ·  ")}
        </div>
      )}

      <div className="grid-4 mb-5">
        {user.role !== "patient" && (
          <div className="stat-card">
            <div className="stat-bar" style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }}></div>
            <span className="stat-icon">🏥</span>
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{visible.length}</div>
            <div className="stat-change">Registered records</div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-bar" style={{ background: "linear-gradient(90deg,#f59e0b,#f97316)" }}></div>
          <span className="stat-icon">🦠</span>
          <div className="stat-label">Active Cases</div>
          <div className="stat-value">{active}</div>
          <div className="stat-change" style={{ color: "var(--orange)" }}>Under treatment</div>
        </div>
        <div className="stat-card">
          <div className="stat-bar" style={{ background: "linear-gradient(90deg,#10b981,#059669)" }}></div>
          <span className="stat-icon">✅</span>
          <div className="stat-label">Recovered</div>
          <div className="stat-value">{recovered}</div>
          <div className="stat-change">
            {visible.length > 0 ? Math.round(recovered / visible.length * 100) : 0}% recovery rate
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-bar" style={{ background: "linear-gradient(90deg,#ef4444,#dc2626)" }}></div>
          <span className="stat-icon">🚨</span>
          <div className="stat-label">Disease Alerts</div>
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-change" style={{ color: alerts.length > 0 ? "var(--red)" : "var(--green)" }}>
            {alerts.length > 0 ? "Requires attention" : "All clear"}
          </div>
        </div>
      </div>

      <div className="grid-2 mb-5">
        <div className="card">
          <div className="card-title">6-Month Disease Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3448" />
              <XAxis dataKey="month" stroke="#4a5a7a" tick={{ fontSize: 11 }} />
              <YAxis stroke="#4a5a7a" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1c2333", border: "1px solid #2a3448", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Dengue" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Malaria" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Covid" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Chikungunya" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">Disease Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                {PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1c2333", border: "1px solid #2a3448", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="grid-2 mb-5">
          <div className="card">
            <div className="card-title">Cases by Location</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={LOC} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3448" />
                <XAxis dataKey="location" stroke="#4a5a7a" tick={{ fontSize: 10 }} />
                <YAxis stroke="#4a5a7a" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1c2333", border: "1px solid #2a3448", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                  {LOC.map((l, i) => {
                    const c = l.cases >= 50 ? "#ef4444" : l.cases >= 30 ? "#f59e0b" : "#10b981";
                    return <Cell key={i} fill={c} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-title">Disease Heatmap — Mumbai Region</div>
            <div className="hm-grid">
              {LOC.map((l, i) => {
                const heat = l.cases >= 50 ? "#ef4444" : l.cases >= 30 ? "#f59e0b" : l.cases >= 20 ? "#f97316" : "#10b981";
                const bg = l.cases >= 50 ? "rgba(239,68,68,0.18)" : l.cases >= 30 ? "rgba(245,158,11,0.18)" : l.cases >= 20 ? "rgba(249,115,22,0.18)" : "rgba(16,185,129,0.15)";
                return (
                  <div key={i} className="hm-cell" style={{ background: bg, borderColor: heat + "55" }}>
                    <div className="hm-name">{l.location}</div>
                    <div className="hm-count" style={{ color: heat }}>{l.cases}</div>
                    <div className="hm-label">cases</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-3" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              <span>🟢 Low (&lt;20)</span>
              <span>🟡 Moderate (20–49)</span>
              <span>🔴 High (50+)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PATIENT LIST PAGE — ROLE RESTRICTED
// ─────────────────────────────────────────────
function PatientListPage({ user, patients, onView, onQR, onUpdate, onEmergency }) {
  const [q, setQ] = useState("");

  // ── STRICT ROLE-BASED FILTERING ──
  let baseList;
  if (user.role === "patient") {
    // Patient sees ONLY their own record
    baseList = patients.filter(p => p.id === user.linkedId);
  } else if (user.role === "doctor") {
    // Doctor sees only patients assigned to them
    baseList = patients.filter(p => p.doctorId === user.doctorId);
  } else {
    // Admin sees all
    baseList = patients;
  }

  const filtered = baseList.filter(p =>
    [p.name, p.id, p.disease, p.location].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      {user.role === "patient" && (
        <div className="info-banner">
          ℹ You are viewing your personal medical records only.
        </div>
      )}
      {user.role === "doctor" && (
        <div className="info-banner">
          ℹ Showing only patients assigned to you ({baseList.length} patient{baseList.length !== 1 ? "s" : ""}).
        </div>
      )}

      {/* Only show search bar for admin/doctor */}
      {user.role !== "patient" && (
        <div className="mb-4 search-wrap">
          <span className="search-icon">🔍</span>
          <input className="input search-input" placeholder="Search by name, ID, or disease..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age / Gender</th>
                <th>Location</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Doctor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "28px", color: "var(--text-muted)" }}>No records found.</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="mono text-accent" style={{ fontSize: 12 }}>{p.id}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>{p.name[0]}</div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.age} · {p.gender}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>📍 {p.location}</td>
                  <td><span style={{ fontWeight: 600, color: "var(--orange)" }}>{p.disease}</span></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{p.doctor}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => onView(p)}>View</button>
                      <button className="btn btn-ghost btn-sm text-accent" onClick={() => onQR(p)}>QR Card</button>
                      {(user.role === "doctor" || user.role === "admin") && (
                        <button className="btn btn-ghost btn-sm text-green" onClick={() => onUpdate(p)}>Update</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => onEmergency(p)}>🚨</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REGISTER PATIENT PAGE
// ─────────────────────────────────────────────
function RegisterPage({ user, onRegister }) {
  const blank = { name: "", age: "", gender: "Male", blood: "A+", location: "", contact: "", disease: "", prescription: "", doctor: user.role === "doctor" ? user.name : "", status: "Under Treatment", allergies: "", chronic: "", emergencyContact: "", currentMeds: "" };
  const [f, setF] = useState(blank);
  const [ok, setOk] = useState(false);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!f.name || !f.age || !f.location || !f.disease) { alert("Please fill all required fields."); return; }
    const id = "PHC-" + String(Date.now()).slice(-5);
    const today = new Date().toISOString().split("T")[0];
    onRegister({
      ...f, age: parseInt(f.age), id, date: today,
      doctorId: user.role === "doctor" ? user.doctorId : "D001",
      history: [{ date: today, disease: f.disease, prescription: f.prescription, doctor: f.doctor || "Unassigned", notes: "" }]
    });
    setOk(true); setF(blank);
    setTimeout(() => setOk(false), 4000);
  };

  return (
    <div className="card" style={{ maxWidth: 700 }}>
      <div className="card-title" style={{ marginBottom: 18, fontSize: 14 }}>Register New Patient</div>
      {ok && <div className="success-banner">✅ Patient registered successfully! QR Health Card has been generated.</div>}
      <div className="form-grid">
        <div className="field"><label className="label">Full Name *</label><input className="input" placeholder="e.g. Rahul Sharma" value={f.name} onChange={e => u("name", e.target.value)} /></div>
        <div className="field"><label className="label">Age *</label><input className="input" type="number" placeholder="e.g. 32" value={f.age} onChange={e => u("age", e.target.value)} /></div>
        <div className="field"><label className="label">Gender</label><select className="input" value={f.gender} onChange={e => u("gender", e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></div>
        <div className="field"><label className="label">Blood Group</label><select className="input" value={f.blood} onChange={e => u("blood", e.target.value)}>{["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map(b => <option key={b}>{b}</option>)}</select></div>
        <div className="field span-2"><label className="label">Location / City *</label><input className="input" placeholder="e.g. Andheri West, Mumbai" value={f.location} onChange={e => u("location", e.target.value)} /></div>
        <div className="field"><label className="label">Contact Number</label><input className="input" placeholder="Phone" value={f.contact} onChange={e => u("contact", e.target.value)} /></div>
        <div className="field"><label className="label">Emergency Contact</label><input className="input" placeholder="Name – Phone" value={f.emergencyContact} onChange={e => u("emergencyContact", e.target.value)} /></div>
        <div className="field"><label className="label">Disease / Diagnosis *</label><input className="input" placeholder="e.g. Dengue" value={f.disease} onChange={e => u("disease", e.target.value)} /></div>
        <div className="field"><label className="label">Treatment Status</label><select className="input" value={f.status} onChange={e => u("status", e.target.value)}><option>Under Treatment</option><option>Recovered</option><option>Critical</option></select></div>
        <div className="field span-2"><label className="label">Prescription</label><input className="input" placeholder="e.g. Paracetamol 500mg · ORS · Rest" value={f.prescription} onChange={e => u("prescription", e.target.value)} /></div>
        <div className="field"><label className="label">Known Allergies</label><input className="input" placeholder="e.g. Penicillin, None" value={f.allergies} onChange={e => u("allergies", e.target.value)} /></div>
        <div className="field"><label className="label">Chronic Conditions</label><input className="input" placeholder="e.g. Diabetes Type 2" value={f.chronic} onChange={e => u("chronic", e.target.value)} /></div>
        <div className="field"><label className="label">Current Medications</label><input className="input" placeholder="e.g. Metformin 500mg" value={f.currentMeds} onChange={e => u("currentMeds", e.target.value)} /></div>
        <div className="field"><label className="label">Assigned Doctor</label><input className="input" placeholder="Dr. Name" value={f.doctor} onChange={e => u("doctor", e.target.value)} /></div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={submit}>Register Patient</button>
        <button className="btn btn-ghost" onClick={() => setF(blank)}>Clear Form</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APPOINTMENTS PAGE
// ─────────────────────────────────────────────
const DOCTORS = [
  { id: "D001", name: "Dr. Suresh Patel", specialty: "General Physician" },
  { id: "D002", name: "Dr. Anjali Rao", specialty: "Infectious Disease" },
  { id: "D003", name: "Dr. Priya Mehta", specialty: "Internal Medicine" },
];

function AppointmentsPage({ user, patients, apts, setApts }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ patientId: "", doctorId: "", reason: "", date: "", time: "10:00 AM" });
  const [ok, setOk] = useState(false);

  const visible = user.role === "doctor" ? apts.filter(a => a.doctorId === user.doctorId)
    : user.role === "patient" ? apts.filter(a => a.patientId === user.linkedId)
      : apts;

  const myPatient = patients.find(p => p.id === user.linkedId);

  const book = () => {
    const patientId = user.role === "patient" ? (user.linkedId || "") : f.patientId;
    const doctorId = user.role === "doctor" ? user.doctorId : f.doctorId;
    const pat = user.role === "patient" ? myPatient : patients.find(p => p.id === patientId);
    const doc = DOCTORS.find(d => d.id === doctorId);
    if (!pat || !doc || !f.date || !f.reason) { alert("Please fill all required fields."); return; }
    setApts(prev => [...prev, {
      id: `APT-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.name,
      doctorId: doc.id,
      doctor: doc.name,
      date: f.date,
      time: f.time,
      status: "pending",
      reason: f.reason,
    }]);
    setOk(true);
    setShowForm(false);
    setF({ patientId: "", doctorId: "", reason: "", date: "", time: "10:00 AM" });
    setTimeout(() => setOk(false), 3000);
  };

  return (
    <div>
      {ok && <div className="success-banner">✅ Appointment booked successfully.</div>}
      <div className="flex justify-between items-center mb-4">
        <div style={{ fontWeight: 600, fontSize: 14 }}>{visible.length} appointment{visible.length !== 1 ? "s" : ""}</div>
        {user.role !== "doctor" && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(s => !s)}>
            {showForm ? "Cancel" : "+ Book Appointment"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-title">
            {user.role === "patient" ? "📅 Book Your Appointment" : "📅 Book Appointment"}
          </div>
          {user.role === "patient" && (
            <div className="info-banner" style={{ marginBottom: 14 }}>
              ℹ Your name is pre-filled. Choose a doctor, date and reason.
            </div>
          )}
          <div className="form-grid">
            {/* Patient field */}
            {user.role === "patient" ? (
              <div className="field">
                <label className="label">Patient Name</label>
                <input className="input" value={myPatient?.name || user.name} readOnly
                  style={{ background: "rgba(59,130,246,0.06)", cursor: "default" }} />
              </div>
            ) : (
              <div className="field">
                <label className="label">Select Patient *</label>
                <select className="input" value={f.patientId}
                  onChange={e => setF(p => ({ ...p, patientId: e.target.value }))}>
                  <option value="">Choose patient…</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
            )}
            {/* Doctor field */}
            {user.role === "doctor" ? (
              <div className="field">
                <label className="label">Doctor</label>
                <input className="input" value={user.name} readOnly style={{ opacity: 0.65, cursor: "default" }} />
              </div>
            ) : (
              <div className="field">
                <label className="label">Select Doctor *</label>
                <select className="input" value={f.doctorId}
                  onChange={e => setF(p => ({ ...p, doctorId: e.target.value }))}>
                  <option value="">Choose doctor…</option>
                  {DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="field">
              <label className="label">Reason *</label>
              <input className="input" placeholder="e.g. Follow-up checkup" value={f.reason}
                onChange={e => setF(p => ({ ...p, reason: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Date *</label>
              <input className="input" type="date" value={f.date}
                onChange={e => setF(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Preferred Time</label>
              <select className="input" value={f.time}
                onChange={e => setF(p => ({ ...p, time: e.target.value }))}>
                {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                  "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn btn-primary btn-sm" onClick={book}>Confirm Booking</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th>
                <th>Time</th><th>Reason</th><th>Status</th>
                {user.role === "doctor" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "28px", color: "var(--text-muted)" }}>No appointments found.</td></tr>
              )}
              {visible.map(a => (
                <tr key={a.id}>
                  <td><span className="mono text-accent" style={{ fontSize: 11 }}>{a.id}</span></td>
                  <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{a.doctor}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{a.date}</td>
                  <td className="mono text-accent" style={{ fontSize: 12 }}>{a.time}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{a.reason}</td>
                  <td><StatusBadge status={a.status} /></td>
                  {user.role === "doctor" && (
                    <td>
                      {a.status === "pending" && (
                        <div className="flex gap-2">
                          <button className="btn btn-ghost btn-sm text-green"
                            onClick={() => setApts(p => p.map(x => x.id === a.id ? { ...x, status: "confirmed" } : x))}>
                            ✓ Confirm
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => setApts(p => p.map(x => x.id === a.id ? { ...x, status: "cancelled" } : x))}>
                            ✕ Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QR SCAN PAGE — shown when QR is "scanned"
// Displays full patient health card + history
// ─────────────────────────────────────────────
function QRScanPage({ patient: p, onBack }) {
  if (!p) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>No patient data found</div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onBack}>← Go Back</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 16px" }}>
      {/* Header bar */}
      <div style={{ maxWidth: 760, margin: "0 auto 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚕</div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700 }}>MedSurveillance</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>QR Health Card — Scanned View</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Emergency banner for critical patients */}
        {p.status === "Critical" && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.4)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, color: "var(--red)", fontWeight: 600 }}>
            🚨 CRITICAL PATIENT — Immediate medical attention may be required
          </div>
        )}

        {/* Top: Patient identity card */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border-act)", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "white", flexShrink: 0, fontFamily: "'Space Grotesk',sans-serif" }}>
              {p.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace", marginBottom: 8 }}>
                <span>{p.id}</span><span>·</span><span>Age {p.age}</span><span>·</span><span>{p.gender}</span><span>·</span>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>Blood {p.blood}</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <StatusBadge status={p.status} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📍 {p.location}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>👨‍⚕️ {p.doctor}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <div className="qr-image-box" style={{ background: "white", borderRadius: 8, padding: 8, display: "inline-flex" }}>
                <QRImage data={`PATIENT_ID:${p.id}|NAME:${p.name}|AGE:${p.age}|BLOOD:${p.blood}`} size={90} />
              </div>
            </div>
          </div>
        </div>

        {/* 2-col info */}
        <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
          {/* Emergency info */}
          <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>🚨 Emergency Information</div>
            {[
              ["Blood Group", p.blood, "#ef4444"],
              ["Allergies", p.allergies || "None known", "#f59e0b"],
              ["Chronic Conditions", p.chronic || "None", "var(--text-secondary)"],
              ["Current Medications", p.currentMeds || "None", "var(--text-secondary)"],
              ["Emergency Contact", p.emergencyContact || "Not set", "var(--accent)"],
            ].map(([k, v, col]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid rgba(239,68,68,0.08)", fontSize: 12 }}>
                <span style={{ color: "var(--text-muted)", fontSize: 11, minWidth: 120 }}>{k}</span>
                <span style={{ fontWeight: 600, color: col, textAlign: "right", maxWidth: 180 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Current treatment */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>💊 Current Treatment</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>DIAGNOSIS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--orange)" }}>🦠 {p.disease}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>PRESCRIPTION</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.prescription || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>ATTENDING DOCTOR</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>👨‍⚕️ {p.doctor}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace", marginTop: 3 }}>{p.date}</div>
            </div>
          </div>
        </div>

        {/* Medical History Timeline */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>📋 Complete Medical History</div>
          {p.history.length === 0 && (
            <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No history recorded.</div>
          )}
          <div className="timeline">
            {[...p.history].reverse().map((h, i) => (
              <div key={i} className="tl-item">
                <div className="tl-dot" style={{ background: i === 0 ? "var(--accent)" : "var(--border-act)" }}></div>
                <div className="tl-date">{h.date}</div>
                <div className="tl-body" style={{ borderLeft: i === 0 ? "2px solid var(--accent)" : "1px solid var(--border)" }}>
                  <div className="tl-disease">🦠 {h.disease}</div>
                  <div className="tl-rx">Rx: {h.prescription || "—"}</div>
                  <div className="tl-doc">Dr: {h.doctor}{h.notes ? ` · ${h.notes}` : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>
          MedSurveillance Healthcare OS · Record ID {p.id} · Last updated {p.date}
        </div>
      </div>
    </div>
  );
}


function AlertsPage({ alerts, setAlerts, patients }) {
  const raiseAlert = (pred) => {
    const already = alerts.find(a => a.disease === pred.disease && a.location === pred.location);
    if (already) { alert("An alert for this disease & location already exists."); return; }
    setAlerts(p => [...p, {
      id: `ALT-${Date.now()}`,
      disease: pred.disease,
      location: pred.location,
      cases: Math.floor(pred.risk / 1.5) + 10,
      threshold: 20,
      timestamp: new Date().toLocaleString("en-IN"),
      severity: "high"
    }]);
  };

  const resolveAlert = (id) => {
    setAlerts(p => p.filter(a => a.id !== id));
  };

  return (
    <div>
      {/* Active Alerts */}
      <div className="card mb-5">
        <div className="card-title">Active Disease Alerts ({alerts.length})</div>
        {alerts.length === 0 && (
          <div className="success-banner" style={{ marginBottom: 0 }}>✅ No active alerts. All disease levels are within normal thresholds.</div>
        )}
        {alerts.map(a => (
          <div key={a.id} className={`alert-item alert-item-${a.severity}`}>
            <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
              <div className="alert-item-title" style={{ color: a.severity === "high" ? "var(--red)" : "var(--orange)" }}>
                🚨 {a.disease} Outbreak — {a.location}
              </div>
              <div className="flex gap-2 items-center">
                <span className={`badge ${a.severity === "high" ? "badge-red" : "badge-orange"}`}>{a.severity.toUpperCase()}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => resolveAlert(a.id)}>✓ Resolve</button>
              </div>
            </div>
            <div className="alert-item-meta">
              <span>📊 {a.cases} cases reported (threshold: {a.threshold})</span>
              <span>🕐 {a.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Prediction */}
      <div className="card">
        <div className="card-title">🤖 AI-Based Outbreak Prediction</div>
        <div className="info-banner">
          AI model analyzing {patients.length} patient records across {LOC.length} locations for abnormal disease trends.
        </div>
        <div className="grid-3">
          {AI_RISK.map((d, i) => {
            const col = d.risk >= 75 ? "var(--red)" : d.risk >= 50 ? "var(--orange)" : "var(--cyan)";
            const alreadyRaised = alerts.find(a => a.disease === d.disease && a.location === d.location);
            return (
              <div key={i} className="card" style={{ padding: "14px 16px" }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
                  <span className={`badge ${d.level === "OUTBREAK" ? "badge-red" : d.level === "WARNING" ? "badge-orange" : "badge-blue"}`}>{d.level}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: col, fontFamily: "'Space Grotesk',sans-serif" }}>{d.risk}%</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>🦠 {d.disease}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 8 }}>📍 {d.location}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>Case increase: <span style={{ color: col, fontWeight: 600 }}>{d.delta}</span></div>
                <div className="risk-track">
                  <div className="risk-fill" style={{ width: `${d.risk}%`, background: col }}></div>
                </div>
                {!alreadyRaised && (
                  <button className="btn btn-danger btn-sm" onClick={() => raiseAlert(d)} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
                    Raise Alert
                  </button>
                )}
                {alreadyRaised && (
                  <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>Alert already active</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REMINDERS PAGE
// ─────────────────────────────────────────────
function RemindersPage({ user, reminders, setReminders }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ medicine: "", dosage: "", time: "", duration: "" });
  const [ok, setOk] = useState(false);

  const visible = user.role === "patient"
    ? reminders.filter(r => r.patientId === user.linkedId)
    : reminders;

  const add = () => {
    if (!f.medicine || !f.time) { alert("Medicine name and time are required."); return; }
    setReminders(p => [...p, { ...f, id: `REM-${Date.now()}`, patientId: user.linkedId || user.id, active: true }]);
    setOk(true); setShowForm(false); setF({ medicine: "", dosage: "", time: "", duration: "" });
    setTimeout(() => setOk(false), 3000);
  };

  return (
    <div>
      {ok && <div className="success-banner">✅ Medicine reminder saved.</div>}
      <div className="flex justify-between items-center mb-4">
        <div style={{ fontWeight: 600, fontSize: 14 }}>{visible.length} reminder{visible.length !== 1 ? "s" : ""}</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(s => !s)}>
          {showForm ? "Cancel" : "+ Add Reminder"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-title">New Medicine Reminder</div>
          <div className="form-grid">
            <div className="field"><label className="label">Medicine Name *</label><input className="input" placeholder="e.g. Paracetamol 500mg" value={f.medicine} onChange={e => setF(p => ({ ...p, medicine: e.target.value }))} /></div>
            <div className="field"><label className="label">Dosage</label><input className="input" placeholder="e.g. 1 tablet" value={f.dosage} onChange={e => setF(p => ({ ...p, dosage: e.target.value }))} /></div>
            <div className="field"><label className="label">Time *</label><input className="input" placeholder="e.g. 08:00 AM" value={f.time} onChange={e => setF(p => ({ ...p, time: e.target.value }))} /></div>
            <div className="field"><label className="label">Duration</label><input className="input" placeholder="e.g. 7 days" value={f.duration} onChange={e => setF(p => ({ ...p, duration: e.target.value }))} /></div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn btn-primary btn-sm" onClick={add}>Save Reminder</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {visible.length === 0 && <div className="info-banner">ℹ No reminders set. Add your first medicine reminder above.</div>}
      {visible.map(r => (
        <div key={r.id} className="rem-card" style={{ opacity: r.active ? 1 : 0.5 }}>
          <div>
            <div className="rem-name">{r.medicine}</div>
            <div className="rem-info">{r.dosage}{r.duration ? ` · ${r.duration}` : ""}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rem-time">{r.time}</div>
            <StatusBadge status={r.active ? "confirmed" : "cancelled"} />
            <button className="btn btn-ghost btn-sm" onClick={() => setReminders(p => p.map(x => x.id === r.id ? { ...x, active: !x.active } : x))}>
              {r.active ? "Pause" : "Resume"}
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setReminders(p => p.filter(x => x.id !== r.id))}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL: PATIENT PROFILE
// ─────────────────────────────────────────────
function PatientProfileModal({ patient: p, onClose, onScan }) {
  return (
    <>
      <div className="modal-header">
        <div className="modal-title">Patient Profile</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close ✕</button>
      </div>

      {/* Header */}
      <div className="flex gap-3 items-center" style={{ marginBottom: 18 }}>
        <div className="avatar">{p.name[0]}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{p.name}</div>
          <div className="mono text-muted text-xs" style={{ marginTop: 3 }}>{p.id} · Age {p.age} · {p.gender} · Blood {p.blood}</div>
          <div className="flex gap-2 items-center" style={{ marginTop: 6 }}>
            <StatusBadge status={p.status} />
            <span className="text-muted text-xs">📍 {p.location}</span>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        {/* Left: Info */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Current Diagnosis</div>
          <div className="card" style={{ padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--orange)", marginBottom: 4 }}>🦠 {p.disease}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Rx: {p.prescription || "—"}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, fontFamily: "monospace" }}>
              {p.date} · {p.doctor}
            </div>
          </div>

          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Patient Details</div>
          <div className="card" style={{ padding: "10px 14px" }}>
            {[
              ["Contact", p.contact || "—"],
              ["Allergies", p.allergies || "—"],
              ["Chronic", p.chronic || "—"],
              ["Current Meds", p.currentMeds || "—"],
              ["Emg. Contact", p.emergencyContact || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: QR card */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>QR Health Card</div>
          <HealthCard patient={p} onScan={onScan} />
        </div>
      </div>

      <div className="divider" />

      {/* History timeline */}
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Medical History</div>
      <div className="timeline">
        {[...p.history].reverse().map((h, i) => (
          <div key={i} className="tl-item">
            <div className="tl-dot" style={{ background: i === 0 ? "var(--accent)" : "var(--text-muted)" }}></div>
            <div className="tl-date">{h.date}</div>
            <div className="tl-body">
              <div className="tl-disease">🦠 {h.disease}</div>
              <div className="tl-rx">Rx: {h.prescription || "—"}</div>
              <div className="tl-doc">Dr: {h.doctor}{h.notes ? ` · ${h.notes}` : ""}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// MODAL: QR CARD (standalone)
// ─────────────────────────────────────────────
function QRModal({ patient: p, onClose, onScan }) {
  return (
    <>
      <div className="modal-header">
        <div className="modal-title">Smart Health Card</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close ✕</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <HealthCard patient={p} onScan={onScan} />
        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          Scan the QR code above to instantly access {p.name}'s medical records
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", fontSize: 11, fontFamily: "monospace", color: "var(--text-secondary)" }}>
          {p.id} · {p.name} · {p.blood} · {p.location}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// MODAL: UPDATE RECORD
// ─────────────────────────────────────────────
function UpdateModal({ patient: p, onUpdate, onClose }) {
  const [f, setF] = useState({ disease: "", prescription: "", doctor: p.doctor, status: p.status, notes: "" });
  const save = () => {
    if (!f.disease) { alert("Please enter a diagnosis."); return; }
    onUpdate(p.id, f); onClose();
  };
  return (
    <>
      <div className="modal-header">
        <div className="modal-title">Update Medical Record</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close ✕</button>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: "11px 14px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>UPDATING RECORD FOR</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.id} · {p.location}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="field"><label className="label">New Diagnosis *</label><input className="input" placeholder="e.g. Dengue Fever" value={f.disease} onChange={e => setF(x => ({ ...x, disease: e.target.value }))} /></div>
        <div className="field"><label className="label">Updated Prescription</label><input className="input" placeholder="Medicines..." value={f.prescription} onChange={e => setF(x => ({ ...x, prescription: e.target.value }))} /></div>
        <div className="field"><label className="label">Attending Doctor</label><input className="input" value={f.doctor} onChange={e => setF(x => ({ ...x, doctor: e.target.value }))} /></div>
        <div className="field"><label className="label">Update Status</label>
          <select className="input" value={f.status} onChange={e => setF(x => ({ ...x, status: e.target.value }))}>
            <option>Under Treatment</option><option>Recovered</option><option>Critical</option>
          </select>
        </div>
        <div className="field"><label className="label">Clinical Notes</label><input className="input" placeholder="Additional observations..." value={f.notes} onChange={e => setF(x => ({ ...x, notes: e.target.value }))} /></div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-success" onClick={save}>Save Update</button>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// MODAL: EMERGENCY ACCESS
// ─────────────────────────────────────────────
function EmergencyModal({ patient: p, onClose }) {
  return (
    <>
      <div className="modal-header">
        <div className="modal-title" style={{ color: "var(--red)" }}>🚨 Emergency Access Mode</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close ✕</button>
      </div>
      <div className="emg-header">
        <div className="emg-icon" style={{ animation: "pulse 1s infinite" }}>🚨</div>
        <div>
          <div className="emg-title">Emergency Mode — Critical Data Only</div>
          <div className="emg-sub">{p.name} · {p.id} · Accessed by authorised personnel</div>
        </div>
      </div>
      <div className="emg-table">
        {[
          ["🩸", "Blood Group", p.blood],
          ["⚠️", "Allergies", p.allergies || "None known"],
          ["🏥", "Chronic Conditions", p.chronic || "None"],
          ["💊", "Current Medications", p.currentMeds || "None"],
          ["📞", "Emergency Contact", p.emergencyContact || "Not set"],
        ].map(([icon, label, value]) => (
          <div key={label} className="emg-row">
            <span className="emg-key">{icon} {label}</span>
            <span className="emg-val">{value}</span>
          </div>
        ))}
      </div>
      <div className="info-banner" style={{ marginTop: 14, marginBottom: 0 }}>
        ℹ Full medical history is accessible after standard doctor authentication.
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// QR SCANNER PAGE — Simulate scanning a patient QR code
// ─────────────────────────────────────────────
function QRScannerPage({ patients, onViewFull }) {
  const [patientId, setPatientId] = useState("");
  const [found, setFound] = useState(null);
  const [err, setErr] = useState("");

  const doScan = () => {
    const p = patients.find(x => x.id === patientId.trim().toUpperCase());
    if (!p) {
      setErr(`No record found for ID "${patientId}". Try PHC-001, PHC-002, PHC-003 or PHC-004.`);
      setFound(null);
    } else {
      setErr("");
      setFound(p);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="card mb-4">
        <div className="card-title">🔲 QR Code Scanner</div>
        <div className="info-banner" style={{ marginBottom: 16 }}>
          ℹ In production, scanning the physical QR on a health card auto-loads the patient record.
          Enter a <strong>Patient ID</strong> below to simulate a scan.
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label className="label">Patient ID (from QR code)</label>
            <input className="input" placeholder="e.g. PHC-001"
              value={patientId} onChange={e => setPatientId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doScan()} />
          </div>
          <button className="btn btn-primary" onClick={doScan}>🔍 Scan</button>
        </div>
        {err && <div className="alert-banner" style={{ marginTop: 12 }}>{err}</div>}
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
          Available IDs: PHC-001 · PHC-002 · PHC-003 · PHC-004
        </div>
      </div>

      {found && (
        <>
          <div className="success-banner">✅ QR scanned — Patient record loaded for <strong>{found.name}</strong></div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <HealthCard patient={found} onScan={() => onViewFull(found)} />
          </div>
          <div className="card">
            <div className="card-title">📋 Health History</div>
            <div className="timeline">
              {[...found.history].reverse().map((h, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-dot" style={{ background: i === 0 ? "var(--accent)" : "var(--border-act)" }}></div>
                  <div className="tl-date">{h.date}</div>
                  <div className="tl-body" style={{ borderLeft: i === 0 ? "2px solid var(--accent)" : "1px solid var(--border)" }}>
                    <div className="tl-disease">🦠 {h.disease}</div>
                    <div className="tl-rx">Rx: {h.prescription || "—"}</div>
                    <div className="tl-doc">Dr: {h.doctor}{h.notes ? ` · ${h.notes}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => onViewFull(found)}>
              🖥 Open Full Health Card
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useState(SEED_PATIENTS);
  const [apts, setApts] = useState(SEED_APTS);
  const [reminders, setReminders] = useState(SEED_REMINDERS);
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [modal, setModal] = useState(null);
  const [qrScanPatient, setQrScanPatient] = useState(null); // patient being "scanned"

  // Update a patient's record
  const handleUpdate = (id, data) => {
    const today = new Date().toISOString().split("T")[0];
    setPatients(prev => {
      const updated = prev.map(p =>
        p.id !== id ? p : {
          ...p,
          disease: data.disease,
          prescription: data.prescription,
          doctor: data.doctor,
          status: data.status,
          date: today,
          history: [...p.history, { date: today, disease: data.disease, prescription: data.prescription, doctor: data.doctor, notes: data.notes || "" }],
        }
      );
      // Auto-raise alert using latest patients state (inside updater to avoid stale closure)
      const sameDiseaseCount = updated.filter(p => p.disease === data.disease).length;
      if (sameDiseaseCount >= 3) {
        const location = updated.find(p => p.id === id)?.location || "Unknown";
        setAlerts(prevAlerts => {
          const exists = prevAlerts.find(a => a.disease === data.disease && a.location === location);
          if (exists) return prevAlerts;
          return [...prevAlerts, {
            id: `ALT-AUTO-${Date.now()}`,
            disease: data.disease,
            location,
            cases: sameDiseaseCount,
            threshold: 3,
            timestamp: new Date().toLocaleString("en-IN"),
            severity: "medium",
          }];
        });
      }
      return updated;
    });
  };

  // Navigation by role
  const NAV = {
    admin: [
      { p: "dashboard", icon: "📊", label: "Dashboard" },
      { p: "patients", icon: "👥", label: "All Patients" },
      { p: "register", icon: "➕", label: "Register Patient" },
      { p: "appointments", icon: "📅", label: "Appointments" },
      { p: "alerts", icon: "🚨", label: "Alerts & AI", badge: alerts.length },
      { p: "qrscan", icon: "🔲", label: "QR Scanner" },
    ],
    doctor: [
      { p: "dashboard", icon: "📊", label: "Dashboard" },
      { p: "patients", icon: "👥", label: "My Patients" },
      { p: "register", icon: "➕", label: "Register Patient" },
      { p: "appointments", icon: "📅", label: "Appointments" },
      { p: "qrscan", icon: "🔲", label: "QR Scanner" },
    ],
    patient: [
      { p: "dashboard", icon: "📊", label: "My Overview" },
      { p: "patients", icon: "📋", label: "My Health Records" },
      { p: "appointments", icon: "📅", label: "My Appointments" },
      { p: "reminders", icon: "💊", label: "Medicine Reminders" },
      { p: "qrscan", icon: "🔲", label: "QR Scanner" },
    ],
  };

  const PAGE_INFO = {
    dashboard: ["Disease Surveillance Dashboard", "Real-time health monitoring & disease analytics"],
    patients: ["Patient Records", "View & manage medical histories"],
    register: ["Register New Patient", "Add a new patient to the system"],
    appointments: ["Appointments", "Manage patient-doctor scheduling"],
    alerts: ["Alerts & AI Prediction", "Outbreak detection & disease trend monitoring"],
    reminders: ["Medicine Reminders", "Track your daily medication schedule"],
    qrscan: ["QR Code Scanner", "Scan a patient health card to view records & history"],
  };

  const ROLE_COLORS = { admin: "var(--accent)", doctor: "var(--green)", patient: "var(--purple)" };

  if (!user) return <><style>{STYLE}</style><LandingPage onLogin={u => { setUser(u); setPage("dashboard") }} /></>;

  // QR Scan view — full-screen, no sidebar
  if (qrScanPatient) return (
    <>
      <style>{STYLE}</style>
      <QRScanPage patient={qrScanPatient} onBack={() => setQrScanPatient(null)} />
    </>
  );

  const [pageTitle, pageSub] = PAGE_INFO[page] || ["", ""];
  // Hide sidebar when patient views their own records (full-width layout)
  const hideNav = user.role === "patient" && page === "patients";

  return (
    <>
      <style>{STYLE}</style>
      <div className="shell">

        {/* ── SIDEBAR ── */}
        {!hideNav && (
          <nav className="sidebar">
            <div className="sb-head">
              <div className="sb-logo-icon">⚕</div>
              <div>
                <div className="sb-brand">MedSurveillance</div>
                <div className="sb-ver">Healthcare OS · v2.0</div>
              </div>
            </div>

            <div style={{ paddingBottom: 8 }}>
              <div className="nav-group-title">Navigation</div>
              {(NAV[user.role] || []).map(n => (
                <div
                  key={n.p}
                  className={`nav-link ${page === n.p ? "active" : ""}`}
                  onClick={() => setPage(n.p)}
                >
                  <span className="nav-icon">{n.icon}</span>
                  <span>{n.label}</span>
                  {n.badge > 0 && <span className="nav-badge">{n.badge}</span>}
                </div>
              ))}
            </div>

            <div className="sb-footer">
              <div className="sb-user-card">
                <div className="sb-user-name">{user.name}</div>
                <div className="sb-user-role" style={{ color: ROLE_COLORS[user.role] }}>
                  ● {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
              <button className="sb-logout" onClick={() => { setUser(null); setPage("dashboard") }}>
                Sign Out →
              </button>
            </div>
          </nav>
        )}

        {/* ── MAIN ── */}
        <div className="main-content" style={{ marginLeft: hideNav ? 0 : 220 }}>
          <div className="topbar">
            <div>
              <div className="page-title">{pageTitle}</div>
              <div className="page-sub">{pageSub}</div>
            </div>
            <div className="flex items-center gap-3">
              {alerts.length > 0 && (
                <span className="alert-tag">
                  🚨 {alerts.length} Alert{alerts.length > 1 ? "s" : ""}
                </span>
              )}
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="page-body">
            {page === "dashboard" && <DashboardPage user={user} patients={patients} alerts={alerts} />}
            {page === "patients" && <PatientListPage user={user} patients={patients}
              onView={p => setModal({ type: "view", patient: p })}
              onQR={p => setModal({ type: "qr", patient: p })}
              onUpdate={p => setModal({ type: "update", patient: p })}
              onEmergency={p => setModal({ type: "emergency", patient: p })} />}
            {page === "register" && <RegisterPage user={user} onRegister={p => { setPatients(prev => [...prev, p]); setPage("patients") }} />}
            {page === "appointments" && <AppointmentsPage user={user} patients={patients} apts={apts} setApts={setApts} />}
            {page === "alerts" && <AlertsPage alerts={alerts} setAlerts={setAlerts} patients={patients} />}
            {page === "reminders" && <RemindersPage user={user} reminders={reminders} setReminders={setReminders} />}
            {page === "qrscan" && <QRScannerPage patients={patients} onViewFull={p => setQrScanPatient(p)} />}
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            {modal.type === "view" && <PatientProfileModal patient={modal.patient} onClose={() => setModal(null)} onScan={() => { setModal(null); setQrScanPatient(modal.patient); }} />}
            {modal.type === "qr" && <QRModal patient={modal.patient} onClose={() => setModal(null)} onScan={() => { setModal(null); setQrScanPatient(modal.patient); }} />}
            {modal.type === "update" && <UpdateModal patient={modal.patient} onUpdate={handleUpdate} onClose={() => setModal(null)} />}
            {modal.type === "emergency" && <EmergencyModal patient={modal.patient} onClose={() => setModal(null)} />}
          </div>
        </div>
      )}
    </>
  );
}
