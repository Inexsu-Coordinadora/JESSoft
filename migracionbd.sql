--
-- PostgreSQL database dump
--

\restrict sOXo85NZaTAEozex19jKxLtG3ZDm9SkcKhZUWSDZPalJUadQ6lseyBdmyqrAAdU

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: asignacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asignacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asignacion_docente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignacion_docente (
    id_asignacion character varying DEFAULT ('AD'::text || (nextval('public.asignacion_seq'::regclass))::text) NOT NULL,
    id_docente character varying NOT NULL,
    id_oferta character varying NOT NULL
);


--
-- Name: asignatura_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asignatura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asignatura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignatura (
    id_asignatura character varying DEFAULT ('A'::text || (nextval('public.asignatura_seq'::regclass))::text) NOT NULL,
    nombre character varying(100) NOT NULL,
    creditos integer NOT NULL,
    carga_horaria integer NOT NULL,
    tipo character varying(10),
    descripcion character varying(50),
    CONSTRAINT asignatura_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['teorica'::character varying, 'practica'::character varying, 'mixta'::character varying])::text[])))
);


--
-- Name: docente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.docente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: docente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.docente (
    id_docente character varying DEFAULT ('D'::text || (nextval('public.docente_seq'::regclass))::text) NOT NULL,
    cedula character varying(15) NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    especialidad character varying(20) NOT NULL,
    vinculacion character varying(20),
    CONSTRAINT docente_vinculacion_check CHECK (((vinculacion)::text = ANY ((ARRAY['Tiempo completo'::character varying, 'Catedra'::character varying, 'Medio tiempo'::character varying])::text[])))
);


--
-- Name: grupo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grupo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oferta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oferta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oferta_academica; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oferta_academica (
    id_oferta character varying DEFAULT ('OF'::text || (nextval('public.oferta_seq'::regclass))::text) NOT NULL,
    id_periodo character varying NOT NULL,
    id_plan character varying NOT NULL,
    grupo character varying(10) DEFAULT ('G'::text || (nextval('public.grupo_seq'::regclass))::text) NOT NULL,
    cupo integer,
    CONSTRAINT oferta_academica_cupo_check CHECK ((cupo > 0))
);


--
-- Name: periodo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.periodo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: periodo_academico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.periodo_academico (
    id_periodo character varying DEFAULT ('P'::text || (nextval('public.periodo_seq'::regclass))::text) NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado character varying(15),
    descripcion character varying(50),
    CONSTRAINT periodo_academico_estado_check CHECK (((estado)::text = ANY ((ARRAY['activo'::character varying, 'cerrado'::character varying, 'en preparacion'::character varying])::text[])))
);


--
-- Name: plane_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.plane_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: plan_estudio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_estudio (
    id_plan character varying DEFAULT ('PL'::text || (nextval('public.plane_seq'::regclass))::text) NOT NULL,
    id_programa character varying NOT NULL,
    id_asignatura character varying NOT NULL,
    semestre integer,
    CONSTRAINT plan_estudio_semestre_check CHECK ((semestre > 0))
);


--
-- Name: programa_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.programa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: programa_academico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programa_academico (
    id_programa character varying DEFAULT ('PA'::text || (nextval('public.programa_seq'::regclass))::text) NOT NULL,
    nombre character varying(50) NOT NULL,
    informacion character varying(50) NOT NULL,
    nivel_educativo character varying(20) NOT NULL,
    duracion character varying(20) NOT NULL,
    modalidad character varying(20),
    CONSTRAINT programa_academico_modalidad_check CHECK (((modalidad)::text = ANY ((ARRAY['Presencial'::character varying, 'Virtual'::character varying, 'Distancia'::character varying])::text[])))
);


--
-- Data for Name: asignacion_docente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asignacion_docente (id_asignacion, id_docente, id_oferta) FROM stdin;
AD1	D1	OF1
AD2	D1	OF2
AD3	D5	OF3
AD4	D2	OF4
AD8	D1	OF8
AD9	D4	OF6
AD10	D1	OF10
AD11	D1	OF11
\.


--
-- Data for Name: asignatura; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asignatura (id_asignatura, nombre, creditos, carga_horaria, tipo, descripcion) FROM stdin;
A1	Programación I	4	64	teorica	Introducción a la programación estructurada
A2	Bases de Datos	3	48	mixta	Modelado relacional y SQL
A3	Matemáticas I	4	64	teorica	Álgebra y cálculo diferencial
A4	Gestión Empresarial	3	48	teorica	Fundamentos de administración
A5	Diseño Digital	3	48	practica	Herramientas digitales y creatividad
\.


--
-- Data for Name: docente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.docente (id_docente, cedula, nombre, apellido, especialidad, vinculacion) FROM stdin;
D1	1234567890	Carlos	Ramírez	Sistemas	Tiempo completo
D2	2233445566	Ana	López	Administración	Catedra
D3	3344556677	María	Torres	Diseño	Medio tiempo
D4	4455667788	Juan	Gómez	Matemáticas	Catedra
D5	5566778899	Laura	Martínez	Bases de Datos	Tiempo completo
\.


