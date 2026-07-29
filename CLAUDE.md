# CLAUDE.md

Documentación técnica del proyecto **ApiRest-NODEjs** (API REST de lista de tareas) para uso de Claude Code y de cualquier colaborador humano.

## Resumen del proyecto

API REST simple sobre Express + MongoDB (Mongoose) para gestionar tareas (`title`, `description`, `due_date`, `completed`). El proyecto original databa de 2018-2019 y usaba dependencias muy desactualizadas. El 2026-07-29 se hizo una revisión completa de código, vulnerabilidades y dependencias.

## Arquitectura

- `server.js`: arranque de la app, middlewares de seguridad, conexión a MongoDB, manejo de errores centralizado.
- `models/taskModel.js`: schema de Mongoose para `Task`.
- `routes/taskRouter.js`: rutas CRUD bajo `/api/tasks`.
- `.env` / `.env.example`: configuración (nunca commitear `.env`).
- `eslint.config.js`: configuración plana de ESLint 10.

## Stack y versiones (actualizado 2026-07-29)

| Paquete             | Antes    | Ahora   | Motivo |
|---------------------|----------|---------|--------|
| express             | 4.16.3   | ^5.2.1  | Fin de soporte de 4.x llegando; Express 5 reenvía automáticamente errores async a los middlewares de error. |
| mongoose            | 5.2.9    | ^9.8.1  | 5.x deprecado hace años; 9.x requiere Promesas/async-await (ya no soporta callbacks). |
| body-parser         | 1.18.3   | eliminado | Express 5 incluye `express.json()` / `express.urlencoded()` nativos. |
| eslint              | 6.5.1    | ^10.8.0 | 6.x sin soporte; ESLint 9+ usa "flat config" (`eslint.config.js`), se retiró `.eslintrc.json`. |
| dotenv              | no usado | ^17.4.2 | El proyecto tenía un `.env` que **nunca se cargaba** (ver errores conocidos). |
| helmet              | no existía | ^8.3.0 | Cabeceras de seguridad HTTP. |
| cors                | no existía | ^2.8.6 | Control explícito de orígenes permitidos. |
| express-rate-limit  | no existía | ^8.6.1 | Mitigación básica de fuerza bruta / DoS. |

`npm audit` tras la actualización: **0 vulnerabilidades**.

## Vulnerabilidades encontradas y corregidas

1. **Credenciales de base de datos hardcodeadas en `server.js`**. La cadena de conexión (usuario/password de mLab) estaba escrita directamente en el código fuente y además el archivo `.env` existía pero nunca se leía (faltaba `dotenv`). Corregido: `server.js` ahora usa `dotenv` y falla explícitamente si falta `DB_ADDRESS`.
2. **`.env` sin proteger**: el `.gitignore` no lo excluía, por lo que las credenciales podían terminar versionadas. Corregido: se añadió `.env` a `.gitignore` y se creó `.env.example` como plantilla sin secretos.
3. **Mass assignment** en `POST/PUT/PATCH`: se hacía `new Task(req.body)` / se copiaban campos completos del body sin whitelist, permitiendo que un cliente intentara sobrescribir campos internos. Corregido: función `pickAllowedFields()` en `taskRouter.js` que sólo permite `title`, `description`, `due_date`, `completed`; además el schema usa `strict: true`.
4. **Sin cabeceras de seguridad HTTP** (Helmet ausente). Corregido: `app.use(helmet())`.
5. **Sin control de CORS** (cualquier origen implícito sin cabeceras). Corregido: middleware `cors` configurable vía `CORS_ORIGIN`.
6. **Sin límite de peticiones** (expuesto a fuerza bruta/DoS simple). Corregido: `express-rate-limit` (300 req / 15 min por IP, ajustable).
7. **Dependencias con años de antigüedad** (express 4.16.3 de 2018, mongoose 5.2.9, body-parser 1.18.3, eslint 6.5.1) con vulnerabilidades conocidas acumuladas en el ecosistema. Corregido: actualización completa a las últimas versiones estables (ver tabla arriba).
8. **Errores no controlados devolvían stack traces / crasheaban el proceso** (por ejemplo, un `taskId` con formato inválido lanzaba una excepción no capturada). Corregido: middleware de errores central en `server.js` que traduce `CastError`/`ValidationError` de Mongoose a respuestas 400 sin filtrar detalles internos.

## Errores conocidos (para no volver a cometerlos)

- **No asumir que un archivo `.env` se está usando**: hay que verificar que exista `require('dotenv').config()` (o equivalente) antes de leer `process.env`. En este proyecto el `.env` llevaba años sin efecto porque nadie lo cargaba y las credenciales estaban hardcodeadas en paralelo en `server.js`.
- **Mongoose 7+ eliminó el soporte de callbacks** (`Model.find({}, callback)` ya no funciona correctamente). Cualquier código nuevo debe usar `async/await` o `.then/.catch`.
- **Express 5 reenvía automáticamente las promesas rechazadas de handlers `async`** al middleware de errores (a diferencia de Express 4, donde había que hacer `try/catch` + `next(err)` manualmente). No añadir `try/catch` redundante en cada ruta: basta con `async (req, res) => { ... }` y dejar que el error se propague.
- **Nunca hacer `new Model(req.body)` directamente** con datos del cliente: es una vulnerabilidad de mass assignment. Siempre filtrar campos explícitamente (whitelist) antes de pasar el body al modelo.
- **`res.status(204)` no debe llevar body** (el código original hacía `res.status(204).send("removed")`, lo cual es inválido según el estándar HTTP). Usar `res.status(204).end()`.
- **ESLint 9+ ya no lee `.eslintrc.json`** por defecto; requiere `eslint.config.js` (flat config) y el paquete `@eslint/js` para el preset `recommended`.
- **mLab (`mlab.com`) dejó de operar en 2020**: cualquier cadena de conexión que apunte ahí es inservible; si se ve en configuraciones antiguas, hay que migrar a MongoDB Atlas o una instancia propia.

## Comandos útiles

```
npm install       # instalar dependencias
npm start         # arrancar el servidor
npm run dev       # arrancar con recarga automática (node --watch)
npx eslint .      # lint
npm audit         # revisar vulnerabilidades de dependencias
```

## Pendiente / posibles mejoras futuras

- Añadir tests automatizados (actualmente `npm test` no ejecuta nada real).
- Añadir autenticación/autorización si la API deja de ser de uso interno.
- Definir `CORS_ORIGIN` explícito en producción (actualmente `*` por defecto en `.env.example`).
