import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

const PALETTE = [
  '#6c63ff', '#00d4aa', '#f72585', '#fbbf24',
  '#3b82f6', '#10b981', '#a78bfa', '#fb923c',
];

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#151c2d',
      border: '1px solid rgba(255,255,255,.12)',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '13px',
      boxShadow: '0 8px 30px rgba(0,0,0,.5)',
    }}>
      {label && <p style={{ color: '#8892a4', marginBottom: '4px', fontWeight: '600' }}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || '#f0f4ff', fontWeight: '700' }}>
          ₹{Number(entry.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

/* ── Custom Pie Label ── */
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function PieChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={45}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PALETTE[index % PALETTE.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#8892a4', fontSize: '12px', fontWeight: '500' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barSize={28} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#4a5568', fontSize: 11, fontWeight: 500 }}
          axisLine={{ stroke: 'rgba(255,255,255,.07)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#4a5568', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Amount">
          {data.map((_, index) => (
            <Cell key={`bar-${index}`} fill={PALETTE[index % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
