import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import AdminClientDetail from './AdminClientDetail.jsx'
import AdminCodes from './AdminCodes.jsx'

const STATUS_COLORS = {
  'in_progress': { bg: '#eff6ff', color: '#1d4ed8', label: 'In Progress' },
  'submitted': { bg: '#fdf8ee', color: '#b8963e', label: 'Submitted' },
  'in_review': { bg: '#f5f3ff', color: '#7c3aed', label: 'In Review' },
  'complete': { bg: '#f0fdf4', color: '#16a34a', label: 'Complete' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('clients') // 'clients' | 'codes'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin')
      return
    }
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('intake_submissions')
      .select('*')
      .order('updated_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin')
  }

  const filtered = submissions.filter(s => {
    const name = `${s.section_personal?.first_name || ''} ${s.section_personal?.last_name || ''}`.toLowerCase()
    const email = s.client_email?.toLowerCase() || ''
    const code = s.access_code?.toLowerCase() || ''
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || code.includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: submissions.length,
    in_progress: submissions.filter(s => s.status === 'in_progress').length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    in_review: submissions.filter(s => s.status === 'in_review').length,
    complete: submissions.filter(s => s.status === 'complete').length,
  }

  if (selected) {
    return (
      <AdminClientDetail
        submission={selected}
        onBack={() => { setSelected(null); fetchSubmissions() }}
        onUpdated={fetchSubmissions}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: '#0f2044', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>LegalQuest Network</div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[['clients', 'Clients'], ['codes', 'Access Codes']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ padding: '0.4rem 1rem', borderRadius: 6, border: 'none', background: tab === key ? 'rgba(255,255,255,0.15)' : 'transparent', color: tab === key ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: tab === key ? 600 : 400, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', borderRadius: 6, padding: '0.35rem 0.85rem', fontSize: '0.8rem', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>

      {tab === 'codes' ? <AdminCodes /> : (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { key: 'all', label: 'Total Clients', color: '#0f2044' },
              { key: 'in_progress', label: 'In Progress', color: '#1d4ed8' },
              { key: 'submitted', label: 'Submitted', color: '#b8963e' },
              { key: 'in_review', label: 'In Review', color: '#7c3aed' },
              { key: 'complete', label: 'Complete', color: '#16a34a' },
            ].map(({ key, label, color }) => (
              <div key={key} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', cursor: 'pointer', borderBottom: statusFilter === key ? `3px solid ${color}` : '1px solid #e2e8f0' }} onClick={() => setStatusFilter(key)}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{counts[key]}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search by name, email, or access code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: 'transparent' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>}
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 1fr', padding: '0.75rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {['Client Name', 'Email', 'Access Code', 'Progress', 'Status', 'Last Updated'].map(h => (
                <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading clients…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No clients found.</div>
            ) : filtered.map(s => {
              const name = [s.section_personal?.first_name, s.section_personal?.last_name].filter(Boolean).join(' ') || '—'
              const status = STATUS_COLORS[s.status] || STATUS_COLORS['in_progress']
              const step = s.current_step || 1
              const pct = Math.round(((step - 1) / 8) * 100)
              const updated = s.updated_at ? new Date(s.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 1fr', padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.client_email}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>{s.access_code}</div>
                  <div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', width: 80 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#b8963e', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>{pct}%</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 20, background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{updated}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
