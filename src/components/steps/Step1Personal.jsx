import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, grid3, btnRow, btnPrimary, btnSecondary, divider, errorStyle, Input, Select, YesNo } from '../FormComponents.jsx'

export default function Step1Personal({ data, onNext, onBack, isFirst }) {
  const [f, setF] = useState({
    last_name: '', first_name: '', middle_name: '', maiden_name: '',
    other_names: '', name_change: '', new_name: '',
    address: '', apt: '', city: '', state: '', zip: '', county: '',
    time_in_state: '', name_on_green_card: '', a_number: '',
    date_permanent_resident: '', green_card_method: '',
    ...data
  })
  const [error, setError] = useState('')

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const setVal = (k, v) => setF(p => ({ ...p, [k]: v }))

  const handleNext = () => {
    if (!f.last_name || !f.first_name || !f.a_number) {
      setError('Please fill in all required fields (Last Name, First Name, A-Number).')
      return
    }
    onNext(f)
  }

  return (
    <div>
      {error && <div style={errorStyle}>{error}</div>}

      <div style={card}>
        <h2 style={sectionTitle}>Personal Information</h2>
        <p style={sectionDesc}>Enter your full legal name exactly as it appears on your Permanent Resident Card.</p>

        <div style={grid3}>
          <Input label="Last Name (Family Name)" required value={f.last_name} onChange={set('last_name')} placeholder="As on Green Card" />
          <Input label="First Name (Given Name)" required value={f.first_name} onChange={set('first_name')} placeholder="As on Green Card" />
          <Input label="Middle Name" value={f.middle_name} onChange={set('middle_name')} placeholder="If applicable" />
        </div>
        <div style={grid2}>
          <Input label="Maiden Name" value={f.maiden_name} onChange={set('maiden_name')} placeholder="If applicable" />
          <Input label="Other Names Ever Used" value={f.other_names} onChange={set('other_names')} placeholder="Prior or married names" />
        </div>

        <YesNo label="Do you want to legally change your name?" value={f.name_change} onChange={v => setVal('name_change', v)} />
        {f.name_change === 'Yes' && (
          <Input label="New Name You Would Like to Use" value={f.new_name} onChange={set('new_name')} placeholder="Full new legal name" />
        )}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Current Address</h2>
        <p style={sectionDesc}>Your current U.S. residential address.</p>

        <Input label="Street Number and Name" value={f.address} onChange={set('address')} placeholder="123 Main Street" />
        <div style={grid3}>
          <Input label="Apt / Unit #" value={f.apt} onChange={set('apt')} placeholder="Optional" />
          <Input label="City" value={f.city} onChange={set('city')} />
          <Input label="State" value={f.state} onChange={set('state')} placeholder="e.g. MI" />
        </div>
        <div style={grid2}>
          <Input label="ZIP Code" value={f.zip} onChange={set('zip')} />
          <Input label="County" value={f.county} onChange={set('county')} placeholder="e.g. Oakland" />
        </div>
        <Input label="How long have you lived in this state?" value={f.time_in_state} onChange={set('time_in_state')} placeholder="e.g. 5 years" />
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Immigration Information</h2>

        <Input
          label="Name as it appears on your Permanent Resident Card"
          value={f.name_on_green_card}
          onChange={set('name_on_green_card')}
          placeholder="Print exactly as shown"
        />
        <div style={grid2}>
          <Input label="USCIS A-Number" required value={f.a_number} onChange={set('a_number')} placeholder="A-000000000" hint="9-digit number on your Green Card" />
          <Input label="Date You Became a Lawful Permanent Resident" type="date" value={f.date_permanent_resident} onChange={set('date_permanent_resident')} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            How did you obtain your Green Card?
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {['Marriage to U.S. Citizen', 'Family Petition', 'Employment', 'Refugee/Asylee', 'Diversity Lottery', 'Other'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setVal('green_card_method', opt)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 6,
                  border: '1.5px solid',
                  borderColor: f.green_card_method === opt ? '#0f2044' : '#e2e8f0',
                  background: f.green_card_method === opt ? '#0f2044' : '#f8fafc',
                  color: f.green_card_method === opt ? '#fff' : '#475569',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={btnRow}>
        <div />
        <button style={btnPrimary} onClick={handleNext}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
