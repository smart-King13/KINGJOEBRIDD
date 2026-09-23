import { NextResponse } from 'next/server';
import { fetchPinterestStyles } from '@/lib/pinterest';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const styles = await fetchPinterestStyles(category, search);
    return NextResponse.json({
      data: styles,
      meta: {
        total: styles.length,
      }
    });
  } catch (error) {
    console.error('Error fetching fashion styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fashion styles' },
      { status: 500 }
    );
  }
}
