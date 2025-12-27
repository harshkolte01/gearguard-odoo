'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TeamReportData } from '@/lib/types';

interface RequestsByTeamChartProps {
  data: TeamReportData[];
  loading?: boolean;
}

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function RequestsByTeamChart({ data, loading }: RequestsByTeamChartProps) {
  if (loading) {
    return (
      <div className="chart-loading">
        <div className="chart-skeleton"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
        <p>No team data available</p>
        <span>Try adjusting your filters</span>
      </div>
    );
  }

  // Transform data for horizontal bar chart
  const chartData = data.map((item) => ({
    name: item.team_name,
    value: item.request_count,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 60)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis type="number" stroke="#888" />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#888" 
            width={120}
            style={{ fontSize: '14px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}
            itemStyle={{ color: '#a0aec0' }}
            formatter={(value: number) => [`${value} requests`, '']}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


