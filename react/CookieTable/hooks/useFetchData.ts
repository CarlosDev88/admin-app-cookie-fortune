import { useState, useEffect } from 'react'

interface FetchDataHookReturn {
  items: any[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  addItem: (newItem: any) => void
  removeItem: (itemId: string) => void
}

export const useFetchData = (
  showToast?: (opts: { message: string; duration?: number }) => void
): FetchDataHookReturn => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/_v/fortune-cookies`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()

      const fetchedItems = Array.isArray(json)
        ? json
        : json.data?.ok || json.data || []
      setItems(fetchedItems)
      setLoading(false)
    } catch (fetchError) {
      console.error('Error fetching data', fetchError)
      setError('Error al cargar las frases')
      setLoading(false)

      if (showToast) {
        showToast({
          message: '❌ Error al cargar las frases',
          duration: 5000,
        })
      }
    }
  }

  const refetch = async (): Promise<void> => {
    await fetchData()
  }

  const addItem = (newItem: any): void => {
    setItems((prevItems) => [...prevItems, newItem])
  }

  const removeItem = (itemId: string): void => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    items,
    loading,
    error,
    refetch,
    addItem,
    removeItem,
  }
}
