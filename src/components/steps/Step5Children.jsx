import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, btnRow, btnPrimary, btnSecondary, errorStyle, Input } from '../FormComponents.jsx'

const emptyChild = { full_name: '', dob: '', country_of_birth: '', citizenship_status: '', address: '' }

export default function Step5Children({ data, onNext, onBack }) {
  const [f, setF] = useState({ total_children: '0', children: [], ...data })
  const [error, setError] = useState('')

  const setCount = e => {
    const n = parseInt(e.target.value) || 0
    const children = Array.from({ length: n }, (_, i) => f.children[i] || { ...emptyChild })
    setF(p => ({ ...p, total_children: e.target.value, children }))
  }

  const updateChild = (i, k, v) => setF(p => {
    const ch = [...p.children]
    ch[i] = { ...ch[i], [k]: v }
    return { ...p, children: ch }
  })

  const handleNext = () => {
    const n = parseInt(f.total_children) || 0
    if (n > 0) {
      const missing = f.children.some(c => !c.full_name || !c.dob)
      if (missing) {
        setError('Please enter at least the full name and date of birth for each child.')
        return
      }
    }
    setError('')
    onNext(f)
  }

  return (
    <div>
      {error && <div style={errorStyle}>{error}</div>}
      <div style={card}>
        <h2 style={sectionTitle}>Children</h2>
        <p style={sectionDesc}>Include all children anywhere in the world — biological, step, adopted, or half-children — regardless of age.</p>
        <Input label="Total Number of Children" type="number" min="0" max="20" value={f.total_children} onChange={setCount} hint="Include all children worldwide" />
      </div>

      {f.children.map((child, i) => (
        <div key={i} style={card}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: '#0f2044', marginBottom: '1.25rem' }}>
            Child #{i + 1}
          </h2>
          <div style={grid2}>
            <Input label="Full Name (First and Last)" required value={child.full_name} onChange={e => updateChild(i, 'full_name', e.target.value)} />
            <Input label="Date of Birth" required type="date" value={child.dob} onChange={e => updateChild(i, 'dob', e.target.value)} />
          </div>
          <div style={grid2}>
            <Input label="Country of Birth" value={child.country_of_birth} onChange={e => updateChild(i, 'country_of_birth', e.target.value)} />
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Citizenship Status</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['U.S. Citizen', 'Green Card', 'Other Visa', 'No Status', 'Unknown'].map(opt => (
                  <button key={opt} type="button" onClick={() => updateChild(i, 'citizenship_status', opt)} style={{ padding: '0.4rem 0.75rem', borderRadius: 6, border: '1.5px solid', borderColor: child.citizenship_status === opt ? '#0f2044' : '#e2e8f0', background: child.citizenship_status === opt ? '#0f2044' : '#f8fafc', color: child.citizenship_status === opt ? '#fff' : '#475569', fontSize: '0.8rem', cursor: 'pointer' }}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
          <Input label="Current Address (if different from yours)" value={child.address} onChange={e => updateChild(i, 'address', e.target.value)} placeholder="City, State, Country" />
        </div>
      ))}

      {parseInt(f.total_children) === 0 && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
          No children to list. Continue to the next section.
        </div>
      )}

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={handleNext}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
        <p style={sectionDesc}>Include all children anywhere in the world — biological, step, adopted, or half-children — regardless of age.</p>

        <Input
          label="Total Number of Children"
          type="number"
          min="0"
          max="20"
          value={f.total_children}
          onChange={setCount}
          hint="Include all children worldwide"
        />
      </div>

      {f.children.map((child, i) => (
        <div key={i} style={card}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: '#0f2044', marginBottom: '1.25rem' }}>
            Child #{i + 1}
          </h2>
          <div style={grid2}>
            <Input label="Full Name (First and Last)" value={child.full_name} onChange={e => updateChild(i, 'full_name', e.target.value)} />
            <Input label="Date of Birth" type="date" value={child.dob} onChange={e => updateChild(i, 'dob', e.target.value)} />
          </div>
          <div style={grid2}>
            <Input label="Country of Birth" value={child.country_of_birth} onChange={e => updateChild(i, 'country_of_birth', e.target.value)} />
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Citizenship Status
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['U.S. Citizen', 'Green Card', 'Other Visa', 'No Status', 'Unknown'].map(opt => (
                  <button key={opt} type="button" onClick={() => updateChild(i, 'citizenship_status', opt)} style={{
                    padding: '0.4rem 0.75rem', borderRadius: 6, border: '1.5px solid',
                    borderColor: child.citizenship_status === opt ? '#0f2044' : '#e2e8f0',
                    background: child.citizenship_status === opt ? '#0f2044' : '#f8fafc',
                    color: child.citizenship_status === opt ? '#fff' : '#475569',
                    fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                  }}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
          <Input label="Current Address (if different from yours)" value={child.address} onChange={e => updateChild(i, 'address', e.target.value)} placeholder="City, State, Country" />
        </div>
      ))}

      {parseInt(f.total_children) === 0 && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
          No children to list. Continue to the next section.
        </div>
      )}

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={() => onNext(f)}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
