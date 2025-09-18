import { NextRequest, NextResponse } from 'next/server';
import { initializeNeonDatabase } from '@/lib/db/init-neon';

export async function POST(request: NextRequest) {
  try {
    // You might want to add some security here, like checking for a secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // For now, we'll allow it, but in production you should use a proper secret
    if (secret !== 'init-db-secret-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeNeonDatabase();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully!' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
