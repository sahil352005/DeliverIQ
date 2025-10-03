'use client';
import { useEffect, useState } from 'react';

export default function AnalyticsCards() {
  const [stats, setStats] = useState({ sent: 0, failed: 0, pending: 0 });

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setStats({
        sent: data.sent || 0,
        failed: data.failed || 0,
        pending: data.pending || 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="flex gap-4 mb-8">
      <div className="bg-white p-6 rounded shadow flex-1 text-center">
        <div className="text-3xl font-bold">{stats.sent}</div>
        <div className="text-gray-500">Messages Sent</div>
      </div>
      <div className="bg-white p-6 rounded shadow flex-1 text-center">
        <div className="text-3xl font-bold">{stats.failed}</div>
        <div className="text-gray-500">Messages Failed</div>
      </div>
      <div className="bg-white p-6 rounded shadow flex-1 text-center">
        <div className="text-3xl font-bold">{stats.pending}</div>
        <div className="text-gray-500">Messages Pending</div>
      </div>
    </div>
  );
}