🎓 Sistema de Gestión Académica Administrativa
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

# 📌 Pruebas Unitarias e Integración  

Se describe el conjunto de pruebas unitarias e integradas desarrolladas para los distintos módulos del sistema académico. Se está verificando que:

- Los casos de uso (lógica interna):
  - Delegan correctamente las operaciones a los repositorios.
  - Retornan los datos esperados según cada operación.
  - Manejan correctamente errores y excepciones.
  - Cumplen reglas de negocio (como no permitir cambiar IDs, límites de asignaciones, validaciones de duplicidad, etc.).

- Las APIs / endpoints:
  - Responden con los códigos HTTP adecuados (200, 201, 204, 400, 404, 409, 500) según el caso.
  - Manejan correctamente errores internos y validaciones de payload.
  - Realizan el flujo completo de CRUD (crear, leer, actualizar, eliminar) para cada módulo.
  - Integran de forma correcta controladores, rutas, casos de uso y repositorios simulados.

---

## 🟩 1. Cobertura Global

**Cobertura obtenida:** 
<img width="1852" height="68" alt="image" src="https://github.com/user-attachments/assets/2ea10e0c-63f6-44e3-9be3-9848b3bd2308" />
<img width="1842" height="376" alt="image" src="https://github.com/user-attachments/assets/4f36e3f1-a1d4-49a1-a77e-53bac4642112" />

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

# 👤 DOCENTE

### Unitarias — `DocenteCasoUso.test.ts`

Estas pruebas garantizan que el caso de uso delega correctamente la lógica al repositorio, responde con los datos esperados y maneja adecuadamente los errores.

- obtenerDocentePorId:
  - retorna correctamente un docente,
  - devuelve null cuando no existe.
- obtenerDocentes: retorna la lista completa entregada por el repositorio.
- crearDocente:
  - delega la creación al repositorio y retorna el ID generado,
  - propaga errores cuando el repositorio falla.
- actualizarDocente:
  - actualiza correctamente y retorna el objeto actualizado,
  - retorna null cuando el repositorio indica que el docente no existe.
- eliminarDocente:
  - ejecuta la eliminación correctamente,
  - propaga errores lanzados por el repositorio.

### Integración — `DocenteApi.test.ts`

Estas pruebas validan manejo correcto de respuestas HTTP, errores, validaciones y flujo completo de la API de docentes.

- GET /docentes: retorna la lista de docentes simulados con código 200, incluyendo conteo y mensaje.
- GET /docentes/:id:
  - responde 404 si no existe.
  - responde 500 cuando ocurre un error interno en el repositorio.
- POST /docentes:
  - crea un docente correctamente (retorna 201 y el ID generado).
  - retorna 400 cuando el payload no cumple validaciones.
  - retorna 400 cuando la cédula ya existe (code 23505).
- PUT /docentes/:id:
  - actualiza correctamente y responde 200,
  - retorna 404 si el docente no existe.
- DELETE /docentes/:id:
  - elimina correctamente respondiendo 200,
  - retorna 404 cuando el repositorio notifica que el docente no existe.

---

# 📘 OFERTA ACADÉMICA

### Unitarias — `OfertaAcademicaCasoUso.test.ts`

Estas pruebas verifican la correcta aplicación de reglas de negocio, la delegación al repositorio y el manejo de errores y retornos.

- obtenerOfertaPorId
  - devuelve la oferta cuando existe,
  - retorna null cuando no se encuentra.
- listarOfertas
  - retorna el listado completo,
  - admite un límite opcional para paginación.
- crearOferta
  - crea correctamente delegando al repositorio y devuelve el nuevo ID,
  - propaga errores cuando fallan las validaciones o el repositorio arroja excepciones,
  - falla correctamente cuando recibe un objeto vacío.
