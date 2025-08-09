import React, { Component } from 'react'
import {
  Table,
  Button,
  IconShoppingCart,
  withToast,
} from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'
import { useCreatePhrase } from './hooks/useCreatePhrase'
import { useDeletePhrase } from './hooks/useDeletePhrase'
import { useFetchData } from './hooks/useFetchData'
import { useSearch } from './hooks/useSearch'
import CreatePhraseModal from './components/CreatePhraseModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import TableHeader from './components/TableHeader'

interface Props {
  runtime: any
  showToast: (opts: { message: string; duration?: number }) => void
}

interface State {
  tableDensity: string
  filterStatements: any[]
}

// Hook wrapper component
const HookWrapper: React.FC<{
  showToast: (opts: { message: string; duration?: number }) => void
  children: (hooks: {
    createHook: ReturnType<typeof useCreatePhrase>
    deleteHook: ReturnType<typeof useDeletePhrase>
    fetchHook: ReturnType<typeof useFetchData>
    searchHook: ReturnType<typeof useSearch>
  }) => React.ReactNode
}> = ({ children, showToast }) => {
  const createHook = useCreatePhrase()
  const deleteHook = useDeletePhrase()
  const fetchHook = useFetchData(showToast)
  const searchHook = useSearch(fetchHook.items)

  return <>{children({ createHook, deleteHook, fetchHook, searchHook })}</>
}

class CookieTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      tableDensity: 'low',
      filterStatements: [],
    }
  }

  getSchema(onDeleteClick: (itemId: string) => void) {
    return {
      properties: {
        CookieFortune: {
          title: 'Fortune Message',
          cellRenderer: ({ rowData }: any) => (
            <span className="ws-normal">{rowData.CookieFortune}</span>
          ),
        },
        actions: {
          title: 'Acciones',
          cellRenderer: ({ rowData }: any) => (
            <Button
              variation="danger"
              size="small"
              onClick={() => onDeleteClick(rowData.id)}
            >
              Eliminar
            </Button>
          ),
        },
      },
    }
  }

  render() {
    const { tableDensity } = this.state

    return (
      <HookWrapper showToast={this.props.showToast}>
        {({ createHook, deleteHook, fetchHook, searchHook }) => (
          <div>
            <TableHeader
              onAddPhrase={() => createHook.setModalOpen(true)}
            />

            <Table
              fullWidth
              updateTableKey={`${tableDensity}-${searchHook.filteredItems.length}`}
              items={searchHook.filteredItems}
              schema={this.getSchema(deleteHook.openDeleteConfirmation)}
              density={tableDensity as any}
              loading={fetchHook.loading}
              toolbar={{
                density: {
                  buttonLabel: 'Line density',
                  lowOptionLabel: 'Low',
                  mediumOptionLabel: 'Medium',
                  highOptionLabel: 'High',
                  handleCallback: (density: string) =>
                    this.setState({ tableDensity: density }),
                },
                inputSearch: {
                  value: searchHook.searchValue || '',
                  placeholder: 'Buscar frase...',
                  onChange: searchHook.setSearchValue,
                  onClear: searchHook.clearSearch,
                  onSubmit: searchHook.handleSearchSubmit,
                },
              }}
              totalizers={[
                {
                  label: 'Total de frases',
                  value: fetchHook.items.length.toString(),
                  icon: <IconShoppingCart size={14} />,
                },
                {
                  label: 'Frases mostradas',
                  value: searchHook.filteredItems.length.toString(),
                  icon: <IconShoppingCart size={14} />,
                },
              ]}
            />

            <CreatePhraseModal
              isOpen={createHook.modalOpen}
              newPhrase={createHook.newPhrase}
              error={createHook.error}
              creating={createHook.creating}
              onClose={createHook.handleModalClose}
              onPhraseChange={(phrase: string) => {
                createHook.setNewPhrase(phrase)
                createHook.setError(null)
              }}
              onCreate={() => createHook.handleCreatePhrase(
                fetchHook.addItem,
                this.props.showToast
              )}
            />

            <DeleteConfirmationModal
              isOpen={deleteHook.confirmDeleteOpen}
              deleting={deleteHook.deleting}
              onConfirm={() => deleteHook.handleDeleteConfirmed(
                fetchHook.removeItem,
                this.props.showToast
              )}
              onCancel={deleteHook.handleDeleteCancel}
            />
          </div>
        )}
      </HookWrapper>
    )
  }
}

export default withRuntimeContext(withToast(CookieTable))
