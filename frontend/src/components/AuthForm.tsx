'use client';
import { useState } from 'react';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'register' ? { email, password, name } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white shadow p-6 rounded" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      {mode === 'register' && (
        <input
          type="text"
          placeholder="Name"
          className="input mb-2 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="input mb-2 w-full"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input mb-2 w-full"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button className="btn w-full" disabled={loading}>
        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
}