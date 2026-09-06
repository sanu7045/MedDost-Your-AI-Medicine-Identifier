import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function UploadZone({ image, setImage, text }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); };
  const handleFileInput = (e) => { if (e.target.files?.length) handleFiles(e.target.files); };
  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      if (image) URL.revokeObjectURL(image);
      setImage(URL.createObjectURL(file));
    }
  };
  const clearImage = () => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  return (
    <div className="w-full">
      {!image ? (
        <div className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'}`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileInput} className="hidden" />
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
            <UploadCloud size={32} className={isDragging ? 'text-blue-600' : 'text-slate-400'} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">{isDragging ? text.drop : text.click}</h3>
          <p className="text-sm text-slate-500 text-center max-w-xs">{text.hint}</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
          <img src={image} alt="preview" className="w-full max-h-[400px] object-contain bg-slate-50" />
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-4">
            <button onClick={clearImage} className="bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md backdrop-blur transition-transform hover:scale-105" title={text.remove}><X size={20} /></button>
          </div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 text-sm font-medium text-slate-700">
            <ImageIcon size={16} className="text-blue-500"/>{text.selected}
          </div>
        </div>
      )}
    </div>
  );
}
