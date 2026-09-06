import { useState, useEffect, useRef } from "react";
import UploadZone from './UploadZone';
import ResultCard from './ResultCard';
import ScanHistory from './ScanHistory';
import { ScanSearch, Mic, MicOff, Search } from 'lucide-react';
import { getLanguageMeta } from '../i18n';
import { fetchPrimaryMedicineImage } from '../utils/medicineImages';

const isQuotaError = (err) => {
  const msg = err.message || '';
  return err.status === 429 || /429|quota|billing|exceeded/i.test(msg);
};

const isConnectionError = (err) => {
  if (!err) return false;
  if (err.isConnectionError) return true;
  if (err instanceof TypeError) return /failed to fetch|network/i.test(err.message || '');
  return false;
};

const cleanJsonResponse = (text) => {
  if (typeof text !== "string") return text;
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  return text.trim();
};

export default function OCRProcessor({ language, text }) {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [matchedMedicine, setMatchedMedicine] = useState(null);
    const [medicinePhotoQuery, setMedicinePhotoQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [voiceQuery, setVoiceQuery] = useState('');
    const voiceQueryRef = useRef('');
    const [isListening, setIsListening] = useState(false);
    const [searchMode, setSearchMode] = useState('image');
    const recognitionRef = useRef(null);
    const languageMeta = getLanguageMeta(language);
    const copy = text.ocr;

    useEffect(() => {
        const savedHistory = localStorage.getItem('meddost_history');
        if (savedHistory) {
            try { setHistory(JSON.parse(savedHistory)); }
            catch (e) { console.error("Error parsing history", e); }
        }
    }, []);

    const saveToHistory = (medicine) => {
        const newEntry = { ...medicine, date: new Date().toISOString() };
        const updatedHistory = [newEntry, ...history.filter(item => item.name !== medicine.name)].slice(0, 6);
        setHistory(updatedHistory);
        localStorage.setItem('meddost_history', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('meddost_history');
    };

    const removeFromHistory = (medicine) => {
        const updatedHistory = history.filter(item => !(item.name === medicine.name && item.date === medicine.date));
        setHistory(updatedHistory);
        localStorage.setItem('meddost_history', JSON.stringify(updatedHistory));
    };

    useEffect(() => {
      if (!image && searchMode === 'image') {
        setResult(null);
        setMatchedMedicine(null);
        setMedicinePhotoQuery('');
      }
    }, [image, searchMode]);

    useEffect(() => {
      return () => recognitionRef.current?.abort();
    }, []);

    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve({
           inlineData: { mimeType: blob.type, data: reader.result.split(',')[1] }
        });
        reader.onerror = reject;
      });
    };

    const createImageThumbnail = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();
      const objectUrl = URL.createObjectURL(blob);
      try {
        return await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const max = 360, scale = Math.min(max / img.width, max / img.height, 1);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.72));
          };
          img.onerror = reject;
          img.src = objectUrl;
        });
      } finally { URL.revokeObjectURL(objectUrl); }
    };

    const getHistoryImage = async (photoQuery) => {
      if (searchMode === 'image' && image) {
        try {
          return { src: await createImageThumbnail(image), alt: `${photoQuery} uploaded medicine photo`, source: 'upload' };
        } catch (e) { console.error("Uploaded thumbnail error:", e); }
      }
      try {
        const ref = await fetchPrimaryMedicineImage(photoQuery);
        if (ref) return { src: ref.src, fullSrc: ref.fullSrc, alt: ref.alt || `${photoQuery} medicine photo`, source: 'reference' };
      } catch (e) { console.error("History reference image error:", e); }
      return null;
    };

    const callGemini = async (contents) => {
      const isImage = Array.isArray(contents) && contents.length > 1 && contents[0] && contents[0].inlineData;
      const endpoint = isImage ? '/api/analyze-image' : '/api/analyze-query';
      
      let body;
      if (isImage) {
        body = { 
          image: contents[0].inlineData.data, 
          prompt: contents[1], 
          language 
        };
      } else {
        body = { 
          prompt: contents[0], 
          language 
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        if (res.status >= 502 && res.status <= 504) {
          const connErr = new Error('Backend server is unavailable');
          connErr.isConnectionError = true;
          throw connErr;
        }
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
      }

      const data = await res.json();
      return data.text;
    };

    const processImage = async () => {
        if (!image) return;
        setLoading(true); setResult(null); setMatchedMedicine(null); setMedicinePhotoQuery('');
        try {
            const prompt = `Act as a highly skilled medical assistant. Look at this medicine image and identify it. 
            **CRITICAL INSTRUCTION**: The image might be blurry, poorly lit, grainy, or partially cut off. Use your advanced reasoning and knowledge of pharmaceutical packaging to deduce the medicine name even if only partial letters, logos, or blister pack shapes are visible. If you are reasonably confident, provide the best match.
            Provide its common name, its main use, and a general dosage.
            For 'use' and 'dosage', provide translations in the requested languages. Ensure the language is extremely simple so anyone can easily understand. 
            Add a short safety advice or warning at the end of the 'dosage' field.
            If you are completely unsure or it is NOT a medicine, return empty strings.`;
            await handleAIResponse(await callGemini([await getBase64FromUrl(image), prompt]));
        } catch (err) {
            console.error("AI Error:", err);
            if (isConnectionError(err)) {
              setResult({ raw: copy.backendUnavailable || 'Backend server unavailable. Start it with `npm run dev:all` (or `npm run server`).' });
            } else {
              setResult({ raw: isQuotaError(err) ? (copy.quotaExceeded || "API quota exceeded. Please check your plan or try again later.") : (err.message || copy.imageFailure) });
            }
        } finally { setLoading(false); }
    };

    const processVoiceQuery = async (query) => {
        const trimmedQuery = (typeof query === 'string' ? query : voiceQueryRef.current).trim();
        if (!trimmedQuery || loading) return;
        setLoading(true); setResult(null); setMatchedMedicine(null); setMedicinePhotoQuery('');
        try {
            const prompt = `Act as a highly skilled medical assistant. The user is asking about a medicine called: "${trimmedQuery}".
            Identify this medicine. Even if the name is slightly misspelled or incomplete, use your knowledge to match it to the closest real medicine.
            Provide its correct common name, its main use, and a general dosage.
            For 'use' and 'dosage', provide translations in the requested languages. Ensure the language is extremely simple so anyone can easily understand. 
            Add a short safety advice or warning at the end of the 'dosage' field.
            If you cannot identify any real medicine from this query, return empty strings.`;
            await handleAIResponse(await callGemini([prompt]));
        } catch (err) {
            console.error("AI Error:", err);
            if (isConnectionError(err)) {
              setResult({ raw: copy.backendUnavailable || 'Backend server unavailable. Start it with `npm run dev:all` (or `npm run server`).' });
            } else {
              setResult({ raw: isQuotaError(err) ? (copy.quotaExceeded || "API quota exceeded. Please check your plan or try again later.") : (err.message || copy.voiceFailure) });
            }
        } finally { setLoading(false); }
    };

    const handleAIResponse = async (textResponse) => {
        const cleaned = cleanJsonResponse(textResponse);
        if (!cleaned) { setMedicinePhotoQuery(""); setResult({ raw: copy.genericFailure }); return; }

        let parsedData;
        try { parsedData = JSON.parse(cleaned); }
        catch (error) {
            console.error("AI JSON parse failed:", error, cleaned);
            setMedicinePhotoQuery(""); setResult({ raw: copy.genericFailure }); return;
        }

        const name = typeof parsedData.name === "string" ? parsedData.name.trim() : "";
        if (name) {
            const resolvedPhotoQuery = name;
            const historyImage = await getHistoryImage(resolvedPhotoQuery);
            setMatchedMedicine(parsedData);
            setMedicinePhotoQuery(resolvedPhotoQuery);
            saveToHistory({ name, use: parsedData.use, dosage: parsedData.dosage, photoQuery: resolvedPhotoQuery, image: historyImage });
        } else {
            console.warn("AI returned empty medicine name:", parsedData);
            setMedicinePhotoQuery(""); setResult({ raw: copy.notFound });
        }
    };

    const toggleListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { alert(copy.unsupportedVoice); return; }
        if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

        const recognition = new SpeechRecognition();
        recognition.lang = languageMeta.voice;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => { setVoiceQuery(event.results[0][0].transcript); setIsListening(false); processVoiceQuery(event.results[0][0].transcript); };
        recognition.onerror = (event) => { console.error("Speech recognition error:", event.error); setIsListening(false); };
        recognition.onend = () => { setIsListening(false); };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 relative">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{copy.title}</h2>
                    <p className="text-slate-500 text-sm">{copy.description}</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                    <button onClick={() => { setSearchMode('image'); setResult(null); setMatchedMedicine(null); setMedicinePhotoQuery(''); }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${searchMode === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <ScanSearch size={18} />{copy.uploadPhoto}
                    </button>
                    <button onClick={() => { setSearchMode('voice'); setResult(null); setMatchedMedicine(null); setMedicinePhotoQuery(''); }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${searchMode === 'voice' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Mic size={18} />{copy.voiceType}
                    </button>
                </div>

                {searchMode === 'image' && (
                    <>
                        <UploadZone image={image} setImage={setImage} text={text.upload} />
                        <button onClick={processImage} disabled={!image || loading}
                            className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 shadow-md ${!image || loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}`}>
                            <ScanSearch size={22} className={loading ? 'animate-pulse' : ''} />
                            {loading ? copy.analyzing : copy.identifyWithAi}
                        </button>
                    </>
                )}

                {searchMode === 'voice' && (
                    <>
                        <div className="flex flex-col items-center gap-4">
                            <button onClick={toggleListening}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isListening ? 'bg-rose-500 text-white animate-pulse scale-110 shadow-rose-300' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-200'}`}
                                title={isListening ? copy.listening : copy.tapMic}>
                                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                            </button>
                            <p className="text-sm text-slate-500 font-medium">{isListening ? copy.listening : copy.tapMic}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input type="text" value={voiceQuery} onChange={(e) => { voiceQueryRef.current = e.target.value; setVoiceQuery(e.target.value); }}
                                onKeyDown={(e) => e.key === 'Enter' && processVoiceQuery()} placeholder={copy.inputPlaceholder}
                                className="flex-1 px-4 py-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" />
                            <button onClick={() => processVoiceQuery()} disabled={!voiceQuery.trim() || loading} title={copy.searchLabel}
                                className={`px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md ${!voiceQuery.trim() || loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
                                <Search size={20} />
                            </button>
                        </div>
                    </>
                )}

                <ResultCard matchedMedicine={matchedMedicine} result={result ? result.raw : null} loading={loading} language={language} text={text.result} photoQuery={medicinePhotoQuery} />
            </div>

            <ScanHistory history={history} onClear={clearHistory} onRemove={removeFromHistory} language={language} text={text.history} />
        </div>
    );
}