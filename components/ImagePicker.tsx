
import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { ImageFile } from '../types';

interface ImagePickerProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  isLoading?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ images, onImagesChange, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = (base64: string, mimeType: string) => {
    if (images.length >= 3) return;
    const newImage: ImageFile = {
      base64,
      mimeType,
      id: Math.random().toString(36).substr(2, 9)
    };
    onImagesChange([...images, newImage]);
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addImage(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processUrl = async () => {
    if (!url) return;
    
    let directUrl = url;
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
      if (fileId) {
        directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }

    try {
      const response = await fetch(directUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        addImage(reader.result as string, blob.type);
        setUrl('');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      alert('عذراً، لا يمكن الوصول إلى هذه الصورة مباشرة بسبب قيود الحماية. يرجى تحميلها ورفعها يدوياً.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-50">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-4 font-bold transition-all ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
        >
          رفع صور (بحد أقصى 3)
        </button>
        <button 
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-4 font-bold transition-all ${activeTab === 'url' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
        >
          إضافة رابط صورة
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
              <img src={img.base64} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <div 
              onClick={() => activeTab === 'upload' ? fileInputRef.current?.click() : null}
              className={`aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all cursor-pointer ${activeTab === 'url' ? 'cursor-default' : ''}`}
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              <span className="text-sm">أضف صورة {images.length + 1}</span>
            </div>
          )}
        </div>

        {activeTab === 'upload' ? (
          <div className="text-center">
            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-400">يمكنك رفع حتى 3 صور لتحليلها معاً</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="ألصق رابط Google Drive أو رابط صورة هنا..." 
                className="flex-1 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={images.length >= 3}
              />
              <Button onClick={processUrl} isLoading={isLoading} disabled={images.length >= 3}>إضافة</Button>
            </div>
            <p className="text-xs text-gray-400 text-center">ملاحظة: تدعم هذه الميزة روابط Google Drive العامة والروابط المباشرة</p>
          </div>
        )}
      </div>
    </div>
  );
};
