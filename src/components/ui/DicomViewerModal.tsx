import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ZoomIn, ZoomOut, RotateCcw, Sliders, Eye, Maximize2,
  Download, Printer, Ruler, Sun, Compass, Activity, ShieldCheck,
  ChevronLeft, ChevronRight, FileText, CheckCircle2, Scan, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/cn';

export interface DicomStudy {
  id: string;
  studyId: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  modality: 'XR' | 'CT' | 'MR' | 'US' | 'Echo';
  bodyPart: string;
  date: string;
  accessionNumber: string;
  institution: string;
  kvp?: string;
  mas?: string;
  sliceThickness?: string;
  matrix?: string;
  findings: string;
  impression: string;
  radiologist: string;
  aiHeatmapSupported: boolean;
  aiLesions?: Array<{
    label: string;
    confidence: number;
    severity: 'critical' | 'moderate' | 'mild';
    box: { x: number; y: number; w: number; h: number };
  }>;
}

export const SAMPLE_DICOM_STUDIES: DicomStudy[] = [
  {
    id: 'xr-chest-01',
    studyId: 'ST-XR-8842',
    patientName: 'Rajesh Kumar Sharma',
    patientId: 'PAT-0001',
    age: 58,
    gender: 'Male',
    modality: 'XR',
    bodyPart: 'Chest PA Standing View',
    date: 'Today, 09:15 AM',
    accessionNumber: 'ACC-XR-2026-9912',
    institution: 'RASA Central Diagnostics (Banjara Hills)',
    kvp: '115 kVp',
    mas: '4.5 mAs',
    matrix: '2048 x 2048 (16-bit Grayscale)',
    findings: 'Bilateral lung fields demonstrate clear expansion. No focal consolidation, pneumothorax, or pleural effusion. Cardiothoracic ratio is normal (0.46). Aortic knuckle is within normal limits. Trachea is midline. Both costophrenic angles are acute.',
    impression: 'Normal Chest PA Radiograph. No active cardiopulmonary lesion detected.',
    radiologist: 'Dr. Suresh V., MD (Radiodiagnosis)',
    aiHeatmapSupported: true,
    aiLesions: [
      { label: 'Cardiothoracic Ratio 0.46 (Normal)', confidence: 99.2, severity: 'mild', box: { x: 38, y: 48, w: 26, h: 22 } },
    ],
  },
  {
    id: 'ct-chest-02',
    studyId: 'ST-CT-4102',
    patientName: 'Kavitha Ramachandran',
    patientId: 'PAT-0016',
    age: 44,
    gender: 'Female',
    modality: 'CT',
    bodyPart: 'High-Resolution Chest CT (HRCT)',
    date: 'Today, 08:30 AM',
    accessionNumber: 'ACC-CT-2026-4019',
    institution: 'RASA Central Diagnostics (Banjara Hills)',
    kvp: '120 kVp',
    mas: '180 mAs',
    sliceThickness: '0.625 mm',
    matrix: '512 x 512 Multi-Slice Helical',
    findings: 'Patchy peripheral ground-glass opacities noted in bilateral lower lobes, predominantly posterior subpleural distribution. No evidence of cavitation or calcification. Mediastinal window shows no significant lymphadenopathy. No pleural fluid.',
    impression: 'Mild viral/atypical pneumonitis pattern in bilateral lower lung zones. CORADS 3 equivalent. Recommend clinical correlation.',
    radiologist: 'Dr. Suresh V., MD (Radiodiagnosis)',
    aiHeatmapSupported: true,
    aiLesions: [
      { label: 'Subpleural Ground Glass Opacity', confidence: 94.6, severity: 'moderate', box: { x: 22, y: 55, w: 20, h: 25 } },
      { label: 'Right Lower Lobe Infiltrate', confidence: 88.4, severity: 'moderate', box: { x: 58, y: 60, w: 18, h: 20 } },
    ],
  },
  {
    id: 'mr-brain-03',
    studyId: 'ST-MR-7719',
    patientName: 'Arun Varma Naidu',
    patientId: 'PAT-0023',
    age: 62,
    gender: 'Male',
    modality: 'MR',
    bodyPart: 'Brain MRI (T1, T2, FLAIR, DWI)',
    date: 'Yesterday, 04:45 PM',
    accessionNumber: 'ACC-MR-2026-7731',
    institution: 'RASA Central Diagnostics (Banjara Hills)',
    sliceThickness: '3.0 mm',
    matrix: '512 x 512 3.0-Tesla FSE',
    findings: 'No acute restricted diffusion on DWI/ADC to suggest acute territorial infarction. Multiple punctate T2/FLAIR hyperintensities noted in bilateral subcortical and periventricular white matter, consistent with chronic microvascular ischemic changes (Fazekas Grade 1). Ventricular system is symmetric.',
    impression: 'Age-appropriate cerebral involution with mild chronic microvascular ischemic white matter changes. No acute ischemic stroke or mass effect.',
    radiologist: 'Dr. Suresh V., MD (Radiodiagnosis)',
    aiHeatmapSupported: true,
    aiLesions: [
      { label: 'Fazekas Gr 1 White Matter Hyperintensity', confidence: 91.8, severity: 'mild', box: { x: 42, y: 38, w: 16, h: 16 } },
    ],
  },
  {
    id: 'us-abdomen-04',
    studyId: 'ST-US-9910',
    patientName: 'Sunita Mehra',
    patientId: 'PAT-0038',
    age: 51,
    gender: 'Female',
    modality: 'US',
    bodyPart: 'Whole Abdomen & Pelvis Ultrasound',
    date: 'Today, 10:20 AM',
    accessionNumber: 'ACC-US-2026-9934',
    institution: 'RASA Central Diagnostics (Banjara Hills)',
    matrix: 'Convex Array 3.5 - 5.0 MHz',
    findings: 'Liver is enlarged measuring 16.4 cm with diffuse increased parenchymal echogenicity and mild posterior acoustic attenuation. Hepatic veins are patent. Gallbladder is distended with normal wall thickness; no calculi. Pancreas, spleen, and bilateral kidneys normal. No ascites.',
    impression: 'Grade II Diffuse Hepatosplenomegaly with Fatty Infiltration (Steatosis). Liver Function Test correlation advised.',
    radiologist: 'Dr. Suresh V., MD (Radiodiagnosis)',
    aiHeatmapSupported: true,
    aiLesions: [
      { label: 'Hepatic Steatosis Grade II', confidence: 96.1, severity: 'moderate', box: { x: 30, y: 25, w: 42, h: 48 } },
    ],
  },
];

