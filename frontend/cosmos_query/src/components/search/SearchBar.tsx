'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getDocsPerYear } from '@/lib/api'
import { ThemeToggle } from '@/components/theme/theme-toggle'

interface SearchBarProps {
  onSearch: (params: {
    query: string
    searchMethod: string
    tokenizer: string
    year: string | null
  }) => void
  isLoading: boolean
  initialParams: {
    query: string
    searchMethod: string
    tokenizer: string
    year: string | null
  } | null
}

export function SearchBar({ onSearch, isLoading, initialParams }: SearchBarProps) {
  const [query, setQuery] = useState(initialParams?.query || '')
  const [searchMethod, setSearchMethod] = useState(initialParams?.searchMethod || 'regular')
  const [tokenizer, setTokenizer] = useState(initialParams?.tokenizer || 'Standard')
  const [year, setYear] = useState(initialParams?.year || 'all')
  const [yearCounts, setYearCounts] = useState<Record<string, number>>({})
  const [isLoadingYears, setIsLoadingYears] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)
    .filter(y => y >= 2015 && y <= currentYear) // Only show years from 2015 onwards

  const handleSearch = async () => {
    if (!query.trim()) return

    try {
      // Get year counts first
      await fetchYearCounts()

      // Then perform the search
      onSearch({
        query,
        searchMethod,
        tokenizer,
        year: year === 'all' ? null : year,
      })
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const fetchYearCounts = async () => {
    if (!query.trim()) return

    setIsLoadingYears(true)
    try {
      const data = await getDocsPerYear(query, tokenizer)
      setYearCounts(data.docs_per_year || {})
    } catch (error) {
      console.error('Failed to fetch year counts:', error)
    } finally {
      setIsLoadingYears(false)
    }
  }

  const handleTokenizerChange = (value: string) => {
    setTokenizer(value)
    setYearCounts({}) // Clear year counts when tokenizer changes
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    if (query.trim()) {
      // Trigger search with new year value
      onSearch({
        query,
        searchMethod,
        tokenizer,
        year: value === 'all' ? null : value,
      })
    }
  }

  const handleYearDropdownOpen = async () => {
    if (query.trim() && Object.keys(yearCounts).length === 0) {
      await fetchYearCounts()
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter your search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSearch()
              }
            }}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={searchMethod} onValueChange={setSearchMethod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular Search</SelectItem>
              <SelectItem value="semantic">Semantic Search</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tokenizer} onValueChange={setTokenizer}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tokenizer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Whitespace">Whitespace</SelectItem>
              <SelectItem value="Letter">Letter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={handleYearChange} onOpenChange={handleYearDropdownOpen}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {Object.entries(yearCounts)
                .sort(([a], [b]) => Number(b) - Number(a))
                .filter(([year]) => Number(year) >= 2015)
                .map(([year, count]) => (
                  <SelectItem key={year} value={year}>
                    {year} ({count})
                  </SelectItem>
                ))}
              {isLoadingYears && <SelectItem value="loading">Loading...</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <ThemeToggle />
      </div>
    </div>
  )
}
