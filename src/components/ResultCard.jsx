import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ImageIcon, Info, Pill, Volume2, VolumeX } from 'lucide-react';
import { LANGUAGES, getLanguageMeta, getLocalizedValue } from '../i18n';
import MedicinePhotoStrip from './MedicinePhotoStrip';

export default function ResultCard({ matchedMedicine, result, loading, language, text, photoQuery }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLanguage, setTtsLanguage] = useState(language);
  const utteranceRef = useRef(null);
  const languageMeta = getLanguageMeta(ttsLanguage);

  useEffect(() => { return () => window.speechSynthesis?.cancel(); }, []);
  useEffect(() => { window.speechSynthesis?.cancel(); setIsSpeaking(false); }, [language, matchedMedicine?.name]);

  const speakResult = () => {
    if (!matchedMedicine || !window.speechSynthesis) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const useText = getLocalizedValue(matchedMedicine.use, language);
    const dosageText = getLocalizedValue(matchedMedicine.dosage, language);
    const fullText = `${matchedMedicine.name}. ${text.useLabel}: ${useText}. ${text.dosageLabel}: ${dosageText}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = languageMeta.voice;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return (
    <div className="mt-6 p-8 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center text-center animate-pulse">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <h3 className="text-lg font-semibold text-slate-700">{text.loadingTitle}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-2">{text.loadingDescription}</p>
    </div>
  );

  if (matchedMedicine) {
    const previewName = photoQuery || matchedMedicine.name;
    const imageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(previewName + ' medicine tablet strip')}`;
    const useText = getLocalizedValue(matchedMedicine.use, language);
    const dosageText = getLocalizedValue(matchedMedicine.dosage, language);

    return (
      <div className="mt-6 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Pill size={120} className="text-emerald-500" /></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-emerald-200/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><CheckCircle2 size={24} /></div>
              <h2 className="text-2xl font-bold text-slate-800">{matchedMedicine.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <select value={ttsLanguage} onChange={(e) => setTtsLanguage(e.target.value)}
                className="text-xs border border-emerald-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                {LANGUAGES.map(lang => <option key={lang.id} value={lang.id}>{lang.label}</option>)}
              </select>
              <button onClick={speakResult}
                className={`p-2.5 rounded-lg border shadow-sm transition-all ${isSpeaking ? 'bg-rose-100 border-rose-200 text-rose-600 hover:bg-rose-200' : 'bg-white/80 border-emerald-100 text-emerald-600 hover:bg-emerald-100'}`}
                title={isSpeaking ? text.stopSpeaking : text.listen}>
                {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{text.useLabel}</p>
                  <p className="text-slate-700 font-medium leading-relaxed text-lg">{useText}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Pill size={20} className="text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{text.dosageLabel}</p>
                  <p className="text-slate-700 font-medium leading-relaxed text-lg">{dosageText}</p>
                </div>
              </div>
            </div>
          </div>
          <MedicinePhotoStrip medicineName={previewName} text={text} />
          <a href={imageSearchUrl} target="_blank" rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/60 border border-emerald-100 text-emerald-700 font-semibold text-sm hover:bg-white hover:shadow-md transition-all">
            <ImageIcon size={18} />{text.seeRealPhotos} {previewName} -&gt;
          </a>
        </div>
      </div>
    );
  }

  if (result && !matchedMedicine) return (
    <div className="mt-6 p-6 border border-rose-200 rounded-2xl bg-rose-50 flex items-start gap-4">
      <div className="bg-white p-2 rounded-full text-rose-500 shadow-sm shrink-0"><AlertCircle size={24} /></div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{text.medicineNotIdentified}</h3>
        <p className="text-slate-600 text-sm">{text.notIdentifiedDescription}</p>
        <div className="mt-4 p-3 bg-white/60 rounded-lg text-xs text-slate-500 font-mono break-all border border-rose-100">
          <strong>{text.aiResponse}: </strong> {result.substring(0, 150)}{result.length > 150 ? '...' : ''}
        </div>
      </div>
    </div>
  );

  return null;
}
