import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { TOKEN_KEY } from './AdminPage';

export default function AdminLoginPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(TOKEN_KEY);
    if (existing) {
      setReady(true);
      return;
    }
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (ready) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );
}
