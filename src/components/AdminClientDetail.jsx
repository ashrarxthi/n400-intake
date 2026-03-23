import { useState } from 'react'
import { supabase } from '../supabase.js'

const STATUS_OPTIONS = ['in_progress', 'submitted', 'in_review', 'complete']
const STATUS_LABELS = { in_progress: 'In Progress', submitted: 'Submitted', in_review: 'In Review', complete: 'Complete' }
const STATUS_COLORS = { in_progress: '#1d4ed8', submitted: '#b8963e', in_review: '#7c3aed', complete: '#16a34a' }

const inputStyle = { display: 'block', width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.9rem', color: '#0f172a', background: '#f8fafc', outline: 'none', marginBottom: '0.75rem' }
const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem' }

function EditableField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value || ''} onChange={e => onChange(e.target.value)}
        onFocus={e => e.target.style.borderColor = '#1d4ed8'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  )
}

function SectionEditor({ title, data, onChange }) {
  if (!data || typeof data !== 'object') return null
  const skip = ['prior_spouses', 'children', 'entries', 'trips', 'selective_service', 'answers', 'details', 'race']
  const fields = Object.keys(data).filter(k => !skip.includes(k) && typeof data[k] !== 'object')

  return (
    <div style={cardStyle}>
      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
        {fields.map(key => (
          <EditableField
            key={key}
            label={key.replace(/_/g, ' ')}
            value={data[key]}
            onChange={v => onChange({ ...data, [key]: v })}
          />
        ))}
      </div>
    </div>
  )
}

export default function AdminClientDetail({ submission, onBack, onUpdated }) {
  const [data, setData] = useState({
    section_personal: submission.section_personal || {},
    section_contact: submission.section_contact || {},
    section_physical: submission.section_physical || {},
    section_marital: submission.section_marital || {},
    section_children: submission.section_children || {},
    section_employment: submission.section_employment || {},
    section_travel: submission.section_travel || {},
    section_background: submission.section_background || {},
  })
  const [status, setStatus] = useState(submission.status || 'in_progress')
  const [notes, setNotes] = useState(submission.attorney_notes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const name = [data.section_personal?.first_name, data.section_personal?.last_name].filter(Boolean).join(' ') || 'Client'

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('intake_submissions')
      .update({
        ...data,
        status,
        attorney_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', submission.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onUpdated()
  }

  const sections = [
    { key: 'section_personal', title: 'Personal Information' },
    { key: 'section_contact', title: 'Contact Information' },
    { key: 'section_physical', title: 'Physical Description' },
    { key: 'section_marital', title: 'Marital History' },
    { key: 'section_children', title: 'Children' },
    { key: 'section_employment', title: 'Employment & Schools' },
    { key: 'section_travel', title: 'Travel' },
    { key: 'section_background', title: 'Background Questions' },
  ]

  const yesAnswers = data.section_background?.answers
    ? Object.entries(data.section_background.answers).filter(([, v]) => v === 'Yes')
    : []

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: '#0f2044', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>← All Clients</button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{name}</div>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            {submission.client_email}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {saved && <span style={{ fontSize: '0.78rem', color: '#4ade80' }}>✓ Saved</span>}
          {saving && <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Saving…</span>}
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.5rem 1.25rem', background: '#b8963e', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Status + Notes row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Case Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STATUS_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setStatus(opt)} style={{
                  padding: '0.6rem 1rem', borderRadius: 7, border: '1.5px solid',
                  borderColor: status === opt ? STATUS_COLORS[opt] : '#e2e8f0',
                  background: status === opt ? STATUS_COLORS[opt] : '#f8fafc',
                  color: status === opt ? '#fff' : '#475569',
                  fontWeight: status === opt ? 600 : 400,
                  fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                }}>
                  {STATUS_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Attorney Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add internal notes about this client's case — missing documents, follow-up items, flags, etc."
              rows={6}
              style={{ display: 'block', width: '100%', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.9rem', color: '#0f172a', resize: 'vertical', outline: 'none', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Background Yes answers callout */}
        {yesAnswers.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              ⚠️ Client answered "Yes" to {yesAnswers.length} background question(s)
            </div>
            {yesAnswers.map(([key]) => {
              const detail = data.section_background?.details?.[key]
              return (
                <div key={key} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#dc2626' }}>{key.replace(/_/g, ' ')}</div>
                  {detail && <div style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: '0.2rem', fontStyle: 'italic' }}>{detail}</div>}
                </div>
              )
            })}
          </div>
        )}

        {/* Editable sections */}
        {sections.map(({ key, title }) => (
          <SectionEditor
            key={key}
            title={title}
            data={data[key]}
            onChange={v => setData(p => ({ ...p, [key]: v }))}
          />
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={onBack} style={{ padding: '0.75rem 1.5rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem', color: '#475569', cursor: 'pointer' }}>
            ← Back to All Clients
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.75rem 2rem', background: '#0f2044', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
