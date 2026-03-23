import { useState } from 'react'
import { card, sectionTitle, sectionDesc, grid2, btnRow, btnPrimary, btnSecondary, Input } from '../FormComponents.jsx'

export default function Step2Contact({ data, onNext, onBack }) {
  const [f, setF] = useState({
    cell_phone: '', day_phone: '', home_phone: '', email: '',
    ...data
  })

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Contact Information</h2>
        <p style={sectionDesc}>Provide the best phone numbers and email address to reach you. Your attorney will use these to contact you about your case.</p>

        <div style={grid2}>
          <Input label="Cell Phone" required type="tel" value={f.cell_phone} onChange={set('cell_phone')} placeholder="(555) 000-0000" />
          <Input label="Daytime Phone" type="tel" value={f.day_phone} onChange={set('day_phone')} placeholder="If different from cell" />
        </div>
        <div style={grid2}>
          <Input label="Home Phone" type="tel" value={f.home_phone} onChange={set('home_phone')} placeholder="If different" />
          <Input label="Email Address" type="email" value={f.email} onChange={set('email')} placeholder="your@email.com" />
        </div>
      </div>

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={() => onNext(f)}>Save &amp; Continue →</button>
      </div>
    </div>
  )
}
