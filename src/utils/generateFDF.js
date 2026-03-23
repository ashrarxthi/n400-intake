// Maps client intake data to official N-400 PDF field names
// Uses FDF format which pdftk can inject into the PDF

export function generateN400FDF(submission) {
  const p = submission.section_personal || {}
  const c = submission.section_contact || {}
  const ph = submission.section_physical || {}
  const m = submission.section_marital || {}
  const ch = submission.section_children || {}
  const em = submission.section_employment || {}
  const tr = submission.section_travel || {}
  const bg = submission.section_background || {}

  const answers = bg.answers || {}

  // Helper to map yes/no answers
  const yn = (val) => val === 'Yes' ? 'Y' : val === 'No' ? 'N' : ''

  // Weight split into individual digits
  const weight = String(ph.weight || '').padStart(3, ' ')
  const weightD1 = weight[0]?.trim() || ''
  const weightD2 = weight[1]?.trim() || ''
  const weightD3 = weight[2]?.trim() || ''

  // Hair color mapping
  const hairMap = {
    'Black': 'BLK', 'Brown': 'BRO', 'Blonde': 'BLN', 'Gray': 'GRY',
    'Red': 'RED', 'Sandy': 'SDY', 'White': 'WHI', 'Bald': 'BAL', 'Other': 'XXX'
  }
  // Eye color mapping  
  const eyeMap = {
    'Brown': 'BRO', 'Blue': 'BLU', 'Green': 'GRN', 'Hazel': 'HAZ',
    'Gray': 'GRY', 'Black': 'BLK', 'Pink': 'PNK', 'Maroon': 'MAR', 'Other': 'XXX'
  }

  // Marital status mapping
  const maritalMap = {
    'Single, Never Married': 'S', 'Married': 'M', 'Divorced': 'D',
    'Widowed': 'W', 'Separated': 'E', 'Marriage Annulled': 'A'
  }

  // Employment entries
  const jobs = em.entries || []
  const trips = tr.trips || []
  const children = ch.children || []

  const fields = {
    // Part 1 - A-Number (appears on every page header)
    'form1[0].#subform[0].#area[0].Line1_AlienNumber[0]': p.a_number || '',
    'form1[0].#subform[1].#area[1].Line1_AlienNumber[1]': p.a_number || '',
    'form1[0].#subform[2].#area[2].Line1_AlienNumber[2]': p.a_number || '',
    'form1[0].#subform[3].#area[3].Line1_AlienNumber[3]': p.a_number || '',
    'form1[0].#subform[4].#area[4].Line1_AlienNumber[4]': p.a_number || '',
    'form1[0].#subform[5].#area[6].Line1_AlienNumber[5]': p.a_number || '',
    'form1[0].#subform[6].#area[7].Line1_AlienNumber[6]': p.a_number || '',
    'form1[0].#subform[7].#area[8].Line1_AlienNumber[7]': p.a_number || '',
    'form1[0].#subform[8].#area[9].Line1_AlienNumber[8]': p.a_number || '',
    'form1[0].#subform[9].#area[10].Line1_AlienNumber[9]': p.a_number || '',
    'form1[0].#subform[10].#area[11].Line1_AlienNumber[10]': p.a_number || '',
    'form1[0].#subform[11].#area[12].Line1_AlienNumber[11]': p.a_number || '',
    'form1[0].#subform[12].#area[13].Line1_AlienNumber[12]': p.a_number || '',
    'form1[0].#subform[13].#area[14].Line1_AlienNumber[13]': p.a_number || '',

    // Part 1 - Eligibility (default to General Provision A)
    'form1[0].#subform[0].Part1_Eligibility[2]': 'A',

    // Part 2 - Current Legal Name
    'form1[0].#subform[0].P2_Line1_FamilyName[0]': p.last_name || '',
    'form1[0].#subform[0].P2_Line1_GivenName[0]': p.first_name || '',
    'form1[0].#subform[0].P2_Line1_MiddleName[0]': p.middle_name || '',

    // Part 2 - Other names (maiden name)
    'form1[0].#subform[0].Line2_FamilyName1[0]': p.maiden_name || '',
    'form1[0].#subform[0].Line3_GivenName1[0]': '',
    'form1[0].#subform[0].Line3_MiddleName1[0]': '',

    // Part 2 - Name change
    'form1[0].#subform[1].P2_Line34_NameChange[0]': p.name_change === 'Yes' ? '' : 'N',
    'form1[0].#subform[1].P2_Line34_NameChange[1]': p.name_change === 'Yes' ? 'Y' : '',
    'form1[0].#subform[1].Part2Line3_FamilyName[0]': p.name_change === 'Yes' ? (p.new_name || '').split(' ').slice(-1)[0] : '',
    'form1[0].#subform[1].Part2Line4a_GivenName[0]': p.name_change === 'Yes' ? (p.new_name || '').split(' ')[0] : '',

    // Part 2 - Personal details
    'form1[0].#subform[1].P2_Line8_DateOfBirth[0]': ph.dob || '',
    'form1[0].#subform[1].P2_Line9_DateBecamePermanentResident[0]': p.date_permanent_resident || '',
    'form1[0].#subform[1].P2_Line10_CountryOfBirth[0]': ph.country_of_birth || '',
    'form1[0].#subform[1].P2_Line11_CountryOfNationality[0]': ph.country_of_citizenship || '',
    'form1[0].#subform[1].Line12b_SSN[0]': (ph.ssn || '').replace(/\D/g, ''),

    // Part 2 - Gender
    'form1[0].#subform[1].P2_Line7_Gender[0]': ph.gender === 'Male' ? 'M' : '',
    'form1[0].#subform[1].P2_Line7_Gender[1]': ph.gender === 'Female' ? 'F' : '',

    // Part 2 - Parent citizen
    'form1[0].#subform[1].P2_Line10_claimdisability[0]': 'N',
    'form1[0].#subform[1].P2_Line11_claimdisability[0]': 'N',

    // Part 2 - SSA update
    'form1[0].#subform[1].Line12a_Checkbox[0]': 'N',

    // Part 3 - Biographic info
    'form1[0].#subform[2].P7_Line1_Ethnicity[0]': ph.ethnicity === 'Not Hispanic or Latino' ? 'N' : '',
    'form1[0].#subform[2].P7_Line1_Ethnicity[1]': ph.ethnicity === 'Hispanic or Latino' ? 'Y' : '',

    // Race checkboxes
    'form1[0].#subform[2].P7_Line2_Race[0]': (ph.race || []).includes('American Indian or Alaska Native') ? 'I' : '',
    'form1[0].#subform[2].P7_Line2_Race[1]': (ph.race || []).includes('Asian') ? 'A' : '',
    'form1[0].#subform[2].P7_Line2_Race[2]': (ph.race || []).includes('Black or African American') ? 'B' : '',
    'form1[0].#subform[2].P7_Line2_Race[3]': (ph.race || []).includes('Native Hawaiian or Other Pacific Islander') ? 'A' : '',
    'form1[0].#subform[2].P7_Line2_Race[4]': (ph.race || []).includes('White') ? 'W' : '',

    // Height (dropdown values)
    'form1[0].#subform[2].P7_Line3_HeightFeet[0]': ph.height_ft ? String(ph.height_ft) : '',
    'form1[0].#subform[2].P7_Line3_HeightInches[0]': ph.height_in ? String(ph.height_in) : '',

    // Weight (3 separate single-digit fields)
    'form1[0].#subform[2].P7_Line4_Pounds1[0]': weightD1,
    'form1[0].#subform[2].P7_Line4_Pounds2[0]': weightD2,
    'form1[0].#subform[2].P7_Line4_Pounds3[0]': weightD3,

    // Eye color
    'form1[0].#subform[2].P7_Line5_Eye[0]': eyeMap[ph.eye_color] === 'BRO' ? 'BRO' : '',
    'form1[0].#subform[2].P7_Line5_Eye[1]': eyeMap[ph.eye_color] === 'BLU' ? 'BLU' : '',
    'form1[0].#subform[2].P7_Line5_Eye[2]': eyeMap[ph.eye_color] === 'GRN' ? 'GRN' : '',
    'form1[0].#subform[2].P7_Line5_Eye[3]': eyeMap[ph.eye_color] === 'HAZ' ? 'HAZ' : '',
    'form1[0].#subform[2].P7_Line5_Eye[4]': eyeMap[ph.eye_color] === 'GRY' ? 'GRY' : '',
    'form1[0].#subform[2].P7_Line5_Eye[5]': eyeMap[ph.eye_color] === 'BLK' ? 'BLK' : '',

    // Hair color
    'form1[0].#subform[2].P7_Line6_Hair[7]': hairMap[ph.hair_color] === 'BLK' ? 'BLK' : '',
    'form1[0].#subform[2].P7_Line6_Hair[6]': hairMap[ph.hair_color] === 'BRO' ? 'BRO' : '',
    'form1[0].#subform[2].P7_Line6_Hair[5]': hairMap[ph.hair_color] === 'BLN' ? 'BLN' : '',
    'form1[0].#subform[2].P7_Line6_Hair[4]': hairMap[ph.hair_color] === 'GRY' ? 'GRY' : '',
    'form1[0].#subform[2].P7_Line6_Hair[3]': hairMap[ph.hair_color] === 'WHI' ? 'WHI' : '',
    'form1[0].#subform[2].P7_Line6_Hair[2]': hairMap[ph.hair_color] === 'RED' ? 'RED' : '',
    'form1[0].#subform[2].P7_Line6_Hair[1]': hairMap[ph.hair_color] === 'SDY' ? 'SDY' : '',
    'form1[0].#subform[2].P7_Line6_Hair[0]': hairMap[ph.hair_color] === 'BAL' ? 'BAL' : '',

    // Part 3 - Residence (current address)
    'form1[0].#subform[2].P4_Line3_PhysicalAddress1[0]': p.address || '',
    'form1[0].#subform[2].P4_Line3_CityTown1[0]': p.city || '',
    'form1[0].#subform[2].P4_Line3_State1[0]': p.state || '',
    'form1[0].#subform[2].P4_Line3_ZipCode1[0]': p.zip || '',
    'form1[0].#subform[2].P4_Line3_Country1[0]': 'USA',
    'form1[0].#subform[2].P4_Line3_From1[0]': p.date_permanent_resident || '',
    'form1[0].#subform[2].Pt3_Line2a_Checkbox[1]': 'Y', // mailing = physical

    // Part 5 - Marital history
    'form1[0].#subform[3].P10_Line1_MaritalStatus[0]': maritalMap[m.marital_status] === 'D' ? 'D' : '',
    'form1[0].#subform[3].P10_Line1_MaritalStatus[1]': maritalMap[m.marital_status] === 'S' ? 'S' : '',
    'form1[0].#subform[3].P10_Line1_MaritalStatus[2]': maritalMap[m.marital_status] === 'W' ? 'W' : '',
    'form1[0].#subform[3].P10_Line1_MaritalStatus[3]': maritalMap[m.marital_status] === 'M' ? 'M' : '',
    'form1[0].#subform[3].P10_Line1_MaritalStatus[4]': maritalMap[m.marital_status] === 'A' ? 'A' : '',
    'form1[0].#subform[3].P10_Line1_MaritalStatus[5]': maritalMap[m.marital_status] === 'E' ? 'E' : '',
    'form1[0].#subform[3].Part9Line3_TimesMarried[0]': m.times_married || '',

    // Current spouse
    'form1[0].#subform[3].P10_Line4a_FamilyName[0]': m.spouse_last || '',
    'form1[0].#subform[3].P10_Line4a_GivenName[0]': m.spouse_first || '',
    'form1[0].#subform[3].P10_Line4a_MiddleName[0]': m.spouse_middle || '',
    'form1[0].#subform[3].P10_Line4d_DateofBirth[0]': m.spouse_dob || '',
    'form1[0].#subform[3].P10_Line4e_DateEnterMarriage[0]': m.date_of_marriage || '',
    'form1[0].#subform[4].TextField1[0]': m.spouse_employer || '',
    'form1[0].#subform[4].#area[5].P7_Line6_ANumber[0]': (m.spouse_a_number || '').replace(/\D/g, ''),

    // Spouse same address
    'form1[0].#subform[3].P10_Line5_Citizen[1]': 'Y',

    // Part 6 - Children count
    'form1[0].#subform[4].P11_Line1_TotalChildren[0]': ch.total_children || '0',

    // Children (up to 3)
    'form1[0].#subform[4].P7_EmployerName1[0]': children[0]?.full_name || '',
    'form1[0].#subform[4].P7_From1[0]': children[0]?.dob || '',
    'form1[0].#subform[4].P7_OccupationFieldStudy1[0]': children[0] ? 'Resides with me' : '',
    'form1[0].#subform[4].P7_OccupationFieldStudy1[1]': children[0] ? 'Biological son or daughter' : '',

    'form1[0].#subform[4].P7_EmployerName2[0]': children[1]?.full_name || '',
    'form1[0].#subform[4].P7_From2[0]': children[1]?.dob || '',
    'form1[0].#subform[4].P7_OccupationFieldStudy2[0]': children[1] ? 'Resides with me' : '',
    'form1[0].#subform[4].P7_OccupationFieldStudy2[1]': children[1] ? 'Biological son or daughter' : '',

    'form1[0].#subform[4].P7_EmployerName3[0]': children[2]?.full_name || '',
    'form1[0].#subform[4].P7_From3[0]': children[2]?.dob || '',
    'form1[0].#subform[4].P7_OccupationFieldStudy3[0]': children[2] ? 'Resides with me' : '',
    'form1[0].#subform[4].P7_OccupationFieldStudy3[1]': children[2] ? 'Biological son or daughter' : '',

    // Part 7 - Employment (up to 3 entries)
    'form1[0].#subform[4].P5_EmployerName1[0]': jobs[0]?.employer_name || '',
    'form1[0].#subform[4].P7_City1[0]': jobs[0]?.city || '',
    'form1[0].#subform[4].P7_State1[0]': jobs[0]?.state || '',
    'form1[0].#subform[4].P7_Country1[0]': jobs[0]?.country || '',
    'form1[0].#subform[4].P7_From1[1]': jobs[0]?.from || '',
    'form1[0].#subform[4].P7_OccupationFieldStudy1[2]': jobs[0]?.occupation || '',

    'form1[0].#subform[4].P5_EmployerName2[0]': jobs[1]?.employer_name || '',
    'form1[0].#subform[4].P7_City2[0]': jobs[1]?.city || '',
    'form1[0].#subform[4].P7_State2[0]': jobs[1]?.state || '',
    'form1[0].#subform[4].P7_Country2[0]': jobs[1]?.country || '',
    'form1[0].#subform[4].P7_From2[1]': jobs[1]?.from || '',
    'form1[0].#subform[4].P7_To2[0]': jobs[1]?.current ? 'PRESENT' : (jobs[1]?.to || ''),
    'form1[0].#subform[4].P7_OccupationFieldStudy2[2]': jobs[1]?.occupation || '',

    'form1[0].#subform[4].P5_EmployerName3[0]': jobs[2]?.employer_name || '',
    'form1[0].#subform[4].P7_City3[0]': jobs[2]?.city || '',
    'form1[0].#subform[4].P7_State3[0]': jobs[2]?.state || '',
    'form1[0].#subform[4].P7_Country3[0]': jobs[2]?.country || '',
    'form1[0].#subform[4].P7_From3[1]': jobs[2]?.from || '',
    'form1[0].#subform[4].P7_To3[0]': jobs[2]?.current ? 'PRESENT' : (jobs[2]?.to || ''),
    'form1[0].#subform[4].P7_OccupationFieldStudy3[2]': jobs[2]?.occupation || '',

    // Part 8 - Travel (up to 6 trips)
    'form1[0].#subform[5].P9_Line1_Countries1[0]': trips[0]?.countries || '',
    'form1[0].#subform[5].P8_Line1_DateLeft1[0]': trips[0]?.date_left || '',
    'form1[0].#subform[5].P8_Line1_DateReturn1[0]': trips[0]?.date_returned || '',

    'form1[0].#subform[5].P8_Line1_Countries2[0]': trips[1]?.countries || '',
    'form1[0].#subform[5].P8_Line1_DateLeft2[0]': trips[1]?.date_left || '',
    'form1[0].#subform[5].P8_Line1_DateReturn2[0]': trips[1]?.date_returned || '',

    'form1[0].#subform[5].P8_Line1_Countries3[0]': trips[2]?.countries || '',
    'form1[0].#subform[5].P8_Line1_DateLeft3[0]': trips[2]?.date_left || '',
    'form1[0].#subform[5].P8_Line1_DateReturn3[0]': trips[2]?.date_returned || '',

    'form1[0].#subform[5].P8_Line1_Countries4[0]': trips[3]?.countries || '',
    'form1[0].#subform[5].P8_Line1_DateLeft4[0]': trips[3]?.date_left || '',
    'form1[0].#subform[5].P8_Line1_DateReturn4[0]': trips[3]?.date_returned || '',

    'form1[0].#subform[5].P8_Line1_Countries5[0]': trips[4]?.countries || '',
    'form1[0].#subform[5].P8_Line1_DateLeft5[0]': trips[4]?.date_left || '',
    'form1[0].#subform[5].P8_Line1_DateReturn5[0]': trips[4]?.date_returned || '',

    'form1[0].#subform[5].P8_Line1_Countries6[0]': trips[5]?.countries || '',
    'form1[0].#subform[5].P8_Line1_DateLeft6[0]': trips[5]?.date_left || '',
    'form1[0].#subform[5].P8_Line1_DateReturn6[0]': trips[5]?.date_returned || '',

    // Part 9 - Background questions
    'form1[0].#subform[5].P9_Line1[0]': answers.claimed_citizen === 'Yes' ? '' : 'N',
    'form1[0].#subform[5].P9_Line1[1]': yn(answers.claimed_citizen) === 'Y' ? 'Y' : '',
    'form1[0].#subform[5].P9_Line2[0]': answers.registered_voted === 'Yes' ? '' : 'N',
    'form1[0].#subform[5].P9_Line2[1]': yn(answers.registered_voted) === 'Y' ? 'Y' : '',
    'form1[0].#subform[5].P9_Line3[1]': answers.overdue_taxes === 'Yes' ? '' : 'N',
    'form1[0].#subform[5].P9_Line3[0]': yn(answers.overdue_taxes) === 'Y' ? 'Y' : '',
    'form1[0].#subform[5].P9_Line4[1]': answers.nonresident_alien === 'Yes' ? '' : 'N',
    'form1[0].#subform[5].P9_Line4[0]': yn(answers.nonresident_alien) === 'Y' ? 'Y' : '',
    'form1[0].#subform[5].P9_5a[1]': answers.communist === 'Yes' ? '' : 'N',
    'form1[0].#subform[5].P9_5a[0]': yn(answers.communist) === 'Y' ? 'Y' : '',
    'form1[0].#subform[5].P9_5b[1]': answers.overthrow_govt === 'Yes' ? '' : 'N',
    'form1[0].#subform[5].P9_5b[0]': yn(answers.overthrow_govt) === 'Y' ? 'Y' : '',

    // More background
    'form1[0].#subform[6].P9_Line7a[0]': 'N',
    'form1[0].#subform[6].P9_Line7\.b\.[0]': 'N',
    'form1[0].#subform[6].P9_Line7\.c[0]': 'N',
    'form1[0].#subform[6].P11_7d[0]': 'N',
    'form1[0].#subform[6].P9_Line7\.e[0]': 'N',
    'form1[0].#subform[6].P9_Line7\.f[0]': 'N',
    'form1[0].#subform[6].P9_Line7\.g[0]': 'N',
    'form1[0].#subform[6].P9_Line8a[0]': 'N',
    'form1[0].#subform[6].P9_Line8b[0]': 'N',
    'form1[0].#subform[6].P9_Line9[0]': 'N',
    'form1[0].#subform[6].P9_Line10a[0]': 'N',
    'form1[0].#subform[6].P9_Line11[0]': 'N',
    'form1[0].#subform[6].P9_Line12[0]': 'N',
    'form1[0].#subform[6].P9_Line13[0]': 'N',
    'form1[0].#subform[6].P9_Line14[0]': 'N',
    'form1[0].#subform[6].P12_6a[0]': 'N',
    'form1[0].#subform[6].P12_6b[1]': 'N',
    'form1[0].#subform[6].P12_6c[0]': 'N',

    // Crimes
    'form1[0].#subform[7].P9_Line15a[0]': answers.committed_crime === 'Yes' ? '' : 'N',
    'form1[0].#subform[7].P9_Line15a[1]': yn(answers.committed_crime) === 'Y' ? 'Y' : '',
    'form1[0].#subform[7].P9_Line15b[0]': answers.arrested === 'Yes' ? '' : 'N',
    'form1[0].#subform[7].P9_Line15b[1]': yn(answers.arrested) === 'Y' ? 'Y' : '',
    'form1[0].#subform[7].P12_Line16[0]': 'N',

    // More background
    'form1[0].#subform[8].P11_Line17A[0]': answers.prostitution === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P11_Line17B[0]': answers.drugs === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P11_Line17C[0]': answers.polygamy === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line17d[0]': 'N',
    'form1[0].#subform[8].P12_Line17e[0]': answers.illegal_entry === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line17f[1]': answers.illegal_gambling === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line17g[0]': answers.failed_support === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line17h[0]': 'N',
    'form1[0].#subform[8].P12_Line18[1]': answers.false_info === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line19[1]': 'N',
    'form1[0].#subform[8].P12_Line20[0]': answers.removal === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line21[0]': answers.deported === 'Yes' ? '' : 'N',

    // Selective service
    'form1[0].#subform[8].P9_Line22a[0]': 'N',

    // Military
    'form1[0].#subform[8].P12_Line23[0]': answers.draft_exempt === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line24[0]': answers.draft_exempt === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line25[0]': answers.military_service === 'Yes' ? '' : 'N',
    'form1[0].#subform[8].P12_Line25[1]': yn(answers.military_service) === 'Y' ? 'Y' : '',

    // Oath questions (all default yes)
    'form1[0].#subform[9].P12_Line26a[0]': 'N',
    'form1[0].#subform[9].P12_Line27[1]': 'N',
    'form1[0].#subform[9].P12_Line28[1]': 'N',
    'form1[0].#subform[9].P9_Line29[0]': 'N',
    'form1[0].#subform[9].P12_Line30a[1]': 'N',
    'form1[0].#subform[9].P12_Line31[1]': 'Y',
    'form1[0].#subform[9].P12_Line32[0]': 'Y',
    'form1[0].#subform[9].P12_Line33[1]': 'N',
    'form1[0].#subform[9].P12_Line34[1]': 'Y',
    'form1[0].#subform[9].P12_Line35[0]': 'Y',
    'form1[0].#subform[9].P12_Line36[1]': 'Y',
    'form1[0].#subform[9].P12_Line37[0]': 'Y',

    // Part 11 - Contact info
    'form1[0].#subform[10].P12_Line3_Telephone[0]': (c.day_phone || '').replace(/\D/g, '').slice(0, 10),
    'form1[0].#subform[10].P12_Line3_Mobile[0]': (c.cell_phone || '').replace(/\D/g, '').slice(0, 10),
    'form1[0].#subform[10].P12_Line5_Email[0]': c.email || '',

    // Part 13 - Preparer (attorney info)
    'form1[0].#subform[11].P15_Line1_PreparerFamilyName[0]': 'LegalQuest',
    'form1[0].#subform[11].P15_Line1_PreparerGivenName[0]': 'Network PC',
    'form1[0].#subform[11].P15_Line2_NameofBusinessorOrgName[0]': 'LegalQuest Network, P.C.',
    'form1[0].#subform[11].P15_Line4_Telephone[0]': '2486630633',
  }

  return buildFDF(fields)
}

function buildFDF(fields) {
  const fieldEntries = Object.entries(fields)
    .map(([name, value]) => {
      // Escape special characters for FDF
      const escapedValue = String(value)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
      return `<< /T (${name}) /V (${escapedValue}) >>`
    })
    .join('\n')

  return `%FDF-1.2
1 0 obj
<<
/FDF
<<
/Fields [
${fieldEntries}
]
>>
>>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`
}

export function downloadFDF(submission, clientName) {
  const fdf = generateN400FDF(submission)
  const blob = new Blob([fdf], { type: 'application/vnd.fdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${clientName.replace(/\s+/g, '_')}_N400.fdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
