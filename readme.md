API REST - Lista de tareas (To Do List)
----------------------------------------------------------

## Instalación

```
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`.
2. Completar `DB_ADDRESS` con la cadena de conexión de tu instancia de MongoDB.
3. Opcionalmente ajustar `PORT` y `CORS_ORIGIN`.

El archivo `.env` **no debe subirse al repositorio** (ya está incluido en `.gitignore`).

## Ejecución

```
npm start
```

Modo desarrollo (reinicia el proceso al detectar cambios):

```
npm run dev
```

## Uso

Raíz de la API: `http://localhost:3100/api/tasks/`

| Método | Ruta                | Descripción            |
|--------|---------------------|-------------------------|
| GET    | /api/tasks          | Lista todas las tareas  |
| POST   | /api/tasks          | Crea una tarea          |
| GET    | /api/tasks/:taskId  | Obtiene una tarea       |
| PUT    | /api/tasks/:taskId  | Reemplaza una tarea     |
| PATCH  | /api/tasks/:taskId  | Actualiza campos        |
| DELETE | /api/tasks/:taskId  | Elimina una tarea       |

Campos aceptados en el body (POST/PUT/PATCH): `title`, `description`, `due_date`, `completed`.

Ver también [CLAUDE.md](CLAUDE.md) para el detalle de la arquitectura, las vulnerabilidades corregidas y los errores conocidos.
