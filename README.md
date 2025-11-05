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

ID (autogenerado)

Nombre

Información general

Nivel educativo

Duración

Modalidad (Presencial, Virtual, Distancia)

📘 2. Asignatura
-
Datos de las materias que componen los programas:

ID (autogenerado)

Nombre

Créditos

Carga horaria

Tipo (teórica, práctica, mixta)

Descripción

📆 3. Período Académico
-
Representa los ciclos académicos de la institución:

ID (autogenerado)

Fecha de inicio

Fecha de fin

Estado (activo, cerrado, en preparación)

Descripción

👨‍🏫 4. Docente
-
Información del cuerpo docente:

ID (autogenerado)

Nombre

Apellido

Especialidad

Vinculación (Tiempo completo, Cátedra, Medio tiempo)

🧱 Arquitectura del Proyecto
-
El sistema fue desarrollado siguiendo principios de Arquitectura Limpia 🧠 y enfoque hexagonal, separando responsabilidades por capas:
<img width="1538" height="506" alt="image" src="https://github.com/user-attachments/assets/6ccfe41f-7d4d-4c01-bc99-cdea2f227e36" />

✅ Ventajas:
-
Código mantenible y escalable

Separación clara de responsabilidades

Fácil de extender y probar

🗄️ Base de Datos — PostgreSQL (Cloud SQL)
-
La base de datos se encuentra desplegada en Google Cloud SQL 🌐
Cada tabla incluye:

Secuencias automáticas (CREATE SEQUENCE)

Triggers para generar IDs personalizados (PA, A, P, D)

Restricciones de integridad y checks

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
Node.js v18 o superior

PostgreSQL (o acceso a la BD en Google Cloud)

Archivo .env con tus credenciales:
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

🧩 Validaciones Implementadas
-
Campos obligatorios (NOT NULL)

Tipos de datos adecuados (VARCHAR, INT, DATE, etc.)

Validación de opciones (CHECK para valores limitados)

Unicidad básica en claves primarias

🧾 Documentación
-
Cada módulo del CRUD cuenta con:
-
Entidad de dominio (core/dominio)

DTO (transferencia de datos)

Caso de uso (core/aplicacion/casos-uso)

Repositorio (core/infraestructura)

Controlador y rutas (presentation)

🧠 Autor
-
👨‍💻 Sebastián Higuita - Jimena Valencia

Desarrolladores Backend · Proyecto académico — Gestión Académica Administrativa
📅 Noviembre 2025

PDF de la documentacion:
- [Informe-JESSoft.pdf](https://github.com/user-attachments/files/23347979/Informe-JESSoft.pdf)


