🎓 Sistema de Gestión Académica Administrativa
-
📅 Entrega 1 — CRUD de cuatro entidades principales
📍 Programa Académico · Asignatura · Período Académico · Docente
-
🚀 Objetivo del Proyecto
-
El propósito de este sistema es construir la base del módulo de Gestión Académica Administrativa, implementando las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) para las principales entidades académicas de una institución educativa.

Cada entidad cuenta con sus respectivas validaciones, estructura de base de datos, y endpoints para interactuar desde el backend.

🧩 Entidades Principales
-
🏫 1. Programa Académico
-
Contiene la información general del programa:

- Id_programa (autogenerado)

- Nombre

- Información general

- Nivel educativo

- Duración

- Modalidad (Presencial, Virtual, Distancia)

📘 2. Asignatura
-
Datos de las materias que componen los programas:

- Id_asignatura (autogenerado)

- Nombre

- Créditos

- Carga horaria

- Tipo (teórica, práctica, mixta)

- Descripción

📆 3. Período Académico
-
Representa los ciclos académicos de la institución:

- Id_periodo (autogenerado)

- Fecha de inicio

- Fecha de fin

- Estado (activo, cerrado, en preparación)

- Descripción

👨‍🏫 4. Docente
-
Información del cuerpo docente:

- Id_docente (autogenerado)

- Cedula

- Nombre

- Apellido

- Especialidad

- Vinculación (Tiempo completo, Cátedra, Medio tiempo)

🧩 **Entidades Dependientes**

📚 1. Plan de Estudio
-
Relaciona programas académicos con las asignaturas que los componen:

- Id_plan (autogenerado)

- ID del programa académico (FK)

- ID de la asignatura (FK)

- Semestre

Semestre

🏫 2. Oferta Académica
-
Representa los grupos y cupos disponibles para un período académico determinado:

- Id_oferta (autogenerado)

- ID del período académico (FK)

- ID del plan de estudio (FK)

- Grupo (autogenerado)

- Cupo

🧑‍🏫 3. Asignación Docente
-
Define qué docente imparte qué grupo y oferta académica:

- Id_asignacion (autogenerado)

- ID del docente (FK)

- ID de la oferta académica (FK)

🧱 Arquitectura del Proyecto
-
El sistema fue desarrollado siguiendo principios de Arquitectura Limpia 🧠 y enfoque hexagonal, separando responsabilidades por capas:
<img width="1538" height="506" alt="image" src="https://github.com/user-attachments/assets/6ccfe41f-7d4d-4c01-bc99-cdea2f227e36" />

✅ Ventajas:
-
- Código mantenible y escalable

- Separación clara de responsabilidades

- Fácil de extender y probar

🗄️ Base de Datos — PostgreSQL (Cloud SQL)
-
La base de datos se encuentra desplegada en Google Cloud SQL 🌐
Cada tabla incluye:

- Secuencias automáticas (CREATE SEQUENCE)

- Triggers para generar IDs personalizados (PA, A, P, D)

- Restricciones de integridad y checks

📤 Migración (Script SQL)
-
El archivo migracion.sql contiene toda la estructura de las cuatro entidades (tablas, secuencias, triggers y funciones).
Se puede ejecutar fácilmente en cualquier instancia de PostgreSQL con:
psql -h <host> -U <usuario> -d <nombre_bd> -f migracion.sql

| Componente        | Tecnología                          |
| ----------------- | ----------------------------------- |
| Lenguaje          | TypeScript 💙                       |
| Framework Backend | Fastify ⚡                           |
| Base de Datos     | PostgreSQL (Cloud SQL) 🐘           |
| ORM / Conexión    | `pg`                                |
| Arquitectura      | Limpia / Hexagonal 🧠               |
| Validaciones      | Validaciones básicas a nivel de DTO |

💡 Instalación y Ejecución
-
🔧 Requisitos previos
-
- Node.js v18 o superior

