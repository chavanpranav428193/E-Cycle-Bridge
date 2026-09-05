import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

export interface ImageUploaderProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Capture or Upload Scrap Photo',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    {
      name: 'Computer Motherboard PCB',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Copper Cables / Wire Bundle',
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lithium Battery Packs',
      url: 'https://images.unsplash.com/photo-1619641782821-75178523cf44?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
          <img
            src={value}
            alt="Scrap preview"
            className="w-full h-56 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Camera className="w-4 h-4" />}
            >
              Replace Photo
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onChange('')}
              leftIcon={<X className="w-4 h-4" />}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-950/20'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">Click to snap camera or upload</p>
          <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG up to 10MB or drag & drop</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Quick sample image buttons for fast demo testing */}
      {!value && (
        <div className="pt-2">
          <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
            Or test with verified demo photo:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleImages.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(sample.url)}
                className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
