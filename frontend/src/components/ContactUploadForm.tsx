'use client';
import { useState } from 'react';

export default function ContactUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [manual, setManual] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('/api/contacts/upload', {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else if (manual) {
        res = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ contacts: manual.split('\n') }),
        });
      } else {
        setError('Please select a file or enter contacts manually.');
        setLoading(false);
        return;
      }
      if (!res?.ok) throw new Error('Upload failed');
      setSuccess('Contacts uploaded!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-white shadow p-6 rounded" onSubmit={handleUpload}>
      <h2 className="text-xl font-bold mb-4">Upload Contacts</h2>
      <input
        type="file"
        accept=".csv,.xlsx,.txt"
        className="mb-2 w-full"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <textarea
        placeholder="Or enter contacts manually, one per line"
        className="input mb-2 w-full"
        rows={5}
        value={manual}
        onChange={e => setManual(e.target.value)}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <button className="btn w-full" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}