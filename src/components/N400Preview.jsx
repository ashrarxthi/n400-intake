export default function N400Preview({ submission, onClose }) {
  const p = submission.section_personal || {}
  const c = submission.section_contact || {}
  const ph = submission.section_physical || {}
  const m = submission.section_marital || {}
  const ch = submission.section_children || {}
  const em = submission.section_employment || {}
  const tr = submission.section_travel || {}
  const bg = submission.section_background || {}
  const answers = bg.answers || {}
  const details = bg.details || {}

  const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Client'

  const s = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, overflowY: 'auto', padding: '2rem 1rem' },
    modal: { background: '#fff', borderRadius: 12, maxWidth: 860, margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    header: { background: '#0f2044', padding: '1.25rem 2rem', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '1.1rem', fontWeight: 600 },
    body: { padding: '2rem' },
    part: { marginBottom: '2rem', pageBreakInside: 'avoid' },
    partTitle: { background: '#0f2044', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, borderRadius: 6, marginBottom: '1rem', letterSpacing: '0.03em' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.5rem' },
    field: { border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.5rem 0.75rem', background: '#f8fafc' },
    fieldLabel: { fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' },
    fieldValue: { fontSize: '0.9rem', color: '#0f172a', fontWeight: 500, minHeight: 20 },
    empty: { color: '#cbd5e1', fontStyle: 'italic', fontWeight: 400 },
    divider: { borderTop: '1px solid #e2e8f0', margin: '1rem 0' },
    yesFlag: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '0.5rem 0.75rem', marginBottom: '0.5rem' },
    noRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' },
  }

  const Field = ({ label, value, span }) => (
    <div style={{ ...s.field, gridColumn: span ? `span ${span}` : undefined }}>
      <div style={s.fieldLabel}>{label}</div>
      <div style={{ ...s.fieldValue, ...((!value || value === '') ? s.empty : {}) }}>
        {value || 'Not provided'}
      </div>
    </div>
  )

  const jobs = em.entries || []
  const trips = tr.trips || []
  const children = ch.children || []

  const yesAnswers = Object.entries(answers).filter(([, v]) => v === 'Yes')
  const noAnswers = Object.entries(answers).filter(([, v]) => v === 'No')

  const questionLabels = {
    claimed_citizen: 'Claimed to be a U.S. citizen',
    registered_voted: 'Registered to vote or voted in a U.S. election',
    overdue_taxes: 'Owes overdue Federal, state, or local taxes',
    nonresident_alien: 'Called themselves a "nonresident alien" on a tax return',
    communist: 'Member of Communist or totalitarian party',
    overthrow_govt: 'Advocated overthrow of any government by force',
    persecuted: 'Persecuted anyone based on race, religion, or national origin',
    nazi: 'Associated with the Nazi government (1933-1945)',
    terrorist: 'Member of a terrorist organization',
    committed_crime: 'Committed a crime for which they were NOT arrested',
    arrested: 'Ever been arrested, cited, or detained by law enforcement',
    convicted: 'Ever been convicted of a crime',
    probation: 'Received suspended sentence, probation, or parole',
    jail: 'Ever been in jail or prison',
    prostitution: 'Engaged in prostitution or received proceeds from prostitution',
    drugs: 'Sold, distributed, or smuggled controlled substances',
    polygamy: 'Been married to more than one person at the same time',
    illegal_entry: 'Helped anyone enter the United States illegally',
    illegal_gambling: 'Gambled illegally or received income from illegal gambling',
    failed_support: 'Failed to support dependents or pay alimony',
    false_info: 'Given false information to a U.S. government official',
    removal: 'Currently in removal or deportation proceedings',
    deported: 'Ever been removed or deported from the United States',
    military_service: 'Served in the U.S. Armed Forces',
    deserted: 'Deserted from the U.S. Armed Forces',
    draft_exempt: 'Applied for exemption from military service',
    title_nobility: 'Has/had a hereditary title or order of nobility in a foreign country',
    affiliations: 'Affiliated with any organization, party, or club',
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.headerTitle}>N-400 Form Reference — {name}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>Use this as a reference while filling the official form</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => window.print()} style={{ padding: '0.5rem 1.1rem', background: '#b8963e', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              🖨 Print
            </button>
            <button onClick={onClose} style={{ padding: '0.5rem 1.1rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 7, fontSize: '0.85rem', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>

        <div style={s.body}>

          {/* Part 1 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 1 — Eligibility &amp; A-Number</div>
            <div style={s.grid}>
              <Field label="A-Number (9 digits)" value={p.a_number} />
              <Field label="Eligibility Basis" value={p.green_card_method} />
              <Field label="Date Became LPR" value={p.date_permanent_resident} />
            </div>
          </div>

          {/* Part 2 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 2 — Information About You</div>
            <div style={s.grid}>
              <Field label="Family Name (Last Name)" value={p.last_name} />
              <Field label="Given Name (First Name)" value={p.first_name} />
              <Field label="Middle Name" value={p.middle_name} />
            </div>
            <div style={s.grid}>
              <Field label="Other Names / Maiden Name" value={p.maiden_name || p.other_names} />
              <Field label="Name Change?" value={p.name_change} />
              {p.name_change === 'Yes' && <Field label="New Name" value={p.new_name} />}
            </div>
            <div style={s.grid}>
              <Field label="Date of Birth" value={ph.dob} />
              <Field label="Sex" value={ph.gender} />
              <Field label="Social Security Number" value={ph.ssn} />
            </div>
            <div style={s.grid}>
              <Field label="Country of Birth" value={ph.country_of_birth} />
              <Field label="Country of Citizenship / Nationality" value={ph.country_of_citizenship} />
            </div>
          </div>

          {/* Part 3 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 3 — Biographic Information</div>
            <div style={s.grid}>
              <Field label="Ethnicity" value={ph.ethnicity} />
              <Field label="Race" value={Array.isArray(ph.race) ? ph.race.join(', ') : ph.race} />
            </div>
            <div style={s.grid}>
              <Field label="Height" value={ph.height_ft && ph.height_in ? `${ph.height_ft} ft ${ph.height_in} in` : ''} />
              <Field label="Weight (lbs)" value={ph.weight} />
              <Field label="Eye Color" value={ph.eye_color} />
              <Field label="Hair Color" value={ph.hair_color} />
            </div>
          </div>

          {/* Part 4 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 4 — Residence</div>
            <div style={s.grid}>
              <Field label="Street Address" value={p.address} span={2} />
              <Field label="Apt #" value={p.apt} />
            </div>
            <div style={s.grid}>
              <Field label="City" value={p.city} />
              <Field label="State" value={p.state} />
              <Field label="ZIP Code" value={p.zip} />
              <Field label="County" value={p.county} />
            </div>
          </div>

          {/* Part 5 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 5 — Marital History</div>
            <div style={s.grid}>
              <Field label="Marital Status" value={m.marital_status} />
              <Field label="Times Married" value={m.times_married} />
            </div>
            {['Married', 'Separated'].includes(m.marital_status) && (
              <>
                <div style={s.divider} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f2044', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Spouse</div>
                <div style={s.grid}>
                  <Field label="Spouse Last Name" value={m.spouse_last} />
                  <Field label="Spouse First Name" value={m.spouse_first} />
                  <Field label="Spouse Middle Name" value={m.spouse_middle} />
                </div>
                <div style={s.grid}>
                  <Field label="Spouse Date of Birth" value={m.spouse_dob} />
                  <Field label="Date of Marriage" value={m.date_of_marriage} />
                  <Field label="Place of Marriage" value={m.marriage_place} />
                </div>
                <div style={s.grid}>
                  <Field label="Spouse Country of Citizenship" value={m.spouse_citizenship} />
                  <Field label="Spouse U.S. Citizen?" value={m.spouse_us_citizen} />
                  <Field label="Spouse A-Number" value={m.spouse_a_number} />
                </div>
                <div style={s.grid}>
                  <Field label="Spouse Employer" value={m.spouse_employer} />
                </div>
              </>
            )}
            {(m.prior_spouses || []).length > 0 && (
              <>
                <div style={s.divider} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f2044', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prior Marriages</div>
                {m.prior_spouses.map((sp, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 6, padding: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Prior Spouse #{i + 1}</div>
                    <div style={s.grid}>
                      <Field label="Name" value={`${sp.first_name || ''} ${sp.last_name || ''}`.trim()} />
                      <Field label="Date of Marriage" value={sp.date_of_marriage} />
                      <Field label="Marriage Ended" value={sp.date_terminated} />
                      <Field label="How Ended" value={sp.how_ended} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Part 6 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 6 — Children</div>
            <Field label="Total Number of Children" value={ch.total_children || '0'} />
            {children.map((child, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 6, padding: '0.75rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Child #{i + 1}</div>
                <div style={s.grid}>
                  <Field label="Full Name" value={child.full_name} />
                  <Field label="Date of Birth" value={child.dob} />
                  <Field label="Country of Birth" value={child.country_of_birth} />
                  <Field label="Citizenship Status" value={child.citizenship_status} />
                </div>
              </div>
            ))}
            {children.length === 0 && <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No children listed.</div>}
          </div>

          {/* Part 7 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 7 — Employment &amp; Schools (Last 5 Years)</div>
            {jobs.length === 0 && <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No entries listed.</div>}
            {jobs.map((job, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 6, padding: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={s.grid}>
                  <Field label="Employer / School" value={job.employer_name} />
                  <Field label="Occupation / Field" value={job.occupation} />
                </div>
                <div style={s.grid}>
                  <Field label="City" value={job.city} />
                  <Field label="State" value={job.state} />
                  <Field label="Country" value={job.country} />
                  <Field label="From" value={job.from} />
                  <Field label="To" value={job.current ? 'PRESENT' : job.to} />
                </div>
              </div>
            ))}
          </div>

          {/* Part 8 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 8 — Travel Outside the U.S. (Last 5 Years)</div>
            {trips.length === 0 && <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No trips listed.</div>}
            {trips.map((trip, i) => (
              <div key={i} style={{ background: trip.over_180 === 'Yes' ? '#fef2f2' : '#f8fafc', border: `1px solid ${trip.over_180 === 'Yes' ? '#fecaca' : '#e2e8f0'}`, borderRadius: 6, padding: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={s.grid}>
                  <Field label="Countries Visited" value={trip.countries} />
                  <Field label="Date Left U.S." value={trip.date_left} />
                  <Field label="Date Returned" value={trip.date_returned} />
                  <Field label="180+ Days?" value={trip.over_180} />
                </div>
                {trip.over_180 === 'Yes' && <div style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.25rem', fontWeight: 600 }}>⚠️ Discuss continuous residence with client</div>}
              </div>
            ))}
          </div>

          {/* Part 9 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 9 — Background Questions</div>

            {yesAnswers.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚠️ Answered YES ({yesAnswers.length} items — review carefully)
                </div>
                {yesAnswers.map(([key]) => (
                  <div key={key} style={s.yesFlag}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dc2626' }}>{questionLabels[key] || key.replace(/_/g, ' ')}</div>
                    {details[key] && <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '0.25rem', fontStyle: 'italic' }}>{details[key]}</div>}
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Answered NO
            </div>
            {noAnswers.map(([key]) => (
              <div key={key} style={s.noRow}>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem' }}>✓</span>
                <span style={{ color: '#475569' }}>{questionLabels[key] || key.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>

          {/* Part 11 */}
          <div style={s.part}>
            <div style={s.partTitle}>PART 11 — Contact Information</div>
            <div style={s.grid}>
              <Field label="Daytime Phone" value={c.day_phone || c.cell_phone} />
              <Field label="Mobile Phone" value={c.cell_phone} />
              <Field label="Email Address" value={c.email} />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}
