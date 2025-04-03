import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface UserProfile {
  username: string;
  displayName: string;
}

export default function Header() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.fid) {
        try {
          const response = await fetch(`/api/user/${session.user.fid}`);
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [session?.user?.fid]);

  return (
    <header className="px-4 py-6">
      <h1 className="text-2xl font-bold text-white">
        Hi {profile?.displayName || 'there'} 👋
      </h1>
    </header>
  );
} 