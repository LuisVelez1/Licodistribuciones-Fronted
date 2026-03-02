# Intranet Frontend 🧩

Frontend de la **Intranet Corporativa**, desarrollado en **Angular** y diseñado para consumir microservicios a través de un **API Gateway** con autenticación basada en **JWT**.

El proyecto está pensado para ser desplegado en **Vercel** y comunicarse únicamente con el **API Gateway** (no directamente con los microservicios).

---

## 🚀 Stack Tecnológico

- **Angular** (CLI v20.3.2)
- **TypeScript**
- **RxJS**
- **Angular Router**
- **HTTP Interceptors**
- **JWT Authentication**
- **API Gateway (Spring Cloud Gateway)**

---

## 🏗️ Arquitectura

```text
Frontend (Angular / Vercel)
        |
        v
   API Gateway
        |
        +--> Auth Service
        +--> User Service
        +--> Academy Service
