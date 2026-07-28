--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14 (Debian 16.14-1.pgdg12+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    username character varying(255),
    media json,
    provider character varying(255) NOT NULL,
    "providerId" character varying(255) NOT NULL,
    data json,
    authorized boolean DEFAULT false,
    "accessToken" text NOT NULL,
    "apiKey" text NOT NULL,
    "authMethod" character varying(255) NOT NULL,
    active boolean DEFAULT false,
    "accountTier" character varying(32) DEFAULT 'Basic'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: admin_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_sessions (
    sid character varying(255) NOT NULL,
    expires timestamp with time zone,
    data text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "userUuid" character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    key character varying(255) NOT NULL,
    "lastUsedAt" timestamp with time zone,
    "isActive" boolean DEFAULT true,
    scopes json DEFAULT '{"allProjects":true,"projects":[]}'::json NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: audience; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audience (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    total integer DEFAULT 0,
    date date NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: audience_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audience_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audience_id_seq OWNED BY public.audience.id;


--
-- Name: calendars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendars (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone,
    "allDay" boolean DEFAULT false,
    color character varying(7) DEFAULT '#3788d8'::character varying,
    type character varying(255) DEFAULT 'event'::character varying,
    "projectUuid" character varying(36) NOT NULL,
    "userUuid" character varying(36) NOT NULL,
    "postUuid" character varying(36),
    metadata json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: calendars_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calendars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calendars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendars_id_seq OWNED BY public.calendars.id;


--
-- Name: facebook_insights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.facebook_insights (
    id integer NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    type integer NOT NULL,
    value integer NOT NULL,
    date date NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: facebook_insights_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.facebook_insights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: facebook_insights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.facebook_insights_id_seq OWNED BY public.facebook_insights.id;


--
-- Name: flow_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_runs (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "workflowUuid" character varying(36) NOT NULL,
    "userUuid" character varying(36) NOT NULL,
    "triggerType" character varying(255) DEFAULT 'manual'::character varying,
    status character varying(255) NOT NULL,
    "startedAt" timestamp with time zone NOT NULL,
    "finishedAt" timestamp with time zone,
    "initialContext" jsonb DEFAULT '{}'::jsonb,
    "contextSnapshot" jsonb DEFAULT '{}'::jsonb,
    error jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: flow_runs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_runs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_runs_id_seq OWNED BY public.flow_runs.id;


--
-- Name: flow_trigger_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_trigger_events (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "workflowUuid" character varying(36) NOT NULL,
    "runUuid" character varying(36),
    "triggerType" character varying(255) NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb,
    headers jsonb DEFAULT '{}'::jsonb,
    status character varying(255) DEFAULT 'received'::character varying,
    "receivedAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: flow_trigger_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_trigger_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_trigger_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_trigger_events_id_seq OWNED BY public.flow_trigger_events.id;


--
-- Name: flow_workflow_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_workflow_versions (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "workflowUuid" character varying(36) NOT NULL,
    "versionNumber" integer NOT NULL,
    name character varying(255),
    definition jsonb NOT NULL,
    "createdBy" character varying(36),
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: flow_workflow_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_workflow_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_workflow_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_workflow_versions_id_seq OWNED BY public.flow_workflow_versions.id;


--
-- Name: flow_workflows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_workflows (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "userUuid" character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    version character varying(255) DEFAULT '1.0.0'::character varying,
    "triggerType" character varying(255) DEFAULT 'manual'::character varying,
    "triggerConfig" jsonb DEFAULT '{}'::jsonb,
    definition jsonb NOT NULL,
    status integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: flow_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_workflows_id_seq OWNED BY public.flow_workflows.id;


--
-- Name: imported_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.imported_posts (
    id integer NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    "providerPostId" character varying(255) NOT NULL,
    content json NOT NULL,
    metrics json NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: imported_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.imported_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: imported_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.imported_posts_id_seq OWNED BY public.imported_posts.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    "totalJobs" integer DEFAULT 0 NOT NULL,
    "pendingJobs" integer DEFAULT 0 NOT NULL,
    "failedJobs" integer DEFAULT 0 NOT NULL,
    "failedJobIds" json,
    "cancelledAt" timestamp with time zone,
    "finishedAt" timestamp with time zone,
    options json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: job_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_batches_id_seq OWNED BY public.job_batches.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.logs (
    uuid character varying(36) NOT NULL,
    level character varying(20) NOT NULL,
    message text NOT NULL,
    meta json,
    service character varying(100),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    "mimeType" character varying(255) NOT NULL,
    disk character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    "userUuid" character varying(36),
    data json,
    size bigint DEFAULT 0 NOT NULL,
    "sizeTotal" bigint DEFAULT 0 NOT NULL,
    conversions json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.metrics (
    id integer NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    data json NOT NULL,
    date date NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.metrics_id_seq OWNED BY public.metrics.id;


--
-- Name: oauth_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_services (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    configuration text NOT NULL,
    active boolean DEFAULT false
);


--
-- Name: oauth_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_services_id_seq OWNED BY public.oauth_services.id;


--
-- Name: post_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_accounts (
    uuid character varying(36) NOT NULL,
    "postUuid" character varying(36) NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "providerPostId" character varying(255),
    data json,
    errors json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: post_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_histories (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "postUuid" character varying(36) NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "publishedAt" timestamp with time zone NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    "providerPostId" character varying(255),
    "recurringType" integer DEFAULT 0 NOT NULL,
    content text,
    media json,
    data json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: post_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_histories_id_seq OWNED BY public.post_histories.id;


--
-- Name: post_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_versions (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "postUuid" character varying(36) NOT NULL,
    "accountUuid" character varying(36) NOT NULL,
    "isOriginal" boolean DEFAULT false,
    content text,
    media json
);


--
-- Name: post_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_versions_id_seq OWNED BY public.post_versions.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    status integer DEFAULT 0,
    "scheduleStatus" integer DEFAULT 0,
    "recurringType" integer DEFAULT 0 NOT NULL,
    "recurringDays" character varying(32),
    "recurringTime" time without time zone,
    "recurringEndAt" timestamp with time zone,
    "scheduledAt" timestamp with time zone,
    "publishedAt" timestamp with time zone,
    "userUuid" character varying(36),
    "projectUuid" character varying(36) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "userUuid" character varying(36) NOT NULL,
    "imageUrl" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    configuration text NOT NULL,
    active boolean DEFAULT false
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    payload json NOT NULL
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: tag_post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tag_post (
    "tagUuid" character varying(36) NOT NULL,
    "postUuid" character varying(36) NOT NULL
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    uuid character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    "hexColor" character varying(10) NOT NULL,
    "projectUuid" character varying(36) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    uuid character varying(36),
    "fullName" character varying(255),
    email character varying(255),
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role,
    "isActive" boolean DEFAULT true,
    "lastLogin" timestamp with time zone,
    password character varying(255),
    provider character varying(255) DEFAULT 'local'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: audience id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audience ALTER COLUMN id SET DEFAULT nextval('public.audience_id_seq'::regclass);


--
-- Name: calendars id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars ALTER COLUMN id SET DEFAULT nextval('public.calendars_id_seq'::regclass);


--
-- Name: facebook_insights id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facebook_insights ALTER COLUMN id SET DEFAULT nextval('public.facebook_insights_id_seq'::regclass);


--
-- Name: flow_runs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_runs ALTER COLUMN id SET DEFAULT nextval('public.flow_runs_id_seq'::regclass);


--
-- Name: flow_trigger_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_trigger_events ALTER COLUMN id SET DEFAULT nextval('public.flow_trigger_events_id_seq'::regclass);


--
-- Name: flow_workflow_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflow_versions ALTER COLUMN id SET DEFAULT nextval('public.flow_workflow_versions_id_seq'::regclass);


--
-- Name: flow_workflows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflows ALTER COLUMN id SET DEFAULT nextval('public.flow_workflows_id_seq'::regclass);


--
-- Name: imported_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imported_posts ALTER COLUMN id SET DEFAULT nextval('public.imported_posts_id_seq'::regclass);


--
-- Name: job_batches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches ALTER COLUMN id SET DEFAULT nextval('public.job_batches_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metrics ALTER COLUMN id SET DEFAULT nextval('public.metrics_id_seq'::regclass);


--
-- Name: oauth_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_services ALTER COLUMN id SET DEFAULT nextval('public.oauth_services_id_seq'::regclass);


--
-- Name: post_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_histories ALTER COLUMN id SET DEFAULT nextval('public.post_histories_id_seq'::regclass);


--
-- Name: post_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_versions ALTER COLUMN id SET DEFAULT nextval('public.post_versions_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_uuid_key UNIQUE (uuid);


--
-- Name: admin_sessions admin_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_pkey PRIMARY KEY (sid);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_uuid_key UNIQUE (uuid);


--
-- Name: audience audience_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audience
    ADD CONSTRAINT audience_pkey PRIMARY KEY (id);


--
-- Name: audience audience_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audience
    ADD CONSTRAINT audience_uuid_key UNIQUE (uuid);


--
-- Name: calendars calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_pkey PRIMARY KEY (id);


--
-- Name: calendars calendars_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_uuid_key UNIQUE (uuid);


--
-- Name: facebook_insights facebook_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facebook_insights
    ADD CONSTRAINT facebook_insights_pkey PRIMARY KEY (id);


--
-- Name: flow_runs flow_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_runs
    ADD CONSTRAINT flow_runs_pkey PRIMARY KEY (id);


--
-- Name: flow_runs flow_runs_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_runs
    ADD CONSTRAINT flow_runs_uuid_key UNIQUE (uuid);


--
-- Name: flow_trigger_events flow_trigger_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_trigger_events
    ADD CONSTRAINT flow_trigger_events_pkey PRIMARY KEY (id);


--
-- Name: flow_trigger_events flow_trigger_events_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_trigger_events
    ADD CONSTRAINT flow_trigger_events_uuid_key UNIQUE (uuid);


--
-- Name: flow_workflow_versions flow_workflow_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflow_versions
    ADD CONSTRAINT flow_workflow_versions_pkey PRIMARY KEY (id);


--
-- Name: flow_workflow_versions flow_workflow_versions_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflow_versions
    ADD CONSTRAINT flow_workflow_versions_uuid_key UNIQUE (uuid);


--
-- Name: flow_workflows flow_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflows
    ADD CONSTRAINT flow_workflows_pkey PRIMARY KEY (id);


--
-- Name: flow_workflows flow_workflows_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflows
    ADD CONSTRAINT flow_workflows_uuid_key UNIQUE (uuid);


--
-- Name: imported_posts imported_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imported_posts
    ADD CONSTRAINT imported_posts_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_uuid_key UNIQUE (uuid);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (uuid);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: media media_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uuid_key UNIQUE (uuid);


--
-- Name: metrics metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metrics
    ADD CONSTRAINT metrics_pkey PRIMARY KEY (id);


--
-- Name: oauth_services oauth_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_services
    ADD CONSTRAINT oauth_services_pkey PRIMARY KEY (id);


--
-- Name: oauth_services oauth_services_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_services
    ADD CONSTRAINT oauth_services_uuid_key UNIQUE (uuid);


--
-- Name: post_accounts post_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT post_accounts_pkey PRIMARY KEY ("postUuid", "accountUuid");


--
-- Name: post_accounts post_accounts_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT post_accounts_uuid_key UNIQUE (uuid);


--
-- Name: post_histories post_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_histories
    ADD CONSTRAINT post_histories_pkey PRIMARY KEY (id);


--
-- Name: post_histories post_histories_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_histories
    ADD CONSTRAINT post_histories_uuid_key UNIQUE (uuid);


--
-- Name: post_versions post_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_versions
    ADD CONSTRAINT post_versions_pkey PRIMARY KEY (id);


--
-- Name: post_versions post_versions_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_versions
    ADD CONSTRAINT post_versions_uuid_key UNIQUE (uuid);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_uuid_key UNIQUE (uuid);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_uuid_key UNIQUE (uuid);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_uuid_key UNIQUE (uuid);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: settings settings_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_uuid_key UNIQUE (uuid);


--
-- Name: tag_post tag_post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_post
    ADD CONSTRAINT tag_post_pkey PRIMARY KEY ("tagUuid", "postUuid");


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_uuid_key UNIQUE (uuid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_uuid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uuid_key UNIQUE (uuid);


--
-- Name: accounts_unq_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX accounts_unq_id ON public.accounts USING btree (provider, "providerId");


--
-- Name: calendars_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX calendars_date_idx ON public.calendars USING btree ("startDate", "endDate");


--
-- Name: calendars_project_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX calendars_project_idx ON public.calendars USING btree ("projectUuid");


--
-- Name: calendars_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX calendars_user_idx ON public.calendars USING btree ("userUuid");


--
-- Name: flow_workflow_versions_workflow_version_unq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX flow_workflow_versions_workflow_version_unq ON public.flow_workflow_versions USING btree ("workflowUuid", "versionNumber");


--
-- Name: imported_posts_unq_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX imported_posts_unq_id ON public.imported_posts USING btree ("accountUuid", "providerPostId");


--
-- Name: logs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_created_at_idx ON public.logs USING btree ("createdAt");


--
-- Name: logs_level_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_level_idx ON public.logs USING btree (level);


--
-- Name: logs_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_service_idx ON public.logs USING btree (service);


--
-- Name: post_histories_account_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX post_histories_account_uuid ON public.post_histories USING btree ("accountUuid");


--
-- Name: post_histories_post_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX post_histories_post_uuid ON public.post_histories USING btree ("postUuid");


--
-- Name: post_histories_post_uuid_published_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX post_histories_post_uuid_published_at ON public.post_histories USING btree ("postUuid", "publishedAt");


--
-- Name: post_histories_published_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX post_histories_published_at ON public.post_histories USING btree ("publishedAt");


--
-- Name: settings_name_project_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_name_project_uuid ON public.settings USING btree (name, "projectUuid");


--
-- Name: accounts accounts_projectUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_projectUuid_fkey" FOREIGN KEY ("projectUuid") REFERENCES public.projects(uuid) ON UPDATE CASCADE;


--
-- Name: api_keys api_keys_userUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT "api_keys_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE;


--
-- Name: audience audience_accountUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audience
    ADD CONSTRAINT "audience_accountUuid_fkey" FOREIGN KEY ("accountUuid") REFERENCES public.accounts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audience audience_projectUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audience
    ADD CONSTRAINT "audience_projectUuid_fkey" FOREIGN KEY ("projectUuid") REFERENCES public.projects(uuid) ON UPDATE CASCADE;


--
-- Name: calendars calendars_postUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "calendars_postUuid_fkey" FOREIGN KEY ("postUuid") REFERENCES public.posts(uuid) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: calendars calendars_projectUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "calendars_projectUuid_fkey" FOREIGN KEY ("projectUuid") REFERENCES public.projects(uuid) ON UPDATE CASCADE;


--
-- Name: calendars calendars_userUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT "calendars_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE;


--
-- Name: facebook_insights facebook_insights_accountUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facebook_insights
    ADD CONSTRAINT "facebook_insights_accountUuid_fkey" FOREIGN KEY ("accountUuid") REFERENCES public.accounts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_runs flow_runs_workflowUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_runs
    ADD CONSTRAINT "flow_runs_workflowUuid_fkey" FOREIGN KEY ("workflowUuid") REFERENCES public.flow_workflows(uuid) ON UPDATE CASCADE;


--
-- Name: flow_trigger_events flow_trigger_events_workflowUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_trigger_events
    ADD CONSTRAINT "flow_trigger_events_workflowUuid_fkey" FOREIGN KEY ("workflowUuid") REFERENCES public.flow_workflows(uuid) ON UPDATE CASCADE;


--
-- Name: flow_workflow_versions flow_workflow_versions_workflowUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflow_versions
    ADD CONSTRAINT "flow_workflow_versions_workflowUuid_fkey" FOREIGN KEY ("workflowUuid") REFERENCES public.flow_workflows(uuid) ON UPDATE CASCADE;


--
-- Name: flow_workflows flow_workflows_userUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_workflows
    ADD CONSTRAINT "flow_workflows_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE;


--
-- Name: imported_posts imported_posts_accountUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imported_posts
    ADD CONSTRAINT "imported_posts_accountUuid_fkey" FOREIGN KEY ("accountUuid") REFERENCES public.accounts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: media media_userUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT "media_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: metrics metrics_accountUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metrics
    ADD CONSTRAINT "metrics_accountUuid_fkey" FOREIGN KEY ("accountUuid") REFERENCES public.accounts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_accounts post_accounts_accountUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT "post_accounts_accountUuid_fkey" FOREIGN KEY ("accountUuid") REFERENCES public.accounts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_accounts post_accounts_postUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT "post_accounts_postUuid_fkey" FOREIGN KEY ("postUuid") REFERENCES public.posts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_versions post_versions_accountUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_versions
    ADD CONSTRAINT "post_versions_accountUuid_fkey" FOREIGN KEY ("accountUuid") REFERENCES public.accounts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_versions post_versions_postUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_versions
    ADD CONSTRAINT "post_versions_postUuid_fkey" FOREIGN KEY ("postUuid") REFERENCES public.posts(uuid) ON UPDATE CASCADE;


--
-- Name: posts posts_projectUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_projectUuid_fkey" FOREIGN KEY ("projectUuid") REFERENCES public.projects(uuid) ON UPDATE CASCADE;


--
-- Name: posts posts_userUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_userUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE;


--
-- Name: tag_post tag_post_postUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_post
    ADD CONSTRAINT "tag_post_postUuid_fkey" FOREIGN KEY ("postUuid") REFERENCES public.posts(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tag_post tag_post_tagUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_post
    ADD CONSTRAINT "tag_post_tagUuid_fkey" FOREIGN KEY ("tagUuid") REFERENCES public.tags(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tags tags_projectUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "tags_projectUuid_fkey" FOREIGN KEY ("projectUuid") REFERENCES public.projects(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
