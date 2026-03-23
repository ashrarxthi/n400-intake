import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, grid3, btnRow, btnPrimary, btnSecondary, Input } from '../FormComponents.jsx'

const emptyJob = { employer_name: '', city: '', state: '', country: 'USA', from: '', to: '', occupation: '', current: false }

export default function Step6Employment({ data, onNext, onBack }) {
  const [entries, setEntries] = useState(data.entries || [{ ...emptyJob, current: true }])

  const add = () => setEntries(p => [...p, { ...emptyJob }])

  const update = (i, k, v) => setEntries(p => {
    const e = [...p]; e[i] = { ...e[i], [k]: v }; return e
  })

  const remove = i => setEntries(p => p.filter((_, idx) => idx !== i))

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Employment &amp; Schools</h2>
        <p style={sectionDesc}>
          List all employers and schools attended in the <strong>last 5 years</strong>, most recent first.
          Include periods of unemployment, retirement, or being a homemaker.
        </p>
      </div>

      {entries.map((entry, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 600, color: '#0f2044' }}>
              {i === 0 ? 'Most Recent' : `Entry #${i + 1}`}
            </span>
            {entries.length > 1 && (
              <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
            )}
          </div>

          <div style={grid2}>
            <Input label="Employer or School Name" value={entry.employer_name} onChange={e => update(i, 'employer_name', e.target.value)} placeholder="Company / School / Unemployed / Retired" />
            <Input label="Your Occupation or Field of Study" value={entry.occupation} onChange={e => update(i, 'occupation', e.target.value)} placeholder="e.g. Software Engineer" />
          </div>
          <div style={grid3}>
            <Input label="City" value={entry.city} onChange={e => update(i, 'city', e.target.value)} />
            <Input label="State / Province" value={entry.state} onChange={e => update(i, 'state', e.target.value)} />
            <Input label="Country" value={entry.country} onChange={e => update(i, 'country', e.target.value)} />
          </div>
          <div style={grid2}>
            <Input label="From (Date)" type="date" value={entry.from} onChange={e => update(i, 'from', e.target.value)} />
            <div>
              <Input label="To (Date)" type="date" value={entry.to} onChange={e => update(i, 'to', e.target.value)} disabled={entry.current} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#475569', marginTop: '0.3rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={entry.current} onChange={e => { update(i, 'current', e.target.checked); if (e.target.checked) update(i, 'to', '') }} />
                Currently working / attending here
              </label>
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} style={{
        padding: '0.65rem 1.25rem', borderRadius: 7, border: '1.5px dashed #cbd5e1',
        background: '#f8fafc', color: '#475569', fontSize: '0.875rem', cursor: 'pointer', width: '100%', marginBottom: '1.25rem',
      }}>
        + Add Another Entry
      </button>

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={() => onNext({ entries })}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
