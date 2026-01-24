# Telecom Dashboard – Frontend

Aplicación web **Single-Page Application (SPA)** desarrollada con **Angular**, orientada a la visualización de datos, administración de usuarios y predicción de churn (abandono de clientes).  
El proyecto sigue una arquitectura modular, escalable y alineada con buenas prácticas de desarrollo frontend moderno.

---

## 🧩 Tecnologías Utilizadas

- **Angular**
- **TypeScript**
- **Tailwind CSS**
- **JWT (JSON Web Tokens)** para autenticación
- **RxJS**
- **HTML5 / CSS3**

---

## 🏗️ Arquitectura General

La aplicación está organizada siguiendo el principio de **separación de responsabilidades**, dividiendo la lógica en componentes, servicios y modelos.

- **Componentes**: Manejan la presentación y la interacción con el usuario.
- **Servicios**: Gestionan la lógica de negocio y la comunicación con el backend.
- **Modelos**: Definen la estructura tipada de los datos.
- **Interceptores**: Controlan y modifican las peticiones HTTP (autenticación).
- **Guards**: Protegen rutas según el estado de autenticación.

La seguridad se implementa mediante **JWT**, adjuntando el token automáticamente a cada petición HTTP.

---

## 🖼️ Capturas de Pantalla

A continuación se presentan algunas vistas representativas de la aplicación:


### 📊 Dashboard Principal Panel
<img width="1918" height="897" alt="image" src="https://github.com/user-attachments/assets/be8323ff-7074-4caf-b830-8b8161f9ae96" />

### 📈 Predicción de Churn
<img width="1918" height="893" alt="image" src="https://github.com/user-attachments/assets/8b595211-3940-46e0-b724-3c018c93958d" />


### 📈 Estadisticas Empresa
<img width="1917" height="896" alt="image" src="https://github.com/user-attachments/assets/fbe101ef-5bf1-4a5b-a6ac-37652c09a569" />


### ⚙️ Panel de Administración
<img width="1916" height="898" alt="image" src="https://github.com/user-attachments/assets/285c577d-37c8-45c6-9af8-8e8bb1486af5" />



---

## 📁 Estructura del Proyecto

```text
telecom-dashboard/
├── .angular/              # Caché interna de Angular
├── .git/                  # Repositorio Git
├── node_modules/          # Dependencias del proyecto
├── public/                # Archivos estáticos públicos
├── src/
│   ├── app/
│   │   ├── core/          # Lógica central compartida
│   │   │   ├── interceptors/  # Interceptores HTTP (JWT)
│   │   │   ├── models/        # Modelos de datos
│   │   │   └── services/      # Servicios y comunicación con la API
│   │   ├── features/      # Funcionalidades principales
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── churn-prediction/
│   │   │   └── dashboard/
│   │   └── shared/        # Componentes reutilizables
│   │       └── components/
│   ├── environments/      # Configuración por entorno
│   ├── index.html         # HTML principal
│   ├── main.ts            # Punto de arranque de la app
│   └── styles.css         # Estilos globales
├── angular.json            # Configuración del proyecto Angular
├── package.json            # Dependencias y scripts
├── tailwind.config.js      # Configuración de Tailwind CSS
└── README.md               # Documentación

