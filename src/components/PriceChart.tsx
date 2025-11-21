"use client";

import { useMemo, useState } from "react";

type Point = {
  date: string;
  close: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatDateLabel(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  points: Point[];
};

export function PriceChart({ points }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const padding = 36;
  const width = 720;
  const height = 260;

  const { polyline, area, min, max, xPositions } = useMemo(() => {
    if (points.length === 0) {
      return { polyline: "", area: "", min: 0, max: 0, xPositions: [] as number[] };
    }

    const closes = points.map((p) => p.close);
    const minVal = Math.min(...closes);
    const maxVal = Math.max(...closes);
    const range = maxVal - minVal || 1;
    const stepX = (width - padding * 2) / Math.max(points.length - 1, 1);

    const coords = points.map((p, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((p.close - minVal) / range) * (height - padding * 2);
      return { x, y };
    });

    const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const areaPoints = `${line} ${width - padding},${height - padding} ${padding},${height - padding}`;
    const xs = coords.map((c) => c.x);

    return { polyline: line, area: areaPoints, min: minVal, max: maxVal, xPositions: xs };
  }, [points, padding, width, height]);

  const activeIndex =
    hoverIndex !== null ? hoverIndex : points.length > 0 ? points.length - 1 : null;
  const tooltipPosition =
    activeIndex !== null && xPositions.length
      ? Math.min(
          0.95,
          Math.max(
            0.05,
            (xPositions[activeIndex] - padding) / (width - padding * 2)
          )
        )
      : 0.5;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Close Price Trend</p>
          <p className="text-sm text-slate-200">
            {points.length} points · latest on the right
          </p>
        </div>
        {points.length > 0 && (
          <div className="text-right text-xs text-slate-400">
            <p>High: {currencyFormatter.format(max)}</p>
            <p>Low: {currencyFormatter.format(min)}</p>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        {points.length < 2 ? (
          <div className="px-4 py-10 text-sm text-slate-300">Not enough points to chart yet.</div>
        ) : (
          <div
            className="relative h-64 w-full"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Close price line chart">
              <defs>
                <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              <rect width={width} height={height} fill="#0f172a" rx="12" />

              {/* Axes */}
              <g>
                <line
                  x1={padding}
                  y1={padding}
                  x2={padding}
                  y2={height - padding}
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                <line
                  x1={padding}
                  y1={height - padding}
                  x2={width - padding}
                  y2={height - padding}
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
              </g>

              {/* Area + line */}
              <polyline fill="url(#priceFill)" stroke="none" points={area} />
              <polyline
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                points={polyline}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Axis labels */}
              <text
                x={padding + 4}
                y={padding + 4}
                textAnchor="start"
                className="fill-slate-500 text-[10px]"
              >
                {currencyFormatter.format(max)}
              </text>
              <text
                x={padding + 4}
                y={height - padding + 12}
                textAnchor="start"
                className="fill-slate-500 text-[10px]"
              >
                {currencyFormatter.format(min)}
              </text>
              <text
                x={padding + 4}
                y={height - padding + 20}
                textAnchor="start"
                className="fill-slate-500 text-[10px]"
              >
                {formatDateLabel(points[0]?.date)}
              </text>
              <text
                x={width - padding - 4}
                y={height - padding + 20}
                textAnchor="end"
                className="fill-slate-500 text-[10px]"
              >
                {formatDateLabel(points[points.length - 1]?.date)}
              </text>

              {/* Hover marker */}
              {activeIndex !== null && (
                <>
                  <line
                    x1={xPositions[activeIndex]}
                    y1={padding}
                    x2={xPositions[activeIndex]}
                    y2={height - padding}
                    stroke="#475569"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={xPositions[activeIndex]}
                    cy={
                      height -
                      padding -
                      ((points[activeIndex].close - min) / (max - min || 1)) *
                        (height - padding * 2)
                    }
                    r={5}
                    fill="#6366f1"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                </>
              )}

              {/* Hover capture */}
              <rect
                x={padding}
                y={padding}
                width={width - padding * 2}
                height={height - padding * 2}
                fill="transparent"
                onMouseMove={(e) => {
                  if (!xPositions.length) return;
                  const rect = (e.currentTarget as SVGRectElement).getBoundingClientRect();
                  const scaleX = (width - padding * 2) / rect.width;
                  const x = padding + (e.clientX - rect.left) * scaleX;
                  let nearest = 0;
                  let minDiff = Math.abs(xPositions[0] - x);
                  for (let i = 1; i < xPositions.length; i++) {
                    const diff = Math.abs(xPositions[i] - x);
                    if (diff < minDiff) {
                      minDiff = diff;
                      nearest = i;
                    }
                  }
                  setHoverIndex(nearest);
                }}
              />
            </svg>

            {activeIndex !== null && (
              <div
                className="pointer-events-none absolute top-3 rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-100 shadow-lg shadow-indigo-600/10 ring-1 ring-slate-700"
                style={{
                  left: `${tooltipPosition * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="font-semibold">{formatFullDate(points[activeIndex].date)}</div>
                <div className="text-indigo-200">
                  {currencyFormatter.format(points[activeIndex].close)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
