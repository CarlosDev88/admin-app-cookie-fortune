import { useState } from 'react'

interface DeletePhraseHookReturn {
  confirmDeleteOpen: boolean
  itemToDelete: string | null
  deleting: boolean
  setConfirmDeleteOpen: (open: boolean) => void
  setItemToDelete: (id: string | null) => void
  handleDeleteConfirmed: (onSuccess: (deletedId: string) => void, showToast: (opts: { message: string; duration?: number }) => void) => Promise<void>
  handleDeleteCancel: () => void
  openDeleteConfirmation: (itemId: string) => void
}

export const useDeletePhrase = (): DeletePhraseHookReturn => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)

  const handleDeleteConfirmed = async (
    onSuccess: (deletedId: string) => void,
    showToast: (opts: { message: string; duration?: number }) => void
  ) => {
    if (!itemToDelete) return

    try {
      setDeleting(true)

      const response = await fetch(`/_v/fortune-cookie/${itemToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      onSuccess(itemToDelete)

      setConfirmDeleteOpen(false)
      setItemToDelete(null)
      setDeleting(false)

      showToast({
        message: `🗑️ Frase eliminada exitosamente`,
        duration: 5000,
      })
    } catch (error) {
      console.error('Error al eliminar', error)
      setConfirmDeleteOpen(false)
      setItemToDelete(null)
      setDeleting(false)

      showToast({
        message: '❌ Error al eliminar frase',
        duration: 5000,
      })
    }
  }

  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false)
    setItemToDelete(null)
  }

  const openDeleteConfirmation = (itemId: string) => {
    setConfirmDeleteOpen(true)
    setItemToDelete(itemId)
  }

  return {
    confirmDeleteOpen,
    itemToDelete,
    deleting,
    setConfirmDeleteOpen,
    setItemToDelete,
    handleDeleteConfirmed,
    handleDeleteCancel,
    openDeleteConfirmation,
  }
}
