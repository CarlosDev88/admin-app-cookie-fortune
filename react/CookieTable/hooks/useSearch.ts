import { useState, useMemo } from 'react'

interface SearchHookReturn {
  searchValue: string | null
  filteredItems: any[]
  setSearchValue: (value: any) => void
  clearSearch: () => void
  handleSearchSubmit: () => void
}

export const useSearch = (items: any[]): SearchHookReturn => {
  const [searchValue, setSearchValue] = useState<string | null>(null)


  const filteredItems = useMemo(() => {
    if (!searchValue || typeof searchValue !== 'string' || searchValue.trim() === '') {
      return items
    }

    const searchTerm = searchValue.toLowerCase().trim()

    return items.filter(item => {

      const message = item.CookieFortune?.toLowerCase() || ''


      const id = item.id?.toString().toLowerCase() || ''

      return message.includes(searchTerm) || id.includes(searchTerm)
    })
  }, [items, searchValue])

  const handleSearchChange = (value: any) => {

    if (value === null || value === undefined) {
      setSearchValue(null)
    } else if (typeof value === 'string') {
      setSearchValue(value)
    } else if (typeof value === 'object' && value.target && typeof value.target.value === 'string') {

      setSearchValue(value.target.value)
    } else {

      setSearchValue(String(value))
    }
  }

  const clearSearch = () => {
    setSearchValue(null)
  }

  const handleSearchSubmit = () => {
    console.log('Searching for:', searchValue)
  }

  return {
    searchValue,
    filteredItems,
    setSearchValue: handleSearchChange,
    clearSearch,
    handleSearchSubmit,
  }
}