- PostgreSQL (o acceso a la BD en Google Cloud)

- Archivo .env con tus credenciales:

  DB_HOST=<host>

  DB_PORT=5432

  DB_USER=<usuario>

  DB_PASSWORD=<contraseña>

  DB_NAME=<nombre_bd>

Pasos de instalación
-
1️⃣ Clona el repositorio

git clone https://github.com/tuusuario/gestion-academica.git
cd gestion-academica

2️⃣ Instala las dependencias

npm install

3️⃣ Compila el código TypeScript

npm run build

4️⃣ Inicia el servidor

npm start

5️⃣ El servidor se ejecutará por defecto en:
👉 http://localhost:3000

🔥 Endpoints CRUD
-
| Método   | Endpoint           | Descripción                 |
| -------- | ------------------ | --------------------------- |
| `GET`    | `/asignaturas`     | Lista todas las asignaturas |
| `POST`   | `/asignaturas`     | Crea una nueva asignatura   |
| `PUT`    | `/asignaturas/:id` | Actualiza una asignatura    |
| `DELETE` | `/asignaturas/:id` | Elimina una asignatura      |

| Método   | Endpoint           | Descripción                 |
| -------- | ------------------ | --------------------------- |
| `GET`    | `/docentes`        | Lista todos los docentes    |
| `POST`   | `/docentes`        | Crea un nuevo docente       |
| `PUT`    | `/docentes/:id`    | Actualiza un docente        |
| `DELETE` | `/docentes/:id`    | Elimina un docente          |

| Método   | Endpoint           | Descripción                 |
| -------- | ------------------ | --------------------------- |
| `GET`    | `/programas`       | Lista todas los programas   |
| `POST`   | `/programas`       | Crea un nuevo programa      |
| `PUT`    | `/programas/:id`   | Actualiza un programas      |
| `DELETE` | `/programas/:id`   | Elimina un programa         |

| Método   | Endpoint           | Descripción                 |
| -------- | ------------------ | --------------------------- |
| `GET`    | `/periodos`        | Lista todos los periodos    |
| `POST`   | `/periodos`        | Crea un nuevo periodo       |
| `PUT`    | `/periodos/:id`    | Actualiza un periodo        |
| `DELETE` | `/periodos/:id`    | Elimina un periodo          |

| Método   | Endpoint              | Descripción                       |
| -------- | --------------------- | --------------------------------- |
| `GET`    | `/planes-estudio`     | Lista todos los planes de estudio |
| `POST`   | `/planes-estudio`     | Crea un nuevo plan de estudio     |
| `PUT`    | `/planes-estudio/:id` | Actualiza un plan de estudio      |
| `DELETE` | `/planes-estudio/:id` | Elimina un plan de estudio        |

| Método   | Endpoint                 | Descripción                        |
| -------- | ------------------------ | ---------------------------------- |
| `GET`    | `/ofertaa-academica`     | Lista todas las ofertas académicas |
| `POST`   | `/ofertaa-academica`     | Crea una nueva oferta académica    |
| `PUT`    | `/ofertaa-academica/:id` | Actualiza una oferta académica     |
| `DELETE` | `/ofertaa-academica/:id` | Elimina una oferta académica       |

| Método   | Endpoint                     | Descripción                  |
| -------- | ------------------- | ------------------------------------- |
| `GET`    | `/asignaciones`     | Lista todas las asignaciones docentes |
| `POST`   | `/asignaciones`     | Crea una nueva asignación docente     |
| `PUT`    | `/asignaciones/:id` | Actualiza una asignación docente      |
| `DELETE` | `/asignaciones/:id` | Elimina una asignación docente        |


🧩 Validaciones Generales Implementadas
-
- Campos obligatorios (NOT NULL)

- Tipos de datos adecuados (VARCHAR, INT, DATE, etc.)

- Validación de opciones (CHECK para valores limitados)

- Unicidad básica en claves primarias
  
