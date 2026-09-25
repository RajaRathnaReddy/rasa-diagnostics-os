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
    text: "👋 **Hello Doctor / Lab Director.** I am your **RASA Diagnostic AI Copilot**, grounded in real-time LIS analyzer nodes, PACS imaging archives, and critical panic value registries.\n\nAsk me about panic lab values requiring immediate doctor tele-notification, sample hemolysis patterns, turnaround time bottlenecks, or IV contrast safety screening.",
    time: 'Just now',
    clinicalBadges: ['LIS Synced', 'PACS Ready', 'NABL ISO 15189 Grounded'],
  },
];

const SUGGESTED_PROMPTS = [
  { label: '🚨 Panic Lab Value Alert Audit', query: 'Show all unacknowledged critical panic lab values across branches today' },
  { label: '⏱️ TAT Bottleneck Analysis', query: 'Identify departments exceeding standard turnaround times (TAT > 3h)' },
  { label: '🩸 Sample Hemolysis & Rejection', query: 'Audit sample rejection rates and hemolysis causes at Kukatpally' },
  { label: '🩻 CT Iodine Contrast Safety Protocol', query: 'What is the eGFR screening cutoff protocol for IV contrast in CT scan?' },
  { label: '🧪 Reagent FEFO Expiry Warning', query: 'Check reagents nearing expiry or below reorder safety stock levels' },
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

      if (lower.includes('panic') || lower.includes('critical') || lower.includes('alert')) {
        replyText = `### 🚨 Urgent Panic Value Tele-Notification Sentinel
Found **3 critical panic lab results** requiring immediate telephonic call to treating physician:
- **PAT-0001 (Rajesh Kumar)**: Serum Potassium **6.8 mEq/L** *(Ref: 3.5 - 5.0)* · High Arrhythmia Risk · Specimen re-checked & verified.
- **PAT-0016 (Kavitha R.)**: High-Sensitivity Troponin-I **1.42 ng/mL** *(Ref: < 0.04)* · Acute Coronary Syndrome indication.
- **PAT-0034 (Venkat Rao)**: Platelet Count **14,000 /µL** *(Ref: 150,000 - 450,000)* · Critical Bleeding Precaution.

**Immediate Protocol Action:**
1. Direct phone call initiated to referring cardiologist (Dr. K. Murthy).
2. Telephonic read-back confirmation logged in LIS audit log as per NABL Section 5.8 standards.`;
        badges = ['Critical Panic', 'Immediate Call', '3 Patients'];
      } else if (lower.includes('tat') || lower.includes('turnaround') || lower.includes('delay') || lower.includes('bottleneck')) {
        replyText = `### ⏱️ Operational TAT Diagnostic Intelligence
Average diagnostic turnaround today is **2.4 hours** (Target: < 3.0 hrs).
**Departmental Breakdown:**
- **Hematology (CBC/Coagulation)**: 48 mins *(Optimal)*
- **Biochemistry (LFT/KFT/Lipid)**: 1 hr 15 mins *(Optimal)*
- **Microbiology (Cultures)**: 36 hrs *(Within incubation cycle)*
- **Radiology (MRI / 64-Slice CT)**: 3 hrs 45 mins *(⚠️ Bottleneck at Banjara Hills)*

**AI Recommendation:**
Radiology reporting queue has 14 unverified studies assigned to Dr. Suresh V. Recommend auto-routing 6 routine spine MRI studies to tele-radiology reserve pool.`;
        badges = ['TAT Analytics', 'Actionable', 'Banjara Hills Node'];
      } else if (lower.includes('hemolysis') || lower.includes('rejection') || lower.includes('rejection rate') || lower.includes('sample')) {
        replyText = `### 🩸 Phlebotomy Quality & Hemolysis Root Cause
Sample rejection rate at **Kukatpally Branch** is currently **8.2%** *(Platform Benchmark: < 1.5%)*.
- **Primary Rejection Mode**: In-vitro Hemolysis (68%) & Under-filled EDTA microtainers (24%).
- **Primary Source**: Phlebotomy Station 2 (Vacutainer 21G butterfly draw technique issue).

**Correction Applied:**
Automatic QC flag created. Phlebotomy refresher training alert dispatched to branch supervisor Suresh Naidu.`;
        badges = ['Pre-Analytical QC', 'Root Cause Found', 'Kukatpally'];
      } else if (lower.includes('contrast') || lower.includes('egfr') || lower.includes('ct') || lower.includes('iodine')) {
        replyText = `### 🩻 Intravenous Contrast Safety Protocol (ACR / ESUR Guidelines)
**Pre-CT Contrast Administration Rules:**
1. **eGFR ≥ 45 mL/min/1.73m²**: Safe to proceed with standard non-ionic low-osmolar iodinated contrast (e.g. Omnipaque / Visipaque).
2. **eGFR 30 - 44 mL/min/1.73m²**: High-risk for CIN (Contrast-Induced Nephropathy). Hydration protocol with IV Normal Saline required. Radiologist approval mandatory.
3. **eGFR < 30 mL/min/1.73m² or Anuria**: Absolute contraindication unless emergent life-threatening indication with nephrology standby.

**Metformin Warning:** Discontinue Metformin at time of procedure and withhold 48 hours post-scan until repeat renal function check.`;
        badges = ['Radiology Safety', 'eGFR Protocol', 'ACR Guidelines'];
      } else if (lower.includes('reagent') || lower.includes('stock') || lower.includes('inventory') || lower.includes('expiry')) {
        replyText = `### 🧪 Reagent Depletion & FEFO Expiry Sentinel
- **HbA1c Bio-Rad HPLC Reagent Kit**: 12 tests remaining *(Forecast depletion: Today 4:30 PM)* · Auto-PO #PO-9912 dispatched to vendor.
- **Serum Electrolytes Calibrator Lot #401**: Expires in 5 days *(30 Sep 2026)* · New lot arrived and pending QC calibration curve run.
- **Vacutainer K2 EDTA Lavender Tubes (4ml)**: 1,200 units in central stock *(Adequate for 18 days)*.`;
        badges = ['FEFO Active', 'Auto-PO Triggered', 'Reagent QC'];
      } else {
        replyText = `### 💡 Diagnostic Intelligence Analysis
Analyzing your inquiry: **"${query}"** against current active diagnostic operating metrics.

- **Current Operating Branch**: Banjara Hills Central Diagnostic Complex
- **Active Specimen Worklist**: 42 specimens in analyzer queues, 12 pending clinical verification
- **Patient Safety Sentinels**: Zero unflagged critical panic values at this moment.

*Note: All AI-assisted suggestions are advisory and must be verified by a board-certified Pathologist or Radiologist.*`;
        badges = ['BioMistral Verified', 'Diagnostic Advisory'];
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