--
-- Data for Name: oferta_academica; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.oferta_academica (id_oferta, id_periodo, id_plan, grupo, cupo) FROM stdin;
OF2	P1	PL2	G2	25
OF3	P1	PL3	G3	35
OF4	P1	PL4	G4	20
OF5	P1	PL5	G5	20
OF6	P1	PL6	G6	15
OF7	P2	PL1	G7	30
OF8	P2	PL5	G8	25
OF9	P1	PL2	G9	30
OF10	P1	PL2	G10	40
OF11	P1	PL3	G11	20
OF12	P1	PL3	G12	30
OF13	P1	PL3	G13	20
OF14	P1	PL3	G14	20
OF15	P1	PL3	G15	20
OF16	P1	PL3	G16	20
OF17	P1	PL3	G17	20
OF18	P1	PL3	G18	20
OF19	P1	PL3	G19	30
OF20	P1	PL3	G20	30
OF21	P1	PL3	G21	30
OF1	P3	PL1	G1	40
\.


--
-- Data for Name: periodo_academico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.periodo_academico (id_periodo, fecha_inicio, fecha_fin, estado, descripcion) FROM stdin;
P1	2025-01-20	2025-06-20	activo	Periodo 2025-1
P2	2025-07-15	2025-12-15	en preparacion	Periodo 2025-2
P3	2024-07-15	2024-12-15	cerrado	Periodo 2024-2
P4	2025-07-18	2025-12-09	activo	Periodo académico 2025-2
\.


--
-- Data for Name: plan_estudio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.plan_estudio (id_plan, id_programa, id_asignatura, semestre) FROM stdin;
PL2	PA1	A2	3
PL3	PA1	A3	1
PL4	PA2	A4	2
PL5	PA2	A2	3
PL6	PA3	A5	1
PL10	PA3	A3	5
PL12	PA2	A1	6
PL23	PA3	A1	5
PL25	PA3	A2	8
PL1	PA1	A1	7
\.


--
-- Data for Name: programa_academico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programa_academico (id_programa, nombre, informacion, nivel_educativo, duracion, modalidad) FROM stdin;
PA1	Ingeniería de Sistemas	Carrera enfocada en software y tecnología	Pregrado	8 semestres	Presencial
PA2	Administración de Empresas	Formación en gestión y liderazgo empresarial	Pregrado	8 semestres	Virtual
PA3	Diseño Gráfico	Formación en comunicación visual y diseño	Pregrado	8 semestres	Distancia
\.


--
-- Name: asignacion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asignacion_seq', 11, true);


--
-- Name: asignatura_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asignatura_seq', 5, true);


--
-- Name: docente_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.docente_seq', 5, true);


--
-- Name: grupo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grupo_seq', 26, true);


--
-- Name: oferta_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.oferta_seq', 26, true);


--
-- Name: periodo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.periodo_seq', 4, true);


--
-- Name: plane_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.plane_seq', 25, true);


--
-- Name: programa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.programa_seq', 3, true);


--
-- Name: asignacion_docente asignacion_docente_id_docente_id_oferta_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_docente
    ADD CONSTRAINT asignacion_docente_id_docente_id_oferta_key UNIQUE (id_docente, id_oferta);


--
-- Name: asignacion_docente asignacion_docente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_docente
    ADD CONSTRAINT asignacion_docente_pkey PRIMARY KEY (id_asignacion);


--
-- Name: asignatura asignatura_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignatura
    ADD CONSTRAINT asignatura_pkey PRIMARY KEY (id_asignatura);


--
-- Name: docente docente_cedula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docente
    ADD CONSTRAINT docente_cedula_key UNIQUE (cedula);


--
-- Name: docente docente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docente
    ADD CONSTRAINT docente_pkey PRIMARY KEY (id_docente);


--
-- Name: oferta_academica oferta_academica_id_periodo_id_plan_grupo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oferta_academica
    ADD CONSTRAINT oferta_academica_id_periodo_id_plan_grupo_key UNIQUE (id_periodo, id_plan, grupo);


--
-- Name: oferta_academica oferta_academica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oferta_academica
    ADD CONSTRAINT oferta_academica_pkey PRIMARY KEY (id_oferta);


--
-- Name: periodo_academico periodo_academico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodo_academico
    ADD CONSTRAINT periodo_academico_pkey PRIMARY KEY (id_periodo);


--
-- Name: plan_estudio plan_estudio_id_programa_id_asignatura_semestre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_id_programa_id_asignatura_semestre_key UNIQUE (id_programa, id_asignatura, semestre);


--
-- Name: plan_estudio plan_estudio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_pkey PRIMARY KEY (id_plan);


--
-- Name: programa_academico programa_academico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programa_academico
    ADD CONSTRAINT programa_academico_pkey PRIMARY KEY (id_programa);


--
-- Name: asignacion_docente asignacion_docente_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_docente
    ADD CONSTRAINT asignacion_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docente(id_docente);


--
-- Name: asignacion_docente asignacion_docente_id_oferta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_docente
    ADD CONSTRAINT asignacion_docente_id_oferta_fkey FOREIGN KEY (id_oferta) REFERENCES public.oferta_academica(id_oferta);


--
-- Name: oferta_academica oferta_academica_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oferta_academica
    ADD CONSTRAINT oferta_academica_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodo_academico(id_periodo);


--
-- Name: oferta_academica oferta_academica_id_plan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oferta_academica
    ADD CONSTRAINT oferta_academica_id_plan_fkey FOREIGN KEY (id_plan) REFERENCES public.plan_estudio(id_plan);


--
-- Name: plan_estudio plan_estudio_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignatura(id_asignatura);


--
-- Name: plan_estudio plan_estudio_id_programa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_id_programa_fkey FOREIGN KEY (id_programa) REFERENCES public.programa_academico(id_programa);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict sOXo85NZaTAEozex19jKxLtG3ZDm9SkcKhZUWSDZPalJUadQ6lseyBdmyqrAAdU