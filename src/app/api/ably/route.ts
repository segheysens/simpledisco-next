import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const room = searchParams.get('roomName');

  if (!room) {
    return NextResponse.json({ error: 'Room parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Ably API key is not configured' }, { status: 500 });
  }

  const [keyId, keySecret] = apiKey.split(':');

  const capability = {
    [`transcriptions`]: ['publish', 'subscribe'],
  };

  const jwtPayload = {
    'x-ably-capability': JSON.stringify(capability),
    // 'x-ably-clientId': 'video-call-app',
  };

  try {
    const issued = Math.floor(Date.now() / 1000);
    const expires = issued + 3600; // 1 hour from now

    const token = jwt.sign(jwtPayload, keySecret, {
      expiresIn: '1h',
      algorithm: 'HS256',
      keyid: keyId,
    });

    const tokenDetails = {
      token,
      issued,
      expires,
      capability,
    };

    return NextResponse.json(tokenDetails);
  } catch (error) {
    console.error('Error creating JWT:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
