'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import StreakBadge from '@/components/StreakBadge';
import ContributionGrid from '@/components/ContributionGrid';
import AddEntryButton from '@/components/AddEntryButton';
import EntryModal from '@/components/EntryModal';
import ActivityList from '@/components/ActivityList';

interface Activity {
  id: string;
  text: string;
  date: string;
  imageUrl?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load activities from localStorage on initial load
  useEffect(() => {
    const savedActivities = localStorage.getItem('habitActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('habitActivities', JSON.stringify(activities));
    }
  }, [activities]);

  const handleSaveEntry = async (data: { text: string; image?: File }) => {
    try {
      setIsSubmitting(true);
      
      // Prepare image upload if needed
      let imageUrl: string | undefined = undefined;
      if (data.image) {
        // For this simplified version, we'll just create a local object URL
        // In a real app, you'd upload to a storage service
        imageUrl = URL.createObjectURL(data.image);
      }

      // In a real app, you would post to a server endpoint
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new activity without posting to Farcaster
      const newActivity = {
        id: Date.now().toString(),
        text: data.text,
        date: new Date().toISOString().split('T')[0],
        imageUrl: imageUrl
      };

      // Add the new activity to our list
      setActivities(prev => [newActivity, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate streak - consecutive days with entries
  const calculateStreak = () => {
    if (activities.length === 0) return 0;
    
    // Sort activities by date in descending order
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(sortedActivities[0].date);
    
    for (let i = 1; i < sortedActivities.length; i++) {
      const prevDate = new Date(sortedActivities[i].date);
      const diffDays = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else if (diffDays > 1) {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  return (
    <main className="min-h-screen bg-[#050709] px-4 py-6 max-w-2xl mx-auto">
      <Header />
      <StreakBadge streak={streak} />
      <ContributionGrid
        activities={activities.map(a => ({
          date: a.date,
          completed: true,
        }))}
      />
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Activities</h2>
        <ActivityList activities={activities} />
      </div>
      <AddEntryButton onClick={() => setIsModalOpen(true)} />
      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
