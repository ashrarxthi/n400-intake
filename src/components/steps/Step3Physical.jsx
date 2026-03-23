import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, grid3, btnRow, btnPrimary, btnSecondary, Input, Select, CheckboxGroup } from '../FormComponents.jsx'

const HAIR = ['Black', 'Brown', 'Blonde', 'Gray', 'Red', 'Sandy', 'White', 'Bald']
const EYES = ['Brown', 'Blue', 'Green', 'Gray', 'Hazel', 'Black', 'Pink', 'Maroon', 'Other']
const RACES = ['White', 'Asian', 'Black or African American', 'American Indian or Alaska Native', 'Native Hawaiian or Other Pacific Islander']

export default function Step3Physical({ data, onNext, onBack }) {
  const [f, setF] = useState({
    dob: '', ssn: '', height_ft: '', height_in: '', weight: '',
    country_of_birth: '', country_of_citizenship: '',
    ethnicity: '', race: [], hair_color: '', eye_color: '', gender: '',
    ...data
  })

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const setVal = (k, v) => setF(p => ({ ...p, [k]: v }))

  const ColorPicker = ({ label, options, value, onChange }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onChange(opt)} style={{
            padding: '0.4rem 0.8rem', borderRadius: 6, border: '1.5px solid',
            borderColor: value === opt ? '#0f2044' : '#e2e8f0',
            background: value === opt ? '#0f2044' : '#f8fafc',
            color: value === opt ? '#fff' : '#475569',
            fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s',
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Personal Details</h2>
        <p style={sectionDesc}>Basic biographical information required for your N-400 application.</p>

        <div style={grid2}>
          <Input label="Date of Birth" required type="date" value={f.dob} onChange={set('dob')} />
          <Input label="Social Security Number" value={f.ssn} onChange={set('ssn')} placeholder="XXX-XX-XXXX" hint="Required for SSA update" />
        </div>
        <div style={grid2}>
          <Input label="Country of Birth" value={f.country_of_birth} onChange={set('country_of_birth')} />
          <Input label="Country of Current Citizenship / Nationality" value={f.country_of_citizenship} onChange={set('country_of_citizenship')} />
        </div>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Physical Description</h2>
        <p style={sectionDesc}>Required for biographic information on your application.</p>

        <div style={grid3}>
          <Input label="Height — Feet" type="number" min="3" max="8" value={f.height_ft} onChange={set('height_ft')} placeholder="5" />
          <Input label="Height — Inches" type="number" min="0" max="11" value={f.height_in} onChange={set('height_in')} placeholder="8" />
          <Input label="Weight (lbs)" type="number" value={f.weight} onChange={set('weight')} placeholder="150" />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Gender</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['Male', 'Female'].map(opt => (
              <button key={opt} type="button" onClick={() => setVal('gender', opt)} style={{
                padding: '0.6rem 1.5rem', borderRadius: 7, border: '1.5px solid',
                borderColor: f.gender === opt ? '#0f2044' : '#e2e8f0',
                background: f.gender === opt ? '#0f2044' : '#f8fafc',
                color: f.gender === opt ? '#fff' : '#475569',
                fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
              }}>{opt}</button>
            ))}
          </div>
        </div>

        <ColorPicker label="Hair Color" options={HAIR} value={f.hair_color} onChange={v => setVal('hair_color', v)} />
        <ColorPicker label="Eye Color" options={EYES} value={f.eye_color} onChange={v => setVal('eye_color', v)} />
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Ethnicity &amp; Race</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Ethnicity</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['Hispanic or Latino', 'Not Hispanic or Latino'].map(opt => (
              <button key={opt} type="button" onClick={() => setVal('ethnicity', opt)} style={{
                padding: '0.5rem 1rem', borderRadius: 7, border: '1.5px solid',
                borderColor: f.ethnicity === opt ? '#0f2044' : '#e2e8f0',
                background: f.ethnicity === opt ? '#0f2044' : '#f8fafc',
                color: f.ethnicity === opt ? '#fff' : '#475569',
                fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s',
              }}>{opt}</button>
            ))}
          </div>
        </div>

        <CheckboxGroup label="Race (select all that apply)" options={RACES} value={f.race} onChange={v => setVal('race', v)} />
      </div>

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={() => onNext(f)}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
