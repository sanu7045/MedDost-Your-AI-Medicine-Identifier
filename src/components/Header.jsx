import { Stethoscope, HeartPulse, Languages } from 'lucide-react';

export default function Header({ language, languages, onLanguageChange, text }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white"><Stethoscope size={24} /></div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">MedDost</h1>
            <p className="text-xs font-medium text-blue-600 tracking-wide uppercase">{text.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500">
            <HeartPulse size={16} className="text-rose-500" /><span>{text.assistant}</span>
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <Languages size={16} className="text-blue-600" />
            <span className="sr-only">{text.languageLabel}</span>
            <select value={language} onChange={(event) => onLanguageChange(event.target.value)} className="max-w-28 bg-transparent outline-none cursor-pointer" aria-label={text.languageLabel}>
              {languages.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
