import { ShieldAlert } from 'lucide-react';

export default function Footer({ text }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700/50 pb-6 mb-6">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-lg text-white">MedDost</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <ShieldAlert size={16} className="text-yellow-500" />
            <p><strong>{text.disclaimer}</strong> {text.short}</p>
          </div>
        </div>
        <p className="text-xs text-center text-slate-500 max-w-2xl mx-auto">{text.long}</p>
      </div>
    </footer>
  );
}
