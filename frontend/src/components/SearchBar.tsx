import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

/**
 * Reusable search bar component with debouncing
 * Used across the platform for skill and user searches
 */
export function SearchBar({ 
  onSearch, 
  placeholder = "Search skills...", 
  className,
  defaultValue = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function to avoid too many API calls
  const debouncedSearch = useCallback((searchQuery: string) => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(true);
    
    // Clear previous timeout and start new one
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    onSearch(query);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 border-0 shadow-md"
        />
        
        {/* Clear button - only show when there's text */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
          disabled={isSearching}
        >
          <Search className={cn("w-4 h-4", isSearching && "animate-pulse")} />
        </Button>
      </div>
    </form>
  );
}