import { useState } from "react";

// ==========================================
// DATA — Agregá más spots acá
// ==========================================
const spots = [
  {
    name: "Hawaii Market",
    desc: "Supermercado coreano. Productos asiáticos difíciles de encontrar, snacks importados y un kimchi casero increíble.",
    address: "Morón 3269",
    lat: -34.6253062,
    lng: -58.4772129,
  },
  {
    name: "Terra",
    desc: "Ropa casual masculina con buenos precios. Probadores, tarjeta y atención de primera en plena zona de Avellaneda.",
    address: "Joaquín V. González 320",
    lat: -34.629759,
    lng: -58.48064,
  },
  {
    name: "REVEL",
    desc: "Carteras, mochilas y accesorios. Diseños originales con muy buena relación calidad-precio. Imposible no tentarse.",
    address: "Av. Avellaneda 3829",
    lat: -34.6291204,
    lng: -58.4827588,
  },
];

// ==========================================
// Street grid data for Floresta area
// Approximate real street positions
// ==========================================
const STREETS = {
  // Major E-W streets (name, lat approx)
  ew: [
    { name: "Av. Rivadavia", lat: -34.6205, major: true },
    { name: "Bacacay", lat: -34.6225 },
    { name: "Yerbal", lat: -34.6240 },
    { name: "Morón", lat: -34.6253 },
    { name: "Neuquén", lat: -34.6265 },
    { name: "Elpidio González", lat: -34.6278 },
    { name: "Av. Avellaneda", lat: -34.6292, major: true },
    { name: "J. V. González", lat: -34.6298 },
    { name: "Caracas", lat: -34.6310 },
    { name: "Av. Directorio", lat: -34.6330, major: true },
  ],
  // Major N-S streets (name, lng approx)
  ns: [
    { name: "Bahía Blanca", lng: -58.4720 },
    { name: "Gualeguaychú", lng: -58.4738 },
    { name: "Campana", lng: -58.4755 },
    { name: "Morón (NS)", lng: -58.4772 },
    { name: "Concordia", lng: -58.4790 },
    { name: "Av. Boyacá", lng: -58.4808, major: true },
    { name: "Remedios", lng: -58.4825 },
    { name: "Rafaela", lng: -58.4842 },
    { name: "Mercedes", lng: -58.4860 },
  ],
};

// Map bounds
const MAP_BOUNDS = {
  minLat: -34.6345,
  maxLat: -34.6190,
  minLng: -58.4880,
  maxLng: -58.4700,
};

const SVG_W = 800;
const SVG_H = 680;

function project(lat, lng) {
  const x =
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    SVG_W;
  const y =
    ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    SVG_H;
  return { x, y };
}

