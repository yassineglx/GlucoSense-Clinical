"use client";

import type { PredictionResult } from "../types";
import RiskMeter from "./RiskMeter";

interface ResultsPanelProps {
  result: PredictionResult;
}

const RISK_STYLES = {
  "very low": { border: "border-emerald-500/30", bg: "bg-emerald-500/5",  badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  low:        { border: "border-emerald-400/30", bg: "bg-emerald-400/5",  badge: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30" },
  medium:     { border: "border-amber-500/30",   bg: "bg-amber-500/5",    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30"       },
  high:       { border: "border-orange-500/30",  bg: "bg-orange-500/5",   badge: "bg-orange-500/20 text-orange-300 border-orange-500/30"    },
  "very high":{ border: "border-red-500/30",     bg: "bg-red-500/5",      badge: "bg-red-500/20 text-red-300 border-red-500/30"             },
};

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const styles = RISK_STYLES[result.riskLevel] || RISK_STYLES["medium"];

  return (
    <div
      className={`glass-card rounded-2xl border ${styles.border} ${styles.bg} p-6 space-y-6 animate-slide-up`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-semibold text-slate-100"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your Risk Assessment
        </h2>
        <span
          className={`text-xs px-3 py-1 rounded-full border font-medium uppercase tracking-wider ${styles.badge}`}
        >
          {result.riskLevel} risk
        </span>
      </div>

      {/* Risk Meter */}
      <div className="flex justify-center py-2">
        <RiskMeter
          probability={result.probability}
          riskLevel={result.riskLevel}
        />
      </div>

      {/* Explanation */}
      <div className="rounded-xl bg-white/5 border border-white/8 p-4">
        <p className="text-sm text-slate-300 leading-relaxed font-semibold">
          {result.explanation}
        </p>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Personalized Recommendations
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="text-sky-400">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-600 border-t border-white/5 pt-4">
        ⚠️ This tool uses a machine learning model for informational purposes only. It does not constitute
        medical advice. Always consult a qualified healthcare professional.
      </p>
    </div>
  );
}
