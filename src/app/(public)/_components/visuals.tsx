import React from "react";

export const GOLD = "#FFB22C";
export const GOLD_SOFT = "#FFC85A";
export const BG = "#1b1b1f";
export const CARD = "#2b2b31";

export function Sparkle({
  className = "",
  size = 24,
  delay = 0,
  float = false,
  color = GOLD,
}: {
  className?: string;
  size?: number;
  delay?: number;
  float?: boolean;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 ${className}`}
      style={{
        animation: `${float ? "pr-float 5s" : "pr-twinkle 3s"} ease-in-out ${delay}s infinite`,
        filter: `drop-shadow(0 0 6px ${color}99)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 0C12.6 7 17 11.4 24 12C17 12.6 12.6 17 12 24C11.4 17 7 12.6 0 12C7 11.4 11.4 7 12 0Z" />
      </svg>
    </span>
  );
}

export function Connector({
  paths,
  children,
  className = "",
}: {
  paths: string[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative mx-auto hidden h-44 w-full max-w-[1440px] md:block lg:h-56 ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        fill="none"
      >
        {paths.map((d, i) => (
          <g key={i}>
            {/* garis dasar */}
            <path
              d={d}
              stroke={GOLD}
              strokeOpacity="0.55"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            {/* cahaya yang mengalir sepanjang garis */}
            <path
              d={d}
              pathLength={1}
              stroke={GOLD_SOFT}
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: "0.1 0.9",
                animation: `pr-flow 4.5s linear ${i * 1.2}s infinite`,
                filter: `drop-shadow(0 0 4px ${GOLD})`,
              }}
            />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}
