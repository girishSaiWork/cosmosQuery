import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('search_query')
    const tokenizer = searchParams.get('tokenizer') || 'Standard'

    // Log the incoming request parameters
    console.log('[Docs Per Year API] Request parameters:', {
      query,
      tokenizer,
    })

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const params = new URLSearchParams({
      search_query: query,
      tokenizer,
    })

    const response = await fetch(
      `${API_BASE_URL}/api/v1/get_docs_per_year_count/?${params}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('[Docs Per Year API] Backend error:', await response.text())
      return NextResponse.json(
        { error: 'Failed to fetch year count' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[Docs Per Year API] Success:', {
      yearCount: Object.keys(data).length,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Docs Per Year API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