- actualizarOferta
  - actualiza correctamente usando el ID recibido por parámetro,
  - si el objeto trae un id_oferta distinto al parámetro, lanza error impidiendo modificar el ID,
  - retorna null cuando la oferta no existe,
  - permite actualizar incluso si el objeto no incluye el campo id_oferta.
- eliminarOferta
  - elimina correctamente al delegar al repositorio,
  - propaga errores cuando el repositorio falla,
  - falla adecuadamente si se envía un id vacío o inválido.

### Integración — `OfertaAcademicaApi.test.ts`

Estas pruebas aseguran el manejo completo del CRUD, validaciones, errores internos, y restricciones de negocio.

- POST /ofertas
  - retorna 400 si el payload no cumple validación (Zod),
  - crea correctamente una oferta nueva (retorna 201 y el ID generado).
- GET /ofertas
  - retorna todas las ofertas simuladas con código 200,
  - si ocurre un error interno, retorna 500 y mensaje de fallo.
- GET /ofertas/:id
  - retorna una oferta específica cuando existe (200),
  - retorna 404 si no se encuentra.
- PUT /ofertas/:id
  - impide modificar el id_oferta y responde 400,
  - actualiza correctamente los campos válidos, verificando que siga siendo el mismo ID,
  - retorna la oferta actualizada en la respuesta.
- DELETE /ofertas/:id
  - elimina correctamente una oferta (200),
  - envía el ID eliminado como parte del body.

---

# 📚 ASIGNATURA

### Unitarias — `Asignatura.test.ts`

- obtenerTodas: asegura que se retornen directamente los datos del repositorio.
- obtenerPorId: valida que se devuelva la asignatura correcta al consultar por ID.
- crear: confirma que:
  - se llama al repositorio con la entidad construida desde el DTO.
  - retorna el DTO creado.
- actualizar: valida que se llame al repositorio con la entidad modificada y el ID, devolviendo el DTO actualizado.
- eliminar: confirma que el caso de uso delega correctamente la eliminación al repositorio.
- propagación de errores: verifica que si el repositorio falla en crear, el caso de uso lanza el error hacia arriba.

### Integración — `Asignatura.test.ts`

- POST /asignaturas: valida que la API cree una asignatura correctamente y devuelva código 201 junto al DTO enviado.
- Validación de payload: comprueba que solicitudes inválidas respondan con 400 y un mensaje de error.
- Conflicto al crear: si el repositorio lanza un error por duplicidad, la API responde 409.
- GET /asignaturas: revisa que la API liste todas las asignaturas y responda con 200.
- PUT /asignaturas/:id: confirma que la asignatura se actualiza correctamente y responde con 200.
- DELETE /asignaturas/:id: prueba la eliminación de una asignatura, devolviendo 204 (aunque el controlador envía cuerpo).

---

# 🎓 PROGRAMA ACADÉMICO

### Unitarias

Estas pruebas verifican que la lógica de los casis de uso para Programas Académicos funcione correctamente:

- Crear programa: comprueba que se envíen los datos al repositorio y retorne el ID generado.
- Listar programas: valida que se obtenga la lista completa o limitada según el parámetro.
- Obtener por ID: confirma que devuelva un programa existente o null si no se encuentra.
- Actualizar programa: prueba la actualización correcta y que no permita cambiar el ID.
- Actualizar inexistente: asegura que retorne null si el programa no existe.
- Eliminar programa: verifica que se llame al repositorio y maneje errores correctamente.

### Integración

Estas pruebas validan que toda la API funcione de extremo a extremo, verificando controladores, rutas y respuestas completas:

- GET /api/programas: comprueba que la API retorne correctamente todos los programas académicos.
- GET /api/programas/:id: valida que obtenga un programa existente y devuelva 404 si no existe.
- POST /api/programas: asegura que se pueda crear un nuevo programa y que retorne el ID generado.
- PUT /api/programas/:id: prueba la actualización de un programa y evita que se modifique el ID.
- PUT inexistente: verifica que actualizar un programa que no existe devuelva 404.
- DELETE /api/programas/:id: confirma que el programa se elimine de forma correcta.
- PUT con ID modificado: confirma que la API rechaza cambios en id_programa con un 400.

