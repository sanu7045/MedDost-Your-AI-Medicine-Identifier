import { useEffect, useState } from 'react';
import { Clock, ImageIcon, Pill, Trash2, X } from 'lucide-react';
import { getLocalizedValue } from '../i18n';
import { fetchPrimaryMedicineImage } from '../utils/medicineImages';

function HistoryImage({ item }) {
  const [image, setImage] = useState(item.image || null);
  const [loading, setLoading] = useState(false);
  const query = item.photoQuery || item.name;

  useEffect(() => {
    setImage(item.image || null);
    if (item.image?.src || !query) return undefined;
    const controller = new AbortController();
    const loadReferenceImage = async () => {
      setLoading(true);
      try { const ref = await fetchPrimaryMedicineImage(query, controller.signal); if (ref) setImage({ src: ref.src, fullSrc: ref.fullSrc, alt: ref.alt || `${query} medicine photo`, source: 'reference' }); }
      catch (e) { if (e.name !== 'AbortError') setImage(null); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    loadReferenceImage();
    return () => controller.abort();
  }, [item.image, query]);

  if (loading) return <div className="mb-4 aspect-[16/10] w-full rounded-lg border border-slate-200 bg-slate-100 animate-pulse"><span className="sr-only">Loading medicine image</span></div>;
  if (image?.src) return <img src={image.src} alt={image.alt || `${query} medicine photo`} loading="lazy" referrerPolicy="no-referrer" className="mb-4 aspect-[16/10] w-full rounded-lg border border-slate-200 bg-slate-100 object-cover" onError={() => setImage(null)} />;
  return <div className="mb-4 flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-300"><ImageIcon size={32} /></div>;
}

export default function ScanHistory({ history, onClear, onRemove, language, text }) {
  const [expandedIndices, setExpandedIndices] = useState([]);

  const toggleExpand = (index) => setExpandedIndices(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  if (!history?.length) return null;

  return (
    <div className="mt-12 max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-700">
          <Clock size={20} className="text-blue-500" /><h2 className="text-xl font-bold">{text.title}</h2>
        </div>
        <button onClick={onClear} className="text-xs font-medium text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
          <Trash2 size={14} />{text.clear}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item, index) => (
          <div key={`${item.name}-${item.date || index}`} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Pill size={80} /></div>
            <button onClick={() => onRemove(item)} className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 rounded-full p-1.5 shadow-sm transition-all duration-200" title={text.remove || 'Remove from history'}>
              <X size={14} />
            </button>
            <div className="relative z-10">
              <HistoryImage item={item} />
              <h3 className="font-bold text-slate-800 mb-1 truncate">{item.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-2">{getLocalizedValue(item.use, language)}</p>
              <div className="flex items-center justify-between gap-3 mt-4">
                <span className="min-w-0 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md"
                  style={{ display: expandedIndices.includes(index) ? "inline" : "-webkit-box", WebkitLineClamp: expandedIndices.includes(index) ? "unset" : 2, WebkitBoxOrient: expandedIndices.includes(index) ? "unset" : "vertical", overflow: expandedIndices.includes(index) ? "visible" : "hidden" }}>
                  {getLocalizedValue(item.dosage, language)}
                </span>
                <button onClick={() => toggleExpand(index)} className="shrink-0 text-[10px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                  {expandedIndices.includes(index) ? (text.less || 'Less') : (text.more || 'More')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
