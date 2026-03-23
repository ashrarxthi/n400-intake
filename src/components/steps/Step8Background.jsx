import { useState } from 'react'
import { card, sectionTitle, sectionDesc, btnRow, btnPrimary, btnSecondary, field, Input } from '../FormComponents.jsx'

const QUESTIONS = [
  { key: 'claimed_citizen', text: 'Have you ever claimed to be a U.S. citizen (in writing or any other way)?' },
  { key: 'registered_voted', text: 'Have you ever registered to vote or voted in any Federal, state, or local election in the United States?' },
  { key: 'overdue_taxes', text: 'Do you currently owe any overdue Federal, state, or local taxes?' },
  { key: 'nonresident_alien', text: 'Have you ever called yourself a "nonresident alien" on a tax return or decided not to file because you considered yourself a nonresident?' },
  { key: 'communist', text: 'Have you ever been a member of the Communist party or any totalitarian party anywhere in the world?' },
  { key: 'overthrow_govt', text: 'Have you ever advocated the overthrow of any government by force or violence?' },
  { key: 'persecuted', text: 'Have you ever persecuted anyone based on race, religion, national origin, or membership in a group?' },
  { key: 'nazi', text: 'Between March 23, 1933 and May 8, 1945, did you work for or associate with the Nazi government of Germany or any associated entity?' },
  { key: 'terrorist', text: 'Have you ever been a member of, involved in, or associated with any terrorist organization?' },
  { key: 'committed_crime', text: 'Have you ever committed a crime for which you were NOT arrested?' },
  { key: 'arrested', text: 'Have you ever been arrested, cited, or detained by any law enforcement officer for any reason?' },
  { key: 'convicted', text: 'Have you ever been convicted of a crime?' },
  { key: 'probation', text: 'Have you ever received a suspended sentence, been placed on probation, or been paroled?' },
  { key: 'jail', text: 'Have you ever been in jail or prison?' },
  { key: 'prostitution', text: 'Have you ever engaged in prostitution or received proceeds from prostitution?' },
  { key: 'drugs', text: 'Have you ever sold, distributed, or smuggled controlled substances or illegal drugs?' },
  { key: 'polygamy', text: 'Have you ever been married to more than one person at the same time?' },
  { key: 'illegal_entry', text: 'Have you ever helped anyone enter the United States illegally?' },
  { key: 'illegal_gambling', text: 'Have you ever gambled illegally or received income from illegal gambling?' },
  { key: 'failed_support', text: 'Have you ever failed to support your dependents or pay court-ordered alimony?' },
  { key: 'false_info', text: 'Have you ever given false or misleading information to a U.S. government official?' },
  { key: 'removal', text: 'Are you currently in removal, exclusion, rescission, or deportation proceedings?' },
  { key: 'deported', text: 'Have you ever been removed or deported from the United States?' },
  { key: 'military_service', text: 'Have you ever served in the U.S. Armed Forces?' },
  { key: 'deserted', text: 'Have you ever deserted from the U.S. Armed Forces?' },
  { key: 'draft_exempt', text: 'Have you ever applied for any exemption from military service in the U.S. Armed Forces?' },
  { key: 'title_nobility', text: 'Do you now have, or did you ever have, a hereditary title or order of nobility in any foreign country?' },
  { key: 'affiliations', text: 'Have you ever been affiliated with any organization, party, club, or similar group in the U.S. or any other country?' },
]

export default function Step8Background({ data, onNext, onBack }) {
  const [answers, setAnswers] = useState(data.answers || {})
  const [details, setDetails] = useState(data.details || {})

  const setAnswer = (key, val) => setAnswers(p => ({ ...p, [key]: val }))
  const setDetail = (key, val) => setDetails(p => ({ ...p, [key]: val }))

  const yesCount = Object.values(answers).filter(v => v === 'Yes').length
  const allAnswered = QUESTIONS.every(q => answers[q.key])

  return (
    <div>
      <div style={card}>
        <h2 style={sectionTitle}>Background Questions</h2>
        <p style={sectionDesc}>
          Answer all questions honestly. These questions mirror the official N-400 form.
          If you answer <strong>"Yes"</strong> to any question, a text field will appear for additional details.
          Answering "Yes" does not automatically disqualify you — your attorney will review each situation.
        </p>
        {yesCount > 0 && (
          <div style={{ background: '#fdf8ee', border: '1px solid #f0d080', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#7a5800', marginBottom: '0.5rem' }}>
            You have answered "Yes" to {yesCount} question{yesCount > 1 ? 's' : ''}. Your attorney will review these responses.
          </div>
        )}
      </div>

      {QUESTIONS.map((q, i) => (
        <div key={q.key} style={{ ...card, padding: '1.25rem 1.5rem' }}>
          <p style={{ fontSize: '0.92rem', color: '#1e293b', marginBottom: '0.85rem', lineHeight: 1.6, fontWeight: 400 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginRight: '0.5rem' }}>{i + 1}.</span>
            {q.text}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['Yes', 'No'].map(opt => (
              <button key={opt} type="button" onClick={() => setAnswer(q.key, opt)} style={{
                padding: '0.5rem 1.5rem', borderRadius: 7, border: '1.5px solid',
                borderColor: answers[q.key] === opt
                  ? (opt === 'Yes' ? '#dc2626' : '#16a34a')
                  : '#e2e8f0',
                background: answers[q.key] === opt
                  ? (opt === 'Yes' ? '#fef2f2' : '#f0fdf4')
                  : '#f8fafc',
                color: answers[q.key] === opt
                  ? (opt === 'Yes' ? '#dc2626' : '#16a34a')
                  : '#475569',
                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s',
              }}>{opt}</button>
            ))}
          </div>
          {answers[q.key] === 'Yes' && (
            <div style={{ marginTop: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Please provide details
              </label>
              <textarea
                value={details[q.key] || ''}
                onChange={e => setDetail(q.key, e.target.value)}
                placeholder="Describe the circumstances, dates, locations, and outcome…"
                rows={3}
                style={{
                  display: 'block', width: '100%', padding: '0.7rem 0.9rem',
                  border: '1.5px solid #fca5a5', borderRadius: 7, fontSize: '0.9rem',
                  color: '#0f172a', background: '#fff', resize: 'vertical', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
            </div>
          )}
        </div>
      ))}

      {!allAnswered && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#1d4ed8', marginBottom: '1rem' }}>
          Please answer all questions before continuing.
        </div>
      )}

      <div style={btnRow}>
        <button style={btnSecondary} onClick={onBack}>← Back</button>
        <button
          style={{ ...btnPrimary, opacity: allAnswered ? 1 : 0.5 }}
          disabled={!allAnswered}
          onClick={() => onNext({ answers, details })}
        >
          Save &amp; Continue →
        </button>
      </div>
    </div>
  )
}
