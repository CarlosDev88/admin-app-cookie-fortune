# Admin Fortune Cookies

## Descripción General

**Admin Fortune Cookies** es una aplicación que permite gestionar mensajes de galletas de la fortuna. La aplicación proporciona una interfaz completa para crear, visualizar, buscar y eliminar mensajes.

## Información Técnica

- **Nombre**: admin-fortune-cookies
- **Vendor**: valtech
- **Versión**: 0.0.12
- **Plataforma**: VTEX IO
- **Framework**: React con TypeScript

## Características Principales

### 🎯 Funcionalidades Core

- **Creación de mensajes**: Interfaz modal para agregar nuevos mensajes de hasta 700 caracteres
- **Visualización tabular**: Lista completa de todos los mensajes con opciones de densidad
- **Búsqueda en tiempo real**: Filtrado por contenido del mensaje o ID
- **Eliminación con confirmación**: Sistema seguro de borrado con modal de confirmación
- **Notificaciones toast**: Feedback visual para todas las operaciones

### 📊 Características de la Tabla

- **Densidad ajustable**: Opciones de densidad baja, media y alta
- **Totalizadores**: Contador de frases totales y mostradas
- **Responsive**: Diseño adaptativo para diferentes pantallas
- **Loading states**: Indicadores de carga durante operaciones

## Arquitectura de Componentes

### Componentes Principales

#### `AdminCookiesFortune`
**Tipo**: Functional Component (FC)
**Propósito**: Componente raíz que define el layout principal de la aplicación admin.

**Implementación**:
```typescript
const AdminCookiesFortune: FC = () => {
  return (
    <Layout
      pageHeader={<PageHeader title={<FormattedMessage id="admin-cookies.title-table" />} />}
    >
      <PageBlock variation="full">
        <CookieTable />
      </PageBlock>
    </Layout>
  );
};
```

**Responsabilidades**:
- Estructura el layout usando componentes de `vtex.styleguide`
- Configura el PageHeader con internacionalización
- Renderiza el componente principal `CookieTable` dentro de un PageBlock
- No maneja estado, actúa como contenedor de presentación

**Dependencias**:
- `vtex.styleguide`: Layout, PageBlock, PageHeader
- `react-intl`: FormattedMessage para i18n

#### `CookieTable`
**Tipo**: Class Component con HookWrapper pattern
**Propósito**: Componente principal que orquesta toda la funcionalidad CRUD y renderiza la tabla de datos.

**Arquitectura híbrida**:
```typescript
// Class Component para state de UI
class CookieTable extends Component<Props, State> {
  state = {
    tableDensity: 'low',
    filterStatements: []
  };
}

// HookWrapper para lógica de negocio
const HookWrapper: FC = ({ children, showToast }) => {
  const createHook = useCreatePhrase();
  const deleteHook = useDeletePhrase();
  const fetchHook = useFetchData(showToast);
  const searchHook = useSearch(fetchHook.items);
  
  return <>{children({ createHook, deleteHook, fetchHook, searchHook })}</>;
};
```

**Schema de tabla**:
```typescript
getSchema(onDeleteClick: (itemId: string) => void) {
  return {
    properties: {
      CookieFortune: {
        title: 'Fortune Message',
        cellRenderer: ({ rowData }) => (
          <span className="ws-normal">{rowData.CookieFortune}</span>
        )
      },
      actions: {
        title: 'Acciones',
        cellRenderer: ({ rowData }) => (
          <Button variation="danger" size="small" 
                  onClick={() => onDeleteClick(rowData.id)}>
            Eliminar
          </Button>
        )
      }
    }
  };
}
```

**Responsabilidades**:
- Coordinación de todos los hooks personalizados
- Configuración del schema de la tabla VTEX
- Gestión del estado local de UI (densidad, filtros)
- Renderizado de modales y tabla principal
- Configuración de toolbar con search y density controls
- Manejo de totalizadores

**Props requeridas**:
- `runtime`: Context de VTEX Runtime
- `showToast`: Función de notificaciones toast

#### `CreatePhraseModal`
**Tipo**: Functional Component
**Propósito**: Modal controlado para creación de nuevos mensajes con validación en tiempo real.

