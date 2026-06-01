"""
ProjectLoop — EGTA26 Round 2
Impact & Journey Dashboard  |  Team GTA261925  |  Five Nines Sustainability
Run: streamlit run projectloop_dashboard.py
"""

import streamlit as st
import plotly.graph_objects as go
from plotly.subplots import make_subplots
streamlit
plotly
st.set_page_config(
    page_title="ProjectLoop — Impact Dashboard",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');
html, body, [class*="css"] {
    font-family: 'DM Sans', sans-serif;
    background-color: #0D1117; color: #E6EDF3;
}
.block-container { padding: 2rem 2.5rem 3rem; max-width: 1400px; }
.hero {
    background: #0d1f16; border: 1px solid #2ECC71;
    border-radius: 16px; padding: 2rem 2.5rem; margin-bottom: 2rem;
}
.hero h1 { font-family:'IBM Plex Mono',monospace; font-size:2rem; color:#2ECC71; margin-bottom:.3rem; }
.hero p  { color:#8B949E; font-size:.95rem; margin:0; }
.tag { display:inline-block; background:#161B22; border:1px solid #30363D;
       border-radius:20px; padding:.2rem .8rem; font-size:.75rem; color:#8B949E; margin:.3rem .3rem 0 0; }
.sec { font-family:'IBM Plex Mono',monospace; font-size:.75rem; color:#2ECC71;
       text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid #21262D;
       padding-bottom:.4rem; margin: 1.8rem 0 1rem; }
.phase-card { background:#161B22; border:1px solid #30363D; border-radius:12px; padding:1.2rem; height:100%; }
.phase-card h4 { font-size:.95rem; color:#E6EDF3; margin-bottom:.2rem; }
.phase-card .period { font-size:.78rem; color:#8B949E; margin-bottom:.8rem; }
.phase-card ul { margin:0; padding-left:1rem; font-size:.83rem; color:#8B949E; line-height:2; }
.phase-card ul li::marker { color:#2ECC71; }
.kpi-row { background:#161B22; border-radius:12px; padding:.9rem 1.2rem;
           display:flex; justify-content:space-between; align-items:center; margin-bottom:.5rem; }
.kpi-row .name { font-size:.85rem; color:#8B949E; }
.kpi-row .vals { display:flex; gap:2rem; font-size:.85rem; font-weight:500; }
.kpi-row .y1 { color:#58A6FF; } .kpi-row .y2 { color:#2ECC71; } .kpi-row .y3 { color:#F0883E; }
.rev-bar { background:#21262D; border-radius:6px; height:10px; margin-bottom:1rem; overflow:hidden; }
.rev-bar-fill { height:100%; border-radius:6px; }
.sdg-card { background:#161B22; border:1px solid #30363D; border-radius:12px;
            padding:1rem; text-align:center; }
.sdg-card .icon { font-size:1.8rem; margin-bottom:.4rem; }
.sdg-card h5 { font-size:.8rem; color:#E6EDF3; margin-bottom:.2rem; }
.sdg-card p  { font-size:.72rem; color:#8B949E; margin:0; }
footer { text-align:center; color:#8B949E; font-size:.75rem; padding:1.5rem 0 0; border-top:1px solid #21262D; }
</style>
""", unsafe_allow_html=True)

# ── HERO ──────────────────────────────────────────────
st.markdown("""
<div class="hero">
  <h1>♻ ProjectLoop</h1>
  <p>A circular economy platform for student engineering components · EGTA26 Round 2 · Team GTA261925</p>
  <div style="margin-top:.8rem">
    <span class="tag">📍 Cairo, Egypt</span>
    <span class="tag">🏛 AUC Pilot → 10 universities</span>
    <span class="tag">📅 Launching 2026–2027</span>
    <span class="tag">💻 Web + Telegram Bot</span>
  </div>
</div>
""", unsafe_allow_html=True)

# ── ABOUT ─────────────────────────────────────────────
st.markdown('<div class="sec">The problem we solve</div>', unsafe_allow_html=True)
c1, c2, c3 = st.columns(3)
c1.markdown("""
<div class="phase-card">
  <h4>🗑️ Linear waste cycle</h4>
  <p class="period">The status quo</p>
  <ul>
    <li>Functional Arduinos, sensors & motors discarded after one project</li>
    <li>Cairo generates 690,000 t of e-waste/year</li>
    <li>Toxic processing in informal sector</li>
  </ul>
</div>""", unsafe_allow_html=True)

c2.markdown("""
<div class="phase-card">
  <h4>💸 Financial pressure</h4>
  <p class="period">On students</p>
  <ul>
    <li>Students spend EGP 1,500–3,000 per project</li>
    <li>Components re-bought new every semester</li>
    <li>No accessible second-hand channel exists</li>
  </ul>
</div>""", unsafe_allow_html=True)

c3.markdown("""
<div class="phase-card">
  <h4>♻️ Our solution</h4>
  <p class="period">ProjectLoop</p>
  <ul>
    <li>Peer-to-peer campus exchange (web + Telegram)</li>
    <li>Sellers recoup ~35% of original cost</li>
    <li>Buyers save ~65% vs buying new</li>
  </ul>
</div>""", unsafe_allow_html=True)

# ── HEADLINE METRICS ───────────────────────────────────
st.markdown('<div class="sec">Year 3 targets</div>', unsafe_allow_html=True)
cols = st.columns(6)
for col, (v, l) in zip(cols, [
    ("10", "Partner\nuniversities"),
    ("2,800 kg", "E-waste\ndiverted/yr"),
    ("8,000+", "Registered\nusers"),
    ("EGP 4.8M", "Student\nsavings"),
    ("11,200 kg", "CO₂e\navoided"),
    ("EGP 599K", "Platform\nnet revenue"),
]):
    col.metric(label=l, value=v)

# ── PHASE JOURNEY ─────────────────────────────────────
st.markdown('<div class="sec">Implementation journey</div>', unsafe_allow_html=True)
p1, p2, p3 = st.columns(3)
p1.markdown("""
<div class="phase-card" style="border-color:#58A6FF33">
  <div style="font-size:.7rem;color:#58A6FF;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.4rem">Phase 1 · Months 1–6</div>
  <h4>AUC Pilot</h4>
  <p class="period">Proof of concept</p>
  <ul>
    <li>Backend + Telegram bot deployed</li>
    <li>AUC Student Union MoU signed</li>
    <li>Semester Component Drive events</li>
    <li>Target: 150 users, 100 transactions</li>
    <li>Break-even by month 6</li>
  </ul>
</div>""", unsafe_allow_html=True)

p2.markdown("""
<div class="phase-card" style="border-color:#2ECC7133">
  <div style="font-size:.7rem;color:#2ECC71;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.4rem">Phase 2 · Months 7–18</div>
  <h4>Cairo University Network</h4>
  <p class="period">Network expansion</p>
  <ul>
    <li>GUC, Ain Shams, Cairo University</li>
    <li>SaaS licence at EGP 12,000/uni/yr</li>
    <li>Campus Coordinator programme</li>
    <li>Target: 1,000+ users</li>
    <li>EGP 100K+ in student savings</li>
  </ul>
</div>""", unsafe_allow_html=True)

p3.markdown("""
<div class="phase-card" style="border-color:#F0883E33">
  <div style="font-size:.7rem;color:#F0883E;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.4rem">Phase 3 · Months 19–36</div>
  <h4>National Scale</h4>
  <p class="period">Platform maturity</p>
  <ul>
    <li>10 universities, 80,000+ students</li>
    <li>Open API for LMS integration</li>
    <li>Hardware Library pilot model</li>
    <li>Annual impact report (QS ranking)</li>
    <li>MENA expansion scoping</li>
  </ul>
</div>""", unsafe_allow_html=True)

# ── GROWTH CHARTS ─────────────────────────────────────
st.markdown('<div class="sec">3-year growth projections</div>', unsafe_allow_html=True)

YEARS   = ["Year 1<br>(AUC)", "Year 2<br>(4 unis)", "Year 3<br>(10 unis)"]
COLORS  = ["#58A6FF", "#2ECC71", "#F0883E"]
BG      = "rgba(0,0,0,0)"
GRID    = "#21262D"
FONT    = "#8B949E"

def bar(fig, row, col, ys, label, tick_fmt=None):
    fig.add_trace(go.Bar(
        x=YEARS, y=ys,
        marker_color=COLORS,
        text=[f"{v:,}" for v in ys],
        textposition="outside",
        textfont=dict(size=11, color="#E6EDF3"),
        showlegend=False,
        name=label,
    ), row=row, col=col)

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=["E-waste diverted (kg)", "Student savings (EGP)",
                    "Platform net revenue (EGP)", "CO₂e avoided (kg)"],
    vertical_spacing=0.22, horizontal_spacing=0.1,
)

bar(fig, 1, 1, [230, 345, 2800], "kg diverted")
bar(fig, 1, 2, [238000, 955000, 4800000], "EGP savings")
bar(fig, 2, 1, [33440, 164470, 599360], "EGP revenue")
bar(fig, 2, 2, [920, 1380, 11200], "kg CO2e")

fig.update_layout(
    paper_bgcolor=BG, plot_bgcolor=BG,
    font=dict(color=FONT, family="DM Sans"),
    margin=dict(t=50, b=20, l=10, r=10),
    height=520,
)
for i in range(1, 3):
    for j in range(1, 3):
        fig.update_xaxes(gridcolor=GRID, row=i, col=j)
        fig.update_yaxes(gridcolor=GRID, zerolinecolor=GRID, row=i, col=j)

fig.update_annotations(font_color="#E6EDF3", font_size=13)
st.plotly_chart(fig, use_container_width=True)

# ── REVENUE BREAKDOWN ─────────────────────────────────
st.markdown('<div class="sec">Revenue streams — year 1 (EGP 71,500 total)</div>', unsafe_allow_html=True)
c1, c2 = st.columns([2, 1])

with c1:
    streams = [
        ("CSR Sponsorship (Vodafone Tech for Good)", 30000, "#2ECC71", 42),
        ("Transaction Fees (5% commission)", 20500, "#58A6FF", 29),
        ("University SaaS Licences", 12000, "#A8E063", 17),
        ("Premium Listings", 9000, "#F0883E", 13),
    ]
    for name, val, color, pct in streams:
        st.markdown(f"""
        <div style="display:flex;justify-content:space-between;font-size:.83rem;margin-bottom:.3rem">
          <span style="color:#8B949E">{name}</span>
          <span style="color:#E6EDF3">EGP {val:,} &nbsp;·&nbsp; {pct}%</span>
        </div>
        <div class="rev-bar"><div class="rev-bar-fill" style="width:{pct}%;background:{color}"></div></div>
        """, unsafe_allow_html=True)

with c2:
    st.markdown("""
    <div class="phase-card" style="margin-top:.2rem">
      <h4 style="color:#2ECC71;font-size:1.4rem;font-family:'IBM Plex Mono',monospace">EGP 33,440</h4>
      <p class="period">Year 1 net surplus</p>
      <h4 style="color:#2ECC71;font-size:1.4rem;font-family:'IBM Plex Mono',monospace">Month 6</h4>
      <p class="period">Break-even point</p>
      <h4 style="color:#2ECC71;font-size:1.4rem;font-family:'IBM Plex Mono',monospace">7.9×</h4>
      <p class="period">Social ROI per EGP invested by CSR sponsors</p>
      <h4 style="color:#2ECC71;font-size:1.4rem;font-family:'IBM Plex Mono',monospace">EGP 580K</h4>
      <p class="period">3-year NPV (8% discount rate)</p>
    </div>
    """, unsafe_allow_html=True)

# ── KPI TABLE ─────────────────────────────────────────
st.markdown('<div class="sec">KPI milestone tracker</div>', unsafe_allow_html=True)

kpis = [
    ("Registered users",            "500",      "2,000",    "8,000"),
    ("Transactions completed",      "448",      "1,800",    "9,000"),
    ("Partner universities",        "1 (AUC)", "3–4",      "10"),
    ("E-waste diverted",            "230 kg",   "345 kg",   "2,800 kg"),
    ("CO₂e avoided",               "920 kg",   "1,380 kg", "11,200 kg"),
    ("Student savings (EGP)",       "238K",     "955K",     "4.8M"),
    ("Platform net revenue (EGP)",  "33,440",   "164,470",  "599,360"),
    ("NPS target",                  ">40",      ">55",      ">65"),
]

header = '<div class="kpi-row"><span class="name" style="font-weight:600;color:#E6EDF3">KPI</span><div class="vals"><span class="y1">Year 1</span><span class="y2">Year 2</span><span class="y3">Year 3</span></div></div>'
st.markdown(header, unsafe_allow_html=True)
for name, y1, y2, y3 in kpis:
    st.markdown(f"""
    <div class="kpi-row">
      <span class="name">{name}</span>
      <div class="vals">
        <span class="y1">{y1}</span>
        <span class="y2">{y2}</span>
        <span class="y3">{y3}</span>
      </div>
    </div>""", unsafe_allow_html=True)

# ── SDG ───────────────────────────────────────────────
st.markdown('<div class="sec">SDG alignment</div>', unsafe_allow_html=True)
s1, s2, s3 = st.columns(3)
for col, icon, num, title, desc in [
    (s1, "♻️", "SDG 12", "Responsible Consumption", "Extends component life by 2–3 academic cycles, directly reducing e-waste to landfill"),
    (s2, "🌍", "SDG 13", "Climate Action", "Avoids manufacturing-embedded carbon; 11,200 kg CO₂e avoided by Year 3"),
    (s3, "🏙️", "SDG 11", "Sustainable Cities", "Reduces toxic e-waste in Cairo's informal sector; builds campus micro-economy"),
]:
    col.markdown(f"""
    <div class="sdg-card">
      <div class="icon">{icon}</div>
      <div style="font-size:.7rem;color:#2ECC71;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.3rem">{num}</div>
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>""", unsafe_allow_html=True)

# ── FOOTER ────────────────────────────────────────────
st.markdown("""
<footer>
  ProjectLoop · EGTA26 Round 2 · Team GTA261925 · Five Nines Sustainability<br>
  AUC Pilot Launch · 2026–2027 Academic Year
</footer>
""", unsafe_allow_html=True)
