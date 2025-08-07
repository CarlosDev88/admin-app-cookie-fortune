import React, { Component } from 'react'
import { Table, Button, IconShoppingCart } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'

interface Props {
  runtime: any
}

interface State {
  items: any[]
  tableDensity: string
  searchValue: string | null
  filterStatements: any[]
  loading: boolean
}

class UsersTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: [],
      tableDensity: 'low',
      searchValue: null,
      filterStatements: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  async fetchData() {
    try {
      const response = await fetch('/_v/fortune-cookies')
      const json = await response.json()

      this.setState({
        items: json.data.ok || [],
        loading: false
      })
    } catch (error) {
      console.error('Error fetching data', error)
      this.setState({ loading: false })
    }
  }

  async handleDelete(id: string) {
    try {
      await fetch(`/_v/fortune-cookies/${id}`, { method: 'DELETE' })
      this.setState(prev => ({
        items: prev.items.filter(item => item.id !== id)
      }))
      console.log(`Registro ${id} eliminado`)
    } catch (error) {
      console.error('Error al eliminar', error)
    }
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
              onClick={() => this.handleDelete(rowData.id)}
            >
              Eliminar
            </Button>
          ),
        },
      },
    }
  }

  render() {
    const { items, searchValue, tableDensity, loading } = this.state

    return (
      <div>
        <Table
          fullWidth
          updateTableKey={tableDensity}
          items={items}
          schema={this.getSchema()}
          density="low"
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
              value: searchValue,
              placeholder: 'Search...',
              onChange: (value: string) =>
                this.setState({ searchValue: value }),
              onClear: () => this.setState({ searchValue: null }),
              onSubmit: () => {},
            },
          }}
          totalizers={[
            {
              label: 'Total fortunes',
              value: items.length.toString(),
              icon: <IconShoppingCart size={14} />,
            },
          ]}
        />
      </div>
    )
  }
}

export default withRuntimeContext(UsersTable)
