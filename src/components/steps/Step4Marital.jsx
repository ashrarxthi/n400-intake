import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, grid3, btnRow, btnPrimary, btnSecondary, divider, Input, Select } from '../FormComponents.jsx'

const STATUSES = ['Single, Never Married', 'Married', 'Divorced', 'Widowed', 'Separated', 'Marriage Annulled']

export default function Step4Marital({ data, onNext, onBack }) {
  const [f, setF] = useState({
    marital_status: '', times_married: '',
    spouse_last: '', spouse_first: '', spouse_middle: '',
    spouse_dob: '', date_of_marriage: '', marriage_place: '',
    spouse_citizenship: '', spouse_us_citizen: '', spouse_citizen_date: '',
    spouse_a_number: '', spouse_employer: '',
    prior_spouses: [],
    ...data
  })

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const setVal = (k, v) => setF(p => ({ ...p, [k]: v }))

  const addPriorSpouse = () => setF(p => ({
    ...p,
    prior_spouses: [...(p.prior_spouses || []), {
      last_name: '', first_name: '', dob: '', date_of_marriage: '', date_terminated: '', how_ended: ''
    }]
  }))

  const updatePrior = (i, k, v) => setF(p => {
    const sp = [...(p.prior_spouses || [])]
    sp[i] = { ...sp[i], [k]: v }
    return { ...p, prior_spouses: sp }
  })

  const removePrior = i => setF(p => ({
    ...p,
    prior_spouses: p.prior_spouses.filter((_, idx) => idx !== i)
  }))

  const isMarried = ['Married', 'Separated'].includes(f.marital_status)

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Marital History</h2>
        <p style={sectionDesc}>Provide accurate information about your current and all previous marriages.</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Current Marital Status</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {STATUSES.map(s => (
              <button key={s} type="button" onClick={() => setVal('marital_status', s)} style={{
                padding: '0.5rem 1rem', borderRadius: 7, border: '1.5px solid',
                borderColor: f.marital_status === s ? '#0f2044' : '#e2e8f0',
                background: f.marital_status === s ? '#0f2044' : '#f8fafc',
                color: f.marital_status === s ? '#fff' : '#475569',
                fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <Input label="Total Number of Times Married" type="number" min="0" value={f.times_married} onChange={set('times_married')} />
      </div>

      {isMarried && (
        <div style={card}>
          <h2 style={sectionTitle}>Current Spouse Information</h2>
          <div style={grid3}>
            <Input label="Spouse Last Name" value={f.spouse_last} onChange={set('spouse_last')} />
            <Input label="Spouse First Name" value={f.spouse_first} onChange={set('spouse_first')} />
            <Input label="Middle Name" value={f.spouse_middle} onChange={set('spouse_middle')} />
          </div>
          <div style={grid2}>
            <Input label="Spouse Date of Birth" type="date" value={f.spouse_dob} onChange={set('spouse_dob')} />
            <Input label="Date of Marriage" type="date" value={f.date_of_marriage} onChange={set('date_of_marriage')} />
          </div>
          <Input label="Place of Marriage (City, State, Country)" value={f.marriage_place} onChange={set('marriage_place')} />
          <div style={grid2}>
            <Input label="Spouse Country of Citizenship" value={f.spouse_citizenship} onChange={set('spouse_citizenship')} />
            <Input label="Spouse A-Number (if applicable)" value={f.spouse_a_number} onChange={set('spouse_a_number')} placeholder="Leave blank if N/A" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Is your spouse a U.S. Citizen?</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Yes', 'No'].map(opt => (
                <button key={opt} type="button" onClick={() => setVal('spouse_us_citizen', opt)} style={{
                  padding: '0.6rem 1.5rem', borderRadius: 7, border: '1.5px solid',
                  borderColor: f.spouse_us_citizen === opt ? '#0f2044' : '#e2e8f0',
                  background: f.spouse_us_citizen === opt ? '#0f2044' : '#f8fafc',
                  color: f.spouse_us_citizen === opt ? '#fff' : '#475569',
                  fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                }}>{opt}</button>
              ))}
            </div>
          </div>
          {f.spouse_us_citizen === 'Yes' && (
            <Input label="Date Spouse Became U.S. Citizen (if naturalized)" type="date" value={f.spouse_citizen_date} onChange={set('spouse_citizen_date')} />
          )}
          <Input label="Spouse's Current Employer" value={f.spouse_employer} onChange={set('spouse_employer')} placeholder="Company name and city" />
        </div>
      )}

      <div style={card}>
        <h2 style={sectionTitle}>Prior Marriages</h2>
        <p style={sectionDesc}>List all previous marriages. Click "Add Prior Spouse" for each one.</p>

        {(f.prior_spouses || []).map((sp, i) => (
          <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f2044' }}>Prior Spouse #{i + 1}</span>
              <button onClick={() => removePrior(i)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
            </div>
            <div style={grid2}>
              <Input label="Last Name" value={sp.last_name} onChange={e => updatePrior(i, 'last_name', e.target.value)} />
              <Input label="First Name" value={sp.first_name} onChange={e => updatePrior(i, 'first_name', e.target.value)} />
            </div>
            <div style={grid3}>
              <Input label="Date of Birth" type="date" value={sp.dob} onChange={e => updatePrior(i, 'dob', e.target.value)} />
              <Input label="Date of Marriage" type="date" value={sp.date_of_marriage} onChange={e => updatePrior(i, 'date_of_marriage', e.target.value)} />
              <Input label="Date Marriage Ended" type="date" value={sp.date_terminated} onChange={e => updatePrior(i, 'date_terminated', e.target.value)} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>How Marriage Ended</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Divorce', 'Annulment', 'Death'].map(opt => (
                  <button key={opt} type="button" onClick={() => updatePrior(i, 'how_ended', opt)} style={{
                    padding: '0.4rem 0.9rem', borderRadius: 6, border: '1.5px solid',
                    borderColor: sp.how_ended === opt ? '#0f2044' : '#e2e8f0',
                    background: sp.how_ended === opt ? '#0f2044' : '#f8fafc',
                    color: sp.how_ended === opt ? '#fff' : '#475569',
                    fontSize: '0.85rem', cursor: 'pointer',
                  }}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addPriorSpouse} style={{
          padding: '0.65rem 1.25rem', borderRadius: 7, border: '1.5px dashed #cbd5e1',
          background: '#f8fafc', color: '#475569', fontSize: '0.875rem', cursor: 'pointer', width: '100%',
        }}>
          + Add Prior Spouse
        </button>
      </div>

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={() => onNext(f)}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
