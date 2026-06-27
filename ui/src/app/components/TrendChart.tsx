"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type ChartDataPoint = {
  date: string;
  glucose?: number;
  weight?: number;
};

interface TrendChartProps {
  data: ChartDataPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-slate-400 bg-slate-800/30 rounded-xl border border-slate-700/50">
        No tracking data available yet. Add a daily log!
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <ReferenceLine y={100} yAxisId="left" stroke="#10b981" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Normal Glucose', fill: '#10b981', fontSize: 10 }} />
          <ReferenceLine y={125} yAxisId="left" stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Prediabetes', fill: '#f59e0b', fontSize: 10 }} />
          
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="glucose" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }}
            activeDot={{ r: 6 }}
            name="Glucose (mg/dL)"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
