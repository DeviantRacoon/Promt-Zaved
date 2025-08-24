# Arquitectura

La aplicacion usa [Preact](https://preactjs.com/) con [Vite](https://vitejs.dev/) como herramienta de compilacion.

## Entrada

- `src/main.tsx` aplica estilos globales y renderiza el componente `App`.
- `src/app.tsx` define las rutas principales mediante `preact-router`.

## Modulos

### Autenticacion (`src/modules/auth`)
Maneja el inicio de sesion, registro, recuperacion de contrasena y configuracion de usuario.

### Prompts (`src/modules/prompt`)
Contiene el dashboard, creacion/edicion de prompts y configuracion de la aplicacion.

## Utilidades Compartidas

- `src/common`, `src/hooks`, `src/libs` y `src/config` agrupan estilos, hooks y utilidades compartidas.
