"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Sector, SectorTile } from "@/i18n/sectors";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ACCENT = "#C06C4C";
const SILVER = "#C7CCD6";

type FlowLabels = { from: string; via: string; to: string };

/* ---------------------------------------------------------------------------
   FINANCE: a hard, angular zig-zag market line (straight segments only, no
   beziers) that spikes at the outcome, with "smart money" (glowing terracotta
   packets) tracing the sharp corners through the decision nodes and a pulsing
   ring at the Business Outcome spike.
   --------------------------------------------------------------------------- */
function FinanceFlow({ labels }: { labels: FlowLabels }) {
  const reduced = useReducedMotion();

  // Straight-line vertices only. Nodes sit on: (20,104) request ·
  // (146,104) reasoning · (300,20) spike.
  const CHART =
    "M 20 104 L 48 60 L 76 110 L 104 58 L 146 104 L 178 64 " +
    "L 210 110 L 244 70 L 276 98 L 300 20";
  const AREA = `${CHART} L 300 128 L 20 128 Z`;

  const nodes = [
    { x: 20, y: 104, dy: 20, label: labels.from, anchor: "start" as const },
    { x: 146, y: 104, dy: 30, label: labels.via, anchor: "middle" as const },
    { x: 300, y: 20, dy: -14, label: labels.to, anchor: "end" as const },
  ];

  return (
    <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
      <defs>
        <linearGradient id="fin-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity="0.3" />
          <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
        <filter id="fin-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>

      {/* Faint chart grid */}
      {[40, 72, 104].map((y) => (
        <line
          key={y}
          x1="12"
          y1={y}
          x2="308"
          y2={y}
          stroke={SILVER}
          strokeOpacity="0.06"
          strokeDasharray="2 6"
        />
      ))}

      {/* Area under the curve fades in behind the line */}
      <motion.path
        d={AREA}
        fill="url(#fin-area)"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />

      {/* Silver market line draws itself in */}
      <motion.path
        d={CHART}
        stroke={SILVER}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="miter"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      {/* Decision nodes + labels */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="4" fill="#0A0A0B" stroke={SILVER} strokeWidth="1.5" />
          <text
            x={n.x}
            y={n.y + n.dy}
            textAnchor={n.anchor}
            fill="#71717A"
            style={{ font: "500 8px ui-monospace, monospace", letterSpacing: "0.12em" }}
          >
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Pulsing ring at the outcome spike */}
      {!reduced && (
        <motion.circle
          cx={300}
          cy={20}
          r="6"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1.5"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: [0.6, 1.9], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: "300px 20px", transformBox: "view-box" }}
        />
      )}

      {/* Smart-money packets flowing along the market line */}
      {!reduced &&
        [0, -1.6].map((begin, i) => (
          <g key={i}>
            <circle r="5" fill={ACCENT} opacity="0.4" filter="url(#fin-glow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path={CHART} begin={`${begin}s`} />
            </circle>
            <circle r="2.5" fill={ACCENT}>
              <animateMotion dur="3.2s" repeatCount="indefinite" path={CHART} begin={`${begin}s`} />
            </circle>
          </g>
        ))}
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   WEALTH ASSISTANTS: an infinite, slow-motion "money rain". Minimalist silver
   $100 bills drift down the container with a gentle sway and rotation, like
   falling leaves. Terracotta-glowing "100". Staggered so the flow is seamless.
   --------------------------------------------------------------------------- */

/* One minimalist bill, centered at (0,0): silver outline + glowing "MONEY". */
function RainBill({ w = 66, h = 26 }: { w?: number; h?: number }) {
  const textStyle = { font: "700 9px var(--font-display), sans-serif", letterSpacing: "0.1em" } as const;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill="none" stroke={SILVER} strokeWidth={1.5} />
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w - 8} height={h - 8} rx={2} fill="none" stroke={SILVER} strokeOpacity={0.25} strokeWidth={1} />
      {/* soft terracotta glow behind the word */}
      <text x={0} y={3.4} textAnchor="middle" fill={ACCENT} filter="url(#rain-glow)" opacity={0.7} style={textStyle}>
        MONEY
      </text>
      {/* crisp legible word on top */}
      <text x={0} y={3.4} textAnchor="middle" fill="#E7A98C" style={textStyle}>
        MONEY
      </text>
    </g>
  );
}

