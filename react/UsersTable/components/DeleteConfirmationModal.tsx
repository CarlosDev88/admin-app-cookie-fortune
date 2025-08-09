import React from 'react'
import { Modal, Button } from 'vtex.styleguide'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  deleting,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal centered isOpen={isOpen} onClose={onCancel}>
      <div className="deleteModal">
        <div className="deleteModal__text">
          <h3>¿Deseas eliminar esta frase? 🗑️</h3>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className="deleteModal__buttons">
          <Button
            variation="secondary"
            size="small"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            size="small"
            isLoading={deleting}
            onClick={onConfirm}
          >
            Sí, eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
