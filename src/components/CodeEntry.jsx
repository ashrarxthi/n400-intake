import { useState } from 'react'
import { supabase } from '../supabase.js'

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(160deg, #0f2044 0%, #1a3460 60%, #0f2044 100%)',
  },
  logo: {
    marginBottom: '2.5rem',
    textAlign: 'center',
  },
  logoText: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.01em',
  },
  logoSub: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginTop: '0.25rem',
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.25)',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: 440,
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#0f2044',
    marginBottom: '0.4rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '0.4rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: '0.95rem',
    color: '#0f172a',
    background: '#f8fafc',
    marginBottom: '1.25rem',
    transition: 'border-color 0.15s',
    outline: 'none',
  },
  btn: {
    display: 'block',
    width: '100%',
    padding: '0.85rem',
    background: '#0f2044',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.15s',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#dc2626',
    marginBottom: '1rem',
  },
  divider: {
    borderTop: '1px solid #e2e8f0',
    margin: '1.5rem 0',
  },
  note: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  gold: {
    display: 'inline-block',
    width: 40,
    height: 3,
    background: '#b8963e',
    borderRadius: 2,
    marginBottom: '1.5rem',
  }
}

export default function CodeEntry({ onAuthenticated }) {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!code.trim() || !email.trim()) {
      setError('Please enter both your access code and email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if code is valid and active
      const { data: codeData, error: codeErr } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('active', true)
        .single()

      if (codeErr || !codeData) {
        setError('Invalid or expired access code. Please check with your attorney.')
        setLoading(false)
        return
      }

      // Upsert submission row (creates if new, retrieves if returning)
      const { data: submission, error: subErr } = await supabase
        .from('intake_submissions')
        .upsert(
          { access_code: code.trim().toUpperCase(), client_email: email.trim().toLowerCase() },
          { onConflict: 'access_code,client_email', ignoreDuplicates: false }
        )
        .select()
        .single()

      if (subErr) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      onAuthenticated({ submission, codeData, email: email.trim().toLowerCase() })
    } catch (e) {
      setError('Connection error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.logo}>
        <div style={s.logoText}>LegalQuest Network</div>
        <div style={s.logoSub}>Attorneys &amp; Counselors</div>
      </div>

      <div style={s.card}>
        <div style={s.gold} />
        <h1 style={s.title}>Client Intake</h1>
        <p style={s.subtitle}>
          Enter the access code provided by your attorney and your email address to begin or continue your naturalization intake form.
        </p>

        {error && <div style={s.error}>{error}</div>}

        <label style={s.label}>Access Code</label>
        <input
          style={s.input}
          type="text"
          placeholder="e.g. SMITH2024"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onFocus={e => e.target.style.borderColor = '#1d4ed8'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <label style={s.label}>Your Email Address</label>
        <input
          style={s.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#1d4ed8'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <button
          style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifying…' : 'Begin Intake Form →'}
        </button>

        <div style={s.divider} />
        <p style={s.note}>
          If you have already started your form, use the same access code and email to resume where you left off.
          Your progress is saved automatically.
        </p>
      </div>
    </div>
  )
}
