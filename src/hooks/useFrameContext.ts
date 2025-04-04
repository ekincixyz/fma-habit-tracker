import { useState, useEffect } from 'react';

interface User {
  fid: number;
  username?: string;
  displayName?: string;
}

interface FrameContext {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface FrameMessage {
  data: {
    fid?: number;
    messageBytes?: string;
    timestamp?: number;
    network?: number;
    buttonIndex?: number;
    inputText?: string;
    castId?: {
      fid: number;
      hash: string;
    };
  };
}

export function useFrameContext(): FrameContext {
  const [context, setContext] = useState<FrameContext>({
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Try to get stored FID first
    const storedFid = localStorage.getItem('userFid');
    
    if (storedFid) {
      // If we have a stored FID, use it immediately
      fetchUserData(parseInt(storedFid));
    }

    // Listen for Frame messages
    function handleFrameMessage(event: MessageEvent<FrameMessage>) {
      const fid = event.data?.data?.fid;
      if (fid) {
        localStorage.setItem('userFid', fid.toString());
        fetchUserData(fid);
      }
    }

    // Add message listener
    window.addEventListener('message', handleFrameMessage as any);

    // For testing purposes, if no FID is found after 2 seconds, use test FID
    const timeoutId = setTimeout(() => {
      if (!context.user?.fid) {
        const testFid = 6227; // Your test FID
        console.log('Using test FID for development:', testFid);
        fetchUserData(testFid);
      }
    }, 2000);

    return () => {
      window.removeEventListener('message', handleFrameMessage as any);
      clearTimeout(timeoutId);
    };
  }, []);

  async function fetchUserData(fid: number) {
    try {
      const response = await fetch(`/api/channels?fid=${fid}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setContext({
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        console.error('Failed to fetch user data:', data.error);
        setContext({
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setContext({
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  return context;
} 