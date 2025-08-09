import React from 'react'
import { Button } from 'vtex.styleguide'

interface TableHeaderProps {
  onAddPhrase: () => void
}

const TableHeader: React.FC<TableHeaderProps> = ({ onAddPhrase }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFF7E0',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <h2
        style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          color: '#8B5E3C',
        }}
      >
        🥠 Galletas de la Fortuna
      </h2>
      <Button
        variation="primary"
        size="small"
        onClick={onAddPhrase}
      >
        🥠 Agregar frase
      </Button>
    </div>
  )
}

export default TableHeader
