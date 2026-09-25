import { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, FileText, Calendar, TrendingUp, Users, Activity } from 'lucide-react';

const aiModules = [
  { id: 'receptionist', name: 'AI Receptionist', desc: 'Smart patient check-in and appointment assistance', icon: Users, color: 'bg-brand-50 text-brand-600' },
  { id: 'report', name: 'AI Report Explanation', desc: 'Patient-friendly report interpretation', icon: FileText, color: 'bg-info-50 text-info-600' },
  { id: 'operations', name: 'AI Operational Intelligence', desc: 'Detect operational bottlenecks and anomalies', icon: Activity, color: 'bg-warning-50 text-warning-600' },
  { id: 'followup', name: 'AI Follow-Up Assistant', desc: 'Automated patient follow-up scheduling', icon: Calendar, color: 'bg-success-50 text-success-600' },
  { id: 'quality', name: 'AI Quality Insights', desc: 'Quality pattern analysis and predictions', icon: TrendingUp, color: 'bg-brand-50 text-brand-600' },
  { id: 'demand', name: 'AI Demand Forecasting', desc: 'Test volume and staffing predictions', icon: Sparkles, color: 'bg-info-50 text-info-600' },
];

export default function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    { role: 'assistant', text: "Hello! I'm the RASA AI Assistant. I can help you with operational insights, report explanations, patient follow-ups, and more. How can I assist you today?" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChatHistory(prev => [...prev,
      { role: 'user' as const, text: message },
      { role: 'assistant' as const, text: "Thank you for your question. As an AI assistant, I'm analyzing the operational data. Here are some insights:\n\n• 12 reports are pending verification — consider prioritizing Biochemistry department.\n• Sample rejection rate at Kukatpally (8.2%) needs attention — main cause: hemolysis.\n• Tomorrow's appointment load is 15% above average — consider additional phlebotomist.\n\n⚠️ AI-generated insight. This does not replace professional judgment." },
    ]);
    setMessage('');
  };

  return (
    <div className="fade-in space-y-5">
      <div><h1 className="text-xl font-bold text-surface-900">AI Command Center</h1><p className="text-[13px] text-surface-500">RASA AI Gateway — Intelligent diagnostic assistance</p></div>
      <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-warning-600 flex-shrink-0" />
        <p className="text-[12px] text-warning-700">All AI-generated content is clearly labelled. Clinical content requires authorized human review before becoming part of the official record.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {aiModules.map(mod => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className="metric-card cursor-pointer hover:border-brand-300 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${mod.color}`}><Icon className="w-5 h-5" /></div>
              <p className="text-[13px] font-semibold text-surface-900">{mod.name}</p>
              <p className="text-[12px] text-surface-500 mt-0.5">{mod.desc}</p>
            </div>
          );
        })}
      </div>
      {/* Chat Interface */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-200 flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-500" />
          <h3 className="text-sm font-semibold text-surface-900">RASA AI Assistant</h3>
          <span className="text-[10px] px-2 py-0.5 bg-brand-50 text-brand-600 rounded-full font-medium">AI-Powered</span>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-xl text-[13px] ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-surface-100 text-surface-800 rounded-bl-sm'
              }`}>
                {msg.role === 'assistant' && <span className="text-[10px] text-surface-500 block mb-1">🤖 AI Generated</span>}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-surface-200 flex gap-2">
          <input
            type="text" value={message} onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about operations, reports, insights..."
            className="flex-1 px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button onClick={handleSend} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
