import { NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { getSession } from '../../../auth';

const client = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY!
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.fid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { text, imageUrl } = await request.json();

    // Create the cast text - no hashtag added
    const castText = `📝 ${text}`;

    // Post the cast using Neynar API
    const response = await client.publishCast({
      signerUuid: process.env.NEYNAR_SIGNER_UUID!, // Use a predetermined signer
      text: castText,
      embeds: imageUrl ? [{ url: imageUrl }] : undefined,
    });

    return NextResponse.json({
      success: true,
      entry: {
        id: Date.now().toString(), // Use timestamp as ID since we don't rely on Farcaster hash
        text: text,
        date: new Date().toISOString().split('T')[0],
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error posting to Farcaster:', error);
    return NextResponse.json(
      { error: 'Failed to post entry' },
      { status: 500 }
    );
  }
} 