**Interface**:
```typescript
interface CreatePhraseModalProps {
  isOpen: boolean;
  newPhrase: string;
  error: string | null;
  creating: boolean;
  onClose: () => void;
  onPhraseChange: (phrase: string) => void;
  onCreate: () => void;
}
```

**Funcionalidades técnicas**:
- **Validación de caracteres**: Límite hard de 700 caracteres con contador visual
- **Control de estado**: Maneja loading states y previene múltiples submits
- **Validación de entrada**: 
  ```typescript
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 700) {
      onPhraseChange(e.target.value);
    }
  };
  ```
- **Estilos inline**: Configuración de tema visual específico
- **Gestión de errores**: Display condicional de mensajes de error

**Dependencias**:
- `vtex.styleguide`: Modal, Button, Textarea

#### `DeleteConfirmationModal`
**Tipo**: Functional Component
**Propósito**: Modal de confirmación para operaciones destructivas con UX de seguridad.

**Interface**:
```typescript
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Características técnicas**:
- **Patrón de confirmación**: Requiere acción explícita del usuario
- **Estados de carga**: Deshabilita controles durante operación DELETE
- **Acciones duales**: Botones de cancelar y confirmar con diferentes estilos
- **CSS Classes**: Utiliza clases CSS personalizadas para styling específico
- **Prevención de clicks accidentales**: Deshabilita botones durante `deleting: true`

**Dependencias**:
- `vtex.styleguide`: Modal, Button

#### `TableHeader`
**Tipo**: Functional Component
**Propósito**: Header personalizado que proporciona contexto visual y acción principal.

**Interface**:
```typescript
interface TableHeaderProps {
  onAddPhrase: () => void;
}
```

**Implementación**:
```typescript
return (
  <div style={{ backgroundColor: '#FFF7E0', padding: '16px', borderRadius: '8px', ... }}>
    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', ... }}>
      🥠 Galletas de la Fortuna
    </h2>
    <Button variation="primary" size="small" onClick={onAddPhrase}>
      🥠 Agregar frase
    </Button>
  </div>
);
```

**Características técnicas**:
- **Estilos inline**: Configuración directa de tema visual
- **Layout flexbox**: Distribución espacial entre título y acción
- **Callback pattern**: Recibe función de callback para acción principal
- **Responsive design**: Adaptación automática del layout

**Dependencias**:
- `vtex.styleguide`: Button

### Custom Hooks

#### `useCreatePhrase`
**Propósito**: Encapsula toda la lógica relacionada con la creación de nuevos mensajes de galletas de la fortuna, incluyendo validaciones, estados de carga y gestión del modal.

**¿Cómo funciona?**
```typescript
// Estado interno que gestiona
{
  newPhrase: string;        // Texto del mensaje que se está escribiendo
  error: string | null;     // Mensajes de error de validación
  creating: boolean;        // Estado de carga durante el POST
  modalOpen: boolean;       // Control de visibilidad del modal
}
```

**Flujo de funcionamiento:**
1. **Apertura del modal**: `setModalOpen(true)` abre la interfaz de creación
2. **Escritura de texto**: `setNewPhrase()` actualiza el contenido en tiempo real
3. **Validación**: Al intentar crear, verifica que el texto no esté vacío
4. **Petición HTTP**: Realiza POST a `/_v/fortune-cookie` con el mensaje
5. **Gestión de respuesta**: 
   - ✅ **Éxito**: Actualiza la lista, cierra modal, muestra toast verde
   - ❌ **Error**: Mantiene modal abierto, muestra toast de error
6. **Limpieza**: Resetea todos los estados al cerrar

**Características especiales:**
- **Validación en tiempo real**: Limita a 700 caracteres con contador visual
- **Prevención de spam**: Deshabilita botones durante `creating: true`
- **Gestión de errores**: Maneja errores de red y validación por separado
- **Auto-limpieza**: Resetea el formulario automáticamente tras éxito

#### `useDeletePhrase`
**Propósito**: Gestiona el flujo completo de eliminación con confirmación de seguridad, evitando borrados accidentales y proporcionando feedback claro al usuario.

**¿Cómo funciona?**
```typescript
// Estado para el proceso de eliminación segura
{
  confirmDeleteOpen: boolean;    // Modal de confirmación visible
  itemToDelete: string | null;   // ID del mensaje a eliminar
  deleting: boolean;             // Estado de carga durante DELETE
}
```

**Flujo de funcionamiento:**
1. **Iniciación**: `openDeleteConfirmation(itemId)` guarda el ID y abre modal
2. **Confirmación**: Usuario debe confirmar explícitamente la acción
3. **Petición HTTP**: DELETE a `/_v/fortune-cookie/${itemId}`
4. **Actualización local**: Remueve el item de la lista sin recargar todo
5. **Feedback**: Toast de confirmación y cierre automático del modal
6. **Cancelación**: `handleDeleteCancel()` permite abortar la operación

**Características especiales:**
- **Patrón de confirmación**: Doble confirmación para prevenir accidentes
- **Estado persistente**: Mantiene el ID durante todo el proceso
- **Optimistic updates**: Actualiza UI inmediatamente tras confirmación
- **Rollback implícito**: En caso de error, la lista no se modifica

#### `useFetchData`
**Propósito**: Centraliza toda la gestión de datos del servidor, proporcionando un estado unificado para la lista de mensajes y métodos para manipulación local optimista.

**¿Cómo funciona?**
```typescript
// Estado principal de datos de la aplicación
{
  items: any[];              // Lista completa de mensajes
  loading: boolean;          // Carga inicial y refresco
  error: string | null;      // Errores de comunicación con API
}