---

# 🧑‍🏫 ASIGNACIÓN DOCENTE

### Unitarias

Estas pruebas verifican la lógica interna del caso de uso de asignación de docentes:

- Crear asignación: valida que se cree correctamente cuando todo es válido.
- Validaciones previas: comprueban errores cuando:
  - el docente no existe,
  - el grupo no existe,
  - la asignación ya existe,
  - el docente supera el límite de 5 grupos,
  - el grupo ya tiene un docente asignado.
- Listar asignaciones: prueba la obtención de asignaciones con y sin límite.
- Obtener por ID: verifica que se retorne la asignación solicitada.
- Actualizar asignación: prueba:
  - prohibición de cambiar el id_asignacion,
  - retorno de null si no existe,
  - actualización correcta cuando sí existe.
- Eliminar asignación: confirma que se elimine correctamente.

### Integración

Estas pruebas validan el comportamiento completo de la API de asignación de docentes usando Fastify, rutas reales y un repositorio simulado:

- Listar asignaciones: verifica que /api/asignaciones devuelve todas las asignaciones con formato correcto.
- Obtener por ID: prueba que una asignación existente se devuelve correctamente y que una inexistente responde 404.
- Crear asignación: confirma que la API permite crear una nueva asignación.
- Validación de reglas: asegura que la API responde con error cuando:
  - el docente no existe.
  - el grupo (oferta) no existe.
- Actualizar asignación: prueba que /PUT actualiza correctamente una asignación existente.
- Actualizar inexistente: garantiza que se devuelva 404 cuando la asignación no existe.
- Eliminar asignación: confirma que /DELETE elimina correctamente una asignación.

---

# 🗓 PERÍODO ACADÉMICO

### Unitarias — `PeriodoAcademico.test.ts`

Estas pruebas validan la lógica interna, reglas de negocio y delegación correcta al repositorio.

- crearPeriodo
  - crea correctamente delegando al repositorio,
retorna el ID generado por el repositorio.
- listarPeriodos
  - retorna el arreglo completo obtenido del repositorio.
  - obtenerPeriodoPorId
  - retorna el periodo cuando existe,
  - usa correctamente el ID pasado como parámetro.
- actualizarPeriodo
  - lanza error si se intenta modificar el id_periodo,
  - retorna null cuando el repositorio no encuentra el periodo,
  - actualiza correctamente cuando los datos son válidos y el periodo existe.
- eliminarPeriodo
  - llama correctamente al repositorio para eliminar,
  - propaga errores si el repositorio falla.

### Integración — `PeriodoAcademico.int.test.ts`

Estas pruebas garantizan que el router, controlador y casos de uso se integran adecuadamente, manejando creación, actualización, lectura y eliminación de periodos.

- GET /api/periodos
  - retorna correctamente la lista completa de periodos simulados (200),
  - incluye cantidad total y mensaje de éxito.
- GET /api/periodos/:id
  - retorna un periodo específico cuando existe (200),
  - incluye todos los campos del periodo consultado.
- POST /api/periodos
  - crea un periodo correctamente y retorna un ID simulado,
  - responde con mensaje de éxito y código 200.
- PUT /api/periodos/:id
  - actualiza correctamente los campos del periodo, retornando el objeto actualizado,
  - asegura que el controlador responda con mensaje descriptivo y código 200.
- DELETE /api/periodos/:id
  - elimina correctamente un periodo existente (200),
  - retorna el ID del periodo eliminado.

---

# 📘 PLAN DE ESTUDIO

### Unitarias — `PlanEstudio.test.ts`

Estas pruebas aseguran que el caso de uso construye correctamente las entidades, respeta las reglas de negocio y usa adecuadamente el repositorio mock.

