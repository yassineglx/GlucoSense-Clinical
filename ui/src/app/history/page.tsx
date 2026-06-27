import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Activity, ShieldAlert, CheckCircle, AlertTriangle, FileText, CalendarDays } from "lucide-react";
import Link from "next/link";

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

  const dailyLogs = await prisma.dailyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  // Merge and sort
  const combinedHistory = [
    ...assessments.map(a => ({ type: 'assessment', date: new Date(a.createdAt), data: a })),
    ...dailyLogs.map(l => ({ type: 'log', date: new Date(l.date), data: l }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

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
        <div className="mb-10 animate-fade-in flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Patient History
            </h1>
            <p className="text-slate-400">
              Review past diabetes risk assessments and daily logs.
            </p>
          </div>
          <Link href="/" className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition border border-slate-700 text-sm font-medium inline-flex items-center gap-2">
            <Activity className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {combinedHistory.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-white/10 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Tracking Data Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              You haven't conducted any patient risk assessments or daily logs yet. Return to the dashboard to start tracking.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-colors font-medium text-sm">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {combinedHistory.map((entry, i) => {
              if (entry.type === 'assessment') {
                const assessment = entry.data as any;
                return (
                  <div key={`assessment-${assessment.id}`} className="bg-slate-900 p-6 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-800/50 transition-colors shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl border ${getRiskColor(assessment.riskLevel)}`}>
                        {getRiskIcon(assessment.riskLevel)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-medium text-white capitalize flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-sky-400" />
                            {assessment.riskLevel} Risk
                          </h3>
                          <span className="text-xs font-medium text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                            Full Assessment
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(entry.date)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-sm">
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Probability</div>
                        <div className="text-slate-200 font-medium">{(assessment.probability * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Glucose</div>
                        <div className="text-slate-200 font-medium">{assessment.glucose} <span className="text-slate-600 text-xs">mg/dL</span></div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">BMI</div>
                        <div className="text-slate-200 font-medium">{assessment.bmi}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">BP</div>
                        <div className="text-slate-200 font-medium">{assessment.bloodPressure}</div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const log = entry.data as any;
                return (
                  <div key={`log-${log.id}`} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-medium text-slate-300">
                            Daily Log
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500">
                          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(entry.date)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-sm">
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Glucose</div>
                        <div className="text-slate-300 font-medium">{log.glucose || '--'} <span className="text-slate-600 text-xs">mg/dL</span></div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Weight</div>
                        <div className="text-slate-300 font-medium">{log.weight || '--'} <span className="text-slate-600 text-xs">kg</span></div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">BP</div>
                        <div className="text-slate-300 font-medium">{log.bloodPressure || '--'} <span className="text-slate-600 text-xs">mmHg</span></div>
                      </div>
                      {log.notes && (
                        <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-slate-400">
                          <FileText className="w-4 h-4" /> <span className="truncate max-w-[100px] text-xs">{log.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </main>
  );
}
