/**
 * FreshFind ProduceArt
 * Hand-built SVG produce cut-outs used as the "isolated PNG" layer of the
 * site. Vector means zero loading cost, perfect scaling and no layout shift,
 * while still allowing the big overlapping editorial compositions.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";

type ArtProps = { className?: string; style?: React.CSSProperties };



/* Reusable gradient + highlight helpers keep each illustration compact. */
function G({
  id,
  from,
  to,
  angle = 35,
}: {
  id: string;
  from: string;
  to: string;
  angle?: number;
}) {
  const rad = (angle * Math.PI) / 180;
  return (
    <linearGradient
      id={id}
      x1={0.5 - Math.cos(rad) / 2}
      y1={0.5 - Math.sin(rad) / 2}
      x2={0.5 + Math.cos(rad) / 2}
      y2={0.5 + Math.sin(rad) / 2}
    >
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  );
}

const Shadow = ({ cx = 50, cy = 92, rx = 26, ry = 4 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#16331F" opacity="0.12" />
);

/* ------------------------------------------------------------------ */

function Avocado({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 130" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="avo-skin" from="#3F7D2B" to="#1E4A18" angle={60} />
        <G id="avo-belly" from="#8FC44A" to="#5FA83C" angle={120} />
        <radialGradient id="avo-sheen" cx="34%" cy="26%" r="42%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Shadow cx={60} cy={124} rx={30} ry={4.5} />
      <path
        d="M60 6c17 0 30 20 30 45 0 28-13 47-30 47S30 79 30 51C30 26 43 6 60 6Z"
        fill="url(#avo-skin)"
      />
      <path
        d="M60 22c10 0 18 14 18 31 0 20-8 33-18 33s-18-13-18-33c0-17 8-31 18-31Z"
        fill="url(#avo-belly)"
      />
      <ellipse cx="46" cy="42" rx="14" ry="20" fill="url(#avo-sheen)" />
      <path d="M60 6c-2 5-2 9 0 13 2-4 2-8 0-13Z" fill="#2B5E1E" />
      <path d="M58 19c-3-4-3-9-1-13" stroke="#24492F" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function AvocadoHalf({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 130" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="avoh-rind" from="#2F6B22" to="#1B4516" angle={60} />
        <G id="avoh-flesh" from="#E8F3A8" to="#A9CF57" angle={40} />
        <G id="avoh-pit" from="#C58A54" to="#8A552F" angle={40} />
      </defs>
      <Shadow cx={60} cy={124} rx={30} ry={4.5} />
      <path
        d="M60 8c17 0 30 20 30 45 0 28-13 47-30 47S30 81 30 53C30 28 43 8 60 8Z"
        fill="url(#avoh-rind)"
      />
      <path
        d="M60 17c13 0 23 16 23 36 0 23-10 39-23 39s-23-16-23-39c0-20 10-36 23-36Z"
        fill="url(#avoh-flesh)"
      />
      <ellipse cx="60" cy="56" rx="14" ry="17" fill="#F2F8D4" opacity="0.55" />
      <ellipse cx="60" cy="58" rx="13" ry="16" fill="url(#avoh-pit)" />
      <ellipse cx="55" cy="51" rx="4" ry="5" fill="#fff" opacity="0.28" />
      <ellipse cx="60" cy="30" rx="17" ry="13" fill="#E8F3A8" opacity="0.35" />
    </svg>
  );
}

function Tomato({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="tom-body" from="#F4673C" to="#C22F1B" angle={40} />
        <radialGradient id="tom-sheen" cx="32%" cy="26%" r="38%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <G id="tom-leaf" from="#6FBF4A" to="#2F6B22" />
      </defs>
      <Shadow cx={60} cy={110} rx={30} ry={4.5} />
      <ellipse cx="60" cy="66" rx="42" ry="38" fill="url(#tom-body)" />
      <ellipse cx="44" cy="48" rx="16" ry="13" fill="url(#tom-sheen)" />
      <path
        d="M60 26c4-6 10-8 16-7-2 6-6 9-11 10 3 2 4 5 4 8-4 0-7-2-9-5-2 3-5 5-9 5 0-3 1-6 4-8-5-1-9-4-11-10 6-1 12 1 16 7Z"
        fill="url(#tom-leaf)"
      />
      <path d="M60 26v-8" stroke="#2F6B22" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 78c8 10 20 15 32 14" stroke="#A8281A" strokeWidth="0" fill="none" />
    </svg>
  );
}

function Strawberry({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 130" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="str-body" from="#F2543D" to="#B01F27" angle={45} />
        <radialGradient id="str-sheen" cx="34%" cy="30%" r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <G id="str-leaf" from="#7BC94F" to="#2F6B22" />
      </defs>
      <Shadow cx={60} cy={122} rx={28} ry={4} />
      <path
        d="M60 118c-22 0-38-19-38-42 0-17 12-27 26-30 4-1 6-2 7-4l5-6 5 6c1 2 3 3 7 4 14 3 26 13 26 30 0 23-16 42-38 42Z"
        fill="url(#str-body)"
      />
      <ellipse cx="46" cy="66" rx="13" ry="18" fill="url(#str-sheen)" />
      {[
        [40, 58],
        [58, 52],
        [76, 58],
        [50, 72],
        [68, 72],
        [60, 84],
        [44, 88],
        [78, 88],
        [60, 66],
        [34, 74],
        [86, 74],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.2" ry="3" fill="#FFE9A8" opacity="0.9" />
      ))}
      <path
        d="M60 40c-9-6-20-8-27-5 3-7 9-11 16-12 6 4 9 9 11 17Zm0 0c9-6 20-8 27-5-3-7-9-11-16-12-6 4-9 9-11 17Z"
        fill="url(#str-leaf)"
      />
      <path d="M60 40V28" stroke="#2F6B22" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Carrot({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="car-body" from="#FFB14A" to="#E0631A" angle={20} />
        <G id="car-leaf" from="#6FBF4A" to="#2F6B22" />
      </defs>
      <Shadow cx={60} cy={132} rx={16} ry={4} />
      <path d="M60 132c-4-30-16-58-22-70 8-6 20-9 22-9s14 3 22 9c-6 12-18 40-22 70Z" fill="url(#car-body)" />
      {[62, 78, 92, 106].map((y, i) => (
        <path
          key={y}
          d={`M${60 - (y * 0.13 + 4)} ${y} q${y * 0.13 + 4} 5 ${(y * 0.13 + 4) * 2} 0`}
          stroke="#C4521A"
          strokeWidth="2.4"
          fill="none"
          opacity={0.35 + i * 0.05}
          strokeLinecap="round"
        />
      ))}
      <path d="M60 53c-2-14-10-24-20-28 4 12 10 20 20 28Z" fill="url(#car-leaf)" />
      <path d="M60 53c2-14 10-24 20-28-4 12-10 20-20 28Z" fill="url(#car-leaf)" />
      <path d="M60 53V22" stroke="#2F6B22" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 27c-6-6-14-9-20-8 3-6 10-9 16-8" fill="url(#car-leaf)" />
    </svg>
  );
}

function Broccoli({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 130 126" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="bro-floret" from="#7BC94F" to="#2F6B22" angle={60} />
        <G id="bro-stalk" from="#CFE79B" to="#9CBF63" angle={20} />
      </defs>
      <Shadow cx={65} cy={120} rx={26} ry={4} />
      <path d="M52 108h26l6-30H46l6 30Z" fill="url(#bro-stalk)" />
      <path d="M50 84h30l-3-14H53l-3 14Z" fill="#B6D57C" />
      {[
        [40, 62, 22],
        [65, 46, 26],
        [90, 62, 22],
        [52, 34, 16],
        [79, 34, 16],
        [65, 20, 15],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="url(#bro-floret)" />
      ))}
      <circle cx="56" cy="42" r="9" fill="#A8D877" opacity="0.55" />
      <circle cx="72" cy="26" r="7" fill="#A8D877" opacity="0.45" />
    </svg>
  );
}

function Spinach({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 130 120" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="spi-leaf" from="#7BC94F" to="#25601C" angle={50} />
        <G id="spi-leaf2" from="#A8D877" to="#3F7D2B" angle={50} />
      </defs>
      <Shadow cx={65} cy={114} rx={30} ry={4} />
      <path
        d="M12 104C12 60 40 22 84 14c14 44-8 84-52 90-8 1-14 0-20 0Z"
        fill="url(#spi-leaf)"
      />
      <path
        d="M118 104C118 66 96 34 62 20c-6 40 12 74 48 82 3 1 5 2 8 2Z"
        fill="url(#spi-leaf2)"
      />
      <path d="M18 100C30 70 52 42 80 22" stroke="#E4F0BF" strokeWidth="2.6" fill="none" opacity="0.7" />
      <path d="M112 100C102 76 88 54 68 28" stroke="#E4F0BF" strokeWidth="2.6" fill="none" opacity="0.7" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${30 + i * 12} ${86 - i * 12} l10 -14`}
          stroke="#E4F0BF"
          strokeWidth="2"
          opacity="0.35"
        />
      ))}
      <path d="M60 108c-6 4-10 8-12 12h24c-2-4-6-8-12-12Z" fill="#25601C" />
    </svg>
  );
}

function Blueberry({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="blue-body" from="#7A8FD6" to="#2C3370" angle={40} />
        <radialGradient id="blue-sheen" cx="34%" cy="28%" r="36%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Shadow cx={60} cy={110} rx={26} ry={4} />
      <circle cx="60" cy="64" r="38" fill="url(#blue-body)" />
      <ellipse cx="46" cy="50" rx="14" ry="11" fill="url(#blue-sheen)" />
      <path
        d="M60 26c3 4 8 5 12 4-1 5-6 8-11 8-1-4 0-8-1-12Zm-12 2c-3 3-8 4-12 3 1-4 5-7 10-7 1 1 2 3 2 4Zm24 0c3 3 8 4 12 3-1-4-5-7-10-7-1 1-2 3-2 4Z"
        fill="#1E2455"
      />
      <circle cx="60" cy="36" r="6" fill="#1E2455" opacity="0.85" />
      <circle cx="60" cy="36" r="2.6" fill="#9FB0E8" opacity="0.6" />
    </svg>
  );
}

function Lemon({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 140 110" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="lem-body" from="#FFE166" to="#E0A91C" angle={40} />
        <G id="lem-leaf" from="#7BC94F" to="#2F6B22" />
      </defs>
      <Shadow cx={70} cy={102} rx={34} ry={4} />
      <path
        d="M32 62c0-22 17-38 38-38s38 16 38 38-17 38-38 38-38-16-38-38Z"
        fill="url(#lem-body)"
      />
      <path d="M22 62c-4-4-4-8-1-11 4 2 7 5 7 11Z" fill="#E0A91C" />
      <path d="M118 62c4-4 4-8 1-11-4 2-7 5-7 11Z" fill="#E0A91C" />
      <ellipse cx="52" cy="46" rx="16" ry="10" fill="#FFF3B0" opacity="0.7" />
      <path d="M70 24c6-8 16-11 24-8-2 8-9 12-17 12" fill="url(#lem-leaf)" />
    </svg>
  );
}

function Orange({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="ora-body" from="#FFB14A" to="#DF6B12" angle={40} />
        <radialGradient id="ora-sheen" cx="32%" cy="28%" r="38%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <G id="ora-leaf" from="#7BC94F" to="#2F6B22" />
      </defs>
      <Shadow cx={60} cy={110} rx={28} ry={4} />
      <circle cx="60" cy="64" r="38" fill="url(#ora-body)" />
      <ellipse cx="46" cy="50" rx="15" ry="12" fill="url(#ora-sheen)" />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={60 + Math.cos(a) * (10 + (i % 3) * 9)}
            cy={64 + Math.sin(a) * (10 + (i % 3) * 9)}
            r="1.6"
            fill="#B84E0A"
            opacity="0.35"
          />
        );
      })}
      <path d="M60 26c4-6 11-8 17-6-2 6-7 9-13 10 3 1 5 4 5 7-4 0-8-2-9-5-2 3-5 5-9 5" fill="url(#ora-leaf)" />
    </svg>
  );
}

function Apple({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 126" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="app-body" from="#E14B6A" to="#8E1330" angle={40} />
        <radialGradient id="app-sheen" cx="33%" cy="28%" r="36%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <G id="app-leaf" from="#7BC94F" to="#2F6B22" />
      </defs>
      <Shadow cx={60} cy={120} rx={28} ry={4} />
      <path
        d="M60 30c8-8 22-9 32 1 10 11 8 30-2 46-7 12-18 22-30 22s-23-10-30-22c-10-16-12-35-2-46 10-10 24-9 32-1Z"
        fill="url(#app-body)"
      />
      <ellipse cx="44" cy="52" rx="14" ry="16" fill="url(#app-sheen)" />
      <path d="M60 30c-1-8 2-14 7-18 3 6 2 13-1 18" fill="url(#app-leaf)" />
      <path d="M60 30V10" stroke="#6B4423" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

function Pumpkin({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 140 120" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="pum-body" from="#FFA23A" to="#D1541A" angle={40} />
        <G id="pum-stem" from="#7BA33F" to="#3F6B22" />
      </defs>
      <Shadow cx={70} cy={112} rx={40} ry={4.5} />
      <ellipse cx="70" cy="70" rx="52" ry="40" fill="url(#pum-body)" />
      {[-34, -17, 0, 17, 34].map((dx, i) => (
        <ellipse
          key={i}
          cx={70 + dx}
          cy="70"
          rx={9 - Math.abs(dx) * 0.12}
          ry="38"
          fill="#C1450F"
          opacity="0.22"
        />
      ))}
      <ellipse cx="50" cy="52" rx="16" ry="12" fill="#FFD9A0" opacity="0.5" />
      <path d="M70 30c-2-8-1-14 1-20 4 5 5 13 3 20" fill="url(#pum-stem)" />
      <path
        d="M84 24c8-4 14-3 18 0-6 6-13 7-18 4"
        fill="url(#pum-stem)"
        transform="rotate(-14 84 24)"
      />
    </svg>
  );
}

function Basil({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 130" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="bas-leaf" from="#8FD16A" to="#2F6B22" angle={50} />
        <G id="bas-leaf2" from="#B7E391" to="#4F9433" angle={50} />
      </defs>
      <Shadow cx={60} cy={122} rx={20} ry={4} />
      <path d="M60 118V52" stroke="#3F7D2B" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M60 62C60 40 44 22 18 18c-2 30 14 50 42 52Z"
        fill="url(#bas-leaf)"
      />
      <path
        d="M60 62C60 40 76 22 102 18c2 30-14 50-42 52Z"
        fill="url(#bas-leaf2)"
      />
      <path d="M60 44C60 28 50 14 34 8c0 22 10 38 26 44Z" fill="url(#bas-leaf2)" />
      <path d="M60 44C60 28 70 14 86 8c0 22-10 38-26 44Z" fill="url(#bas-leaf)" />
      <path d="M60 62C48 56 34 44 24 32" stroke="#DFF3C0" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M60 62C72 56 86 44 96 32" stroke="#DFF3C0" strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  );
}

function Honey({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 130" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="hon-jar" from="#FFD879" to="#D98A15" angle={30} />
        <G id="hon-lid" from="#B98A5A" to="#7A5430" />
      </defs>
      <Shadow cx={60} cy={124} rx={28} ry={4} />
      <rect x="34" y="6" width="52" height="14" rx="6" fill="url(#hon-lid)" />
      <path
        d="M30 24h60c4 0 6 3 6 7v76c0 8-6 13-14 13H38c-8 0-14-5-14-13V31c0-4 2-7 6-7Z"
        fill="url(#hon-jar)"
      />
      <path d="M24 56h72v52c0 6-4 10-10 10H34c-6 0-10-4-10-10V56Z" fill="#E8A12A" opacity="0.55" />
      <rect x="28" y="30" width="8" height="82" rx="4" fill="#FFF0B8" opacity="0.5" />
      <path d="M60 40v40" stroke="#F5E3B8" strokeWidth="7" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx="60" cy={48 + i * 10} rx={11 - i} ry="4.5" fill="#F5E3B8" />
      ))}
    </svg>
  );
}

function Bread({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 140 110" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="brd-crust" from="#E0A95E" to="#9C5A22" angle={40} />
        <G id="brd-crumb" from="#FFF3DC" to="#E8CBA0" />
      </defs>
      <Shadow cx={70} cy={102} rx={46} ry={4.5} />
      <path
        d="M18 76c0-28 24-52 52-52s52 24 52 52c0 12-10 18-24 18H42c-14 0-24-6-24-18Z"
        fill="url(#brd-crust)"
      />
      <path
        d="M30 78c2-22 20-40 40-40s38 18 40 40c-14 6-28 9-40 9s-26-3-40-9Z"
        fill="#B4702E"
        opacity="0.35"
      />
      {[
        "M44 52c8-6 18-8 28-6",
        "M52 66c8-6 18-8 28-6",
        "M60 80c8-6 18-8 26-7",
      ].map((d, i) => (
        <path key={i} d={d} stroke="url(#brd-crumb)" strokeWidth="6" fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx="46" cy="44" rx="16" ry="9" fill="#FFF0CE" opacity="0.4" />
    </svg>
  );
}

function Cheese({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 140 110" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="che-body" from="#FFD977" to="#D99A17" angle={40} />
        <G id="che-side" from="#F5C24E" to="#BE7E0C" />
      </defs>
      <Shadow cx={70} cy={100} rx={44} ry={4.5} />
      <path d="M20 52 70 22l50 30-50 30-50-30Z" fill="url(#che-body)" />
      <path d="M20 52v20l50 30V72L20 52Z" fill="url(#che-side)" />
      <path d="M120 52v20l-50 30V72l50-20Z" fill="#C98B12" />
      <circle cx="62" cy="48" r="5" fill="#BE7E0C" opacity="0.55" />
      <circle cx="86" cy="58" r="4" fill="#BE7E0C" opacity="0.5" />
      <circle cx="46" cy="60" r="3.4" fill="#BE7E0C" opacity="0.45" />
      <circle cx="72" cy="38" r="3" fill="#BE7E0C" opacity="0.4" />
    </svg>
  );
}

function Egg({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 110 130" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="egg-shell" from="#FFF6E6" to="#E4CFA8" angle={40} />
        <radialGradient id="egg-sheen" cx="34%" cy="26%" r="34%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Shadow cx={55} cy={124} rx={24} ry={4} />
      <path
        d="M55 8c16 0 30 30 30 58 0 26-13 42-30 42S25 92 25 66C25 38 39 8 55 8Z"
        fill="url(#egg-shell)"
      />
      <ellipse cx="42" cy="48" rx="12" ry="18" fill="url(#egg-sheen)" />
    </svg>
  );
}

function LeafDoodle({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <defs>
        <G id="doodle-leaf" from="#C7E36B" to="#5FA83C" angle={40} />
      </defs>
      <path d="M88 8C56 8 20 30 14 66c-2 12 2 22 8 26 6-38 32-62 66-68Z" fill="url(#doodle-leaf)" />
      <path d="M20 88C36 56 60 30 88 12" stroke="#3F7D2B" strokeWidth="2.4" fill="none" opacity="0.55" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${34 + i * 12} ${72 - i * 13} l12 -10`}
          stroke="#3F7D2B"
          strokeWidth="1.8"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

const ART: Record<string, React.ComponentType<ArtProps>> = {
  avocado: Avocado,
  "avocado-half": AvocadoHalf,
  tomato: Tomato,
  strawberry: Strawberry,
  carrot: Carrot,
  broccoli: Broccoli,
  spinach: Spinach,
  blueberry: Blueberry,
  lemon: Lemon,
  citrus: Orange,
  orange: Orange,
  apple: Apple,
  pumpkin: Pumpkin,
  basil: Basil,
  honey: Honey,
  sourdough: Bread,
  cheese: Cheese,
  eggs: Egg,
  leaf: LeafDoodle,
};

/** Maps a produce id (from produce.json) to its artwork. */
export const ART_FOR_ID: Record<string, string> = {
  avocado: "avocado",
  tomato: "tomato",
  strawberry: "strawberry",
  carrot: "carrot",
  blueberry: "blueberry",
  peach: "peach",
  onion: "onion",
  broccoli: "broccoli",
  spinach: "spinach",
  pumpkin: "pumpkin",
  apple: "apple",
  basil: "basil",
  honey: "honey",
  sourdough: "sourdough",
  cheese: "cheese",
  eggs: "eggs",
  citrus: "citrus",
};

/**
 * Real 3D produce cut-outs supplied as PNGs.
 * Mapped by artwork name — anything without a PNG falls back to the inline
 * SVG illustration, so a missing/failed asset can never leave a hole.
 */
const REAL_PNG: Record<string, string> = {
  avocado: "avocado",
  "avocado-half": "avocado",
  strawberry: "strawberry",
  tomato: "tomato",
  carrot: "carrot",
  broccoli: "broccoli",
  spinach: "spinach",
  blueberry: "blueberry",
  peach: "peach",
  basil: "basil",
  honey: "honey",
  onion: "onion",
  apple: "apple",
  pumpkin: "pumpkin",
  eggs: "eggs",
  citrus: "citrus",
  cheese: "cheese",
  sourdough: "bread",
};

export function ProduceArt({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Falls back to the leaf doodle so a missing key never breaks a layout.
  const Cmp = ART[name] ?? ART.leaf;
  const png = REAL_PNG[name];
  // Transparent cut-out first, then the inline SVG artwork as fallback.
  const chain = png ? [`images/${png}-cut.png`] : [];
  const [step, setStep] = useState(0);
  const src = chain[step];

  if (src) {
    return (
      <img
        key={src}
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onError={() => setStep((s) => s + 1)}
        className={cn("ff-3d object-contain", className)}
        style={style}
      />
    );
  }
  return <Cmp className={cn("ff-3d", className)} style={style} />;
}

/** Small decorative seed / dot pattern used behind editorial sections. */
export function SeedPattern({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 200 200">
      <defs>
        <pattern id="ff-seeds" width="34" height="34" patternUnits="userSpaceOnUse">
          <ellipse cx="8" cy="8" rx="2.2" ry="3.4" fill="#16331F" opacity="0.16" transform="rotate(-24 8 8)" />
          <ellipse cx="26" cy="22" rx="1.6" ry="2.6" fill="#5FA83C" opacity="0.22" transform="rotate(18 26 22)" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#ff-seeds)" />
    </svg>
  );
}

export { LeafDoodle };
