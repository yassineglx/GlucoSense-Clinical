import DiabetesForm from "./components/DiabetesForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Activity, ShieldCheck, Database, ActivitySquare } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-medium tracking-widest uppercase text-sky-400 bg-sky-400/10 border border-sky-400/20 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            Clinical Grade AI Tool
          </div>

          <h1
            className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in"
            style={{ fontFamily: "var(--font-display)", animationDelay: "100ms" }}
          >
            Predictive Intelligence for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              Diabetes Care
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
            GlucoSense Clinical utilizes an advanced LightGBM machine learning model trained on extensive patient data to provide accurate, real-time diabetes risk assessments.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-white font-medium mb-2">Data-Driven</h3>
              <p className="text-sm text-slate-400">Analyzes 8 vital clinical parameters for robust predictive scoring.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-white font-medium mb-2">High Accuracy</h3>
              <p className="text-sm text-slate-400">Powered by optimized LightGBM decision trees.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-white font-medium mb-2">Secure</h3>
              <p className="text-sm text-slate-400">HIPAA-ready architecture ensuring patient data privacy.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ── Hero header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-medium tracking-widest uppercase text-sky-400 bg-sky-400/10 border border-sky-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            LightGBM Risk Assessment
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gluco<span className="text-sky-400">Sense</span> Clinical
          </h1>

          <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            Estimate patient diabetes risk using our state-of-the-art LightGBM clinical model, trained on real patient data with 8 vital health parameters.
          </p>
        </div>

        {/* ── Scoring info bar ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-8 animate-fade-in">
          {[
            { icon: "🩸", label: "Glucose" },
            { icon: "⚖️", label: "BMI" },
            { icon: "🎂", label: "Age" },
            { icon: "🧬", label: "Pedigree" },
            { icon: "❤️", label: "BP" },
            { icon: "💉", label: "Insulin" },
            { icon: "🤰", label: "Pregnancies" },
            { icon: "✋", label: "Skin Thick." },
          ].map((item) => (
            <div
              key={item.label}
              className="glass-card rounded-xl border border-white/8 p-3 text-center flex flex-col items-center justify-center"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs font-medium text-slate-300">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <DiabetesForm />

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="mt-12 text-center text-xs text-slate-600">
          Built with Next.js & FastAPI · Powered by LightGBM · Not a substitute for medical advice
        </footer>
      </div>
    </main>
  );
}
