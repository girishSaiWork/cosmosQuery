'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle 
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface SearchResult {
  _source: {
    title: string
    explanation: string
    image_url: string
    date: string
  }
  _score: number
}

interface SearchResultsProps {
  results: SearchResult[]
  currentPage: number
  maxPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

export function SearchResults({
  results,
  currentPage,
  maxPages,
  onPageChange,
  isLoading,
}: SearchResultsProps) {
  const [expandedExplanations, setExpandedExplanations] = useState<{[key: number]: boolean}>({})
  const [imageDialogOpen, setImageDialogOpen] = useState<string | null>(null)

  // Reset expanded items when results change or page changes
  useEffect(() => {
    setExpandedExplanations({})
  }, [results, currentPage])

  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or filters
        </p>
      </div>
    )
  }

  const toggleExplanation = (index: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-48 w-full group">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer relative w-full h-full">
                    <Image
                      src={result._source.image_url}
                      alt={result._source.title}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                      <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogTitle className="sr-only">
                    {result._source.title}
                  </DialogTitle>
                  <div className="relative w-full h-[60vh]">
                    <Image
                      src={result._source.image_url}
                      alt={result._source.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2 hover:line-clamp-none">
                {result._source.title}
              </CardTitle>
              <CardDescription>
                {new Date(result._source.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <p className={`text-sm text-muted-foreground ${expandedExplanations[index] ? '' : 'line-clamp-3'}`}>
                {result._source.explanation}
              </p>
              {result._source.explanation.length > 150 && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-2"
                  onClick={() => toggleExplanation(index)}
                >
                  {expandedExplanations[index] ? 'Show Less' : 'Read More'}
                </Button>
              )}
            </CardContent>
            
            <CardFooter className="text-sm text-muted-foreground">
              Score: {result._score.toFixed(2)}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Page {currentPage} of {maxPages}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= maxPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
