import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import type { Dataset } from '../types/content';

interface Props {
  dataset: Dataset;
  realmColor?: string;
}

export default function GraphWidget({ dataset, realmColor = '#3b82f6' }: Props) {
  const data = dataset.points.map(p => ({
    x: p.x,
    y: p.y,
    label: p.label,
  }));

  const xLabel = `${dataset.xLabel}${dataset.xUnit ? ` (${dataset.xUnit})` : ''}`;
  const yLabel = `${dataset.yLabel}${dataset.yUnit ? ` (${dataset.yUnit})` : ''}`;

  return (
    <div className="card p-4">
      <div className="text-xs text-muted font-mono mb-3 flex justify-between">
        <span>{yLabel}</span>
        <span className="text-right">{xLabel} →</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
          <XAxis
            dataKey="x"
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#1e2130' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#1e2130' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#13151c',
              border: '1px solid #1e2130',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              color: '#e8eaed',
            }}
            formatter={(value: number) => [`${value} ${dataset.yUnit ?? ''}`, dataset.yLabel]}
            labelFormatter={(label) => `${dataset.xLabel}: ${label} ${dataset.xUnit ?? ''}`}
          />
          <Line
            type="linear"
            dataKey="y"
            stroke={realmColor}
            strokeWidth={2.5}
            dot={{ fill: realmColor, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: realmColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
