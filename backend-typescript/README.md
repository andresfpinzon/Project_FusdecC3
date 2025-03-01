# API REST con TypeScript y Express 🚀

Una API REST robusta construida con TypeScript, Express y MongoDB, que incluye autenticación de usuarios, autorización y manejo integral de errores.

## 🌟 Características

- **Autenticación y Autorización**
  - Autenticación basada en JWT
  - Control de acceso basado en roles
  - Funcionalidad de token de actualización

- **Gestión de Usuarios**
  - Registro e inicio de sesión
  - Actualización de perfiles
  - Gestión de estado de cuenta
  - Eliminación de usuarios

- **Seguridad**
  - Encriptación de contraseñas
  - Validación de tokens JWT
  - Validación de solicitudes
  - Límite de velocidad de peticiones

- **Documentación de API**
  - Integración con Swagger/OpenAPI
  - Autenticación mediante Bearer token

## 🛠️ Tecnologías Utilizadas

- Node.js
- TypeScript
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- Swagger para documentación de API
- Zod para validaciones

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd ts
```
## 📦 Instalar las dependencias
1. Instalar las dependencias:
```bash
npm i express mongoose dotenv bcrypt jsonwebtoken cors cookie-parser helmet express-rate-limit morgan zod swagger-jsdoc swagger-ui-express
```
2. Dependencias de desarrollo:
```bash
npm i -D typescript ts-node-dev tsconfig-paths @types/express @types/cookie-parser@types/node @typs/express @types/mongoose @types/cors @types/bcrypt @types/jsonwebtoken @types/morgan @types/swagger-jsdoc @types/swagger-ui-express
```
3. Iniciar typescript:
```bash
npx tsc --init
```
4. Configurar el archivo tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "moduleResolution": "node",
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "paths": {
      "@controllers/*": ["controllers/*"],
      "@swagger/*": ["swagger/*"],
      "@models/*": ["models/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@middlewares/*": ["middlewares/*"],
      "@interfaces/*": ["interfaces/*"],
      "@routes/*": ["routes/*"],
      "@config/*": ["config/*"],
      "@types/*": ["types/*"],
      "@enums/*": ["enums/*"],
      "@dtos/*": ["dtos/*"],
      "@validations/*": ["validations/*"],
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"],
  "ts-node": {
    "require": ["tsconfig-paths/register"]
  }
}
```
5. Scripts de arrancar el proyecto:	
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/app.ts",
    "build": "tsc"
  },
}
```

"" Variables de entorno ""
1. Crear un archivo .env en la raíz del proyecto:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRY_IN=1d
JWT_REFRESH_SECRET=tu_secreto_refresh
JWT_REFRESH_EXPIRY_IN=30d
```