export default function FlorestMap() {
  const [active, setActive] = useState(null);

  const projected = spots.map((s) => ({
    ...s,
    ...project(s.lat, s.lng),
  }));

  const pathD =
    "M " + projected.map((p) => `${p.x},${p.y}`).join(" L ");

  return (
    <div
      style={{
        background: "#0c0c14",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "#e8e8ed",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "2rem 1rem 0.5rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #ff6b35, #ffd166)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Floresta Spots
        </h1>
        <p
          style={{
            color: "#6b6b80",
            fontSize: "0.8rem",
            marginTop: "0.4rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          Buenos Aires · Recorrido a pie
        </p>
      </div>

      {/* Map */}
      <div
        style={{
          maxWidth: 820,
          margin: "1rem auto",
          padding: "0 0.8rem",
        }}
      >
        <div
          style={{
            background: "#111119",
            borderRadius: 14,
            border: "1px solid #ffffff0a",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ width: "100%", display: "block" }}
          >
            {/* Background blocks (manzanas) */}
            {STREETS.ew.map((ewSt, ei) => {
              if (ei === STREETS.ew.length - 1) return null;
              const nextEw = STREETS.ew[ei + 1];
              return STREETS.ns.map((nsSt, ni) => {
                if (ni === STREETS.ns.length - 1) return null;
                const nextNs = STREETS.ns[ni + 1];
                const tl = project(ewSt.lat, nsSt.lng);
                const br = project(nextEw.lat, nextNs.lng);
                return (
                  <rect
                    key={`block-${ei}-${ni}`}
                    x={tl.x + 2}
                    y={tl.y + 2}
                    width={br.x - tl.x - 4}
                    height={br.y - tl.y - 4}
                    fill="#16161f"
                    rx={3}
                  />
                );
              });
            })}

            {/* E-W Streets */}
            {STREETS.ew.map((st, i) => {
              const left = project(st.lat, MAP_BOUNDS.minLng);
              const right = project(st.lat, MAP_BOUNDS.maxLng);
              return (
                <g key={`ew-${i}`}>
                  <line
                    x1={0}
                    y1={left.y}
                    x2={SVG_W}
                    y2={right.y}
                    stroke={st.major ? "#2a2a3a" : "#1e1e2a"}
                    strokeWidth={st.major ? 3 : 1.5}
                  />
                  <text
                    x={8}
                    y={left.y - 4}
                    fill={st.major ? "#555570" : "#333345"}
                    fontSize={st.major ? 9 : 7}
                    fontWeight={st.major ? 600 : 400}
                    fontFamily="system-ui, sans-serif"
                  >
                    {st.name}
                  </text>
                </g>
              );
            })}

            {/* N-S Streets */}
            {STREETS.ns.map((st, i) => {
              const top = project(MAP_BOUNDS.maxLat, st.lng);
              const bottom = project(MAP_BOUNDS.minLat, st.lng);
              return (
                <g key={`ns-${i}`}>
                  <line
                    x1={top.x}
                    y1={0}
                    x2={bottom.x}
                    y2={SVG_H}
                    stroke={st.major ? "#2a2a3a" : "#1e1e2a"}
                    strokeWidth={st.major ? 3 : 1.5}
                  />
                  <text
                    x={top.x + 3}
                    y={14}
                    fill={st.major ? "#555570" : "#333345"}
                    fontSize={st.major ? 9 : 7}
                    fontWeight={st.major ? 600 : 400}
                    fontFamily="system-ui, sans-serif"
                    transform={`rotate(90, ${top.x + 3}, 14)`}
                  >
                    {st.name}
                  </text>
                </g>
              );
            })}

            {/* Walking path */}
            <path
              d={pathD}
              fill="none"
              stroke="#ff6b35"
              strokeWidth={3}
              strokeDasharray="10 7"
              strokeLinecap="round"
              opacity={0.5}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-300"
                dur="25s"
                repeatCount="indefinite"
              />
            </path>

            {/* Spot markers */}
            {projected.map((spot, i) => {
              const isActive = active === i;
              return (
                <g
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  {/* Outer pulse */}
                  <circle cx={spot.x} cy={spot.y} r={18} fill="none" stroke="#ff6b35" strokeWidth={1.2} opacity={0.3}>
                    <animate attributeName="r" values="12;22;12" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Glow */}
                  <circle
                    cx={spot.x}
                    cy={spot.y}
                    r={isActive ? 18 : 14}
                    fill="#ff6b35"
                    opacity={0.15}
                  />
                  {/* Dot */}
                  <circle
                    cx={spot.x}
                    cy={spot.y}
                    r={isActive ? 14 : 11}
                    fill="#ff6b35"
                    stroke="#0c0c14"
                    strokeWidth={3}
                    style={{
                      filter: "drop-shadow(0 0 8px #ff6b3588)",
                      transition: "r 0.3s ease",
                    }}
                  />
                  {/* Number */}
                  <text
                    x={spot.x}
                    y={spot.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#0c0c14"
                    fontSize={10}
                    fontWeight={700}
                    fontFamily="system-ui, sans-serif"
                  >
                    {i + 1}
                  </text>
                  {/* Label */}
                  <text
                    x={spot.x + 18}
                    y={spot.y + 1}
                    fill="#ffd166"
                    fontSize={10}
                    fontWeight={700}
                    fontFamily="system-ui, sans-serif"
                    dominantBaseline="central"
                    style={{
                      textShadow: "0 0 10px #0c0c14, 0 0 20px #0c0c14",
                    }}
                  >
                    {spot.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active spot popup */}
          {active !== null && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                background: "#1a1a28ee",
                backdropFilter: "blur(12px)",
                borderRadius: 12,
                padding: "1rem 1.2rem",
                border: "1px solid #ffffff12",
                display: "flex",
                gap: "0.8rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#ff6b35",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0c0c14",
                  flexShrink: 0,
                }}
              >
                {active + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#ffd166",
                    marginBottom: 4,
                  }}
                >
                  {spots[active].name}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#8888a0",
                    lineHeight: 1.45,
                  }}
                >
                  {spots[active].desc}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#555570",
                    marginTop: 6,
                    fontFamily: "monospace",
                  }}
                >
                  {spots[active].address}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555570",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: "0 4px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div
        style={{
          maxWidth: 820,
          margin: "1rem auto 3rem",
          padding: "0 0.8rem",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {spots.map((spot, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? "#1c1c2a" : "#15151f",
              padding: "1.1rem 1.3rem",
              display: "grid",
              gridTemplateColumns: "2rem 1fr",
              gap: "0.8rem",
              alignItems: "start",
              cursor: "pointer",
              borderLeft: `3px solid ${active === i ? "#ff6b35" : "transparent"}`,
              borderRadius:
                i === 0
                  ? "12px 12px 0 0"
                  : i === spots.length - 1
                  ? "0 0 12px 12px"
                  : 0,
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "#ff6b35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#0c0c14",
              }}
            >
              {i + 1}
            </div>
            <div>
              <div
                style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: 3 }}
              >
                {spot.name}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#8888a0",
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              >
                {spot.desc}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#555570",
                  marginTop: 5,
                  fontFamily: "monospace",
                }}
              >
                {spot.address}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          color: "#333345",
          fontSize: "0.6rem",
          fontFamily: "monospace",
        }}
      >
        hecho con cariño · floresta 2026
      </div>
    </div>
  );
}