- obtenerTodos
  - retorna correctamente todos los planes de estudio,
  - asegura que el caso de uso llame al repositorio una sola vez.
- obtenerPorId
  - retorna el plan cuando existe,
  - delega correctamente la búsqueda al repositorio.
- crear
  - construye internamente una instancia de PlanEstudio,
  - la envía al repositorio y retorna el ID generado.
- actualizar
  - construye una instancia PlanEstudio con el ID recibido,
  - delega en el repositorio,
  - retorna el DTO actualizado que se envió.
- eliminar
  - llama al repositorio con el ID correspondiente,
  - no retorna contenido adicional.

### Integración — `PlanEstudio.int.test.ts`

Estas pruebas confirman que rutas, controlador, repositorio mock y casos de uso funcionan correctamente en conjunto.

- GET /api/planes-estudio
  - retorna correctamente todos los planes simulados (200),
  - la estructura coincide 1:1 con lo que entrega el repositorio mock.
- POST /api/planes-estudio
  - crea un nuevo plan de estudio correctamente,
  - responde con 201 y un ID generado (mock-created-id).
- PUT /api/planes-estudio/:id
  - actualiza un plan de estudio existente,
  - retorna la estructura enviada y un mensaje de éxito (200).
- DELETE /api/planes-estudio/:id
  - elimina correctamente un plan,
  - responde con 204 y un body vacío, cumpliendo el contrato del controlador.

---

# ▶️ 4. Ejecución de Pruebas

Ejecutar todas las pruebas:

- npm test

Ejecutar pruebas unitarias:

- npm run unit-test

Ejecutar pruebas de integracion:

- npm run integration-test

Ejecutar cobertura:

- npm run coverage

# Entregas

📍 Entrega 1 
-
- [Informe-JESSoft.pdf](https://github.com/user-attachments/files/23347979/Informe-JESSoft.pdf)
- https://youtu.be/PgmNPc9FmsM

📍 Entrega 2
-
- [Informe2-JESSOFT.pdf](https://github.com/user-attachments/files/23515733/Informe2-JESSOFT.pdf)
- https://www.youtube.com/watch?v=GHNqmps0C8s

📍Entrega 3
-
Video donde se explica la ejecución de pruebas y la cobertura:
- https://youtu.be/Hhm9IJmoMkg

  
Checklist de completado:
-

| Estado | Ítem                                                  | Descripción                                                                                                                                         |
| :----: | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|    ✅   | **Recomendaciones del informe aplicadas**             | Se aplicaron todas las sugerencias y correcciones indicadas en el informe técnico previo.                                                           |
|    ✅   | **Pruebas unitarias creadas y ejecutadas**            | Todas las pruebas unitarias para cada módulo (`Docente`, `Asignatura`, `Programa Académico`, etc.) fueron implementadas y verificadas exitosamente. |
|    ✅   | **Pruebas de integración creadas y ejecutadas**       | Se realizaron pruebas de integración para validar el flujo completo de la API y la interacción entre capas.                                         |
|    ✅   | **Cobertura sugerida alcanzada**                      | La cobertura de pruebas cumple con los estándares recomendados, asegurando que la mayoría de casos críticos están probados.                         |
|    ✅   | **README actualizado con instrucciones y evidencias** | El README contiene pasos para ejecutar el proyecto y ejecutar pruebas.                                 |
|    ✅   | **Video demostrativo agregado**                       | Se incluyó un video demostrativo mostrando el funcionamiento del sistema y las funcionalidades principales.                                         |
|    ✅   | **PR feature//<nombre-representativo> → main creado** | Se generó un Pull Request integrando todo el desarrollo, documentación y pruebas, listo para revisión e integración.                                |


🧠 Autor
-
👨‍💻 Sebastián Higuita - Jimena Valencia - Sara Mellán - Edwin Rivera

Desarrolladores Backend · Proyecto académico — Gestión Académica Administrativa
📅 Noviembre 2025


