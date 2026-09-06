import { useEffect, useState } from 'react';
import { ImageIcon, Search, X } from 'lucide-react';
import { fetchDedicatedMedicineImages } from '../utils/medicineImages';

const PHOTO_COUNT = 5;

export default function MedicinePhotoStrip({ medicineName, text }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!medicineName) return;
    const controller = new AbortController();
    const loadImages = async () => {
      setImages([]); setSelectedImage(null); setLoading(true);
      try { setImages(await fetchDedicatedMedicineImages(medicineName, controller.signal, PHOTO_COUNT)); }
      catch (e) { if (e.name !== 'AbortError') setImages([]); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    loadImages();
    return () => controller.abort();
  }, [medicineName]);

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
        <ImageIcon size={16} className="text-emerald-600" /><span>{text.referencePhotos}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-busy={loading}>
        {loading && Array.from({ length: PHOTO_COUNT }).map((_, i) => (
          <div key={i} className="aspect-[16/10] rounded-xl bg-white/70 border border-emerald-100 animate-pulse"><span className="sr-only">{text.photosLoading}</span></div>
        ))}
        {!loading && images.map((image, index) => (
          <button key={`${image.src}-${index}`} type="button" onClick={() => setSelectedImage(image)}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-emerald-100 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            title={`${medicineName} preview`}>
            <img src={image.src} alt={image.alt || `${medicineName} medicine preview`} loading="lazy" referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => e.currentTarget.closest('button')?.remove()} />
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-slate-950/65 px-3 py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Search size={13} />{image.alt || medicineName}
            </span>
          </button>
        ))}
      </div>
      {!loading && images.length === 0 && (
        <div className="rounded-xl border border-dashed border-emerald-200 bg-white/70 px-4 py-3 text-sm font-medium text-slate-600">
          {text.noDedicatedPhotos || `No verified ${medicineName} preview found.`}
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
              title={text.closePreview || 'Close preview'}><X size={22} /></button>
            <img src={selectedImage.fullSrc || selectedImage.src} alt={selectedImage.alt || `${medicineName} medicine preview`}
              className="max-h-[82vh] w-full rounded-2xl bg-white object-contain shadow-2xl" referrerPolicy="no-referrer" />
            <p className="mt-3 text-center text-sm font-semibold text-white">{selectedImage.alt || medicineName}</p>
          </div>
        </div>
      )}
    </div>
  );
}
