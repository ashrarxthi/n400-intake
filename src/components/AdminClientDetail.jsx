import { useState } from 'react'
import { supabase } from '../supabase.js'
import { downloadFDF } from '../utils/generateFDF.js'
import N400Preview from './N400Preview.jsx'

const STATUS_OPTIONS = ['in_progress', 'submitted', 'in_review', 'complete']
const STATUS_LABELS = { in_progress: 'In Progress', submitted: 'Submitted', in_review: 'In Review', complete: 'Complete' }
const STATUS_COLORS = { in_progress: '#1d4ed8', submitted: '#b8963e', in_review: '#7c3aed', complete: '#16a34a' }

const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem' }

const SECTION_FIELDS = {
  section_personal: [
    { key: 'last_name', label: 'Last Name' },
    { key: 'first_name', label: 'First Name' },
    { key: 'middle_name', label: 'Middle Name' },
    { key: 'maiden_name', label: 'Maiden Name' },
    { key: 'other_names', label: 'Other Names Used' },
    { key: 'name_change', label: 'Name Change Requested' },
    { key: 'new_name', label: 'New Name (if changing)' },
    { key: 'address', label: 'Street Address' },
    { key: 'apt', label: 'Apt / Unit #' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zip', label: 'ZIP Code' },
    { key: 'county', label: 'County' },
    { key: 'time_in_state', label: 'Time Living in State' },
    { key: 'name_on_green_card', label: 'Name on Green Card' },
    { key: 'a_number', label: 'A-Number' },
    { key: 'date_permanent_resident', label: 'Date Became LPR' },
    { key: 'green_card_method', label: 'How Green Card Obtained' },
  ],
  section_contact: [
    { key: 'cell_phone', label: 'Cell Phone' },
    { key: 'day_phone', label: 'Daytime Phone' },
    { key: 'home_phone', label: 'Home Phone' },
    { key: 'email', label: 'Email Address' },
  ],
  section_physical: [
    { key: 'dob', label: 'Date of Birth' },
    { key: 'ssn', label: 'Social Security Number' },
    { key: 'country_of_birth', label: 'Country of Birth' },
    { key: 'country_of_citizenship', label: 'Country of Citizenship' },
    { key: 'gender', label: 'Gender' },
    { key: 'height_ft', label: 'Height (ft)' },
    { key: 'height_in', label: 'Height (in)' },
    { key: 'weight', label: 'Weight (lbs)' },
    { key: 'hair_color', label: 'Hair Color' },
    { key: 'eye_color', label: 'Eye Color' },
    { key: 'ethnicity', label: 'Ethnicity' },
    { key: 'race', label: 'Race' },
  ],
  section_marital: [
    { key: 'marital_status', label: 'Marital Status' },
    { key: 'times_married', label: 'Times Married' },
    { key: 'spouse_last', label: 'Spouse Last Name' },
    { key: 'spouse_first', label: 'Spouse First Name' },
    { key: 'spouse_middle', label: 'Spouse Middle Name' },
    { key: 'spouse_dob', label: 'Spouse Date of Birth' },
    { key: 'date_of_marriage', label: 'Date of Marriage' },
    { key: 'marriage_place', label: 'Place of Marriage' },
    { key: 'spouse_citizenship', label: 'Spouse Country of Citizenship' },
    { key: 'spouse_us_citizen', label: 'Spouse U.S. Citizen?' },
    { key: 'spouse_citizen_date', label: 'Spouse Naturalization Date' },
    { key: 'spouse_a_number', label: 'Spouse A-Number' },
    { key: 'spouse_employer', label: "Spouse's Current Employer" },
  ],
}

function EditableField({ label, value, onChange }) {
  const isEmpty = !value || String(value).trim() === ''
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: isEmpty ? '#dc2626' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
        {label} {isEmpty && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— missing</span>}
      </label>
      <input
        style={{
          display: 'block', width: '100%', padding: '0.65rem 0.85rem',
          border: `1.5px solid ${isEmpty ? '#fca5a5' : '#e2e8f0'}`,
          borderRadius: 7, fontSize: '0.9rem', color: '#0f172a',
          background: isEmpty ? '#fff5f5' : '#f8fafc',
          outline: 'none', marginBottom: 0,
        }}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { e.target.style.borderColor = '#1d4ed8'; e.target.style.background = '#fff' }}
        onBlur={e => {
          const val = e.target.value.trim()
          e.target.style.borderColor = val ? '#e2e8f0' : '#fca5a5'
          e.target.style.background = val ? '#f8fafc' : '#fff5f5'
        }}
      />
    </div>
  )
}