// Métodos para sincronización
{
  refetch: () => Promise<void>;        // Recarga completa desde servidor
  addItem: (newItem) => void;          // Actualización optimista post-creación
  removeItem: (itemId) => void;        // Actualización optimista post-eliminación
}
```

**Flujo de funcionamiento:**
1. **Carga inicial**: `useEffect` dispara `fetchData()` al montar el componente
2. **Petición HTTP**: GET a `/_v/fortune-cookies` para obtener lista completa
3. **Normalización de datos**: Maneja diferentes formatos de respuesta del API
4. **Gestión de estados**: Actualiza `loading`, `error` e `items` según la respuesta
5. **Manipulación local**: 
   - `addItem()`: Añade nuevo elemento sin refetch
   - `removeItem()`: Filtra elemento eliminado
   - `refetch()`: Recarga completa cuando sea necesario

**Características especiales:**
- **Resilencia**: Maneja múltiples formatos de respuesta API (`json.data?.ok || json.data || []`)
- **Optimistic updates**: Actualiza UI antes de confirmar con servidor
- **Error recovery**: Sistema robusto de manejo de errores de red
- **Separación de responsabilidades**: Solo maneja datos, no lógica de UI

#### `useSearch`
**Propósito**: Implementa un sistema de filtrado en tiempo real que permite buscar mensajes por contenido o ID, con lógica optimizada para grandes volúmenes de datos.

**¿Cómo funciona?**
```typescript
// Estado de búsqueda y resultados filtrados
{
  searchValue: string | null;    // Término de búsqueda actual
  filteredItems: any[];          // Lista filtrada en tiempo real
}

