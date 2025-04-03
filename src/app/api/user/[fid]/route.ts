import { NextResponse } from 'next/server';
import { NeynarV2APIClient } from '@neynar/nodejs-sdk';

const client = new NeynarV2APIClient(process.env.NEYNAR_API_KEY!);

export async function GET(
  request: Request,
  { params }: { params: { fid: string } }
) {
  try {
    const response = await client.getUserBulk({ fids: [parseInt(params.fid)] });
    const user = response.users[0];
    
    return NextResponse.json({
      username: user.username,
      displayName: user.display_name || user.username,
      pfpUrl: user.pfp_url,
    });
  } catch (error) {
    console.error('Error fetching user from Neynar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 