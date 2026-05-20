import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Activity, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // @ts-ignore
  const userId = session.user.id as string;

  const assessments = await prisma.assessment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "very low":
      case "low":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "high":
      case "very high":
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "very low":
      case "low":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "high":
      case "very high":
        return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <main className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Patient History
          </h1>
          <p className="text-slate-400">
            Review past diabetes risk assessments and clinical predictions.
          </p>
        </div>

        {assessments.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-white/10 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Assessments Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              You haven't conducted any patient risk assessments yet. Return to the dashboard to start.
            </p>
            <a href="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-colors font-medium text-sm">
              Go to Dashboard
            </a>
          </div>
        ) : (
          <div className="grid gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {assessments.map((assessment) => (
              <div key={assessment.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-white/[0.03] transition-colors">
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${getRiskColor(assessment.riskLevel)}`}>
                    {getRiskIcon(assessment.riskLevel)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-medium text-white capitalize">
                        {assessment.riskLevel} Risk
                      </h3>
                      <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
                        {(assessment.probability * 100).toFixed(1)}% Probability
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(assessment.createdAt))}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Glucose</div>
                    <div className="text-slate-200 font-medium">{assessment.glucose} <span className="text-slate-600 text-xs">mg/dL</span></div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">BMI</div>
                    <div className="text-slate-200 font-medium">{assessment.bmi}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Age</div>
                    <div className="text-slate-200 font-medium">{assessment.age}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">BP</div>
                    <div className="text-slate-200 font-medium">{assessment.bloodPressure}</div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
