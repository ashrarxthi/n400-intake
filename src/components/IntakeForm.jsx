import { useState, useCallback } from 'react'
import { supabase } from '../supabase.js'
import Step1Personal from './steps/Step1Personal.jsx'
import Step2Contact from './steps/Step2Contact.jsx'
import Step3Physical from './steps/Step3Physical.jsx'
import Step4Marital from './steps/Step4Marital.jsx'
import Step5Children from './steps/Step5Children.jsx'
import Step6Employment from './steps/Step6Employment.jsx'
import Step7Travel from './steps/Step7Travel.jsx'
import Step8Background from './steps/Step8Background.jsx'
import StepReview from './steps/StepReview.jsx'

const STEPS = [
  { label: 'Personal Info', component: Step1Personal, field: 'section_personal' },
  { label: 'Contact', component: Step2Contact, field: 'section_contact' },
  { label: 'Physical', component: Step3Physical, field: 'section_physical' },
  { label: 'Marital History', component: Step4Marital, field: 'section_marital' },
  { label: 'Children', component: Step5Children, field: 'section_children' },
  { label: 'Employment', component: Step6Employment, field: 'section_employment' },
  { label: 'Travel', component: Step7Travel, field: 'section_travel' },
  { label: 'Background', component: Step8Background, field: 'section_background' },
  { label: 'Review', component: StepReview, field: null },
]

export default function IntakeForm({ session, onExit }) {
  const { submission, email } = session
  const [currentStep, setCurrentStep] = useState((submission.current_step || 1) - 1)
  const [formData, setFormData] = useState({
    section_personal: submission.section_personal || {},
    section_contact: submission.section_contact || {},
    section_physical: submission.section_physical || {},
    section_marital: submission.section_marital || {},
    section_children: submission.section_children || {},
    section_employment: submission.section_employment || {},
    section_travel: submission.section_travel || {},
    section_background: submission.section_background || {},
  })
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(submission.status === 'submitted')

  const saveSection = useCallback(async (field, data) => {
    setSaving(true)
    const update = { [field]: data, current_step: currentStep + 1, updated_at: new Date().toISOString() }
    await supabase
      .from('intake_submissions')
      .update(update)
      .eq('access_code', submission.access_code)
      .eq('client_email', email)
    setSaving(false)
  }, [currentStep, submission.access_code, email])

  const handleNext = async (field, data) => {
    const updated = { ...formData, [field]: data }
    setFormData(updated)
    if (field) await saveSection(field, data)
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setCurrentStep(s => Math.max(s - 1, 0))
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    await supabase
      .from('intake_submissions')
      .update({ status: 'submitted', updated_at: new Date().toISOString() })
      .eq('access_code', submission.access_code)
      .eq('client_email', email)
    setSubmitted(true)
  }

  if (submitted) {
    return <SubmittedScreen clientEmail={email} />
  }

  const StepComponent = STEPS[currentStep].component
  const totalSteps = STEPS.length
  const pct = Math.round(((currentStep) / (totalSteps - 1)) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: '#0f2044',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>
          LegalQuest Network
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {saving && <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Saving…</span>}
          {!saving && currentStep > 0 && <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Progress saved</span>}
          <button onClick={onExit} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: 6, padding: '0.35rem 0.85rem', fontSize: '0.8rem', cursor: 'pointer' }}>
            Exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#e2e8f0' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#b8963e', transition: 'width 0.4s ease' }} />
      </div>

      {/* Step tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', maxWidth: 900, margin: '0 auto', padding: '0 1rem' }}>
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => i < currentStep && setCurrentStep(i)}
              style={{
                padding: '0.85rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: i === currentStep ? 600 : 400,
                color: i === currentStep ? '#0f2044' : i < currentStep ? '#b8963e' : '#94a3b8',
                background: 'none',
                border: 'none',
                borderBottom: i === currentStep ? '2px solid #0f2044' : '2px solid transparent',
                cursor: i < currentStep ? 'pointer' : 'default',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {i < currentStep ? '✓ ' : ''}{step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Step {currentStep + 1} of {totalSteps}
        </div>
        <StepComponent
          data={formData[STEPS[currentStep].field] || {}}
          allData={formData}
          onNext={(data) => handleNext(STEPS[currentStep].field, data)}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isFirst={currentStep === 0}
          isLast={currentStep === STEPS.length - 1}
        />
      </div>
    </div>
  )
}

function SubmittedScreen({ clientEmail }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f2044 0%, #1a3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '3rem 2.5rem', maxWidth: 500, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#0f2044', marginBottom: '0.75rem' }}>Form Submitted</h2>
        <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Your intake information has been submitted to LegalQuest Network. Your attorney will review your responses and may reach out to{' '}
          <strong>{clientEmail}</strong> if any additional information is needed.
        </p>
        <div style={{ background: '#fdf8ee', border: '1px solid #f0d080', borderRadius: 8, padding: '1rem', fontSize: '0.875rem', color: '#7a5800' }}>
          <strong>What happens next?</strong><br />
          Your attorney will review your completed intake and begin preparing your N-400 application. You will be contacted when it is ready for your review.
        </div>
      </div>
    </div>
  )
}
