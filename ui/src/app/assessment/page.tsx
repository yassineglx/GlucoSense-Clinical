import DiabetesForm from "../components/DiabetesForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AssessmentPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!session || !userId) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-medium tracking-widest uppercase text-sky-400 bg-sky-400/10 border border-sky-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            LightGBM Risk Assessment
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Full <span className="text-sky-400">Clinical</span> Assessment
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

        <DiabetesForm />
      </div>
    </main>
  );
}
