import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Analytics as AnalyticsData } from '../api/client';

interface Props {
  analytics: AnalyticsData | null;
}

const COLORS = [
  '#15803d', // green (primary)
  '#ca8a04', // gold
  '#2563eb', // blue (savings)
  '#dc2626', // red (expense)
  '#9333ea', // purple
  '#0891b2', // cyan
  '#ea580c', // orange
  '#be185d', // pink
  '#4f46e5', // indigo
  '#059669', // emerald
  '#64748b', // slate
];

export default function Analytics({ analytics }: Props) {
  if (!analytics || analytics.categories.length === 0) {
    return (
      <div className="card p-5">
        <h2 className="section-title mb-4">
          <BarChart3 size={20} className="text-text-secondary" />
          Analytics
        </h2>
        <p className="text-text-secondary text-center py-8">No data available</p>
      </div>
    );
  }

  const data = analytics.categories.map((cat, i) => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4">
        <BarChart3 size={20} className="text-text-secondary" />
        Category Analytics
      </h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
        {analytics.categories.map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-text truncate">{cat.name}</span>
            <span className="text-text-secondary w-12 text-right">
              {cat.percentage.toFixed(0)}%
            </span>
            <span className="font-medium w-20 text-right text-text">
              {cat.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-semibold">
        <span className="text-text-secondary">Total</span>
        <span className="text-text">{analytics.total.toLocaleString()}</span>
      </div>
    </div>
  );
}
