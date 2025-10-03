'use client';
import { useState, useEffect } from 'react';

export default function SendMessageForm() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchContacts() {
      const res = await fetch('/api/contacts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setContacts(data.contacts || []);
    }
    fetchContacts();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contactIds: selected, content: message }),
      });
      if (!res.ok) throw new Error('Send failed');
      setSuccess('Message sent!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white shadow p-6 rounded" onSubmit={handleSend}>
      <h2 className="text-xl font-bold mb-4">Send Message</h2>
      <select
        multiple
        className="input mb-2 w-full"
        value={selected}
        onChange={e =>
          setSelected(Array.from(e.target.selectedOptions, opt => opt.value))
        }
      >
        {contacts.map(c => (
          <option key={c.id} value={c.id}>
            {c.name || c.email || c.phone}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Enter your message"
        className="input mb-2 w-full"
        rows={4}
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <button className="btn w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}