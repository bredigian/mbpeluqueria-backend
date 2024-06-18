# Express.js + TypeScript Backend

Este proyecto es una configuración inicial para un backend utilizando Express.js y TypeScript. Incluye dependencias de desarrollo como Nodemon y otras necesarias para un entorno de desarrollo eficiente.

## Contenido

- [Instalación](#instalación)
- [Scripts](#scripts)
- [Dependencias](#dependencias)
- [Autor](#autor)

## Instalación

Para instalar las dependencias del proyecto, asegúrate de tener `pnpm` instalado (también es posible utilizar `npm`) y ejecuta:

```bash
pnpm install
```

## Scripts

En el archivo package.json se han definido los siguientes scripts:

- dev: Ejecuta el proyecto en modo desarrollo con Nodemon para recargar automáticamente ante cambios.

```bash
pnpm run dev
```

- build: Compila el proyecto TypeScript a JavaScript.

```bash
pnpm run build
```

- start: Ejecuta el proyecto en modo producción (se debe ejecutar `pnpm run build` anteriormente).

```bash
pnpm run start
```

## Dependencias

### Producción

- cors: Middleware para habilitar CORS en Express.
- express: Framework de backend web para Node.js.

### Desarrollo

- @types/cors: Tipos para la biblioteca cors.
- @types/express: Tipos para la biblioteca express.
- @types/node: Tipos para Node.js.
- dotenv: Carga variables de entorno desde un archivo .env.
- ts-node: Ejecuta archivos TypeScript directamente.
- typescript: Lenguaje de programación tipado que compila a JavaScript.

## Autor

- Gianluca Bredice
  - Email: bredicegian@gmail.com
  - Sitio Web: https://devbredicegian.site

## Licencia

Este proyecto está licenciado bajo la licencia ISC
