import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, X, Send, Bot, RotateCcw,
  CheckCircle2, Shield, Zap, ChevronDown, MessageSquare,
  AlertCircle, Stethoscope, Clock, TestTubes, Activity
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/cn';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  clinicalBadges?: string[];
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-init',
    sender: 'assistant',
    text: "Good afternoon.\n\nThere are **12 items requiring attention** across center operations:\n\n• **10 Critical Results** — 3 awaiting acknowledgement\n• **8 TAT Risks** — Approaching turnaround limit\n• **5 Rejected Samples** — Phlebotomy recollection needed\n• **4 Delayed Collections** — Home visit routing delays\n\nHow would you like to proceed?",
    time: 'Just now',
    clinicalBadges: ['Operational Assistant', 'LIS & PACS Connected', 'Real-time Feed'],
  },
];

const SUGGESTED_PROMPTS = [
  { label: '🚨 Show Critical Results', query: 'Show Critical Results' },
  { label: '⏱️ Show TAT Risks', query: 'Show TAT Risks' },
  { label: '🧪 Show Rejected Samples', query: 'Show Rejected Samples' },
  { label: '🚚 Show Delayed Collections', query: 'Show Delayed Collections' },
  { label: '📊 How many reports are delayed today?', query: 'How many reports are delayed today?' },
  { label: '🏥 Which department has the highest TAT?', query: 'Which department has the highest TAT?' },
  { label: '🩸 How many samples were rejected today?', query: 'How many samples were rejected today?' },
  { label: '🩻 Show today\'s pending radiology reports', query: 'Show today\'s pending radiology reports' },
];

