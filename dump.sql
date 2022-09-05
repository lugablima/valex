--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: transactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."transactionType" AS ENUM (
    'groceries',
    'restaurant',
    'transport',
    'education',
    'health'
);


ALTER TYPE public."transactionType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: businesses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.businesses (
    id integer NOT NULL,
    name text NOT NULL,
    type public."transactionType" NOT NULL
);


ALTER TABLE public.businesses OWNER TO postgres;

--
-- Name: businesses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.businesses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.businesses_id_seq OWNER TO postgres;

--
-- Name: businesses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.businesses_id_seq OWNED BY public.businesses.id;


--
-- Name: cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    "employeeId" integer NOT NULL,
    number text NOT NULL,
    "cardholderName" text NOT NULL,
    "securityCode" text NOT NULL,
    "expirationDate" text NOT NULL,
    password text,
    "isVirtual" boolean NOT NULL,
    "originalCardId" integer,
    "isBlocked" boolean NOT NULL,
    type public."transactionType" NOT NULL
);


ALTER TABLE public.cards OWNER TO postgres;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cards_id_seq OWNER TO postgres;

--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name text NOT NULL,
    "apiKey" text
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    "fullName" text NOT NULL,
    cpf text NOT NULL,
    email text NOT NULL,
    "companyId" integer NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    "cardId" integer NOT NULL,
    "businessId" integer NOT NULL,
    "timestamp" timestamp(0) without time zone DEFAULT now() NOT NULL,
    amount integer NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: recharges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recharges (
    id integer NOT NULL,
    "cardId" integer NOT NULL,
    "timestamp" timestamp(0) without time zone DEFAULT now() NOT NULL,
    amount integer NOT NULL
);


ALTER TABLE public.recharges OWNER TO postgres;

--
-- Name: recharges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recharges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recharges_id_seq OWNER TO postgres;

--
-- Name: recharges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recharges_id_seq OWNED BY public.recharges.id;


--
-- Name: businesses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses ALTER COLUMN id SET DEFAULT nextval('public.businesses_id_seq'::regclass);


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: recharges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recharges ALTER COLUMN id SET DEFAULT nextval('public.recharges_id_seq'::regclass);


