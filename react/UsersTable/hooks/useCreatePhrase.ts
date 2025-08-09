import { useState } from 'react'

interface CreatePhraseHookReturn {
  newPhrase: string
  error: string | null
  creating: boolean
  modalOpen: boolean
  setNewPhrase: (phrase: string) => void
  setError: (error: string | null) => void
  setModalOpen: (open: boolean) => void
  handleCreatePhrase: (onSuccess: (newItem: any) => void, showToast: (opts: { message: string; duration?: number }) => void) => Promise<void>
  handleModalClose: () => void
}

export const useCreatePhrase = (): CreatePhraseHookReturn => {
  const [newPhrase, setNewPhrase] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleCreatePhrase = async (
    onSuccess: (newItem: any) => void,
    showToast: (opts: { message: string; duration?: number }) => void
  ) => {
    if (!newPhrase.trim()) {
      setError('El mensaje no puede estar vacío')
      return
    }

    try {
      setError(null)
      setCreating(true)

      const response = await fetch('/_v/fortune-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CookieFortune: newPhrase.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newPhraseObject = await response.json()
      console.log('Created item response:', newPhraseObject)

      onSuccess(newPhraseObject)

      setModalOpen(false)
      setNewPhrase('')
      setCreating(false)

      showToast({
        message: '🥠 Frase creada con éxito',
        duration: 5000,
      })
    } catch (error) {
      console.error('Error creating phrase:', error)
      setCreating(false)

      showToast({
        message: '❌ Error al crear la frase',
        duration: 5000,
      })
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setNewPhrase('')
    setError(null)
  }

  return {
    newPhrase,
    error,
    creating,
    modalOpen,
    setNewPhrase,
    setError,
    setModalOpen,
    handleCreatePhrase,
    handleModalClose,
  }
}
