import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem' }

export default function AdminCodes() {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchCodes() }, [])

  const fetchCodes = async () => {
    setLoading(true)
    const { data } = await supabase.from('access_codes').select('*').order('created_at', { ascending: false })
    setCodes(data || [])
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!newCode.trim()) { setError('Please enter a code.'); return }
    setCreating(true); setError(''); setSuccess('')
    const { error: err } = await supabase.from('access_codes').insert({
      code: newCode.trim().toUpperCase(),
      client_name: newName.trim(),
      notes: newNotes.trim(),
      active: true,
    })
    if (err) {
      setError(err.message.includes('unique') ? 'That code already exists.' : 'Error creating code.')
    } else {
      setSuccess(`Code ${newCode.trim().toUpperCase()} created successfully.`)
      setNewCode(''); setNewName(''); setNewNotes('')
      fetchCodes()
    }
    setCreating(false)
  }

  const toggleActive = async (id, current) => {
    await supabase.from('access_codes').update({ active: !current }).eq('id', id)
    fetchCodes()
  }

  const deleteCode = async (id) => {
    if (!confirm('Delete this access code? The client will no longer be able to log in.')) return
    await supabase.from('access_codes').delete().eq('id', id)
    fetchCodes()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Create new code */}
      <div style={cardStyle}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#0f2044', marginBottom: '1.25rem' }}>Create New Access Code</h3>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#dc2626', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#16a34a', marginBottom: '1rem' }}>{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
              Access Code <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              value={newCode}
              onChange={e => setNewCode(e.target.value.toUpperCase())}
              placeholder="e.g. SMITH2025"
              style={{ display: 'block', width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.95rem', outline: 'none', background: '#f8fafc', fontFamily: 'monospace', letterSpacing: '0.05em' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>Client Name</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="John Smith"
              style={{ display: 'block', width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.95rem', outline: 'none', background: '#f8fafc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>Notes</label>
            <input
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="Optional internal note"
              style={{ display: 'block', width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.95rem', outline: 'none', background: '#f8fafc' }}
            />
          </div>
        </div>

        <button onClick={handleCreate} disabled={creating} style={{ padding: '0.75rem 2rem', background: '#0f2044', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: creating ? 0.7 : 1 }}>
          {creating ? 'Creating…' : '+ Create Code'}
        </button>
      </div>

      {/* Codes table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 2fr 1fr 1fr', padding: '0.75rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          {['Code', 'Client Name', 'Notes', 'Status', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : codes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No access codes yet.</div>
        ) : codes.map(code => (
          <div key={code.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 2fr 1fr 1fr', padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#0f2044', letterSpacing: '0.05em' }}>{code.code}</div>
            <div style={{ fontSize: '0.875rem', color: '#334155' }}>{code.client_name || '—'}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{code.notes || '—'}</div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 20, background: code.active ? '#f0fdf4' : '#f1f5f9', color: code.active ? '#16a34a' : '#94a3b8' }}>
                {code.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => toggleActive(code.id, code.active)} style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', border: '1px solid #e2e8f0', borderRadius: 5, background: '#f8fafc', color: '#475569', cursor: 'pointer' }}>
                {code.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => deleteCode(code.id)} style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', border: '1px solid #fecaca', borderRadius: 5, background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
