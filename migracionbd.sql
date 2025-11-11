--
-- PostgreSQL database dump
--

\restrict 5zWEhCfXtfEmI6nQItUfa2PmbfpftqzOJHraRx3qEUaHHRGPSsewW8dugrOYfnS

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
-- Name: gen_id_a(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.gen_id_a() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.id_asignatura := 'A' || nextval('asignatura_seq');
  RETURN NEW;
END;
$$;


--
-- Name: gen_id_docenteocente(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.gen_id_docenteocente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.id_docenteocente := 'D' || nextval('docente_seq');
  RETURN NEW;
END;
$$;


--
-- Name: gen_id_p(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.gen_id_p() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.id_p := 'P' || nextval('periodo_seq');
  RETURN NEW;
END;
$$;


--
-- Name: gen_id_plan(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.gen_id_plan() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.id_plan := 'PA' || nextval('programa_seq');
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asignatura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignatura (
    id_asignatura character varying NOT NULL,
    nombre character varying(100) NOT NULL,
    creditos integer NOT NULL,
    carga_horaria integer NOT NULL,
    tipo character varying(10),
    descripcion character varying(50),
    CONSTRAINT asignatura_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['teorica'::character varying, 'practica'::character varying, 'mixta'::character varying])::text[])))
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
-- Name: docente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.docente (
    id_docenteocente character varying(15) NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    especialidad character varying(20) NOT NULL,
    vinculacion character varying(20),
    cedula character varying(10) NOT NULL,
    CONSTRAINT docente_vinculacion_check CHECK (((vinculacion)::text = ANY ((ARRAY['Tiempo completo'::character varying, 'Catedra'::character varying, 'Medio tiempo'::character varying])::text[])))
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
-- Name: periodo_academico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.periodo_academico (
    id_p character varying NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado character varying(15),
    descripcion character varying(50),
    CONSTRAINT periodo_academico_estado_check CHECK (((estado)::text = ANY ((ARRAY['activo'::character varying, 'cerrado'::character varying, 'en preparacion'::character varying])::text[])))
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
-- Name: programa_academico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programa_academico (
    id_plan character varying NOT NULL,
    nombre character varying(50) NOT NULL,
    informacion character varying(50) NOT NULL,
    nivel_educativo character varying(20) NOT NULL,
    duracion character varying(20) NOT NULL,
    modalidad character varying(20),
    CONSTRAINT programa_academico_modalidad_check CHECK (((modalidad)::text = ANY ((ARRAY['Presencial'::character varying, 'Virtual'::character varying, 'Distancia'::character varying])::text[])))
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
-- Data for Name: asignatura; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asignatura (id_asignatura, nombre, creditos, carga_horaria, tipo, descripcion) FROM stdin;
A4	Diseño Digital	3	4	practica	Uso de software de diseño gráfico
A5	Logística Internacional	3	4	mixta	Operaciones globales y transporte
A13	Bases de datos 3	4	5	mixta	materia fundamental para analisis de datos
A14	Logica de programacion 1	3	2	practica	materia fundamental para diseños de software
A18	Bases de datos II	3	4	teorica	materia fundamental para analisis de datos
A19	Programación III	4	4	practica	Fundamentos de programación
A20	Bases de datos III	4	4	practica	Fundamentos de programación
\.


--
-- Data for Name: docente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.docente (id_docenteocente, nombre, apellido, especialidad, vinculacion, cedula) FROM stdin;
D8	Carlos	Ramírez	Informática	Tiempo completo	2839405758
D10	María	González	Finanzas	Catedra	2940273003
D11	Julián	Pérez	Diseño	Medio tiempo	294027204
D12	Laura	Martínez	Educación	Tiempo completo	5769328302
D13	Andrés	Santos	Logística	Catedra	5679209576
\.


--
-- Data for Name: periodo_academico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.periodo_academico (id_p, fecha_inicio, fecha_fin, estado, descripcion) FROM stdin;
P1	2025-01-15	2025-06-15	cerrado	Periodo académico 2025-1
P2	2025-07-15	2025-12-15	activo	Periodo académico 2025-2
P3	2026-01-15	2026-06-15	en preparacion	Periodo académico 2026-1
\.


--
-- Data for Name: programa_academico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programa_academico (id_plan, nombre, informacion, nivel_educativo, duracion, modalidad) FROM stdin;
PA1	Ingeniería de Sistemas	Formación en software y redes	Pregrado	10 semestres	Presencial
PA2	Administración de Empresas	Gestión y liderazgo empresarial	Pregrado	8 semestres	Virtual
PA3	Diseño Gráfico	Creatividad y comunicación visual	Pregrado	8 semestres	Presencial
PA4	Maestría en Educación	Investigación y pedagogía avanzada	Posgrado	4 semestres	Presencial
PA5	Tecnología en Logística	Gestión de operaciones y transporte	Técnico	6 semestres	Distancia
\.


--
-- Name: asignatura_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asignatura_seq', 20, true);


--
-- Name: docente_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.docente_seq', 13, true);


--
-- Name: periodo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.periodo_seq', 3, true);


--
-- Name: programa_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.programa_seq', 5, true);


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
    ADD CONSTRAINT docente_pkey PRIMARY KEY (id_docenteocente);


--
-- Name: periodo_academico periodo_academico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodo_academico
    ADD CONSTRAINT periodo_academico_pkey PRIMARY KEY (id_p);


--
-- Name: programa_academico programa_academico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programa_academico
    ADD CONSTRAINT programa_academico_pkey PRIMARY KEY (id_plan);


--
-- Name: asignatura trg_id_a; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_id_a BEFORE INSERT ON public.asignatura FOR EACH ROW EXECUTE FUNCTION public.gen_id_a();


--
-- Name: docente trg_id_docente; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_id_docente BEFORE INSERT ON public.docente FOR EACH ROW EXECUTE FUNCTION public.gen_id_docente();


--
-- Name: periodo_academico trg_id_p; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_id_p BEFORE INSERT ON public.periodo_academico FOR EACH ROW EXECUTE FUNCTION public.gen_id_p();


--
-- Name: programa_academico trg_id_plan; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_id_plan BEFORE INSERT ON public.programa_academico FOR EACH ROW EXECUTE FUNCTION public.gen_id_plan();


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict 5zWEhCfXtfEmI6nQItUfa2PmbfpftqzOJHraRx3qEUaHHRGPSsewW8dugrOYfnS

