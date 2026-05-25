import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Verify the request is authorized (sent by Vercel Cron)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 2. Query a single row from the history table to generate database activity.
    // Even if no data is found or RLS limits the rows returned, the query is 
    // still executed against the DB, keeping the instance active.
    const { data, error } = await supabase
      .from('history')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase ping query failed:', error.message);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase pinged successfully',
      data,
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