export function FloatingCopilotWidget() {
  const { copilotOpen, toggleCopilot, setCopilotOpen, copilotInitialQuery, setCopilotInitialQuery } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (copilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, copilotOpen]);

  useEffect(() => {
    if (copilotInitialQuery) {
      handleSendMessage(copilotInitialQuery);
      setCopilotInitialQuery(undefined);
    }
  }, [copilotInitialQuery]);

  useEffect(() => {
    if (copilotOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [copilotOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let replyText = '';
      let badges: string[] = ['RASA Clinical Engine'];
      const lower = query.toLowerCase();
       if (lower.includes('show critical') || lower.includes('critical results') || lower.includes('panic')) {
        replyText = `### 🚨 Critical Results Requiring Acknowledgement (10 Total)
- **PAT-0001 (Rajesh Kumar)**: Serum Potassium **6.8 mEq/L** *(Arrhythmia Risk · STAT)*
- **PAT-0016 (Kavitha R.)**: High-Sensitivity Troponin-I **1.42 ng/mL** *(Acute Coronary Syndrome)*
- **PAT-0034 (Venkat Rao)**: Platelet Count **14,000 /µL** *(Critical Bleeding Alert)*
- **7 Additional critical values** flagged in morning analyzer runs (Bilirubin, Calcium, Lactate).

**Immediate Required Action:**
Treating doctors must be telephonically contacted and read-back acknowledgment logged in LIS.`;
        badges = ['10 Criticals', 'STAT Protocol', 'LIS Verified'];
      } else if (lower.includes('show tat') || lower.includes('tat risks') || lower.includes('delayed today') || lower.includes('how many reports are delayed')) {
        replyText = `### ⏱️ Turnaround Time (TAT) Risk & Delays Summary
- **Total reports delayed today**: **8 reports** are currently delayed beyond their guaranteed SLA time.
- **Top delay drivers**: Histopathology complex biopsies (avg 3.8 hrs) and MRI Brain with Contrast (avg 2.8 hrs).
- **8 additional reports** are within 45 minutes of breaching their SLA commitment.

**Recommended Action:**
Expedite pathologist verification queue on Histopathology and allocate tele-radiologist for pending neuro scans.`;
        badges = ['8 Delayed Reports', 'SLA Alert', 'TAT Watch'];
      } else if (lower.includes('highest tat') || lower.includes('which department has the highest')) {
        replyText = `### 🏥 Department Turnaround Time Ranking
1. **Histopathology & Biopsy**: **3.8 hrs** *(Target: 3.0 hrs)* — ⚠️ Highest TAT
2. **Radiology (MRI / 64-Slice CT)**: **2.6 hrs** *(Target: 2.5 hrs)*
3. **Immunology & Hormones**: **2.2 hrs** *(Target: 2.0 hrs)*
4. **Biochemistry**: **1.8 hrs** *(Target: 2.0 hrs)* — ✅ Within SLA
5. **Hematology (CBC)**: **45 mins** *(Target: 1.0 hr)* — ✅ Optimal`;
        badges = ['Pathology Highest', 'TAT Ranking', 'Benchmarked'];
      } else if (lower.includes('show rejected') || lower.includes('how many samples were rejected') || lower.includes('samples rejected')) {
        replyText = `### 🧪 Sample Rejections Today (5 Specimens Total)
- **18 Awaiting Recollection** across yesterday & today's batches.
- **5 Rejected today**:
  - 3 samples rejected for **Gross In-vitro Hemolysis** (Lavender EDTA tubes).
  - 1 sample rejected for **Insufficient Specimen Volume** (Citrate Blue top).
  - 1 sample rejected for **Severe Lipemia** (Fasting required).

**Correction Action:**
Free patient recollection orders dispatched to phlebotomy team.`;
        badges = ['5 Rejected Today', '18 In Queue', 'Phlebotomy Flagged'];
      } else if (lower.includes('show delayed collections') || lower.includes('delayed collections')) {
        replyText = `### 🚚 Delayed Home Collections (4 Visits)
- **LB Nagar Route**: Pavan Kumar (Phleb) running 35 minutes behind due to traffic.
- **Hitec City Route**: Suresh Naidu running 20 minutes behind.
- **Affected Patients**: S. Ramanathan (Lipid Profile) & Anita Deshmukh (Thyroid Panel).

**Fleet Correction:**
Notifications dispatched via SMS to patients with updated arrival window.`;
        badges = ['4 Delayed Visits', 'Fleet Logistics', 'Live GPS'];
      } else if (lower.includes('pending radiology') || lower.includes('radiology reports')) {
        replyText = `### 🩻 Today's Pending Radiology Reporting Queue
There are **14 pending radiology studies** awaiting radiologist sign-off:
- **MRI Brain / Spine**: 4 studies (Dr. Anand assigned)
- **CT Abdomen / Chest (HRCT)**: 5 studies (Dr. Radhika Sharma assigned)
- **Ultrasound Abdomen & Pelvis**: 5 studies (Completed, draft notes uploaded)

**PACS Accession Status:**
All DICOM slices loaded in zero-footprint web viewer with AI CADx lesion heatmap pre-processed.`;
        badges = ['14 Pending Studies', 'PACS Synced', 'AI CADx Ready'];
      } else if (lower.includes('contrast') || lower.includes('egfr') || lower.includes('iodine')) {
        replyText = `### 🩻 Intravenous Contrast Safety Protocol (ACR / ESUR Guidelines)
**Pre-CT Contrast Administration Rules:**
1. **eGFR ≥ 45 mL/min/1.73m²**: Safe to proceed with standard non-ionic low-osmolar iodinated contrast (Omnipaque / Visipaque).
2. **eGFR 30 - 44 mL/min/1.73m²**: High-risk for Contrast-Induced Nephropathy (CIN). Pre-scan hydration protocol required.
3. **eGFR < 30 mL/min/1.73m²**: Absolute contraindication unless emergent life-threatening indication.`;
        badges = ['Radiology Safety', 'eGFR Protocol', 'ACR Guidelines'];
      } else {
        replyText = `### 💡 Diagnostic Intelligence Operational Synthesis
Analyzing inquiry: **"${query}"** against current diagnostic center operations.

- **Current Center Status**: 42 specimens active in analyzer pipelines, 12 pending verification.
- **Panic Value Sentinels**: 3 unflagged critical results in queue.
- **Recommendation**: Review Immediate Action Queue on Command Center.

*Note: All AI-assisted suggestions are advisory and must be verified by a board-certified Pathologist or Radiologist.*`;
        badges = ['Operational Search', 'Live Center Node'];
      }

      setMessages(prev => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clinicalBadges: badges,
        },
      ]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <>
      {/* ═══ FLOATING COPILOT TRIGGER BUTTON (BOTTOM RIGHT) ═══ */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCopilot}
          className={cn(
            'relative h-13 px-4 rounded-full shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer border',
            copilotOpen
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-gradient-to-r from-brand-600 to-brand-700 text-white border-brand-400/40 hover:shadow-brand-500/25'
          )}
        >
          {/* Subtle Breathing Glow */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-400"></span>
          </span>

          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none">Diagnostic Copilot</p>
            <p className="text-[10px] text-white/80 font-medium leading-none mt-1">LIS & PACS Grounded</p>
          </div>
        </motion.button>
      </div>

      {/* ═══ EXPANDABLE COPILOT CHAT DIALOG ═══ */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 w-full max-w-lg bg-surface-0 border border-surface-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: 'calc(100vh - 120px)', height: '620px' }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">RASA Clinical Copilot</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono font-semibold">
                      v3.2 AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Real-time Lab, PACS & TAT Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(DEFAULT_MESSAGES)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2.5 bg-surface-50 border-b border-surface-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-surface-0 hover:bg-brand-50 hover:text-brand-600 text-surface-700 border border-surface-200 whitespace-nowrap transition-colors shadow-xs cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col',
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[88%] p-3.5 rounded-2xl leading-relaxed',
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-surface-100 text-surface-900 rounded-bl-xs border border-surface-200'
                    )}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-1.5 text-[10px] text-surface-500 font-semibold mb-1 uppercase tracking-wider">
                        <Bot className="w-3.5 h-3.5 text-brand-600" />
                        <span>RASA AI Diagnostic Sentinel</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line prose-sm">{msg.text}</div>

                    {msg.clinicalBadges && msg.clinicalBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-surface-200/60">
                        {msg.clinicalBadges.map((b, i) => (
                          <span
                            key={i}
                            className="text-[9.5px] px-2 py-0.5 rounded bg-surface-200 text-surface-700 font-mono font-bold"
                          >
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-surface-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-surface-500 text-xs p-3 bg-surface-50 rounded-xl w-fit border border-surface-200">
                  <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
                  <span>Synthesizing multi-analyzer data & PACS nodes...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-surface-0 border-t border-surface-200 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about panic values, TAT delays, contrast safety..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-surface-900"
              />
              <button
                disabled={!inputQuery.trim() || isThinking}
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