- Prevención de modificación de IDs en actualizaciones.
  
- Validaciones de entrada: mediante Zod, garantizando que los datos enviados desde el cliente cumplan con el formato, tipo y estructura esperada

- Manejo de errores controlado: uso de bloques try/catch y mensajes descriptivos con códigos HTTP adecuados

- Integridad referencial: asegurada mediante claves foráneas (FOREIGN KEY) entre las tablas relacionadas


🧾 Documentación
-
Cada módulo del CRUD cuenta con:
-
- Entidad de dominio (core/dominio)

- DTO (transferencia de datos)

- Caso de uso (core/aplicacion/casos-uso)

- Repositorio (core/infraestructura)

- Controlador y rutas (presentation)
  
- Validaciones (Core)

PDF de la documentacion y enlace del video:
-
Entrega 1 
-
- [Informe-JESSoft.pdf](https://github.com/user-attachments/files/23347979/Informe-JESSoft.pdf)
- https://youtu.be/PgmNPc9FmsM

Entrega 2
-
- [Informe2-JESSOFT.pdf](https://github.com/user-attachments/files/23515733/Informe2-JESSOFT.pdf)
- https://www.youtube.com/watch?v=GHNqmps0C8s

  
Checklist de completado:
-

| Estado | Ítem                                             | Descripción                                                                                                                                                                                                              |
| :----: | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|    ✅   | **Migraciones implementadas**                    | Se desarrollaron las migraciones en PostgreSQL para todas las entidades del módulo (`Programa Académico`, `Asignatura`, `Periodo Académico`, `Oferta Académica` y `Asignación Docente`) con sus secuencias y relaciones. |
|    ✅   | **CRUD completo para todos los servicios (1–4)** | Cada servicio cuenta con operaciones de creación, lectura, actualización y eliminación completamente funcionales y probadas.                                                                                             |
|    ✅   | **Validaciones de datos y reglas de negocio**    | Se aplicaron validaciones de tipo, obligatoriedad, unicidad, no duplicidad, y reglas específicas de negocio en los casos de uso y controladores.                                                                         |
|    ✅   | **Estructura de errores uniforme**               | Todos los endpoints devuelven respuestas consistentes con mensajes claros, diferenciando errores de validación, inexistencia y del servidor.                                                                             |
|    ✅   | **Arquitectura limpia implementada**             | El proyecto sigue la arquitectura hexagonal, separando capas de dominio, aplicación, infraestructura y presentación.                                                                                                     |
|    ✅   | **Documentación y entregables completos**        | Se entregaron el `README.md`, el informe técnico con descripción de arquitectura y decisiones de diseño, además del video demostrativo.                                                                                  |
|    ✅   | **Pull Request creado**                          | Se generó el PR **`feature/gestion-academica → main`** integrando todo el desarrollo, validaciones y documentación final.                                                                                                |

# 📌 Pruebas Unitarias e Integración  

En esta parte del documento se describen las pruebas unitarias, pruebas de integración, cobertura global e instrucciones de ejecución incluidas en la tercera entrega del proyecto.

---

## 🟩 1. Cobertura Global

**Cobertura obtenida:** 

![cobertura](https://github.com/user-attachments/assets/bcf513b4-3a81-4ab3-88c2-d5c893bc605a)

---

## 🧪 2. Tecnologías Utilizadas

- Jest  
- ts-jest  
- Supertest  
- Fastify  
- Mocks de Jest para repositorios PostgreSQL

---

## 🧩 3. Pruebas por Entidad

A continuación se listan las pruebas unitarias y de integración desarrolladas por módulo.

---

# 👤 DOCENTE

### Unitarias — `DocenteCasoUso.test.ts`

- obtenerDocentes  
- obtenerDocentePorId  
- crearDocente  
- actualizarDocente  
- eliminarDocente  

### Integración — `DocenteApi.test.ts`

- GET /docentes — lista y estructura  
- GET /docentes/:id — éxito y 404  
- POST /docentes — validación Zod (400)  
- GET /docentes — error interno (500 simulado)

---

# 📘 OFERTA ACADÉMICA

### Unitarias — `OfertaAcademicaCasoUso.test.ts`

- listarOfertas  
- obtenerOfertaPorId  
- crearOferta  
- actualizarOferta  
- eliminarOferta  

### Integración — `OfertaAcademicaApi.test.ts`

- GET /ofertas — lista  
- GET /ofertas/:id — éxito y 404  
- POST /ofertas — validación Zod  
- GET /ofertas — error 500 simulado  

---

# 📚 ASIGNATURA

### Unitarias — `Asignatura.test.ts`

- obtenerTodas  
- obtenerPorId  
- crear  
- actualizar  
- eliminar  
- Manejo de errores del repositorio

### Integración — `Asignatura.test.ts`

- POST /asignaturas — 201, 400 o 409  
- GET /asignaturas — lista  
- PUT /asignaturas/:id — valida ID  
- DELETE /asignaturas/:id — 204  

---

# 🎓 PROGRAMA ACADÉMICO

### Unitarias

- Crear programa  
- Listar (con y sin límite)  
- Obtener por ID  
- Actualizar (con validación de ID)  
- Actualizar inexistente  
- Eliminar  

### Integración

- GET /api/programas  
- GET /api/programas/:id — éxito y 404  
- POST /api/programas  
- PUT /api/programas/:id — validación ID (400)  
- PUT /api/programas/:id — no encontrado (404)  
- DELETE /api/programas/:id  

---

# 🧑‍🏫 ASIGNACIÓN DOCENTE

### Unitarias

- Crear asignación  
- Error si docente no existe  
- Error si grupo no existe  
- Error por asignación duplicada  
- Error si supera límite máximo  
- Error si grupo ya tiene docente  
- Listar  
- Obtener por ID  
- Actualizar (bloqueo ID)  
- Actualizar inexistente  
- Eliminar  

### Integración

- GET /asignaciones  
- GET /asignaciones/:id  
- POST /asignaciones — 201  
- POST errores por no existir docente o grupo — 404  
- PUT /asignaciones/:id — éxito y 404  
- DELETE /asignaciones/:id  

---

# 🗓 PERÍODO ACADÉMICO

### Unitarias — `PeriodoAcademico.test.ts`

- Crear período  
- Listar períodos  
- Obtener por ID  
- Actualizar  
- Bloquear modificación de ID  
- Actualizar inexistente  
- Eliminar  

### Integración — `PeriodoAcademico.int.test.ts`

- GET /api/periodos  
- GET /api/periodos/:id  
- POST /api/periodos  
- PUT /api/periodos/:id  
- DELETE /api/periodos/:id  

---

# 📘 PLAN DE ESTUDIO

### Unitarias — `PlanEstudio.test.ts`

- obtenerTodos  
- obtenerPorId  
- crear  
- actualizar  
- eliminar  

### Integración — `PlanEstudio.int.test.ts`

- GET /api/planes-estudio  
- POST /api/planes-estudio  
- PUT /api/planes-estudio/:id  
- DELETE /api/planes-estudio/:id  

---

# ▶️ 4. Ejecución de Pruebas

Ejecutar todas las pruebas:

npm test

Ejecutar con reporte de cobertura:

npm run test:coverage

Scripts utilizados:

{
"scripts": {
"test": "jest",
"test:coverage": "jest --coverage"
}
}

# 🎥 5. Video de Evidencia

Video donde se explica la ejecución de pruebas y la cobertura:

https://youtu.be/Hhm9IJmoMkg

🧠 Autor
-
👨‍💻 Sebastián Higuita - Jimena Valencia - Sara Mellán - Edwin Rivera

Desarrolladores Backend · Proyecto académico — Gestión Académica Administrativa
📅 Noviembre 2025


