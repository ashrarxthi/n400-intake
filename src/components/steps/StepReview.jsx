import { card, sectionTitle, sectionDesc, btnRow, btnPrimary, btnSecondary, divider } from '../FormComponents.jsx'

const Section = ({ title, data, fields }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
      {fields.map(({ key, label }) => (
        data[key] ? (
          <div key={key}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>{Array.isArray(data[key]) ? data[key].join(', ') : String(data[key])}</div>
          </div>
        ) : null
      ))}
    </div>
  </div>
)

export default function StepReview({ allData, onBack, onSubmit }) {
  const { section_personal: p, section_contact: c, section_physical: ph,
    section_marital: m, section_children: ch, section_employment: em,
    section_travel: tr, section_background: bg } = allData

  const yesAnswers = bg?.answers ? Object.entries(bg.answers).filter(([, v]) => v === 'Yes') : []

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Review Your Information</h2>
        <p style={sectionDesc}>
          Please review all of your answers before submitting. Once submitted, your attorney will
          review and may reach out if any corrections are needed. You can also go back to any
          section using the tabs above.
        </p>
      </div>

      {/* Personal */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Personal Information</h2>
          <StatusBadge data={p} requiredKeys={['last_name', 'first_name', 'a_number']} />
        </div>
        <Section title="Name" data={p || {}} fields={[
          { key: 'last_name', label: 'Last Name' }, { key: 'first_name', label: 'First Name' },
          { key: 'middle_name', label: 'Middle Name' }, { key: 'maiden_name', label: 'Maiden Name' },
        ]} />
        <div style={divider} />
        <Section title="Immigration" data={p || {}} fields={[
          { key: 'a_number', label: 'A-Number' }, { key: 'date_permanent_resident', label: 'LPR Date' },
          { key: 'green_card_method', label: 'How Green Card Obtained' },
        ]} />
        <div style={divider} />
        <Section title="Address" data={p || {}} fields={[
          { key: 'address', label: 'Street' }, { key: 'city', label: 'City' },
          { key: 'state', label: 'State' }, { key: 'zip', label: 'ZIP' }, { key: 'county', label: 'County' },
        ]} />
      </div>

      {/* Contact */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Contact Information</h2>
          <StatusBadge data={c} requiredKeys={['cell_phone']} />
        </div>
        <Section title="" data={c || {}} fields={[
          { key: 'cell_phone', label: 'Cell Phone' }, { key: 'day_phone', label: 'Daytime Phone' },
          { key: 'home_phone', label: 'Home Phone' }, { key: 'email', label: 'Email' },
        ]} />
      </div>

      {/* Physical */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Physical Description</h2>
          <StatusBadge data={ph} requiredKeys={['dob', 'country_of_birth']} />
        </div>
        <Section title="Details" data={ph || {}} fields={[
          { key: 'dob', label: 'Date of Birth' }, { key: 'ssn', label: 'SSN' },
          { key: 'country_of_birth', label: 'Country of Birth' }, { key: 'country_of_citizenship', label: 'Country of Citizenship' },
          { key: 'gender', label: 'Gender' }, { key: 'height_ft', label: 'Height (ft)' },
          { key: 'height_in', label: 'Height (in)' }, { key: 'weight', label: 'Weight (lbs)' },
          { key: 'hair_color', label: 'Hair Color' }, { key: 'eye_color', label: 'Eye Color' },
          { key: 'ethnicity', label: 'Ethnicity' }, { key: 'race', label: 'Race' },
        ]} />
      </div>

      {/* Marital */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Marital History</h2>
          <StatusBadge data={m} requiredKeys={['marital_status']} />
        </div>
        <Section title="" data={m || {}} fields={[
          { key: 'marital_status', label: 'Current Status' }, { key: 'times_married', label: 'Times Married' },
          { key: 'spouse_first', label: 'Spouse First Name' }, { key: 'spouse_last', label: 'Spouse Last Name' },
          { key: 'date_of_marriage', label: 'Date of Marriage' }, { key: 'marriage_place', label: 'Place of Marriage' },
          { key: 'spouse_citizenship', label: 'Spouse Citizenship' },
        ]} />
        {(m?.prior_spouses || []).length > 0 && (
          <div style={{ marginTop: '0.75rem', background: '#f8fafc', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#475569' }}>
            {m.prior_spouses.length} prior marriage(s) listed
          </div>
        )}
      </div>

      {/* Children */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Children</h2>
          <CompleteBadge />
        </div>
        <div style={{ fontSize: '0.9rem', color: '#475569' }}>
          {parseInt(ch?.total_children) > 0
            ? `${ch.total_children} child(ren) listed`
            : 'No children listed'}
        </div>
        {(ch?.children || []).map((c, i) => (
          <div key={i} style={{ background: '#f8fafc', borderRadius: 6, padding: '0.6rem 0.9rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            {c.full_name} — DOB: {c.dob} — {c.citizenship_status}
          </div>
        ))}
      </div>

      {/* Employment */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Employment &amp; Schools</h2>
          <CompleteBadge />
        </div>
        {(em?.entries || []).map((e, i) => (
          <div key={i} style={{ background: '#f8fafc', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            <strong>{e.employer_name}</strong> — {e.occupation} — {e.city}, {e.state} ({e.from} to {e.current ? 'Present' : e.to})
          </div>
        ))}
      </div>

      {/* Travel */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Travel</h2>
          <CompleteBadge />
        </div>
        <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem' }}>
          {parseInt(tr?.total_trips) > 0 ? `${tr.total_trips} trip(s) listed` : 'No trips listed'}
        </div>
        {(tr?.trips || []).map((t, i) => (
          <div key={i} style={{
            background: t.over_180 === 'Yes' ? '#fef2f2' : '#f8fafc',
            borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.5rem',
            fontSize: '0.85rem', color: t.over_180 === 'Yes' ? '#dc2626' : '#334155',
          }}>
            {t.countries} — {t.date_left} to {t.date_returned}
            {t.over_180 === 'Yes' && ' ⚠️ 180+ days'}
          </div>
        ))}
      </div>

      {/* Background */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Background Questions</h2>
          <StatusBadge data={bg?.answers ? { answered: 'yes' } : {}} requiredKeys={['answered']} />
        </div>
        {yesAnswers.length === 0 ? (
          <div style={{ fontSize: '0.9rem', color: '#16a34a' }}>✓ All background questions answered "No"</div>
        ) : (
          <div>
            <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 600, marginBottom: '0.5rem' }}>
              {yesAnswers.length} question(s) answered "Yes" — your attorney will review these:
            </div>
            {yesAnswers.map(([key]) => (
              <div key={key} style={{ background: '#fef2f2', borderRadius: 6, padding: '0.5rem 0.85rem', marginBottom: '0.4rem', fontSize: '0.82rem', color: '#dc2626' }}>
                • {key.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div style={{ ...card, background: '#0f2044', border: 'none' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Ready to Submit?</h2>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You can submit at any time — even if some sections are incomplete. Your attorney will follow up if anything is missing.
        </p>
        <div style={btnRow}>
          <button style={{ padding: '0.8rem 1.5rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: '0.95rem', cursor: 'pointer' }} onClick={onBack}>
            ← Go Back
          </button>
          <button
            style={{ padding: '0.85rem 2.5rem', background: '#b8963e', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
            onClick={onSubmit}
          >
            Submit to Attorney →
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ data, requiredKeys }) {
  const complete = data && requiredKeys.every(k => data[k])
  return <CompleteBadge complete={complete} />
}

function CompleteBadge({ complete = true }) {
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      padding: '0.25rem 0.65rem', borderRadius: 20,
      background: complete ? '#f0fdf4' : '#fef9ec',
      color: complete ? '#16a34a' : '#b8963e',
      border: `1px solid ${complete ? '#bbf7d0' : '#f0d080'}`,
    }}>
      {complete ? '✓ Complete' : 'In Progress'}
    </span>
  )
}