const RAIN_W = 320;
/* Fixed, compact animation band height (px) so bills reliably fall the full
   visible height regardless of container width, and the modal stays punchy. */
const RAIN_H = 132;

/* Deterministic per-bill drift so the SSR and client markup match. */
const RAIN_BILLS = [
  { left: 30, dur: 5.2, delay: 0, sway: 12, rot: 8, scale: 1 },
  { left: 96, dur: 6.4, delay: 0.9, sway: -16, rot: -10, scale: 0.86 },
  { left: 152, dur: 4.6, delay: 0.4, sway: 12, rot: 9, scale: 1.02 },
  { left: 208, dur: 6.0, delay: 1.6, sway: -13, rot: -8, scale: 0.92 },
  { left: 256, dur: 5.6, delay: 0.6, sway: 15, rot: 11, scale: 0.8 },
  { left: 128, dur: 5.0, delay: 2.3, sway: -11, rot: -9, scale: 0.94 },
  { left: 282, dur: 6.8, delay: 1.2, sway: 11, rot: 7, scale: 0.88 },
];

function WealthFlow() {
  const reduced = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="A continuous rain of minimalist money notes"
      className="relative w-full overflow-hidden rounded-lg"
      style={{ height: `${RAIN_H}px` }}
    >
      {/* Shared filter defs (referenced document-wide by the falling bills). */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="rain-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
      </svg>

      {reduced &&
        RAIN_BILLS.slice(0, 3).map((b, i) => (
          <svg
            key={i}
            viewBox="0 0 100 44"
            className="absolute"
            style={{ left: `${(b.left / RAIN_W) * 100}%`, width: "96px", top: `${16 + i * 40}px` }}
            aria-hidden="true"
          >
            <g transform={`translate(50 22) rotate(${b.rot / 2}) scale(${b.scale})`}>
              <RainBill />
            </g>
          </svg>
        ))}

      {!reduced &&
        RAIN_BILLS.map((b, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 100 44"
            className="absolute"
            style={{ left: `${(b.left / RAIN_W) * 100}%`, width: "96px", top: 0 }}
            aria-hidden="true"
            initial={{ y: "-44px", x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: ["-44px", `${RAIN_H + 44}px`],
              x: [0, b.sway, -b.sway, 0],
              rotate: [0, b.rot, -b.rot, 0],
              opacity: [0, 0.92, 0.92, 0],
            }}
            transition={{
              duration: b.dur,
              delay: b.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.12, 0.88, 1],
              x: { duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <g transform={`translate(50 22) scale(${b.scale})`}>
              <RainBill />
            </g>
          </motion.svg>
        ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   FRAUD NEUTRALIZATION: a rail of silver transaction cards streaming through
   a hexagonal scanner gate. Legit cards pass clean; one terracotta card gets
   caught mid-gate, ringed, crossed out and dissolved. Language-neutral (no
   text), so it serves both locales.
   --------------------------------------------------------------------------- */
function TxCard({ color }: { color: string }) {
  return (
    <g>
      <rect x={-11} y={-7} width={22} height={14} rx={2.5} fill="#0A0A0B" stroke={color} strokeWidth={1.5} />
      <line x1={-6} y1={-2} x2={6} y2={-2} stroke={color} strokeOpacity={0.7} strokeWidth={1} />
      <line x1={-6} y1={2.5} x2={2} y2={2.5} stroke={color} strokeOpacity={0.35} strokeWidth={1} />
    </g>
  );
}

function FraudFlow() {
  const reduced = useReducedMotion();
  const LANE_Y = 74;
  const GATE_X = 170;
  const DUR = 5.6;
  // Hexagonal shield centered on the gate.
  const HEX = "M 170 54 L 187.3 64 L 187.3 84 L 170 94 L 152.7 84 L 152.7 64 Z";

  if (reduced) {
    return (
      <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
        <line x1="8" y1={LANE_Y} x2="312" y2={LANE_Y} stroke={SILVER} strokeOpacity="0.12" strokeDasharray="2 6" />
        <path d={HEX} stroke={SILVER} strokeOpacity="0.5" strokeWidth="1.5" />
        <g transform={`translate(60 ${LANE_Y})`}>
          <TxCard color={SILVER} />
        </g>
        <g transform={`translate(268 ${LANE_Y})`}>
          <TxCard color={SILVER} />
        </g>
        <g transform={`translate(${GATE_X} ${LANE_Y})`}>
          <TxCard color={ACCENT} />
        </g>
        <circle cx={GATE_X} cy={LANE_Y} r="15" stroke={ACCENT} strokeOpacity="0.6" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
      <defs>
        <filter id="fraud-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      {/* Transaction rail */}
      <line x1="8" y1={LANE_Y} x2="312" y2={LANE_Y} stroke={SILVER} strokeOpacity="0.12" strokeDasharray="2 6" />

      {/* Scanner gate: hexagonal shield + breathing scan beam */}
      <path d={HEX} stroke={SILVER} strokeOpacity="0.45" strokeWidth="1.5" />
      <motion.line
        x1={GATE_X}
        y1="34"
        x2={GATE_X}
        y2="114"
        stroke={ACCENT}
        strokeWidth="1"
        animate={{ opacity: [0.06, 0.4, 0.06] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Legit transactions glide through the gate untouched. The lane offset
          lives on a static wrapper <g>: framer writes its own transform on the
          motion element, which would clobber a translate set there. */}
      {[0, 1.4, 2.8].map((delay) => (
        <g key={delay} transform={`translate(0 ${LANE_Y})`}>
          <motion.g
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: [-30, 350], opacity: [0, 0.85, 0.85, 0] }}
            transition={{
              duration: 4.2,
              delay,
              repeat: Infinity,
              ease: "linear",
              opacity: { duration: 4.2, delay, repeat: Infinity, times: [0, 0.1, 0.9, 1] },
            }}
          >
            <TxCard color={SILVER} />
          </motion.g>
        </g>
      ))}

      {/* The fraudulent one: arrives, gets caught mid-gate, dissolves */}
      <g transform={`translate(0 ${LANE_Y})`}>
        <motion.g
          initial={{ x: -30, opacity: 0, scale: 1 }}
          animate={{
            x: [-30, GATE_X, GATE_X, GATE_X, GATE_X],
            opacity: [0, 1, 1, 0, 0],
            scale: [1, 1, 1, 0.4, 0.4],
          }}
          transition={{ duration: DUR, times: [0, 0.4, 0.6, 0.7, 1], repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <TxCard color={ACCENT} />
        </motion.g>
      </g>

      {/* Neutralization: expanding ring + cross flash at the catch moment */}
      <motion.circle
        cx={GATE_X}
        cy={LANE_Y}
        r="9"
        stroke={ACCENT}
        strokeWidth="1.5"
        fill="none"
        filter="url(#fraud-glow)"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 0.4, 0.6, 2.2, 2.2], opacity: [0, 0, 0.85, 0, 0] }}
        transition={{ duration: DUR, times: [0, 0.42, 0.5, 0.72, 1], repeat: Infinity, ease: "easeOut" }}
        style={{ transformBox: "view-box", transformOrigin: `${GATE_X}px ${LANE_Y}px` }}
      />
      <motion.g
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9, 0.9, 0, 0] }}
        transition={{ duration: DUR, times: [0, 0.46, 0.52, 0.64, 0.72, 1], repeat: Infinity }}
      >
        <line x1={GATE_X - 5} y1={LANE_Y - 5} x2={GATE_X + 5} y2={LANE_Y + 5} />
        <line x1={GATE_X + 5} y1={LANE_Y - 5} x2={GATE_X - 5} y2={LANE_Y + 5} />
      </motion.g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   PERSONAL SHOPPERS: a terracotta agent dot browses a shelf grid of product
   tiles, picks three (tiles flash, items arc into a line-drawn cart), then
   the cart pulses. Collection mechanic, distinct from the fraud interception
   and the inventory forecast.
   --------------------------------------------------------------------------- */
function ShopperFlow() {
  const reduced = useReducedMotion();
  const DUR = 8;
  const TILE_W = 32;
  const TILE_H = 24;
  const COLS = [20, 64, 108, 152];
  const ROWS = [26, 62];
  const CART = { x: 274, y: 100 };
  // Tiles the agent buys from, with the moment (0..1 of the cycle) it happens.
  const PICKS = [
    { cx: 124, cy: 38, t: 0.26 },
    { cx: 80, cy: 74, t: 0.42 },
    { cx: 168, cy: 74, t: 0.58 },
  ];

  const cart = (
    <g stroke={SILVER} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M 246 86 L 253 90 L 258 112 L 290 112 L 296 91" fill="none" />
      <circle cx="263" cy="118" r="3" fill="#0A0A0B" />
      <circle cx="285" cy="118" r="3" fill="#0A0A0B" />
    </g>
  );

  const grid = ROWS.map((y) =>
    COLS.map((x) => (
      <rect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width={TILE_W}
        height={TILE_H}
        rx="4"
        stroke={SILVER}
        strokeOpacity="0.3"
        strokeWidth="1"
      />
    ))
  );

  if (reduced) {
    return (
      <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
        {grid}
        {PICKS.slice(0, 2).map((p) => (
          <rect
            key={p.t}
            x={p.cx - TILE_W / 2}
            y={p.cy - TILE_H / 2}
            width={TILE_W}
            height={TILE_H}
            rx="4"
            stroke={ACCENT}
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
        ))}
        {cart}
        <rect x="270" y="98" width="6" height="6" rx="1" fill={ACCENT} opacity="0.9" />
        <circle cx={CART.x} cy={CART.y - 14} r="3" fill={ACCENT} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
      <defs>
        <filter id="shop-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {grid}

      {/* Pick flashes on the tiles the agent buys from */}
      {PICKS.map((p) => (
        <motion.rect
          key={`flash-${p.t}`}
          x={p.cx - TILE_W / 2}
          y={p.cy - TILE_H / 2}
          width={TILE_W}
          height={TILE_H}
          rx="4"
          stroke={ACCENT}
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.95, 0.95, 0, 0] }}
          transition={{
            duration: DUR,
            times: [0, p.t - 0.02, p.t, p.t + 0.05, p.t + 0.11, 1],
            repeat: Infinity,
          }}
        />
      ))}

      {/* Bought items arc from their tile into the cart */}
      {PICKS.map((p) => (
        <motion.rect
          key={`item-${p.t}`}
          width="6"
          height="6"
          rx="1"
          fill={ACCENT}
          initial={{ x: p.cx - 3, y: p.cy - 3, opacity: 0 }}
          animate={{
            x: [p.cx - 3, p.cx - 3, (p.cx + CART.x) / 2, CART.x - 3, CART.x - 3],
            y: [p.cy - 3, p.cy - 3, Math.min(p.cy, CART.y) - 26, CART.y - 6, CART.y - 6],
            opacity: [0, 0, 1, 0.9, 0],
          }}
          transition={{
            duration: DUR,
            times: [0, p.t + 0.01, p.t + 0.07, p.t + 0.13, p.t + 0.15],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Cart + end-of-run pulse once the third item lands */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1, 1.08, 1, 1] }}
        transition={{ duration: DUR, times: [0, 0.74, 0.79, 0.85, 1], repeat: Infinity }}
        style={{ transformBox: "view-box", transformOrigin: `${CART.x}px 104px` }}
      >
        {cart}
      </motion.g>

      {/* The agent: a glowing terracotta dot browsing the shelves */}
      <motion.g
        initial={{ x: -12, y: 110 }}
        animate={{
          x: [-12, 36, 124, 80, 168, CART.x, CART.x, 336],
          y: [110, 38, 38, 74, 74, CART.y, CART.y, 112],
        }}
        transition={{
          duration: DUR,
          times: [0, 0.12, 0.26, 0.42, 0.58, 0.75, 0.88, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <circle r="5.5" fill={ACCENT} opacity="0.4" filter="url(#shop-glow)" />
        <circle r="2.8" fill={ACCENT} />
      </motion.g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   INVENTORY PREDICTION: a stock bar chart split by a "now" divider. Solid
   silver bars to the left, dashed forecast bars to the right under a
   terracotta prediction line with a confidence band. The bar nearest "now"
   drains and a terracotta replenishment packet drops in just in time.
   Time-series mechanic, distinct from the other two.
   --------------------------------------------------------------------------- */
function InventoryFlow() {
  const reduced = useReducedMotion();
  const BASE = 116;
  const BAR_W = 18;
  const DUR = 6.4;
  const NOW_X = 166;
  const actual = [
    { x: 24, h: 40 },
    { x: 52, h: 56 },
    { x: 80, h: 32 },
    { x: 108, h: 62 },
  ];
  const RISK = { x: 136, h: 46 }; // the bar that drains and refills
  const predicted = [
    { x: 182, h: 52 },
    { x: 210, h: 36 },
    { x: 238, h: 60 },
    { x: 266, h: 44 },
  ];
  // Forecast polyline over the bar tops, actual into predicted.
  const CURVE =
    "M 33 76 L 61 60 L 89 84 L 117 54 L 145 70 " +
    "L 191 64 L 219 80 L 247 56 L 275 72 L 296 66";
  const BAND =
    "M 191 54 L 219 70 L 247 46 L 275 62 L 296 56 " +
    "L 296 76 L 275 82 L 247 66 L 219 90 L 191 74 Z";

  const axis = (
    <>
      <line x1="16" y1={BASE} x2="304" y2={BASE} stroke={SILVER} strokeOpacity="0.18" />
      <line
        x1={NOW_X}
        y1="24"
        x2={NOW_X}
        y2={BASE + 6}
        stroke={SILVER}
        strokeOpacity="0.3"
        strokeDasharray="3 5"
      />
      <path d={`M ${NOW_X - 4} 18 L ${NOW_X + 4} 18 L ${NOW_X} 24 Z`} fill={SILVER} fillOpacity="0.5" />
    </>
  );

  const predictedBars = predicted.map((b, i) =>
    reduced ? (
      <rect
        key={b.x}
        x={b.x}
        y={BASE - b.h}
        width={BAR_W}
        height={b.h}
        rx="2"
        stroke={SILVER}
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
    ) : (
      <motion.rect
        key={b.x}
        x={b.x}
        y={BASE - b.h}
        width={BAR_W}
        height={b.h}
        rx="2"
        stroke={SILVER}
        strokeWidth="1"
        strokeDasharray="3 4"
        fill="none"
        animate={{ strokeOpacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
    )
  );

  if (reduced) {
    return (
      <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
        {axis}
        {[...actual, RISK].map((b) => (
          <rect
            key={b.x}
            x={b.x}
            y={BASE - b.h}
            width={BAR_W}
            height={b.h}
            rx="2"
            fill={SILVER}
            fillOpacity="0.12"
            stroke={SILVER}
            strokeOpacity="0.5"
            strokeWidth="1"
          />
        ))}
        {predictedBars}
        <path d={BAND} fill={ACCENT} fillOpacity="0.07" />
        <path d={CURVE} stroke={ACCENT} strokeOpacity="0.8" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" className="w-full">
      {axis}

      {/* Actual stock: solid bars grow in once */}
      {actual.map((b, i) => (
        <motion.rect
          key={b.x}
          x={b.x}
          y={BASE - b.h}
          width={BAR_W}
          height={b.h}
          rx="2"
          fill={SILVER}
          fillOpacity="0.12"
          stroke={SILVER}
          strokeOpacity="0.5"
          strokeWidth="1"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
          style={{ transformBox: "view-box", transformOrigin: `${b.x + BAR_W / 2}px ${BASE}px` }}
        />
      ))}

      {/* The at-risk bar drains, then refills the moment the packet lands */}
      <motion.rect
        x={RISK.x}
        y={BASE - RISK.h}
        width={BAR_W}
        height={RISK.h}
        rx="2"
        fill={SILVER}
        fillOpacity="0.12"
        stroke={SILVER}
        strokeOpacity="0.5"
        strokeWidth="1"
        animate={{ scaleY: [1, 0.26, 0.26, 1, 1] }}
        transition={{ duration: DUR, times: [0, 0.38, 0.52, 0.62, 1], repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "view-box", transformOrigin: `${RISK.x + BAR_W / 2}px ${BASE}px` }}
      />

      {/* Replenishment packet drops in just before stockout */}
      <motion.rect
        x={RISK.x + 3}
        width="12"
        height="7"
        rx="1.5"
        fill={ACCENT}
        initial={{ y: -14, opacity: 0 }}
        animate={{
          y: [-14, -14, -14, BASE - RISK.h - 12, BASE - RISK.h - 8, BASE - RISK.h - 8],
          opacity: [0, 0, 0.95, 0.95, 0, 0],
        }}
        transition={{ duration: DUR, times: [0, 0.4, 0.46, 0.56, 0.62, 1], repeat: Infinity, ease: "easeIn" }}
      />

      {/* Predicted stock: dashed bars breathing beyond the "now" line */}
      {predictedBars}

      {/* Confidence band + forecast line sweeping across */}
      <motion.path
        d={BAND}
        fill={ACCENT}
        initial={{ fillOpacity: 0 }}
        animate={{ fillOpacity: [0, 0.08, 0.08, 0] }}
        transition={{ duration: 5, times: [0, 0.3, 0.8, 1], repeat: Infinity, repeatDelay: 0.4 }}
      />
      <motion.path
        d={CURVE}
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0.9 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0.9, 0.9, 0] }}
        transition={{ duration: 5, times: [0, 0.6, 1], repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Generic request -> reasoning -> outcome timeline. Placeholder for the
   sectors whose bespoke visuals are not built yet (healthcare, legal,
   industrial, e-commerce).
   --------------------------------------------------------------------------- */
function GenericFlow({ labels }: { labels: FlowLabels }) {
  const reduced = useReducedMotion();
  const FLOW = "M 24 46 C 90 14 150 78 296 34";
  return (
    <svg viewBox="0 0 320 84" fill="none" aria-hidden="true" className="w-full">
      <defs>
        <filter id="flow-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path d={FLOW} stroke={SILVER} strokeOpacity="0.28" strokeWidth="1.5" />
      {[
        { x: 24, y: 46, dy: 20, label: labels.from, anchor: "start" as const },
        { x: 160, y: 46, dy: 32, label: labels.via, anchor: "middle" as const },
        { x: 296, y: 34, dy: -16, label: labels.to, anchor: "end" as const },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="4" fill="#0A0A0B" stroke={SILVER} strokeWidth="1.5" />
          <text
            x={n.x}
            y={n.y + n.dy}
            textAnchor={n.anchor}
            fill="#71717A"
            style={{ font: "500 8px ui-monospace, monospace", letterSpacing: "0.12em" }}
          >
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}
      {!reduced && (
        <>
          <circle r="5" fill={ACCENT} opacity="0.45" filter="url(#flow-glow)">
            <animateMotion dur="2.6s" repeatCount="indefinite" path={FLOW} />
          </circle>
          <circle r="2.5" fill={ACCENT}>
            <animateMotion dur="2.6s" repeatCount="indefinite" path={FLOW} />
          </circle>
        </>
      )}
    </svg>
  );
}

export default function SectorFlow({
  sector,
  flow,
  labels,
}: {
  sector: Sector["id"];
  flow?: SectorTile["flow"];
  labels: FlowLabels;
}) {
  if (flow === "wealth") return <WealthFlow />;
  if (flow === "fraud") return <FraudFlow />;
  if (flow === "shopper") return <ShopperFlow />;
  if (flow === "inventory") return <InventoryFlow />;
  if (sector === "finance") return <FinanceFlow labels={labels} />;
  return <GenericFlow labels={labels} />;
}
