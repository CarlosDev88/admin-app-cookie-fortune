import React, { Component } from 'react'
import {
  Table,
  Button,
  IconShoppingCart,
  Modal,
  Textarea,
  withToast,
} from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'

interface Props {
  runtime: any
  showToast: (opts: { message: string; duration?: number }) => void
}

interface State {
  items: any[]
  tableDensity: string
  searchValue: string | null
  filterStatements: any[]
  loading: boolean
  modalOpen: boolean
  newPhrase: string
  error: string | null
  creating: boolean
  confirmDeleteOpen: boolean
  itemToDelete: string | null
  deleting: boolean
}

class UsersTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: [],
      tableDensity: 'low',
      searchValue: null,
      filterStatements: [],
      loading: true,
      modalOpen: false,
      newPhrase: '',
      error: null,
      creating: false,
      confirmDeleteOpen: false,
      itemToDelete: null,
      deleting: false,
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  async fetchData() {
    try {
      this.setState({ loading: true })
      const response = await fetch(`/_v/fortune-cookies?_t=${Date.now()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log('Fetched data:', json)

      this.setState({
        items: Array.isArray(json) ? json : (json.data?.ok || json.data || []),
        loading: false,
      })
    } catch (error) {
      console.error('Error fetching data', error)
      this.setState({ loading: false })
      this.props.showToast({
        message: '❌ Error al cargar las frases',
        duration: 5000,
      })
    }
  }

  handleDeleteConfirmed = async () => {
    const { itemToDelete } = this.state
    if (!itemToDelete) return

    try {
      this.setState({ deleting: true })

      const response = await fetch(`/_v/fortune-cookie/${itemToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      this.setState(
        (prevState) => ({
          items: prevState.items.filter((item) => item.id !== itemToDelete),
          confirmDeleteOpen: false,
          itemToDelete: null,
          deleting: false,
        }),
        () => {
          if (this.props.showToast) {
            this.props.showToast({
              message: `🗑️ Frase eliminada exitosamente`,
              duration: 5000,
            })
          }
        }
      )
    } catch (error) {
      console.error('Error al eliminar', error)
      this.setState({
        confirmDeleteOpen: false,
        itemToDelete: null,
        deleting: false,
      })

      if (this.props.showToast) {
        this.props.showToast({
          message: '❌ Error al eliminar frase',
          duration: 5000,
        })
      }
    }
  }

  handleCreatePhrase = async () => {
    const { newPhrase } = this.state

    if (!newPhrase.trim()) {
      this.setState({ error: 'El mensaje no puede estar vacío' })
      return
    }

    try {
      this.setState({ error: null, creating: true })

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

      // Obtenemos la respuesta que ahora contiene el objeto creado
      const newPhraseObject = await response.json()
      console.log('Created item response:', newPhraseObject)

      // Actualizamos el estado con la nueva frase sin necesidad de volver a llamar a la API
      this.setState(
        (prevState) => ({
          items: [...prevState.items, newPhraseObject],
          modalOpen: false,
          newPhrase: '',
          creating: false,
        }),
        () => {
          // Mostrar toast después de la actualización.
          if (this.props.showToast) {
            this.props.showToast({
              message: '🥠 Frase creada con éxito',
              duration: 5000,
            })
          }
        }
      )
    } catch (error) {
      console.error('Error creating phrase:', error)
      this.setState({ creating: false })

      if (this.props.showToast) {
        this.props.showToast({
          message: '❌ Error al crear la frase',
          duration: 5000,
        })
      }
    }
  }

  handleModalClose = () => {
    this.setState({
      modalOpen: false,
      newPhrase: '',
      error: null,
    })
  }

  handleDeleteCancel = () => {
    this.setState({
      confirmDeleteOpen: false,
      itemToDelete: null,
    })
  }

  getSchema() {
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
              onClick={() =>
                this.setState({
                  confirmDeleteOpen: true,
                  itemToDelete: rowData.id,
                })
              }
            >
              Eliminar
            </Button>
          ),
        },
      },
    }
  }

  render() {
    const {
      items,
      tableDensity,
      loading,
      modalOpen,
      newPhrase,
      error,
      creating,
      confirmDeleteOpen,
      deleting,
    } = this.state

    return (
      <div>
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
            onClick={() => this.setState({ modalOpen: true })}
          >
            🥠 Agregar frase
          </Button>
        </div>

        <Table
          fullWidth
          updateTableKey={`${tableDensity}-${items.length}`}
          items={items}
          schema={this.getSchema()}
          density={tableDensity as any}
          loading={loading}
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
              value: this.state.searchValue,
              placeholder: 'Buscar frase...',
              onChange: (value: string) =>
                this.setState({ searchValue: value }),
              onClear: () => this.setState({ searchValue: null }),
              onSubmit: () => {},
            },
          }}
          totalizers={[
            {
              label: 'Total de frases',
              value: items.length.toString(),
              icon: <IconShoppingCart size={14} />,
            },
          ]}
        />

        {/* Modal Crear */}
        <Modal
          centered
          isOpen={modalOpen}
          onClose={this.handleModalClose}
        >
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
              onChange={(e: any) => {
                if (e.target.value.length <= 700) {
                  this.setState({ newPhrase: e.target.value, error: null })
                }
              }}
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
                onClick={this.handleModalClose}
                disabled={creating}
              >
                Cancelar
              </Button>
              <span className="ml3">
                <Button
                  variation="primary"
                  isLoading={creating}
                  onClick={this.handleCreatePhrase}
                >
                  Crear frase
                </Button>
              </span>
            </div>
          </div>
        </Modal>

        {/* Modal Confirmar Eliminación */}
        <Modal
          centered
          isOpen={confirmDeleteOpen}
          onClose={this.handleDeleteCancel}
        >
          <div className="deleteModal">
            <div className="deleteModal__text">
              <h3>¿Deseas eliminar esta frase? 🗑️</h3>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="deleteModal__buttons">
              <Button
                variation="secondary"
                size="small"
                onClick={this.handleDeleteCancel}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                size="small"
                isLoading={deleting}
                onClick={this.handleDeleteConfirmed}
              >
                Sí, eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default withRuntimeContext(withToast(UsersTable))
