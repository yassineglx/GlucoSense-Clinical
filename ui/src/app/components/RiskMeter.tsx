"use client";

import { useEffect, useState } from "react";
import type { RiskLevel } from "../types";

interface RiskMeterProps {
  probability: number;
  riskLevel: RiskLevel;
}

const COLORS: Record<RiskLevel, { stroke: string; glow: string; text: string }> = {
  "very low": { stroke: "#10b981", glow: "rgba(16,185,129,0.5)",  text: "text-emerald-500" },
  low:        { stroke: "#34d399", glow: "rgba(52,211,153,0.5)",  text: "text-emerald-400" },
  medium:     { stroke: "#f59e0b", glow: "rgba(245,158,11,0.5)", text: "text-amber-400"   },
  high:       { stroke: "#f97316", glow: "rgba(249,115,22,0.5)",  text: "text-orange-400"  },
  "very high":{ stroke: "#ef4444", glow: "rgba(239,68,68,0.5)",  text: "text-red-500"     },
};

const LABELS: Record<RiskLevel, string> = {
  "very low": "Very Low Risk",
  low:        "Low Risk",
  medium:     "Moderate Risk",
  high:       "High Risk",
  "very high":"Very High Risk"
};

export default function RiskMeter({ probability, riskLevel }: RiskMeterProps) {
  const [displayed, setDisplayed] = useState(0);
  const color = COLORS[riskLevel] || COLORS["medium"];
  const label = LABELS[riskLevel] || LABELS["medium"];

  const radius = 45;
  const circumference = Math.PI * radius; 
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (probability) * circumference;

  useEffect(() => {
    let start = 0;
    const target = probability * 100;
    const step = () => {
      start += 2;
      if (start >= target) {
        setDisplayed(Math.round(target));
        return;
      }
      setDisplayed(Math.round(start));
      requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [probability]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="160" height="90" viewBox="0 0 100 55" className="overflow-visible">
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke={color.stroke} strokeWidth="8" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} style={{ filter: `drop-shadow(0 0 6px ${color.glow})`, transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
          <circle cx="50" cy="50" r="3" fill={color.stroke} />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className={`text-3xl font-bold tabular-nums ${color.text}`} style={{ fontFamily: "var(--font-display)" }}>
            {displayed}%
          </span>
        </div>
      </div>
      <span className={`text-sm font-semibold tracking-widest uppercase ${color.text}`}>{label}</span>
    </div>
  );
}
