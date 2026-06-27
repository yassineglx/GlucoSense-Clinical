import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DashboardClient from "./components/DashboardClient";
import { ShieldCheck, Database, Activity } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!session || !userId) {
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

  // Fetch data for authenticated user
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await prisma.dailyLog.findMany({
    where: { 
      userId,
      date: { gte: thirtyDaysAgo }
    },
    orderBy: { date: "asc" },
  });

  const latestAssessment = await prisma.assessment.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen py-10 px-4">
      <DashboardClient logs={logs} latestAssessment={latestAssessment} />
    </main>
  );
}
