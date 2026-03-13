import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

export default function AdminJsonEditor({ data, onSave, saving }: Props) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRaw(JSON.stringify(data, null, 2));
      setError(null);
    } catch {
      setRaw('{}');
      setError('Invalid JSON');
    }
  }, [data]);

  const handleSave = () => {
    setError(null);
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      onSave(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Edit everything.</strong> This is the full content.json. Change any value, add new sections, or fix structure. Invalid JSON will not be saved.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <textarea
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setError(null);
        }}
        spellCheck={false}
        className="w-full h-[600px] font-mono text-sm p-4 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none"
        style={{ tabSize: 2 }}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save all content'}
        </button>
        {error && (
          <span className="text-sm text-red-600">Fix JSON errors before saving</span>
        )}
      </div>
    </div>
  );
}