function SectionEditor({ title, fields, data, onChange }) {
  const missingCount = fields.filter(f => !data[f.key] || String(data[f.key]).trim() === '').length
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044' }}>{title}</h3>
        {missingCount > 0 ? (
          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 20, background: '#fff5f5', color: '#dc2626', border: '1px solid #fca5a5' }}>
            {missingCount} field{missingCount > 1 ? 's' : ''} missing
          </span>
        ) : (
          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
            ✓ Complete
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
        {fields.map(f => (
          <EditableField
            key={f.key}
            label={f.label}
            value={data[f.key]}
            onChange={v => onChange({ ...data, [f.key]: v })}
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
  const [showPdfInstructions, setShowPdfInstructions] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const name = [data.section_personal?.first_name, data.section_personal?.last_name].filter(Boolean).join(' ') || 'Client'

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('intake_submissions')
      .update({ ...data, status, attorney_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', submission.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onUpdated()
  }

  const yesAnswers = data.section_background?.answers
    ? Object.entries(data.section_background.answers).filter(([, v]) => v === 'Yes')
    : []

  const children = data.section_children?.children || []
  const employmentEntries = data.section_employment?.entries || []
  const trips = data.section_travel?.trips || []

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
          <button
            onClick={() => setShowPreview(true)}
            style={{ padding: '0.5rem 1.1rem', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 7, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            👁 Form Reference
          </button>
              downloadFDF({ ...data, section_personal: { ...data.section_personal }, section_contact: data.section_contact, section_physical: data.section_physical, section_marital: data.section_marital, section_children: data.section_children, section_employment: data.section_employment, section_travel: data.section_travel, section_background: data.section_background }, name)
              setShowPdfInstructions(true)
              setTimeout(() => setShowPdfInstructions(false), 8000)
            }}
            style={{ padding: '0.5rem 1.1rem', background: 'rgba(184,150,62,0.15)', color: '#f0d080', border: '1px solid rgba(184,150,62,0.4)', borderRadius: 7, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            ↓ Generate N-400 FDF
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.5rem 1.25rem', background: '#b8963e', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {showPdfInstructions && (
          <div style={{ background: '#fdf8ee', border: '1px solid #f0d080', borderRadius: 10, padding: '1.1rem 1.5rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#7a5800' }}>
            <strong>✓ FDF file downloaded!</strong> Run this command in your terminal to generate the filled N-400 PDF (update the path to where your n-400.pdf is saved):
            <div style={{ marginTop: '0.5rem', background: '#fff8e0', borderRadius: 6, padding: '0.6rem 1rem', fontFamily: 'monospace', fontSize: '0.82rem', color: '#5a3f00', wordBreak: 'break-all' }}>
              pdftk /Users/alexarathi/Desktop/Codin/N400Intake/app/public/n-400.pdf fill_form ~/Downloads/{name.replace(/\s+/g, '_')}_N400.fdf output ~/Desktop/{name.replace(/\s+/g, '_')}_filled_N400.pdf flatten
            </div>
          </div>
        )}

        {/* Status + Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Case Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STATUS_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setStatus(opt)} style={{ padding: '0.6rem 1rem', borderRadius: 7, border: '1.5px solid', borderColor: status === opt ? STATUS_COLORS[opt] : '#e2e8f0', background: status === opt ? STATUS_COLORS[opt] : '#f8fafc', color: status === opt ? '#fff' : '#475569', fontWeight: status === opt ? 600 : 400, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}>
                  {STATUS_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Attorney Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add internal notes — missing documents, follow-up items, flags, etc." rows={6} style={{ display: 'block', width: '100%', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: '0.9rem', color: '#0f172a', resize: 'vertical', outline: 'none', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }} />
          </div>
        </div>

        {/* Background yes answers */}
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

        {/* Standard sections with all fields shown */}
        {Object.entries(SECTION_FIELDS).map(([sectionKey, fields]) => (
          <SectionEditor
            key={sectionKey}
            title={{ section_personal: 'Personal Information', section_contact: 'Contact Information', section_physical: 'Physical Description', section_marital: 'Marital History' }[sectionKey]}
            fields={fields}
            data={data[sectionKey] || {}}
            onChange={v => setData(p => ({ ...p, [sectionKey]: v }))}
          />
        ))}

        {/* Children */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Children</h3>
          {children.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No children listed by client.</div>
          ) : children.map((child, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f2044', marginBottom: '0.75rem' }}>Child #{i + 1}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 1rem' }}>
                {[{ key: 'full_name', label: 'Full Name' }, { key: 'dob', label: 'Date of Birth' }, { key: 'country_of_birth', label: 'Country of Birth' }, { key: 'citizenship_status', label: 'Citizenship Status' }, { key: 'address', label: 'Address' }].map(f => {
                  const isEmpty = !child[f.key]
                  return (
                    <div key={f.key} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: isEmpty ? '#dc2626' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{f.label}{isEmpty ? ' — missing' : ''}</div>
                      <input value={child[f.key] || ''} onChange={e => {
                        const updated = [...children]
                        updated[i] = { ...updated[i], [f.key]: e.target.value }
                        setData(p => ({ ...p, section_children: { ...p.section_children, children: updated } }))
                      }} style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: `1.5px solid ${isEmpty ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 6, fontSize: '0.875rem', background: isEmpty ? '#fff5f5' : '#fff', outline: 'none' }} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Employment */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Employment & Schools</h3>
          {employmentEntries.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No employment entries listed by client.</div>
          ) : employmentEntries.map((entry, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f2044', marginBottom: '0.75rem' }}>Entry #{i + 1}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0 1rem' }}>
                {[{ key: 'employer_name', label: 'Employer / School' }, { key: 'occupation', label: 'Occupation / Field' }, { key: 'city', label: 'City' }, { key: 'state', label: 'State' }, { key: 'country', label: 'Country' }, { key: 'from', label: 'From' }, { key: 'to', label: 'To' }].map(f => {
                  const isEmpty = !entry[f.key]
                  return (
                    <div key={f.key} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: isEmpty ? '#dc2626' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{f.label}{isEmpty ? ' — missing' : ''}</div>
                      <input value={entry[f.key] || ''} onChange={e => {
                        const updated = [...employmentEntries]
                        updated[i] = { ...updated[i], [f.key]: e.target.value }
                        setData(p => ({ ...p, section_employment: { ...p.section_employment, entries: updated } }))
                      }} style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: `1.5px solid ${isEmpty ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 6, fontSize: '0.875rem', background: isEmpty ? '#fff5f5' : '#fff', outline: 'none' }} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Travel */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f2044', marginBottom: '1.25rem' }}>Travel Outside U.S.</h3>
          {trips.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No trips listed by client.</div>
          ) : trips.map((trip, i) => (
            <div key={i} style={{ background: trip.over_180 === 'Yes' ? '#fef2f2' : '#f8fafc', border: `1px solid ${trip.over_180 === 'Yes' ? '#fecaca' : '#e2e8f0'}`, borderRadius: 8, padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: trip.over_180 === 'Yes' ? '#dc2626' : '#0f2044', marginBottom: '0.75rem' }}>
                Trip #{i + 1} {trip.over_180 === 'Yes' && '⚠️ 180+ days'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0 1rem' }}>
                {[{ key: 'countries', label: 'Countries' }, { key: 'date_left', label: 'Date Left U.S.' }, { key: 'date_returned', label: 'Date Returned' }, { key: 'over_180', label: '180+ Days?' }].map(f => (
                  <div key={f.key} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{f.label}</div>
                    <div style={{ fontSize: '0.875rem', color: '#334155', padding: '0.5rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6 }}>{trip[f.key] || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={onBack} style={{ padding: '0.75rem 1.5rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem', color: '#475569', cursor: 'pointer' }}>← Back to All Clients</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.75rem 2rem', background: '#0f2044', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {showPreview && (
        <N400Preview
          submission={data}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
