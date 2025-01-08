'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { searchNASAData } from '@/lib/api'

interface SearchParams {
  query: string
  searchMethod: string
  tokenizer: string
  year: string | null
}

export default function Home() {
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPages, setMaxPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null)

  const performSearch = async (params: SearchParams, page: number) => {
    setIsLoading(true)
    try {
      const response = await searchNASAData({
        ...params,
        page,
      })
      setResults(response.hits)
      setMaxPages(response.max_pages)
      setHasSearched(true)
      setCurrentSearchParams(params)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (params: SearchParams) => {
    if (!params.query.trim()) {
      setResults([])
      setHasSearched(false)
      setCurrentSearchParams(null)
      return
    }

    setCurrentPage(1) // Reset to first page on new search
    await performSearch(params, 1)
  }

  const handlePageChange = async (page: number) => {
    if (!currentSearchParams) return

    setCurrentPage(page)
    await performSearch(currentSearchParams, page)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">CosmosQuery: NASA Data Explorer</h1>
          <p className="text-muted-foreground">
            Explore the cosmos through our intelligent search engine
          </p>
        </header>

        <SearchBar 
          onSearch={handleSearch} 
          isLoading={isLoading}
          initialParams={currentSearchParams}
        />

        {hasSearched && (
          <SearchResults
            results={results}
            currentPage={currentPage}
            maxPages={maxPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