--
-- Data for Name: businesses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.businesses (id, name, type) FROM stdin;
1	Responde Aí	education
2	Extra	groceries
3	Driven Eats	restaurant
4	Uber	transport
5	Unimed	health
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cards (id, "employeeId", number, "cardholderName", "securityCode", "expirationDate", password, "isVirtual", "originalCardId", "isBlocked", type) FROM stdin;
3	1	9092526296578947	FULANO R SILVA	489c937d5cc06a652064124a8a9164d180ddf8650f22ab3f93be21c1f34b7123a287d8123f3ac1c365213fc9f531adbc3124f3c0eb6235cfe1f876f214e3bb798d9c9542b45b419be3b2b5b3db040278a17a46e0cf34b3f51e77b4fbcb120b303fe3bb	09/27	\N	f	\N	t	restaurant
8	2	5626691373795752	CICLANA M MADEIRA	13f08796892d0ea1b744fe5d124d02ecb304e9e35a2c392f78283e24940c64f932a3520c67c890c10b4c3f59a8e2c1f39a4c5022c79f51dddb44a2d08a4d269a83cab5823614f07d234299a862a3af19e654fcdf3cb163d4dd41d70f57cb63830d87aa	09/27	\N	f	\N	f	transport
2	1	6271946116384629	FULANO R SILVA	129138dbf68667c4915ef8e10a400e637d7b02517e071b22b9f1e363c4233a7fc10194b39c3b2a44a18a17617dd31a2cd3c5ef970afd35162c6a1cd4c3c9a857fff8c2d76f40c719fa6b40bd2cbbbf775643a4dd076e5e3fbe9b4962d8d57899c32206	09/27	\N	f	\N	t	education
7	1	5544849223370043	FULANO R SILVA	21dbc9196f490711a2c79619050884efa14905c84355bd6bdbf441e43ed5150bba4180aa04896d606e4e8c89733b6c8b1504249140c24d2b3836018151b2f1e21c6eafce59c2e28811b428d4a90ae8204ae099143633326d9d88e0909b0cbc51fcb555	09/27	$2b$10$FCRavlfvJi2JDHU0jIrMkeP3Kixxunm.Z5sT/i5UNAObp9jtkQQ8m	f	\N	f	transport
9	1	6771-8968-1901-4957	FULANO R SILVA	76f43827f33693e622fc4a5ba6305acc78ce8857218906931be4d03b3229881e89f655cd1f63d1ca626e2c63913caac32f51e279290efb4cc2b1533b678bc4f2085dd6d1312e4f484287dad53bc5483ce920d76f0fdf581c895df25d0341851122afe8	09/27	$2b$10$FCRavlfvJi2JDHU0jIrMkeP3Kixxunm.Z5sT/i5UNAObp9jtkQQ8m	t	7	f	transport
4	2	3907698701031319	CICLANA M MADEIRA	3a76ef4691568cd4e5f053dfc6ef4e24de3e501c40c7d11deb1b34ebaa8f01e2144e5ab0ab4dd1f9e5e0fbda5f793582d0d4bbb0d92a14da569af5ea30e8b7d9ad3825daf9bf9397258736acd775fd1a1e926e1e829996eac569db3c0d058699a8fb10	09/27	$2b$10$Zix3zE94EgYzDvtrHseuVOitAz7.LbqOGVHyWzb6BOhNzS2bjznw2	f	4	f	restaurant
5	2	0074085357151832	CICLANA M MADEIRA	b1e13cc0cd7f8e93c2341a37bd609e90a693c93db3f71a34329b341142f897ccf6881bcd1e1a74f06895cba581e43f596e5230eca74856fc19c4f3e58bf9d16924f248c4e4a2927a8e5490710d71ea2dc4dab56ea211035000671d31d1e418116e1a1a	09/17	1234	f	\N	f	health
1	2	5897780635548803	CICLANA M MADEIRA	a9682c9d5bafcc629fd7e3fe572a112fbdcdd587897d3a150b591123791416d22eff21fad0c481e66c3f9a9fea0ca4f780d8117c238a73855d695666dcb844bd2950cb2b068332b178e68ece56cc14d509072d00ced393ea9f60ff721fc4dd49e9570b	09/27	1234	f	\N	t	education
10	1	7575254645324693	FULANO R SILVA	01479a6d5621477033d934a345877299a656b69fcff665f036c41a51f50511b62b5806c6c1a120c0809832d09e274c3f9ce285a06b16ea599bf08380b6a4967bc2dc9110ab72ef942933f63b333a50051952d1ce99c5e306ab467545e3313f130c75e6	09/27	$2b$10$4R3eY6C6ahyFx1ASVZliW.6P74nv6gDcl9JDCZ8kxfd/svVVs2woe	f	\N	f	groceries
6	1	7386054009905263	FULANO R SILVA	eddaa7e844b7c8fef7aa27e2802ad64d0f4ff574190261a1f048ce5132af66caaa3b04d0b37217159c8b5099419021f8012667ffe77141a647f8caa01ad6c43f4a7058a87a5d52380880461359fee08fd34ec30cc15c8b3f7592ca84f0258547b96ea1	09/27	$2b$10$XMo0SVkg7qJv1DhYNyo5b.S1GHRG7a4wBPMt8qVdGJK9VhGrOf.uy	f	6	f	health
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, "apiKey") FROM stdin;
1	Driven	zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, "fullName", cpf, email, "companyId") FROM stdin;
1	Fulano Rubens da Silva	47100935741	fulano.silva@gmail.com	1
2	Ciclana Maria Madeira	08434681895	ciclaninha@gmail.com	1
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "cardId", "businessId", "timestamp", amount) FROM stdin;
1	4	3	2022-09-03 20:15:06	50
2	4	3	2022-09-03 20:20:05	50
3	6	5	2022-09-05 13:29:45	50
4	7	4	2022-09-05 17:22:08	20
5	7	4	2022-09-05 19:04:51	10
\.


--
-- Data for Name: recharges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recharges (id, "cardId", "timestamp", amount) FROM stdin;
1	4	2022-09-03 18:59:02	100
2	6	2022-09-05 13:27:28	100
3	7	2022-09-05 17:17:45	70
\.


--
-- Name: businesses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.businesses_id_seq', 1, false);


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 10, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 1, false);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 5, true);


--
-- Name: recharges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recharges_id_seq', 3, true);


--
-- Name: businesses businesses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_name_key UNIQUE (name);


--
-- Name: businesses businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);


--
-- Name: cards cards_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_number_key UNIQUE (number);


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: employees employees_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_cpf_key UNIQUE (cpf);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: recharges recharges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recharges
    ADD CONSTRAINT recharges_pkey PRIMARY KEY (id);


--
-- Name: cards cards_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT "cards_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id);


--
-- Name: cards cards_originalCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT "cards_originalCardId_fkey" FOREIGN KEY ("originalCardId") REFERENCES public.cards(id);


--
-- Name: employees employees_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id);


--
-- Name: payments payments_businessId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES public.businesses(id);


--
-- Name: payments payments_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public.cards(id);


--
-- Name: recharges recharges_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recharges
    ADD CONSTRAINT "recharges_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public.cards(id);


--
-- PostgreSQL database dump complete
--

