## API REST - Lista de tareas (To Do List)

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

| Método | Ruta               | Descripción            |
| ------ | ------------------ | ---------------------- |
| GET    | /api/tasks         | Lista todas las tareas |
| POST   | /api/tasks         | Crea una tarea         |
| GET    | /api/tasks/:taskId | Obtiene una tarea      |
| PUT    | /api/tasks/:taskId | Reemplaza una tarea    |
| PATCH  | /api/tasks/:taskId | Actualiza campos       |
| DELETE | /api/tasks/:taskId | Elimina una tarea      |

Campos aceptados en el body (POST/PUT/PATCH): `title`, `description`, `due_date`, `completed`.

## Resumen del proyecto

API REST simple sobre Express + MongoDB (Mongoose) para gestionar tareas (`title`, `description`, `due_date`, `completed`). El proyecto original databa de 2018-2019 y usaba dependencias muy desactualizadas. El 2026-07-29 se hizo una revisión completa de código, vulnerabilidades y dependencias.

## Arquitectura

- `server.js`: arranque de la app, middlewares de seguridad, conexión a MongoDB, manejo de errores centralizado.
- `models/taskModel.js`: schema de Mongoose para `Task`.
- `routes/taskRouter.js`: rutas CRUD bajo `/api/tasks`.
- `.env` / `.env.example`: configuración (nunca commitear `.env`).
- `eslint.config.js`: configuración plana de ESLint 10.

## Stack y versiones (actualizado 2026-07-29)

| Paquete            | Antes      | Ahora     | Motivo                                                                                                      |
| ------------------ | ---------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| express            | 4.16.3     | ^5.2.1    | Fin de soporte de 4.x llegando; Express 5 reenvía automáticamente errores async a los middlewares de error. |
| mongoose           | 5.2.9      | ^9.8.1    | 5.x deprecado hace años; 9.x requiere Promesas/async-await (ya no soporta callbacks).                       |
| body-parser        | 1.18.3     | eliminado | Express 5 incluye `express.json()` / `express.urlencoded()` nativos.                                        |
| eslint             | 6.5.1      | ^10.8.0   | 6.x sin soporte; ESLint 9+ usa "flat config" (`eslint.config.js`), se retiró `.eslintrc.json`.              |
| dotenv             | no usado   | ^17.4.2   | El proyecto tenía un `.env` que **nunca se cargaba** (ver errores conocidos).                               |
| helmet             | no existía | ^8.3.0    | Cabeceras de seguridad HTTP.                                                                                |
| cors               | no existía | ^2.8.6    | Control explícito de orígenes permitidos.                                                                   |
| express-rate-limit | no existía | ^8.6.1    | Mitigación básica de fuerza bruta / DoS.                                                                    |

`npm audit` tras la actualización: **0 vulnerabilidades**.
