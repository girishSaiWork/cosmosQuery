import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('search_query')
    const year = searchParams.get('year')
    const tokenizer = searchParams.get('tokenizer') || 'Standard'
    const skip = searchParams.get('skip') || '0'
    const limit = searchParams.get('limit') || '9'

    // Log the incoming request parameters
    console.log('[Regular Search API] Request parameters:', {
      query,
      year,
      tokenizer,
      skip,
      limit,
    })

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const params = new URLSearchParams({
      search_query: query,
      skip,
      limit,
      ...(year && { year }),
      tokenizer,
    })

    const response = await fetch(
      `${API_BASE_URL}/api/v1/regular_search/?${params}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('[Regular Search API] Backend error:', await response.text())
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[Regular Search API] Success:', {
      totalHits: data.hits?.length || 0,
      maxPages: data.max_pages,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Regular Search API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
