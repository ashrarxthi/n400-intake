export const card = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
  padding: '1.75rem',
  marginBottom: '1.25rem',
}

export const sectionTitle = {
  fontFamily: 'Playfair Display, serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#0f2044',
  marginBottom: '0.3rem',
}

export const sectionDesc = {
  fontSize: '0.875rem',
  color: '#64748b',
  marginBottom: '1.5rem',
  lineHeight: 1.6,
}

export const label = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#475569',
  marginBottom: '0.35rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

export const required = { color: '#dc2626', marginLeft: 2 }

export const inputBase = {
  display: 'block',
  width: '100%',
  padding: '0.7rem 0.9rem',
  border: '1.5px solid #e2e8f0',
  borderRadius: 7,
  fontSize: '0.95rem',
  color: '#0f172a',
  background: '#f8fafc',
  transition: 'border-color 0.15s, background 0.15s',
  outline: 'none',
}

export const grid2 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
  marginBottom: '1rem',
}

export const grid3 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '1rem',
  marginBottom: '1rem',
}

export const field = { marginBottom: '1rem' }

export const btnRow = {
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'space-between',
  marginTop: '1.5rem',
}

export const btnPrimary = {
  padding: '0.8rem 2rem',
  background: '#0f2044',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
}

export const btnSecondary = {
  padding: '0.8rem 1.5rem',
  background: '#fff',
  color: '#475569',
  border: '1.5px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
}

export const radioGroup = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '1rem',
}

export const hint = {
  fontSize: '0.78rem',
  color: '#94a3b8',
  marginTop: '0.3rem',
  lineHeight: 1.5,
}

export const errorStyle = {
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: 6,
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#dc2626',
  marginBottom: '1rem',
}

export const divider = {
  borderTop: '1px solid #e2e8f0',
  margin: '1.5rem 0',
}

// Reusable input component helper
export function Input({ label: lbl, required: req, hint: hnt, type = 'text', ...props }) {
  return (
    <div style={field}>
      {lbl && <label style={label}>{lbl}{req && <span style={required}>*</span>}</label>}
      <input
        type={type}
        style={inputBase}
        onFocus={e => { e.target.style.borderColor = '#1d4ed8'; e.target.style.background = '#fff' }}
        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
        {...props}
      />
      {hnt && <div style={hint}>{hnt}</div>}
    </div>
  )
}

export function Select({ label: lbl, required: req, children, ...props }) {
  return (
    <div style={field}>
      {lbl && <label style={label}>{lbl}{req && <span style={required}>*</span>}</label>}
      <select
        style={{ ...inputBase, cursor: 'pointer' }}
        onFocus={e => { e.target.style.borderColor = '#1d4ed8'; e.target.style.background = '#fff' }}
        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function YesNo({ label: lbl, value, onChange }) {
  return (
    <div style={field}>
      <label style={label}>{lbl}</label>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 7,
              border: '1.5px solid',
              borderColor: value === opt ? '#0f2044' : '#e2e8f0',
              background: value === opt ? '#0f2044' : '#f8fafc',
              color: value === opt ? '#fff' : '#475569',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CheckboxGroup({ label: lbl, options, value = [], onChange }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt))
    else onChange([...value, opt])
  }
  return (
    <div style={field}>
      <label style={label}>{lbl}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 6,
              border: '1.5px solid',
              borderColor: value.includes(opt) ? '#0f2044' : '#e2e8f0',
              background: value.includes(opt) ? '#0f2044' : '#f8fafc',
              color: value.includes(opt) ? '#fff' : '#475569',
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
  )
}
