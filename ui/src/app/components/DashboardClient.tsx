"use client";

import { useState } from "react";
import { PlusCircle, Activity, HeartPulse, Scale, ShieldAlert } from "lucide-react";
import TrendChart from "./TrendChart";
import LogModal from "./LogModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardClient({ logs, latestAssessment }: { logs: any[], latestAssessment: any }) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const router = useRouter();

  // Format data for chart
  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    glucose: log.glucose,
    weight: log.weight
  }));

  // Calculate quick stats
  const latestGlucose = logs.length > 0 ? logs[logs.length - 1].glucose : null;
  const latestBP = logs.length > 0 ? logs[logs.length - 1].bloodPressure : null;
  const latestWeight = logs.length > 0 ? logs[logs.length - 1].weight : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Health Dashboard</h2>
          <p className="text-slate-400">Track your daily metrics and predictive risk.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm font-medium"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            Quick Log
          </button>
          <Link
            href="/assessment"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] font-medium"
          >
            <ShieldAlert className="w-4 h-4" />
            Full Risk Assessment
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Activity className="w-5 h-5 text-blue-400" />} 
          title="Latest Glucose" 
          value={latestGlucose ? `${latestGlucose} mg/dL` : "--"} 
          trend={latestGlucose > 125 ? "High" : latestGlucose > 100 ? "Elevated" : "Normal"}
          trendColor={latestGlucose > 125 ? "text-rose-400" : latestGlucose > 100 ? "text-fuchsia-400" : "text-emerald-400"}
        />
        <StatCard 
          icon={<HeartPulse className="w-5 h-5 text-rose-400" />} 
          title="Latest BP" 
          value={latestBP ? `${latestBP} mmHg` : "--"} 
        />
        <StatCard 
          icon={<Scale className="w-5 h-5 text-purple-400" />} 
          title="Weight" 
          value={latestWeight ? `${latestWeight} kg` : "--"} 
        />
        <StatCard 
          icon={<ShieldAlert className="w-5 h-5 text-amber-400" />} 
          title="Current Risk" 
          value={latestAssessment?.riskLevel || "Not Assessed"}
          trend={latestAssessment ? `${(latestAssessment.probability * 100).toFixed(1)}% prob.` : undefined}
          trendColor="text-slate-400"
        />
      </div>

      {/* Main Chart Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Glucose Trend</h3>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">Last 30 Days</span>
        </div>
        <TrendChart data={chartData} />
      </div>

      <LogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        onSuccess={() => router.refresh()} 
      />
    </div>
  );
}

function StatCard({ icon, title, value, trend, trendColor }: { icon: React.ReactNode, title: string, value: string | number, trend?: string, trendColor?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-800/50 rounded-full blur-xl group-hover:bg-slate-700/50 transition-all" />
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-slate-400">{title}</span>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>
        )}
      </div>
    </div>
  );
}
