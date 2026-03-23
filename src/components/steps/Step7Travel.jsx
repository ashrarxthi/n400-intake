import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, btnRow, btnPrimary, btnSecondary, hint, Input, YesNo } from '../FormComponents.jsx'

const emptyTrip = { date_left: '', date_returned: '', countries: '', over_180: '' }

export default function Step7Travel({ data, onNext, onBack }) {
  const [trips, setTrips] = useState(data.trips || [])
  const [totalTrips, setTotalTrips] = useState(data.total_trips || '')
  const [selectiveService, setSelectiveService] = useState(data.selective_service || {})

  const add = () => setTrips(p => [...p, { ...emptyTrip }])

  const update = (i, k, v) => setTrips(p => {
    const t = [...p]; t[i] = { ...t[i], [k]: v }; return t
  })

  const remove = i => setTrips(p => p.filter((_, idx) => idx !== i))
  const setSS = (k, v) => setSelectiveService(p => ({ ...p, [k]: v }))

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Travel Outside the U.S.</h2>
        <p style={sectionDesc}>
          List all trips of <strong>24 hours or more</strong> outside the United States in the last 5 years.
          Do not include day trips to Canada or Mexico under 24 hours. Start with the most recent trip.
        </p>

        <Input
          label="Total Number of Trips (24+ hours) Outside U.S. in Last 5 Years"
          type="number"
          min="0"
          value={totalTrips}
          onChange={e => setTotalTrips(e.target.value)}
        />
      </div>

      {trips.map((trip, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 600, color: '#0f2044' }}>Trip #{i + 1}</span>
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
          </div>
          <div style={grid2}>
            <Input label="Date You Left the U.S." type="date" value={trip.date_left} onChange={e => update(i, 'date_left', e.target.value)} />
            <Input label="Date You Returned to the U.S." type="date" value={trip.date_returned} onChange={e => update(i, 'date_returned', e.target.value)} />
          </div>
          <Input label="Countries Visited" value={trip.countries} onChange={e => update(i, 'countries', e.target.value)} placeholder="e.g. Mexico, Colombia" />

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Did this trip last 180 days or more?
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Yes', 'No'].map(opt => (
                <button key={opt} type="button" onClick={() => update(i, 'over_180', opt)} style={{
                  padding: '0.5rem 1.25rem', borderRadius: 7, border: '1.5px solid',
                  borderColor: trip.over_180 === opt ? (opt === 'Yes' ? '#dc2626' : '#0f2044') : '#e2e8f0',
                  background: trip.over_180 === opt ? (opt === 'Yes' ? '#fef2f2' : '#0f2044') : '#f8fafc',
                  color: trip.over_180 === opt ? (opt === 'Yes' ? '#dc2626' : '#fff') : '#475569',
                  fontWeight: 500, cursor: 'pointer',
                }}>{opt}</button>
              ))}
            </div>
            {trip.over_180 === 'Yes' && (
              <div style={{ marginTop: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '0.75rem', fontSize: '0.85rem', color: '#dc2626' }}>
                ⚠️ Trips of 180+ days may affect your continuous residence requirement. Your attorney will need to discuss this with you.
              </div>
            )}
          </div>
        </div>
      ))}

      <button type="button" onClick={add} style={{
        padding: '0.65rem 1.25rem', borderRadius: 7, border: '1.5px dashed #cbd5e1',
        background: '#f8fafc', color: '#475569', fontSize: '0.875rem', cursor: 'pointer', width: '100%', marginBottom: '1.25rem',
      }}>
        + Add a Trip
      </button>

      <div style={card}>
        <h2 style={sectionTitle}>Selective Service (Males Only)</h2>
        <p style={sectionDesc}>If you are male, answer the following. Skip if female.</p>

        <YesNo
          label="Did you live in the U.S. as a lawful permanent resident between ages 18 and 26?"
          value={selectiveService.lived_18_26}
          onChange={v => setSS('lived_18_26', v)}
        />
        {selectiveService.lived_18_26 === 'Yes' && (
          <>
            <YesNo label="Did you register for Selective Service?" value={selectiveService.registered} onChange={v => setSS('registered', v)} />
            {selectiveService.registered === 'Yes' && (
              <div style={grid2}>
                <Input label="Registration Date" type="date" value={selectiveService.reg_date || ''} onChange={e => setSS('reg_date', e.target.value)} />
                <Input label="Selective Service Number" value={selectiveService.ss_number || ''} onChange={e => setSS('ss_number', e.target.value)} hint="Find at sss.gov" />
              </div>
            )}
          </>
        )}
      </div>

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={() => onNext({ trips, total_trips: totalTrips, selective_service: selectiveService })}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
