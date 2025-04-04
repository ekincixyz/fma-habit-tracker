import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!NEYNAR_API_KEY) {
      throw new Error('NEYNAR_API_KEY is not configured');
    }

    // Get FID from query parameter
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { error: 'Unauthorized - No FID found' },
        { status: 401 }
      );
    }

    // Fetch user channels from Neynar
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/channels?fid=${fid}&limit=25`,
      {
        headers: {
          accept: 'application/json',
          api_key: NEYNAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch channels from Neynar');
    }

    const data = await response.json();
    
    // Also fetch user profile
    const userResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user?fid=${fid}`,
      {
        headers: {
          accept: 'application/json',
          api_key: NEYNAR_API_KEY,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user profile from Neynar');
    }

    const userData = await userResponse.json();
    const user = userData.result.user;

    return NextResponse.json({
      success: true,
      channels: [
        { id: 'home', name: 'Home' },
        ...(data.channels || []).map((channel: any) => ({
          id: channel.id,
          name: channel.name,
        })),
      ],
      user: {
        fid: parseInt(fid),
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 