// ══════════════════════════════════════════════════════════════════════
// RASA DIAGNOSTICS OS — Clinical Laboratory Report Engine & Mock Data
// ISO 15189:2012 & NABL Accredited Diagnostic Center Standard
// ══════════════════════════════════════════════════════════════════════

export interface TestParameterResult {
  parameter: string;
  observedValue: string;
  unit: string;
  referenceInterval: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  method: string;
}

export interface ClinicalTestPanel {
  panelName: string;
  department: string;
  specimen: string;
  methodology: string;
  parameters: TestParameterResult[];
  interpretation?: string;
}

export interface FullMedicalReportData {
  reportId: string;
  orderId: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  referringDoctor: string;
  sampleId: string;
  barcode: string;
  collectionTime: string;
  reportingTime: string;
  status: 'Generated' | 'Verified' | 'Delivered' | 'Pending';
  panels: ClinicalTestPanel[];
  pathologist: {
    name: string;
    qualification: string;
    regNumber: string;
    designation: string;
  };
  biochemist?: {
    name: string;
    qualification: string;
    regNumber: string;
    designation: string;
  };
  clinicalNotes?: string;
  deliveryMethod?: string;
}

// ── Standard Clinical Panels Library ──
export const STANDARD_PANELS: Record<string, (outcome: 'normal' | 'abnormal' | 'critical') => ClinicalTestPanel> = {
  // 1. Complete Blood Count (CBC)
  'Complete Blood Count (CBC)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'COMPLETE BLOOD COUNT (CBC) WITH ESR',
      department: 'Clinical Hematology',
      specimen: 'EDTA Whole Blood (Purple Top)',
      methodology: 'Fully Automated 5-Part Differential Hematology Analyzer (Flow Cytometry & Impedance)',
      parameters: [
        {
          parameter: 'Hemoglobin (Hb)',
          observedValue: isCrit ? '6.8' : isAbn ? '9.4' : '14.2',
          unit: 'g/dL',
          referenceInterval: '13.0 - 17.0 (Male) / 12.0 - 15.0 (Female)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'LOW' : 'NORMAL',
          method: 'SLS-Hemoglobin Method',
        },
        {
          parameter: 'Total Leukocyte Count (WBC)',
          observedValue: isCrit ? '22,400' : isAbn ? '13,800' : '7,400',
          unit: '/cumm',
          referenceInterval: '4,000 - 11,000',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Flow Cytometry Laser Scatter',
        },
        {
          parameter: 'RBC Count',
          observedValue: isAbn ? '3.8' : '4.85',
          unit: 'mill/cumm',
          referenceInterval: '4.5 - 5.5',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'Electrical Impedance',
        },
        {
          parameter: 'Packed Cell Volume (PCV / HCT)',
          observedValue: isAbn ? '29.5' : '42.8',
          unit: '%',
          referenceInterval: '40.0 - 50.0',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'Calculated',
        },
        {
          parameter: 'Mean Corpuscular Volume (MCV)',
          observedValue: isAbn ? '74.2' : '88.2',
          unit: 'fL',
          referenceInterval: '80.0 - 96.0',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'Calculated',
        },
        {
          parameter: 'Mean Corpuscular Hemoglobin (MCH)',
          observedValue: isAbn ? '24.1' : '29.4',
          unit: 'pg',
          referenceInterval: '27.0 - 33.0',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'Calculated',
        },
        {
          parameter: 'Mean Corpuscular Hb Conc (MCHC)',
          observedValue: '32.6',
          unit: 'g/dL',
          referenceInterval: '31.0 - 36.0',
          flag: 'NORMAL',
          method: 'Calculated',
        },
        {
          parameter: 'Platelet Count',
          observedValue: isCrit ? '42,000' : isAbn ? '110,000' : '265,000',
          unit: '/cumm',
          referenceInterval: '150,000 - 450,000',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'LOW' : 'NORMAL',
          method: 'Optical Flow Cytometry',
        },
        {
          parameter: 'Neutrophils',
          observedValue: isAbn ? '78' : '62',
          unit: '%',
          referenceInterval: '40 - 70',
          flag: isAbn ? 'HIGH' : 'NORMAL',
          method: '5-Part Differential',
        },
        {
          parameter: 'Lymphocytes',
          observedValue: isAbn ? '16' : '30',
          unit: '%',
          referenceInterval: '20 - 40',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: '5-Part Differential',
        },
        {
          parameter: 'Eosinophils',
          observedValue: '4',
          unit: '%',
          referenceInterval: '1 - 6',
          flag: 'NORMAL',
          method: '5-Part Differential',
        },
        {
          parameter: 'Monocytes',
          observedValue: '5',
          unit: '%',
          referenceInterval: '2 - 8',
          flag: 'NORMAL',
          method: '5-Part Differential',
        },
        {
          parameter: 'Erythrocyte Sedimentation Rate (ESR)',
          observedValue: isAbn ? '38' : '11',
          unit: 'mm/1st hr',
          referenceInterval: '0 - 15 (Male) / 0 - 20 (Female)',
          flag: isAbn ? 'HIGH' : 'NORMAL',
          method: 'Modified Westergren Method',
        },
      ],
      interpretation: isCrit
        ? 'ALERT: Marked bicytopenia with leukocytosis noted. Smear demonstrates toxic granulation. Urgent clinical hematology review recommended.'
        : isAbn
        ? 'Microcytic hypochromic red cell morphology with moderate anemia and reactive granulocytosis. Recommend serum ferritin and iron profile correlation.'
        : 'All blood indices within normal physiological limits for age and gender. Normal red cell morphology and adequate platelets seen on smear.',
    };
  },

  // 2. Comprehensive Diabetic Profile
  'Diabetic Profile (HbA1c & Fasting Glucose)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'COMPREHENSIVE DIABETIC ASSESSMENT PANEL',
      department: 'Clinical Biochemistry',
      specimen: 'Fluoride Plasma & EDTA Whole Blood',
      methodology: 'High Performance Liquid Chromatography (HPLC) & Hexokinase UV',
      parameters: [
        {
          parameter: 'Glycated Hemoglobin (HbA1c)',
          observedValue: isCrit ? '11.8' : isAbn ? '8.4' : '5.3',
          unit: '%',
          referenceInterval: '< 5.7 (Normal), 5.7 - 6.4 (Prediabetes), ≥ 6.5 (Diabetes)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'HPLC (NGSP / IFCC Certified)',
        },
        {
          parameter: 'Estimated Average Glucose (eAG)',
          observedValue: isCrit ? '292' : isAbn ? '194' : '105',
          unit: 'mg/dL',
          referenceInterval: '70 - 126',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'ADA Formula Derivation',
        },
        {
          parameter: 'Fasting Plasma Glucose (FBS)',
          observedValue: isCrit ? '248' : isAbn ? '156' : '88',
          unit: 'mg/dL',
          referenceInterval: '70 - 99 (Normal), 100 - 125 (IFG), ≥ 126 (Diabetes)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Hexokinase Enzymatic UV',
        },
        {
          parameter: 'Postprandial Blood Sugar (PPBS - 2hr)',
          observedValue: isCrit ? '340' : isAbn ? '218' : '124',
          unit: 'mg/dL',
          referenceInterval: '< 140 (Normal), 140 - 199 (IGT), ≥ 200 (Diabetes)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Hexokinase Enzymatic UV',
        },
        {
          parameter: 'Urine Glucose',
          observedValue: isCrit ? '3+ (Positive)' : isAbn ? '1+ (Trace)' : 'Nil (Negative)',
          unit: '',
          referenceInterval: 'Nil (Negative)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Dry Chemistry Strip',
        },
        {
          parameter: 'Urine Microalbumin (Spot ACR)',
          observedValue: isCrit ? '86.4' : isAbn ? '42.0' : '14.2',
          unit: 'mg/g Creatinine',
          referenceInterval: '< 30 (Normal), 30 - 300 (Microalbuminuria)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Immunoturbidimetry',
        },
      ],
      interpretation: isCrit
        ? 'CRITICAL ALERT: Severe hyperglycemia with marked HbA1c elevation (>11%) indicating profound chronic dysglycemia. Concomitant microalbuminuria detected. Immediate endocrinology consultation advised.'
        : isAbn
        ? 'Suboptimal glycemic control (HbA1c 8.4%). Target for non-pregnant adults is typically < 7.0%. Early microalbuminuria noted; renal protection and regimen intensification recommended.'
        : 'Glycemic parameters and average glucose levels are within optimal targets. No significant microalbumin leakage detected.',
    };
  },

  // 3. Lipid Profile
  'Lipid Profile (Cardiac Risk Assessment)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'LIPID PROFILE — ATHEROSCLEROTIC CARDIOVASCULAR RISK',
      department: 'Clinical Biochemistry',
      specimen: 'Serum (Yellow SST Tube)',
      methodology: 'Fully Automated Photometric Enzymatic Selective Inhibition',
      parameters: [
        {
          parameter: 'Total Cholesterol',
          observedValue: isCrit ? '294' : isAbn ? '238' : '172',
          unit: 'mg/dL',
          referenceInterval: '< 200 Desirable, 200 - 239 Borderline, ≥ 240 High',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'CHOD-PAP Enzymatic',
        },
        {
          parameter: 'Triglycerides',
          observedValue: isCrit ? '420' : isAbn ? '245' : '118',
          unit: 'mg/dL',
          referenceInterval: '< 150 Normal, 150 - 199 Borderline, 200 - 499 High',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'GPO-PAP Enzymatic',
        },
        {
          parameter: 'HDL Cholesterol (Direct Good)',
          observedValue: isAbn ? '34' : '52',
          unit: 'mg/dL',
          referenceInterval: '> 40 (Male) / > 50 (Female) Desirable',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'Direct Immunoinhibition',
        },
        {
          parameter: 'LDL Cholesterol (Calculated Bad)',
          observedValue: isCrit ? '182' : isAbn ? '155' : '96',
          unit: 'mg/dL',
          referenceInterval: '< 100 Optimal, 100 - 129 Above Optimal, 130 - 159 Borderline',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Friedewald Equation',
        },
        {
          parameter: 'VLDL Cholesterol',
          observedValue: isAbn ? '49' : '24',
          unit: 'mg/dL',
          referenceInterval: '< 30 Desirable',
          flag: isAbn ? 'HIGH' : 'NORMAL',
          method: 'Calculated (TG / 5)',
        },
        {
          parameter: 'Total Cholesterol / HDL Ratio',
          observedValue: isCrit ? '6.8' : isAbn ? '5.4' : '3.3',
          unit: 'Ratio',
          referenceInterval: '< 4.5 Optimal, > 5.0 High Risk',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Calculated',
        },
      ],
      interpretation: isCrit
        ? 'High-risk atherogenic lipid phenotype with marked hypertriglyceridemia and elevated LDL-C. High cardiovascular risk profile. Lifestyle intervention and lipid-lowering therapy recommended.'
        : isAbn
        ? 'Mixed dyslipidemia with elevated LDL cholesterol and sub-optimal protective HDL. Dietary modification and cardiac risk factor assessment advised.'
        : 'Desirable lipid profile with optimal LDL/HDL ratio. Low 10-year estimated atherosclerotic cardiovascular risk.',
    };
  },

  // 4. Liver Function Test (LFT)
  'Liver Function Test (LFT)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'LIVER FUNCTION & HEPATOBILIARY PANEL (LFT)',
      department: 'Clinical Biochemistry',
      specimen: 'Serum (Yellow SST Tube)',
      methodology: 'Enzymatic Kinetic Rate UV (IFCC Recommended Without Pyridoxal Phosphate)',
      parameters: [
        {
          parameter: 'Total Bilirubin',
          observedValue: isCrit ? '4.8' : isAbn ? '2.1' : '0.8',
          unit: 'mg/dL',
          referenceInterval: '0.2 - 1.2',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Diazo Method (Malloy-Evelyn)',
        },
        {
          parameter: 'Direct (Conjugated) Bilirubin',
          observedValue: isCrit ? '2.4' : isAbn ? '0.9' : '0.2',
          unit: 'mg/dL',
          referenceInterval: '0.0 - 0.3',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Diazo Direct',
        },
        {
          parameter: 'Indirect Bilirubin',
          observedValue: isCrit ? '2.4' : isAbn ? '1.2' : '0.6',
          unit: 'mg/dL',
          referenceInterval: '0.1 - 0.8',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Calculated',
        },
        {
          parameter: 'SGOT / AST (Aspartate Aminotransferase)',
          observedValue: isCrit ? '380' : isAbn ? '84' : '28',
          unit: 'U/L',
          referenceInterval: '10 - 40',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Kinetic UV (IFCC)',
        },
        {
          parameter: 'SGPT / ALT (Alanine Aminotransferase)',
          observedValue: isCrit ? '440' : isAbn ? '96' : '31',
          unit: 'U/L',
          referenceInterval: '7 - 56',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Kinetic UV (IFCC)',
        },
        {
          parameter: 'Alkaline Phosphatase (ALP)',
          observedValue: isCrit ? '290' : isAbn ? '164' : '82',
          unit: 'U/L',
          referenceInterval: '44 - 147',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'p-NPP Kinetic',
        },
        {
          parameter: 'Total Protein',
          observedValue: '7.1',
          unit: 'g/dL',
          referenceInterval: '6.0 - 8.3',
          flag: 'NORMAL',
          method: 'Biuret End Point',
        },
        {
          parameter: 'Serum Albumin',
          observedValue: isAbn ? '3.2' : '4.2',
          unit: 'g/dL',
          referenceInterval: '3.5 - 5.0',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'Bromocresol Green (BCG)',
        },
        {
          parameter: 'A/G Ratio',
          observedValue: '1.45',
          unit: 'Ratio',
          referenceInterval: '1.0 - 2.2',
          flag: 'NORMAL',
          method: 'Calculated',
        },
      ],
      interpretation: isCrit
        ? 'CRITICAL ALERT: Acute transaminitis with >10x ULN AST/ALT elevation and conjugated hyperbilirubinemia. Immediate viral hepatitis screen and hepatic ultrasound evaluation advised.'
        : isAbn
        ? 'Mild to moderate hepatocellular injury with ALT predominance, consistent with metabolic fatty liver changes or medication effect. Clinical correlation recommended.'
        : 'Normal hepatic synthetic function and biliary clearance parameters. Transaminases within healthy reference limits.',
    };
  },

  // 5. Kidney Function Test (KFT / RFT)
  'Kidney Function Test (KFT / RFT)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'RENAL FUNCTION & ELECTROLYTE PANEL (KFT)',
      department: 'Clinical Biochemistry',
      specimen: 'Serum (Yellow SST Tube)',
      methodology: 'Enzymatic UV & Ion Selective Electrode (ISE)',
      parameters: [
        {
          parameter: 'Serum Creatinine',
          observedValue: isCrit ? '4.8' : isAbn ? '1.9' : '0.9',
          unit: 'mg/dL',
          referenceInterval: '0.7 - 1.3 (Male) / 0.5 - 1.1 (Female)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Enzymatic Creatininase / IDMS Standardized',
        },
        {
          parameter: 'Blood Urea',
          observedValue: isCrit ? '112' : isAbn ? '58' : '26',
          unit: 'mg/dL',
          referenceInterval: '15 - 45',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'GLDH Kinetic Rate',
        },
        {
          parameter: 'Estimated GFR (CKD-EPI)',
          observedValue: isCrit ? '14' : isAbn ? '42' : '98',
          unit: 'mL/min/1.73m²',
          referenceInterval: '> 90 Normal, 60 - 89 Mild, < 60 Renal Impairment',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'LOW' : 'NORMAL',
          method: 'CKD-EPI 2021 Equation',
        },
        {
          parameter: 'Serum Uric Acid',
          observedValue: isAbn ? '8.4' : '5.2',
          unit: 'mg/dL',
          referenceInterval: '3.5 - 7.2',
          flag: isAbn ? 'HIGH' : 'NORMAL',
          method: 'Uricase PAP',
        },
        {
          parameter: 'Serum Sodium (Na+)',
          observedValue: isCrit ? '124' : '139',
          unit: 'mEq/L',
          referenceInterval: '135 - 145',
          flag: isCrit ? 'CRITICAL' : 'NORMAL',
          method: 'Direct Ion Selective Electrode (ISE)',
        },
        {
          parameter: 'Serum Potassium (K+)',
          observedValue: isCrit ? '6.4' : isAbn ? '5.3' : '4.3',
          unit: 'mEq/L',
          referenceInterval: '3.5 - 5.1',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Direct Ion Selective Electrode (ISE)',
        },
        {
          parameter: 'Serum Chloride (Cl-)',
          observedValue: '101',
          unit: 'mEq/L',
          referenceInterval: '98 - 107',
          flag: 'NORMAL',
          method: 'Direct ISE',
        },
      ],
      interpretation: isCrit
        ? 'PANIC VALUE ALERT: Severe acute/chronic kidney injury with eGFR < 15 and profound Hyperkalemia (K+ 6.4 mEq/L). Cardiac arrhythmia risk. Treating nephrologist/physician notified immediately via telephone.'
        : isAbn
        ? 'Impaired renal excretory function with elevated serum creatinine and reduction in eGFR (Stage 3 CKD pattern). Concomitant hyperuricemia noted.'
        : 'Renal clearance indices and serum electrolytes are balanced within normal biological reference intervals.',
    };
  },

  // 6. Cardiac Biomarkers STAT
  'Cardiac Emergency Panel (Troponin-I STAT)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'CARDIAC BIOMARKERS & HIGH-SENSITIVITY TROPONIN-I STAT',
      department: 'Critical Care Biochemistry',
      specimen: 'Lithium Heparin Plasma / Serum',
      methodology: 'Chemiluminescent Microparticle Immunoassay (CMIA)',
      parameters: [
        {
          parameter: 'High-Sensitivity Troponin-I (hs-cTnI)',
          observedValue: isCrit ? '0.48' : isAbn ? '0.08' : '0.012',
          unit: 'ng/mL',
          referenceInterval: '< 0.04 (Normal Cutoff), ≥ 0.04 (Myocardial Injury)',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Chemiluminescence (CMIA)',
        },
        {
          parameter: 'CK-MB (Mass)',
          observedValue: isCrit ? '48.2' : isAbn ? '12.4' : '3.1',
          unit: 'ng/mL',
          referenceInterval: '0.0 - 5.0',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Immunoinhibition',
        },
        {
          parameter: 'High-Sensitivity CRP (hs-CRP)',
          observedValue: isCrit ? '14.2' : isAbn ? '4.8' : '0.8',
          unit: 'mg/L',
          referenceInterval: '< 1.0 Low Risk, 1.0 - 3.0 Moderate, > 3.0 High Risk',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'Particle Enhanced Immunoturbidimetry',
        },
        {
          parameter: 'NT-proBNP',
          observedValue: isCrit ? '1,840' : '88',
          unit: 'pg/mL',
          referenceInterval: '< 125 (Age < 75y), ≥ 450 (Acute Heart Failure Cutoff)',
          flag: isCrit ? 'CRITICAL' : 'NORMAL',
          method: 'ECLIA',
        },
      ],
      interpretation: isCrit
        ? 'CRITICAL STAT ALERT: Significant elevation of cardiac biomarkers (hs-cTnI 0.48 ng/mL and CK-MB >48 ng/mL) indicative of acute myocardial infarction / necrosis. Critical call log placed to treating cardiologist immediately.'
        : isAbn
        ? 'Borderline elevation of myocardial injury markers. Recommend serial troponin evaluation in 3 hours and baseline 12-lead ECG correlation.'
        : 'Cardiac biomarkers within baseline limits. No biochemical evidence of acute myocardial necrosis detected.',
    };
  },

  // 7. Thyroid Profile
  'Thyroid Profile Total (T3, T4, TSH)': (outcome) => {
    const isAbn = outcome === 'abnormal';
    const isCrit = outcome === 'critical';
    return {
      panelName: 'THYROID FUNCTION PROFILE (TOTAL T3, T4 & ULTRASENSITIVE TSH)',
      department: 'Immunology & Endocrinology',
      specimen: 'Serum (Yellow SST Tube)',
      methodology: 'Chemiluminescence Immunoassay (CLIA)',
      parameters: [
        {
          parameter: 'Total Triiodothyronine (T3)',
          observedValue: isAbn ? '0.54' : '1.24',
          unit: 'ng/mL',
          referenceInterval: '0.80 - 2.00',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'CLIA',
        },
        {
          parameter: 'Total Thyroxine (T4)',
          observedValue: isAbn ? '3.8' : '8.6',
          unit: 'µg/dL',
          referenceInterval: '5.1 - 14.1',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'CLIA',
        },
        {
          parameter: 'TSH — Ultrasensitive 3rd Gen',
          observedValue: isCrit ? '28.4' : isAbn ? '8.9' : '2.15',
          unit: 'µIU/mL',
          referenceInterval: '0.35 - 4.94',
          flag: isCrit ? 'CRITICAL' : isAbn ? 'HIGH' : 'NORMAL',
          method: 'CLIA (3rd Generation)',
        },
      ],
      interpretation: isCrit
        ? 'Overt primary hypothyroidism with significant TSH surge (>25 µIU/mL) and suppressed peripheral thyroid hormones. Endocrine replacement therapy indicated.'
        : isAbn
        ? 'Subclinical hypothyroidism with moderately elevated TSH and preserved free peripheral hormone levels. Recommend Anti-TPO antibody evaluation.'
        : 'Euthyroid biochemical profile with normal pituitary-thyroid axis regulation.',
    };
  },

  // 8. Vitamin Profile
  'Vitamin D3 & Vitamin B12 Profile': (outcome) => {
    const isAbn = outcome === 'abnormal';
    return {
      panelName: 'VITAMIN METABOLISM PROFILE (25-OH VIT D & VIT B12)',
      department: 'Special Clinical Chemistry',
      specimen: 'Serum (Protected from direct light)',
      methodology: 'Electrochemiluminescence Immunoassay (ECLIA)',
      parameters: [
        {
          parameter: '25-Hydroxy Vitamin D (Total)',
          observedValue: isAbn ? '12.4' : '44.8',
          unit: 'ng/mL',
          referenceInterval: '< 20 (Deficient), 20 - 30 (Insufficient), 30 - 100 (Sufficiency)',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'ECLIA',
        },
        {
          parameter: 'Vitamin B12 (Cyanocobalamin)',
          observedValue: isAbn ? '142' : '480',
          unit: 'pg/mL',
          referenceInterval: '211 - 911 (Normal), < 200 (Deficiency)',
          flag: isAbn ? 'LOW' : 'NORMAL',
          method: 'ECLIA',
        },
      ],
      interpretation: isAbn
        ? 'Moderate combined deficiency of Vitamin D (12.4 ng/mL) and Vitamin B12 (142 pg/mL). Oral/injectable supplementation course advised with repeat testing in 12 weeks.'
        : 'Adequate vitamin D stores and physiological circulating Vitamin B12 levels.',
    };
  },
};