interface DicomViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  study?: DicomStudy | null;
}

export function DicomViewerModal({ isOpen, onClose, study: propStudy }: DicomViewerModalProps) {
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const activeStudy = propStudy || SAMPLE_DICOM_STUDIES[currentStudyIndex] || SAMPLE_DICOM_STUDIES[0];

  // Viewer tool states
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'bone' | 'soft' | 'lung' | 'standard'>('standard');
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [activeTool, setActiveTool] = useState<'pan' | 'ruler' | 'angle' | 'pointer'>('pointer');
  const [showFindingsPanel, setShowFindingsPanel] = useState(true);
  const [rulerLengthMm, setRulerLengthMm] = useState<number | null>(48.2);

  if (!isOpen) return null;

  const handleReset = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setInvert(false);
    setActiveWindow('standard');
    setActiveTool('pointer');
  };

  const applyWindowPreset = (preset: 'bone' | 'soft' | 'lung' | 'standard') => {
    setActiveWindow(preset);
    if (preset === 'bone') {
      setBrightness(90);
      setContrast(170);
    } else if (preset === 'lung') {
      setBrightness(130);
      setContrast(140);
    } else if (preset === 'soft') {
      setBrightness(110);
      setContrast(115);
    } else {
      setBrightness(100);
      setContrast(100);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden text-slate-100 font-sans">
        {/* Full Viewport Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden"
        >
          {/* ═══ TOP DICOM PACS CONTROL BAR ═══ */}
          <header className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
            {/* Left: Study Title & Patient Identifiers */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xs">
                {activeStudy.modality}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white truncate">{activeStudy.bodyPart}</h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                    {activeStudy.accessionNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-500/20 text-success-300 border border-success-500/30 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> DICOM 3.0 Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  <strong className="text-slate-200">{activeStudy.patientName}</strong> · ID: {activeStudy.patientId} · {activeStudy.age}y / {activeStudy.gender} · {activeStudy.date}
                </p>
              </div>
            </div>

            {/* Middle: Study Navigation Selector */}
            <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setCurrentStudyIndex(i => (i > 0 ? i - 1 : SAMPLE_DICOM_STUDIES.length - 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Previous Study"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-300 px-2">
                Study {currentStudyIndex + 1} of {SAMPLE_DICOM_STUDIES.length}
              </span>
              <button
                onClick={() => setCurrentStudyIndex(i => (i < SAMPLE_DICOM_STUDIES.length - 1 ? i + 1 : 0))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Next Study"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Actions & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiOverlay(!showAiOverlay)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border',
                  showAiOverlay
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-xs'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI CADx Lesion Map</span>
              </button>

              <button
                onClick={() => setShowFindingsPanel(!showFindingsPanel)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border',
                  showFindingsPanel
                    ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Radiologist Report</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
                title="Close PACS Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* ═══ SECONDARY TOOLBAR: RADIOLOGY VIEWPORT CONTROLS ═══ */}
          <div className="h-11 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
            {/* Preset Windowing Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 tracking-wider">Window:</span>
              {(['standard', 'bone', 'lung', 'soft'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => applyWindowPreset(w)}
                  className={cn(
                    'px-2 py-1 rounded text-[11px] font-medium capitalize transition-all',
                    activeWindow === w
                      ? 'bg-slate-800 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Interactive Tool Selection */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTool('pointer')}
                className={cn(
                  'p-1.5 rounded hover:bg-slate-800 transition-colors',
                  activeTool === 'pointer' ? 'bg-slate-800 text-brand-300' : 'text-slate-400'
                )}
                title="Pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('ruler')}
                className={cn(
                  'p-1.5 rounded hover:bg-slate-800 transition-colors',
                  activeTool === 'ruler' ? 'bg-slate-800 text-brand-300' : 'text-slate-400'
                )}
                title="Linear Measurement Caliper"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('angle')}
                className={cn(
                  'p-1.5 rounded hover:bg-slate-800 transition-colors',
                  activeTool === 'angle' ? 'bg-slate-800 text-brand-300' : 'text-slate-400'
                )}
                title="Cobb / CTR Angle Measurement"
              >
                <Compass className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-slate-800 mx-1" />
              <button
                onClick={() => setInvert(!invert)}
                className={cn(
                  'px-2 py-1 rounded text-[11px] font-medium border border-slate-700 transition-colors',
                  invert ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                )}
              >
                Invert Grayscale
              </button>
              <button
                onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
                title="Reset Viewport"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <span>W/L: {brightness}/{contrast}</span>
              {activeStudy.matrix && <span>{activeStudy.matrix}</span>}
            </div>
          </div>

          {/* ═══ MAIN WORKSPACE: CANVAS VIEWPORT & REPORT SIDE PANEL ═══ */}
          <div className="flex-1 flex min-h-0 relative overflow-hidden bg-black">
            {/* Center: DICOM Canvas Viewport */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
              {/* OSD (On-Screen Display) Medical Overlays */}
              <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-cyan-400/80 pointer-events-none space-y-0.5 drop-shadow-md">
                <p className="font-bold text-cyan-300">{activeStudy.institution}</p>
                <p>PAT: {activeStudy.patientName.toUpperCase()}</p>
                <p>ID: {activeStudy.patientId} · {activeStudy.gender}/{activeStudy.age}</p>
                <p>ACQ: {activeStudy.date}</p>
                {activeStudy.kvp && <p>EXP: {activeStudy.kvp} · {activeStudy.mas}</p>}
              </div>

              <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-cyan-400/80 pointer-events-none text-right space-y-0.5 drop-shadow-md">
                <p className="font-bold text-amber-400">NOT FOR RE-EXPORT WITHOUT SIGN-OFF</p>
                <p>MOD: {activeStudy.modality} · {activeStudy.bodyPart}</p>
                <p>SERIES: 01 · IM: 04/24</p>
                {activeStudy.sliceThickness && <p>THICK: {activeStudy.sliceThickness}</p>}
                <p>LOSSLESS DICOM COMPRESSION</p>
              </div>

              {/* Bottom OSD Coordinates */}
              <div className="absolute bottom-4 left-4 z-10 text-[11px] font-mono text-slate-500 pointer-events-none">
                <p>WW: {Math.round(contrast * 3.5)} · WL: {Math.round(brightness * 2.1)}</p>
                <p>PIXEL SPACING: 0.143 mm/pixel</p>
              </div>

              {/* High-Fidelity SVG Diagnostic Radiographic Canvas */}
              <div
                style={{
                  transform: `scale(${zoom})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
                  transition: 'filter 0.15s ease-out',
                }}
                className="relative max-w-full max-h-full aspect-square flex items-center justify-center"
              >
                {/* Simulated High-Res Radiograph for Chest / Joint / CT / MRI */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] rounded bg-slate-950 border border-slate-800 shadow-2xl"
                >
                  <defs>
                    <radialGradient id="lungFieldGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#080c14" />
                      <stop offset="70%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#020617" />
                    </radialGradient>
                    <linearGradient id="ribGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.4" />
                    </linearGradient>
                    <radialGradient id="heartGrad" cx="45%" cy="55%" r="45%">
                      <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.85" />
                      <stop offset="85%" stopColor="#64748b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity="0.1" />
                    </radialGradient>
                  </defs>

                  {/* Anatomical Background Soft Tissue Silhouette */}
                  <path
                    d="M 120 50 Q 250 30 380 50 Q 440 180 440 380 Q 420 460 250 470 Q 80 460 60 380 Q 60 180 120 50 Z"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                    opacity="0.75"
                  />

                  {/* Spinal Column & Thoracic Vertebrae */}
                  <rect x="238" y="45" width="24" height="400" rx="3" fill="#cbd5e1" opacity="0.65" />
                  {Array.from({ length: 14 }).map((_, i) => (
                    <line
                      key={i}
                      x1="234"
                      y1={65 + i * 26}
                      x2="266"
                      y2={65 + i * 26}
                      stroke="#475569"
                      strokeWidth="2.5"
                      opacity="0.8"
                    />
                  ))}

                  {/* Bilateral Clavicles */}
                  <path d="M 238 80 Q 170 65 110 85" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.85" />
                  <path d="M 262 80 Q 330 65 390 85" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.85" />

                  {/* Left & Right Lung Parenchymal Fields */}
                  <path
                    d="M 225 100 Q 140 100 110 170 Q 95 270 120 370 Q 170 380 225 350 Z"
                    fill="url(#lungFieldGrad)"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 275 100 Q 360 100 390 170 Q 405 270 380 370 Q 330 380 275 350 Z"
                    fill="url(#lungFieldGrad)"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Thoracic Rib Cage Arcs */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <g key={i} opacity="0.6">
                      <path
                        d={`M 238 ${110 + i * 36} Q 150 ${130 + i * 38} 105 ${170 + i * 35}`}
                        fill="none"
                        stroke="url(#ribGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d={`M 262 ${110 + i * 36} Q 350 ${130 + i * 38} 395 ${170 + i * 35}`}
                        fill="none"
                        stroke="url(#ribGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}

                  {/* Cardiac Silhouette & Aortic Knob */}
                  <path
                    d="M 245 150 Q 230 180 215 220 Q 175 270 190 330 Q 240 350 260 350 Q 275 330 265 250 Z"
                    fill="url(#heartGrad)"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  {/* Aortic Arch */}
                  <path d="M 245 130 Q 225 120 225 145 Q 225 170 245 190" fill="none" stroke="#e2e8f0" strokeWidth="9" opacity="0.8" />

                  {/* Bilateral Diaphragmatic Domes */}
                  <path d="M 95 385 Q 165 340 235 365" fill="none" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
                  <path d="M 265 365 Q 335 340 405 385" fill="none" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
                </svg>

                {/* AI CADx Lesion Overlays */}
                {showAiOverlay && activeStudy.aiLesions && (
                  <div className="absolute inset-0 pointer-events-none">
                    {activeStudy.aiLesions.map((lesion, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: `${lesion.box.x}%`,
                          top: `${lesion.box.y}%`,
                          width: `${lesion.box.w}%`,
                          height: `${lesion.box.h}%`,
                        }}
                        className={cn(
                          'absolute border-2 rounded transition-all',
                          lesion.severity === 'critical'
                            ? 'border-rose-500 bg-rose-500/10'
                            : lesion.severity === 'moderate'
                            ? 'border-amber-400 bg-amber-400/10'
                            : 'border-emerald-400 bg-emerald-400/10'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wide whitespace-nowrap shadow-md flex items-center gap-1',
                            lesion.severity === 'critical'
                              ? 'bg-rose-600 text-white'
                              : lesion.severity === 'moderate'
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          )}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{lesion.label} ({lesion.confidence}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Caliper Overlay (Ruler) */}
                {activeTool === 'ruler' && rulerLengthMm && (
                  <div className="absolute left-[35%] top-[55%] pointer-events-none flex items-center gap-2">
                    <div className="w-28 h-0.5 bg-yellow-400 relative">
                      <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full border-2 border-yellow-400 bg-black" />
                      <div className="absolute -right-1 -top-1.5 w-3 h-3 rounded-full border-2 border-yellow-400 bg-black" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.5 rounded shadow">
                      {rulerLengthMm} mm
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ═══ RIGHT: COLLAPSIBLE RADIOLOGIST REPORT & SIGN-OFF PANEL ═══ */}
            {showFindingsPanel && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="w-90 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 text-slate-200 z-10"
              >
                {/* Panel Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-bold text-white">Diagnostic Impression</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-500/20 text-success-300 font-semibold border border-success-500/30">
                    Official Read
                  </span>
                </div>

                {/* Findings Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {/* Modality & Technique */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Technique</p>
                    <p className="font-medium text-slate-300">
                      {activeStudy.bodyPart} · {activeStudy.modality}
                    </p>
                    {activeStudy.kvp && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        Technique: {activeStudy.kvp} @ {activeStudy.mas} · DICOM Node #{activeStudy.accessionNumber}
                      </p>
                    )}
                  </div>

                  {/* Findings */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Detailed Findings</p>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {activeStudy.findings}
                    </p>
                  </div>

                  {/* Impression */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Impression</p>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-medium leading-relaxed">
                      {activeStudy.impression}
                    </div>
                  </div>

                  {/* AI Diagnostic Verification */}
                  {activeStudy.aiHeatmapSupported && (
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>RASA AI-Assisted Radiographic Screen</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80">
                        Zero critical fractures or acute tension pneumothorax detected by DeepVision-PACS v3.2.
                      </p>
                    </div>
                  )}

                  {/* Radiologist Digital Signature */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authorized Sign-off</p>
                      <CheckCircle2 className="w-4 h-4 text-success-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{activeStudy.radiologist}</p>
                      <p className="text-[11px] text-slate-400">MD Radiodiagnosis · Medical Council Verified</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                      <span>SIGN: RSA-E-SIG-9912</span>
                      <span>{activeStudy.date}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-400" /> Print
                  </button>
                  <button
                    onClick={() => alert(`Exporting Lossless DICOM DCM file: ${activeStudy.accessionNumber}.dcm`)}
                    className="flex-1 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Export DICOM
                  </button>
                </div>
              </motion.aside>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
