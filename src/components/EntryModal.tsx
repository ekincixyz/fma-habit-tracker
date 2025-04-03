import { useState, useRef } from 'react';
import Image from 'next/image';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; image?: File }) => void;
  isSubmitting?: boolean;
}

export default function EntryModal({ isOpen, onClose, onSave, isSubmitting = false }: EntryModalProps) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSave = () => {
    const data: { text: string; image?: File } = { text };
    if (fileInputRef.current?.files?.[0]) {
      data.image = fileInputRef.current.files[0];
    }
    onSave(data);
    resetForm();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = () => {
    setText('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1116] rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-[#161B22]">
          <h2 className="text-white text-lg font-semibold">Log Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I found more time to reflect on my own thoughts and ideas without social media."
              className="w-full h-32 bg-[#161B22] text-white rounded-lg p-3 resize-none"
              disabled={isSubmitting}
            />
          </div>
          
          {imagePreview && (
            <div className="mb-4 relative w-full aspect-video">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                disabled={isSubmitting}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white hover:text-gray-300"
              disabled={isSubmitting}
            >
              Add Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <button
              onClick={handleSave}
              disabled={!text.trim() || isSubmitting}
              className="bg-[#018A08] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#016A06] flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 