'use client';
import { useEffect, useState } from 'react';

export default function AnalyticsChart() {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    async function fetchChart() {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const result = await res.json();
      setData(result.hourly || []);
    }
    fetchChart();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Messaging Analytics</h2>
      <svg width="100%" height="120" viewBox="0 0 400 120">
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points={data.map((v, i) => `${i * 40},${120 - v * 2}`).join(' ')}
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={i * 40}
            cy={120 - v * 2}
            r="4"
            fill="#2563eb"
          />
        ))}
      </svg>
    </div>
  );
}