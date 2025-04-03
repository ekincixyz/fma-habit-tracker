import Image from 'next/image';
import { useState } from 'react';

interface Activity {
  id: string;
  text: string;
  date: string;
  imageUrl?: string;
}

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleString('default', { weekday: 'long' });
    const month = date.toLocaleString('default', { month: 'short' });
    const dayNum = date.getDate();
    return `${day}, ${month} ${dayNum}`;
  };

  const hasImages = activities.some(activity => activity.imageUrl);

  return (
    <div>
      {hasImages && (
        <div className="flex justify-end mb-4">
          <div className="bg-[#0D1116] p-1 rounded-lg flex">
            <button
              className={`px-3 py-1 rounded ${
                viewMode === 'list'
                  ? 'bg-[#161B22] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode('list')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block mr-1" fill="currentColor">
                <path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h9A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-13zM3.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-9z"/>
                <path d="M4.5 4h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zm0 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zm0 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zm0 2h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
              </svg>
              List
            </button>
            <button
              className={`px-3 py-1 rounded ${
                viewMode === 'gallery'
                  ? 'bg-[#161B22] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode('gallery')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block mr-1" fill="currentColor">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zM10.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 9.5A1.5 1.5 0 0 1 2.5 8h3A1.5 1.5 0 0 1 7 9.5v3A1.5 1.5 0 0 1 5.5 14h-3A1.5 1.5 0 0 1 1 12.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 8h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 12.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
              </svg>
              Gallery
            </button>
          </div>
        </div>
      )}
      
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="bg-[#0D1116] rounded-lg p-6 text-center text-gray-400">
              No entries yet. Click the + button to add your first entry.
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-[#0D1116] rounded-lg p-4 border border-[#30363d] hover:border-[#8b949e] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#018A08]" />
                  <span className="text-gray-400">
                    {formatDate(activity.date)}
                  </span>
                </div>
                <p className="text-white mb-4">{activity.text}</p>
                {activity.imageUrl && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={activity.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activities
            .filter(activity => activity.imageUrl)
            .map((activity) => (
              <div
                key={activity.id}
                className="bg-[#0D1116] rounded-lg overflow-hidden border border-[#30363d] hover:border-[#8b949e] transition-colors"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={activity.imageUrl!}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#018A08]" />
                    <span className="text-gray-400 text-sm">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <p className="text-white text-sm line-clamp-2">{activity.text}</p>
                </div>
              </div>
            ))}
          {activities.filter(activity => activity.imageUrl).length === 0 && (
            <div className="col-span-2 bg-[#0D1116] rounded-lg p-6 text-center text-gray-400">
              No images available. Add entries with images to see them in gallery view.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 