import React from 'react'
import { Modal, Button, Textarea } from 'vtex.styleguide'

interface CreatePhraseModalProps {
  isOpen: boolean
  newPhrase: string
  error: string | null
  creating: boolean
  onClose: () => void
  onPhraseChange: (phrase: string) => void
  onCreate: () => void
}

const CreatePhraseModal: React.FC<CreatePhraseModalProps> = ({
  isOpen,
  newPhrase,
  error,
  creating,
  onClose,
  onPhraseChange,
  onCreate,
}) => {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 700) {
      onPhraseChange(e.target.value)
    }
  }

  return (
    <Modal centered isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          backgroundColor: '#FFF7E0',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#8B5E3C' }}>🥠 Crear nueva frase</h3>
        <Textarea
          value={newPhrase}
          onChange={handleTextareaChange}
          placeholder="Escribe un mensaje que cambie el día de alguien..."
          resize="vertical"
        />
        <div
          style={{
            fontSize: '12px',
            color: '#8B5E3C',
            marginTop: '4px',
          }}
        >
          {newPhrase.length} / 700 caracteres
        </div>
        {error && (
          <p style={{ color: 'red', marginTop: '4px' }}>{error}</p>
        )}
        <div className="mt4 flex justify-end">
          <Button
            variation="secondary"
            onClick={onClose}
            disabled={creating}
          >
            Cancelar
          </Button>
          <span className="ml3">
            <Button
              variation="primary"
              isLoading={creating}
              onClick={onCreate}
            >
              Crear frase
            </Button>
          </span>
        </div>
      </div>
    </Modal>
  )
}

export default CreatePhraseModal
