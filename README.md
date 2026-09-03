# Lico Distribuciones — Frontend

Frontend de la plataforma web interna de **Lico Distribuciones**, desarrollado con Angular y orientado a centralizar diferentes procesos y servicios de la organización desde una única aplicación.

La aplicación implementa una arquitectura modular basada en componentes standalone, lazy loading, guards de navegación e interceptores HTTP, permitiendo mantener separadas las diferentes áreas funcionales de la plataforma.

## Características

* Autenticación y gestión de sesiones.
* Protección de rutas mediante guards.
* Gestión del perfil de usuario.
* Módulo de academia y seguimiento de cursos.
* Consulta de cursos pendientes y completados.
* Gestión y consulta de certificados.
* Gestión de documentos.
* Creación y seguimiento de requerimientos.
* Consulta de requerimientos por área.
* Gestión de agentes.
* Generación y consulta de reportes.
* Administración de usuarios.
* Gestión de áreas.
* Administración de tipos de requerimientos.
* Gestión de activos fijos.
* Gestión y reserva de salas de reuniones.
* Carga diferida de módulos y componentes para optimizar la navegación.

Las rutas principales de la aplicación se encuentran organizadas en módulos como `academy`, `documents`, `requeriments`, `admin`, `fixed-assets` y `meeting-room`, además de las secciones de inicio y perfil.

## Arquitectura

El proyecto sigue una organización modular dentro de `src/app`, separando responsabilidades entre funcionalidades principales, infraestructura y componentes reutilizables.

```text
src/app/
├── core/
│   ├── interceptors/
│   ├── services/
│   └── ...
│
├── guards/
│   ├── auth.guard
│   └── reverse.guard
│
├── layouts/
│   ├── auth-layout/
│   └── main-layout/
│
├── pages/
│   ├── academy/
│   ├── admin/
│   ├── documents/
│   ├── fixed-assets/
│   ├── home/
│   ├── login/
│   ├── meeting-room/
│   ├── profile/
│   └── requeriments/
│
├── shared/
│
├── app.config.ts
├── app.routes.ts
└── app.ts
```

La navegación utiliza lazy loading tanto para módulos completos como para componentes individuales, reduciendo la carga inicial de la aplicación.

## Seguridad y manejo de solicitudes

La aplicación incorpora un sistema de autenticación basado en sesiones y tokens.

El `authInterceptor` obtiene el token de la sesión y lo agrega automáticamente como un encabezado `Bearer` en las solicitudes HTTP autenticadas.

También se implementan interceptores especializados para:

* Autenticación de solicitudes.
* Manejo centralizado de errores.
* Control del estado de carga de las peticiones.

La aplicación contempla además el tratamiento de sesiones expiradas mediante el interceptor de errores, redirigiendo al usuario hacia el inicio de sesión cuando recibe una respuesta `401`.

## Módulos principales

### Academia

Permite consultar diferentes estados de formación del usuario:

* Cursos pendientes.
* Cursos completados.
* Certificados.

### Requerimientos

El módulo de requerimientos permite trabajar con diferentes procesos relacionados con solicitudes internas:

* Creación de requerimientos.
* Consulta de mis requerimientos.
* Requerimientos por área.
* Reportes.
* Gestión de agentes.

### Administración

Incluye funcionalidades administrativas para:

* Usuarios.
* Creación y actualización de usuarios.
* Cambio de contraseñas.
* Cambio de estado.
* Áreas.
* Tipos de requerimientos.

## Tecnologías

| Tecnología       | Uso                                         |
| ---------------- | ------------------------------------------- |
| Angular 20       | Framework principal                         |
| TypeScript       | Lenguaje de programación                    |
| Angular Material | Componentes de interfaz                     |
| Angular Router   | Navegación y routing                        |
| RxJS             | Programación reactiva                       |
| SCSS             | Estilos                                     |
| Swiper           | Componentes de contenido deslizante         |
| Angular SSR      | Infraestructura de renderizado              |
| Express          | Servidor utilizado por la configuración SSR |
| Jasmine / Karma  | Pruebas                                     |

Las versiones principales del proyecto corresponden a Angular 20.3.x, Angular Material 20.2.x, RxJS 7.8.x, TypeScript 5.9.x y Swiper 12.x.

## Requisitos

Antes de ejecutar el proyecto necesitas tener instalado:

* Node.js
* npm
* Angular CLI

Se recomienda utilizar una versión de Node.js compatible con Angular 20.

Puedes verificar las instalaciones con:

```bash
node --version
npm --version
ng version
```

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/LuisVelez1/Licodistribuciones-Fronted.git
```

Ingresa al proyecto:

```bash
cd Licodistribuciones-Fronted
```

Instala las dependencias:

```bash
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible normalmente en:

```text
http://localhost:4200
```

## Construcción

Para generar una versión de producción:

```bash
npm run build
```

Los archivos generados se encuentran dentro del directorio `dist/`.

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
```

El proyecto utiliza Jasmine y Karma para la ejecución de pruebas unitarias.

## Scripts disponibles

| Comando         | Descripción                                                 |
| --------------- | ----------------------------------------------------------- |
| `npm start`     | Inicia el servidor de desarrollo                            |
| `npm run build` | Genera el build de producción                               |
| `npm run watch` | Compila continuamente usando la configuración de desarrollo |
| `npm test`      | Ejecuta las pruebas                                         |
| `npm run ng`    | Ejecuta comandos del Angular CLI                            |

## Estructura del proyecto

La estructura está organizada para facilitar la escalabilidad y el mantenimiento:

```text
src/
├── app/
│   ├── core/          # Servicios e infraestructura principal
│   ├── guards/        # Protección de rutas
│   ├── layouts/       # Layouts principales y de autenticación
│   ├── pages/         # Funcionalidades y páginas de la aplicación
│   └── shared/        # Componentes y recursos reutilizables
│
├── environments/      # Configuración por entorno
├── index.html
├── main.ts
├── main.server.ts
├── server.ts
└── styles.scss
```

## Arquitectura de navegación

La aplicación diferencia entre rutas públicas y rutas protegidas.

```text
                         Aplicación Angular
                                |
                    ┌───────────┴───────────┐
                    |                       |
               /auth/*                 Rutas privadas
                    |                       |
             Login / Auth            Auth Guard
                                            |
                              ┌─────────────┼─────────────┐
                              |             |             |
                            Home         Profile       Academy
                              |                           |
                         Documents                  Courses / Certificates
                              |
                        Requeriments
                              |
                           Admin
                              |
                    Fixed Assets / Meeting Room
```

El acceso a las rutas principales está protegido mediante `authGuard`, mientras que las rutas de autenticación utilizan `reverseAuthGuard` para controlar el acceso de usuarios que ya cuentan con una sesión activa.

## Estado del proyecto

Proyecto en desarrollo.

El frontend forma parte de una plataforma empresarial orientada a centralizar funcionalidades internas y proporcionar una interfaz única para diferentes procesos de la organización.

## Autor

**Luis Eduardo Vélez**

Software Developer

* GitHub: [LuisVelez1](https://github.com/LuisVelez1)

---

> Este proyecto fue desarrollado como parte de la implementación de una plataforma web empresarial, aplicando principios de arquitectura modular, separación de responsabilidades y desarrollo de aplicaciones modernas con Angular.