// ── Resolver Function to generate complete medical report data for any report ──
export function resolveReportFullData(report: any, allPatients: any[] = []): FullMedicalReportData {
  const patient = allPatients.find(p => p.id === report.patientId) || {
    id: report.patientId || 'PT-2026-081',
    fullName: report.patientName || 'Rajesh Kumar Sharma',
    age: 54,
    gender: 'Male',
    phone: '+91 98765 43210',
  };

  const testList: string[] = Array.isArray(report.testNames)
    ? report.testNames
    : [report.testName || 'Complete Blood Count (CBC)'];

  // Determine outcome based on status or ID
  const outcome: 'normal' | 'abnormal' | 'critical' =
    report.isCritical || (report.reportId && report.reportId.endsWith('3'))
      ? 'critical'
      : (report.reportId && (report.reportId.endsWith('1') || report.reportId.endsWith('4')))
      ? 'abnormal'
      : 'normal';

  // Build panels
  const panels: ClinicalTestPanel[] = [];

  testList.forEach(testName => {
    const matchedKey = Object.keys(STANDARD_PANELS).find(k =>
      k.toLowerCase().includes(testName.toLowerCase()) || testName.toLowerCase().includes(k.toLowerCase())
    );

    if (matchedKey) {
      panels.push(STANDARD_PANELS[matchedKey](outcome));
    }
  });

  // Default to CBC if no exact matches found
  if (panels.length === 0) {
    panels.push(STANDARD_PANELS['Complete Blood Count (CBC)'](outcome));
    if (testList.length > 1) {
      panels.push(STANDARD_PANELS['Diabetic Profile (HbA1c & Fasting Glucose)'](outcome));
    }
  }

  const dateStr = report.generatedAt || new Date().toISOString();
  const collDate = new Date(new Date(dateStr).getTime() - 2.5 * 3600000).toISOString();

  return {
    reportId: report.reportId || 'RPT-30001',
    orderId: report.orderId || 'ORD-2026-904',
    uhid: `UHID-${(patient.id || 'PT-01').replace(/[^0-9]/g, '').padStart(6, '0')}`,
    patientName: patient.fullName || report.patientName || 'Patient',
    age: patient.age || 48,
    gender: patient.gender || 'Male',
    phone: patient.phone || '+91 98765 01001',
    referringDoctor: report.referringDoctor || 'Dr. Srinivas Rao, MD (Internal Medicine)',
    sampleId: `SMP-2026-${(report.reportId || '001').replace(/[^0-9]/g, '').slice(-4)}`,
    barcode: `BAR*${(report.reportId || '30001').replace(/[^0-9]/g, '')}*LAB`,
    collectionTime: new Date(collDate).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    reportingTime: new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    status: report.status || 'Verified',
    panels,
    pathologist: {
      name: 'Dr. Sunita Rao, MD, DNB',
      qualification: 'Senior Consultant Pathologist & Lab Director',
      regNumber: 'TSMC Reg. No: 54219',
      designation: 'Head of Department, Pathology',
    },
    biochemist: {
      name: 'Dr. Harish Reddy, MD',
      qualification: 'Consultant Clinical Biochemist',
      regNumber: 'TSMC Reg. No: 48902',
      designation: 'Quality Manager, Biochemistry',
    },
    clinicalNotes: 'Test results correspond to the specimen received. Biological reference intervals established per CLSI C28-A3 guidelines.',
    deliveryMethod: report.deliveryMethod || 'WhatsApp / Portal',
  };
}
