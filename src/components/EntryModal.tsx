import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useFrameContext } from '../hooks/useFrameContext';

interface Channel {
  id: string;
  name: string;
}

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; image?: File; channel?: string }) => void;
  isSubmitting?: boolean;
}

export default function EntryModal({ isOpen, onClose, onSave, isSubmitting = false }: EntryModalProps) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [channels, setChannels] = useState<Channel[]>([{ id: '', name: 'Home' }]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fid } = useFrameContext();
  
  useEffect(() => {
    if (isOpen && fid) {
      fetchChannels();
    }
  }, [isOpen, fid]);

  const fetchChannels = async () => {
    try {
      setIsLoadingChannels(true);
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid })
      });
      
      const data = await response.json();
      if (data.success && Array.isArray(data.channels)) {
        setChannels([
          { id: '', name: 'Home' },
          ...data.channels
        ]);
      } else {
        console.error('Failed to fetch channels:', data.error);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setIsLoadingChannels(false);
    }
  };
  
  const handleSave = () => {
    if (!text.trim()) return;
    const data: { text: string; image?: File; channel?: string } = { 
      text,
      channel: selectedChannel || undefined 
    };
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
    setSelectedChannel('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const charCount = text.length;
  const maxChars = 320; // Farcaster's character limit

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1116] rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-[#161B22]">
          <h2 className="text-white text-lg font-semibold">New Cast</h2>
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
              placeholder="What's on your mind?"
              className="w-full h-32 bg-[#161B22] text-white rounded-lg p-3 resize-none"
              disabled={isSubmitting}
              maxLength={maxChars}
            />
            <div className="text-right mt-1">
              <span className={`text-sm ${charCount > maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                {charCount}/{maxChars}
              </span>
            </div>
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!text.trim() || isSubmitting || charCount > maxChars}
                className="bg-[#018A08] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#016A06] flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Casting...
                  </>
                ) : (
                  'Cast'
                )}
              </button>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="bg-[#161B22] text-white rounded-lg px-3 py-2 border border-[#30363d] hover:border-[#6e7681] focus:border-[#388bfd] focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                disabled={isSubmitting || isLoadingChannels}
              >
                {isLoadingChannels ? (
                  <option value="">Loading channels...</option>
                ) : (
                  channels.map(channel => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white hover:text-gray-300 flex items-center gap-2"
              disabled={isSubmitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
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
          </div>
        </div>
      </div>
    </div>
  );
} 