// Métodos de control
{
  setSearchValue: (value) => void;     // Actualiza término de búsqueda
  clearSearch: () => void;             // Limpia filtro
  handleSearchSubmit: () => void;      // Callback para envío (placeholder)
}
```

**Flujo de funcionamiento:**
1. **Entrada de usuario**: `setSearchValue()` captura texto de búsqueda
2. **Normalización**: Convierte entrada a lowercase y elimina espacios extra
3. **Filtrado con useMemo**: 
   ```typescript
   // Búsqueda en múltiples campos
   return items.filter(item => {
     const message = item.CookieFortune?.toLowerCase() || '';
     const id = item.id?.toString().toLowerCase() || '';
     return message.includes(searchTerm) || id.includes(searchTerm);
   });
   ```
4. **Optimización**: Solo recalcula cuando `items` o `searchValue` cambian
5. **Casos especiales**: Maneja valores null/undefined y diferentes tipos de entrada

**Características especiales:**
- **Búsqueda multi-campo**: Busca en contenido del mensaje Y en ID
- **Performance optimizada**: `useMemo` evita cálculos innecesarios
- **Flexibilidad de entrada**: Maneja strings, eventos, objetos y valores nulos
- **Búsqueda inclusiva**: Case-insensitive y con partial matching
- **Estado limpio**: `clearSearch()` restaura vista completa instantáneamente

### Patrón de Integración de Hooks

La aplicación utiliza un **HookWrapper** que encapsula todos los hooks y los pasa como props a los componentes hijos:

```typescript
const HookWrapper: React.FC = ({ children, showToast }) => {
  const createHook = useCreatePhrase();
  const deleteHook = useDeletePhrase();
  const fetchHook = useFetchData(showToast);
  const searchHook = useSearch(fetchHook.items);  // Dependencia directa

  return <>{children({ createHook, deleteHook, fetchHook, searchHook })}</>;
};
```

**Ventajas de este patrón:**
- **Separación limpia**: Lógica de hooks separada de componentes de clase
- **Composición**: Combina múltiples hooks de forma elegante
- **Dependencias explícitas**: `searchHook` depende de `fetchHook.items`
- **Testabilidad**: Cada hook se puede probar independientemente
- **Reutilización**: Hooks pueden usarse en otros componentes sin modificación

## API Endpoints

### Obtener todas las frases
```
GET /_v/fortune-cookies
```
**Respuesta**: Array de objetos con mensajes

### Crear nueva frase
```
POST /_v/fortune-cookie
Content-Type: application/json

{
  "CookieFortune": "Tu mensaje inspirador aquí"
}
```

### Eliminar frase
```
DELETE /_v/fortune-cookie/{id}
```

## Configuración VTEX IO

### Manifest.json
```json
{
  "dependencies": {
    "vtex.styleguide": "9.x"
  },
  "builders": {
    "react": "3.x",
    "admin": "0.x",
    "messages": "1.x",
    "docs": "0.x"
  }
}
```

### Navegación
- **Sección**: orders
- **SubSección**: example
- **Ruta**: `/admin/cookies-fortune`

### Routing
- **Admin Path**: `/admin/app/cookies-fortune`
- **Componente**: `AdminCookiesFortune`

## Guía de Desarrollo

### Estructura de Archivos
```
/react/
  AdminCookiesFortune.tsx      # Componente principal
  CookieTable.tsx              # Tabla principal
  /components/
    CreatePhraseModal.tsx      # Modal de creación
    DeleteConfirmationModal.tsx # Modal de eliminación
    TableHeader.tsx            # Header personalizado
  /hooks/
    useCreatePhrase.ts         # Hook de creación
    useDeletePhrase.ts         # Hook de eliminación
    useFetchData.ts           # Hook de datos
    useSearch.ts              # Hook de búsqueda
  /styles/
    styles.global.css         # Estilos globales
```

### Dependencias Principales
- **vtex.styleguide**: Componentes UI de VTEX
- **vtex.render-runtime**: Context de runtime
- **react-intl**: Internacionalización

### Patrones de Desarrollo

#### Gestión de Estado
- **Hooks customizados** para lógica específica
- **Props drilling** controlado mediante composition
- **Estado local** para UI temporal

#### Manejo de Errores
- Try-catch en operaciones async
- Notificaciones toast para feedback
- Estados de loading durante operaciones

#### Validaciones
- **Frontend**: Longitud de mensajes, campos obligatorios
- **UX**: Prevención de envíos duplicados con loading states

## Guía de Usuario

### Crear un Nuevo Mensaje

1. Hacer clic en "🥠 Agregar frase"
2. Escribir el mensaje (máximo 700 caracteres)
3. Hacer clic en "Crear frase"
4. Confirmar la notificación de éxito

### Buscar Mensajes

1. Usar la barra de búsqueda en la parte superior de la tabla
2. Escribir términos de búsqueda (busca en contenido e ID)
3. Los resultados se filtran automáticamente
4. Usar "Limpiar" para mostrar todos los mensajes

### Eliminar un Mensaje

1. Hacer clic en "Eliminar" junto al mensaje deseado
2. Confirmar la eliminación en el modal
3. El mensaje se eliminará permanentemente

### Ajustar Visualización

- **Densidad de tabla**: Usar el menú desplegable para cambiar entre Alta, Media y Baja
- **Totalizadores**: Ver contadores de frases totales y mostradas en la parte inferior

