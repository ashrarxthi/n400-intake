import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = 'legalquest2025'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #0f2044 0%, #1a3460 100%)', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>LegalQuest Network</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.25rem' }}>Attorney Portal</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, padding: '2.5rem 2rem', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'inline-block', width: 40, height: 3, background: '#b8963e', borderRadius: 2, marginBottom: '1.5rem' }} />
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0f2044', marginBottom: '0.4rem' }}>Attorney Login</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem' }}>Enter your password to access the client dashboard.</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#dc2626', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Enter password"
          style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.95rem', marginBottom: '1.25rem', outline: 'none', background: '#f8fafc' }}
        />
        <button
          onClick={handleLogin}
          style={{ display: 'block', width: '100%', padding: '0.85rem', background: '#0f2044', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Enter Dashboard →
        </button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <a href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Back to Client Portal</a>
      </div>
    </div>
  )
}
