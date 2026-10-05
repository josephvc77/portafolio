import type { Project } from './types';

/**
 * Ordered by importance. Metrics appear only where the owner supplied them.
 * `caseStudy` chapters are intentionally left empty until real details exist.
 */
export const PROJECTS: readonly Project[] = [
  {
    id: 'nen',
    kind: 'professional',
    name: 'NEN',
    tagline: { es: 'Nómina Educativa Nacional', en: 'National Education Payroll' },
    role: { es: 'Líder de desarrollo frontend', en: 'Frontend development lead' },
    context: { es: 'SEP · Nayarit · 2024 – 2026', en: 'SEP · Nayarit · 2024 – 2026' },
    summary: {
      es: 'Sistema institucional de nómina y recursos humanos a gran escala. Definí la arquitectura frontend, la estructura modular de componentes y los estándares de calidad del proyecto.',
      en: 'Large-scale institutional payroll and HR system. I defined the frontend architecture, the modular component structure and the project’s quality standards.',
    },
    highlights: [
      { es: 'Accesibilidad enfocada en WCAG para flujos institucionales complejos.', en: 'WCAG-focused accessibility across complex institutional workflows.' },
      { es: 'Validaciones avanzadas que redujeron las incidencias críticas en producción.', en: 'Advanced validation that reduced critical production incidents.' },
      { es: 'Integración de APIs REST con backend Java y múltiples motores de base de datos.', en: 'REST API integration with a Java backend and multiple database engines.' },
    ],
    tech: ['angular', 'typescript', 'rest-api', 'java', 'oracle', 'postgresql', 'sql-server', 'wcag', 'docker', 'git'],
    metrics: [
      { value: '50,000+', label: { es: 'usuarios', en: 'users' } },
      { value: '80+', label: { es: 'componentes Angular', en: 'Angular components' } },
    ],
    architecture: [
      { label: { es: 'Usuarios institucionales', en: 'Institutional users' }, tech: ['wcag'] },
      { label: { es: 'Frontend Angular', en: 'Angular frontend' }, tech: ['angular', 'typescript'] },
      { label: { es: 'API REST', en: 'REST API' }, tech: ['rest-api'] },
      { label: { es: 'Backend Java', en: 'Java backend' }, tech: ['java'] },
      { label: { es: 'Datos', en: 'Data' }, tech: ['oracle', 'postgresql', 'sql-server'] },
    ],
  },
  {
    id: 'rnp',
    preview: { url: 'https://cedulaprofesional.sep.gob.mx/' },
    kind: 'professional',
    name: 'RNP',
    tagline: { es: 'Registro Nacional de Profesionistas', en: 'National Registry of Professionals' },
    role: { es: 'Desarrollo y liderazgo frontend', en: 'Frontend development & leadership' },
    context: { es: 'SEP · CDMX', en: 'SEP · Mexico City' },
    summary: {
      es: 'Plataforma crítica a nivel nacional para la validación y gestión de registros profesionales y cédulas, con usuarios reales y flujos institucionales.',
      en: 'Nationally critical platform for validating and managing professional records and licenses, serving real users and institutional workflows.',
    },
    highlights: [
      { es: 'Arquitectura frontend de micro-sitios para atender alta demanda nacional.', en: 'Micro-site frontend architecture built for high national demand.' },
      { es: 'Generación de PDF y exportaciones CSV.', en: 'PDF generation and CSV exports.' },
      { es: 'Autenticación por tokens, reCAPTCHA y Google Analytics.', en: 'Token-based authentication, reCAPTCHA and Google Analytics.' },
      { es: 'Coordinación técnica de un equipo de desarrollo pequeño.', en: 'Technical coordination of a small development team.' },
    ],
    tech: ['angular', 'typescript', 'rest-api', 'micro-sites', 'docker'],
    architecture: [
      { label: { es: 'Ciudadanos', en: 'Citizens' }, tech: [] },
      { label: { es: 'Micro-sitios Angular', en: 'Angular micro-sites' }, tech: ['angular', 'typescript'] },
      { label: { es: 'API REST · autenticación por tokens', en: 'REST API · token auth' }, tech: ['rest-api'] },
    ],
    links: [{ label: { es: 'Visitar sitio', en: 'Visit site' }, href: 'https://cedulaprofesional.sep.gob.mx/', external: true }],
  },
  {
    id: 'siisep',
    kind: 'professional',
    name: 'SIISEP',
    // TODO(content): needs owner details — period, exact role and what the system does.
    tagline: { es: 'Aplicación web institucional de la SEP', en: 'Institutional SEP web application' },
    role: { es: 'Desarrollo frontend', en: 'Frontend development' },
    context: { es: 'SEP', en: 'SEP' },
    summary: {
      es: 'Aplicación institucional construida con arquitectura frontend empresarial en Angular: formularios, gestión de datos y flujos institucionales con interfaces responsivas.',
      en: 'Institutional application built on an enterprise Angular frontend architecture: forms, data management and institutional workflows with responsive interfaces.',
    },
    highlights: [],
    tech: ['angular', 'typescript', 'component-architecture', 'responsive'],
  },
  {
    id: 'arrendamientos',
    kind: 'professional',
    name: { es: 'Arrendamientos SEP', en: 'SEP Leasing' },
    tagline: { es: 'Catálogo nacional de inmuebles arrendados', en: 'National leased-property catalog' },
    role: { es: 'Diseño y desarrollo full stack', en: 'Full-stack design & development' },
    context: { es: 'SEP · CDMX · red interna', en: 'SEP · Mexico City · internal network' },
    summary: {
      es: 'Sistema centralizado para la administración del catálogo nacional de inmuebles arrendados, digitalizando procesos operativos internos.',
      en: 'Centralized system for managing the national catalog of leased properties, digitizing internal operational processes.',
    },
    highlights: [
      { es: 'Control de acceso basado en roles (RBAC).', en: 'Role-based access control (RBAC).' },
      { es: 'Módulos CRUD administrativos y filtros avanzados sobre registros masivos.', en: 'Admin CRUD modules and advanced filtering over large record sets.' },
    ],
    tech: ['python', 'django', 'html', 'scss', 'bootstrap', 'rbac'],
    architecture: [
      { label: { es: 'Personal administrativo', en: 'Administrative staff' }, tech: [] },
      { label: { es: 'Presentación', en: 'Presentation' }, tech: ['html', 'scss', 'bootstrap'] },
      { label: { es: 'Servicios Django · RBAC', en: 'Django services · RBAC' }, tech: ['python', 'django', 'rbac'] },
    ],
  },
  {
    id: 'cinema-landings',
    preview: { url: 'https://yelmocinespropuesta.netlify.app/' },
    kind: 'professional',
    name: { es: 'Landing pages cinematográficas', en: 'Cinematic landing pages' },
    tagline: { es: 'Estrenos internacionales en LATAM', en: 'International film releases in LATAM' },
    role: { es: 'Desarrollador frontend', en: 'Frontend developer' },
    context: { es: 'IA Interactive · Morelia', en: 'IA Interactive · Morelia' },
    summary: {
      es: 'Componentes web inmersivos y reutilizables con alta demanda visual para promocionales de estrenos en cartelera internacional.',
      en: 'Immersive, reusable web components with high visual demands for international theatrical release campaigns.',
    },
    highlights: [
      { es: 'Tematización escalable con SCSS entre proyectos concurrentes.', en: 'Scalable SCSS theming across concurrent projects.' },
      { es: 'SEO técnico y optimización de Core Web Vitals.', en: 'Technical SEO and Core Web Vitals optimization.' },
    ],
    tech: ['react', 'javascript', 'scss', 'seo', 'performance', 'responsive'],
    links: [{ label: { es: 'Ver demo', en: 'View demo' }, href: 'https://yelmocinespropuesta.netlify.app/', external: true }],
  },
  {
    id: 'kiln-store',
    kind: 'product',
    preview: { url: 'https://kilnstore.netlify.app/' },
    name: 'KILN Store',
    // TODO(content): confirm role and whether this is a personal concept or client work.
    tagline: { es: 'E-commerce de ropa con escenario 3D', en: 'Apparel e-commerce with a 3D stage' },
    role: { es: 'Desarrollo frontend', en: 'Frontend development' },
    context: { es: 'Sitio en vivo', en: 'Live site' },
    summary: {
      es: 'Tienda en línea para una marca de ropa de gramaje pesado: catálogo por colecciones, bolsa de compra, búsqueda, favoritos y un escenario 3D interactivo del producto renderizado en WebGL.',
      en: 'Online store for a heavyweight apparel brand: collection catalog, shopping bag, search, wishlist and an interactive 3D product stage rendered in WebGL.',
    },
    highlights: [
      { es: 'Angular 18 con escena 3D en Three.js integrada en el flujo de compra.', en: 'Angular 18 with a Three.js 3D scene built into the shopping flow.' },
    ],
    tech: ['angular', 'typescript', 'threejs', 'responsive'],
    links: [{ label: { es: 'Visitar sitio', en: 'Visit site' }, href: 'https://kilnstore.netlify.app/', external: true }],
  },
  {
    id: 'kiln-coffee',
    kind: 'product',
    preview: { url: 'https://coffeklen.netlify.app/' },
    name: 'Kiln Coffee Roasters',
    // TODO(content): confirm role and whether this is a personal concept or client work.
    tagline: { es: 'Sitio de suscripción para una tostadora de café', en: 'Subscription site for a coffee roaster' },
    role: { es: 'Desarrollo frontend', en: 'Frontend development' },
    context: { es: 'Sitio en vivo', en: 'Live site' },
    summary: {
      es: 'Sitio editorial para una tostadora de especialidad: suscripciones flexibles, catálogo semanal, transparencia de precios al productor y un grano de café en 3D en la portada.',
      en: 'Editorial site for a specialty roaster: flexible subscriptions, a weekly catalog, transparent producer pricing and a 3D coffee bean on the landing page.',
    },
    highlights: [
      { es: 'Angular 16 con un elemento 3D en Three.js como pieza central de la portada.', en: 'Angular 16 with a Three.js 3D element as the landing centerpiece.' },
    ],
    tech: ['angular', 'typescript', 'threejs', 'responsive'],
    links: [{ label: { es: 'Visitar sitio', en: 'Visit site' }, href: 'https://coffeklen.netlify.app/', external: true }],
  },
  {
    id: 'nexusbpo',
    preview: { url: 'https://nexusbpo.net/' },
    kind: 'product',
    name: 'nexusBPO',
    tagline: { es: 'Gestión de instalaciones', en: 'Facilities management' },
    role: { es: 'Creador y fundador', en: 'Creator & founder' },
    context: { es: 'Producto propio', en: 'Own product' },
    summary: {
      es: 'Plataforma empresarial para Business Process Outsourcing: administración centralizada, mantenimiento correctivo y preventivo, y georreferenciación de activos e infraestructura corporativa.',
      en: 'Enterprise platform for Business Process Outsourcing: centralized administration, corrective and preventive maintenance, and geolocation of corporate assets and infrastructure.',
    },
    highlights: [],
    tech: ['angular', 'typescript', 'leaflet', 'rest-api'],
    links: [{ label: { es: 'Visitar app', en: 'Visit app' }, href: 'https://nexusbpo.net/', external: true }],
  },
  {
    id: 'echobound',
    kind: 'product',
    name: 'ECHOBOUND',
    tagline: { es: 'Videojuego de aventura · Ecos de las Islas Rotas', en: 'Adventure video game · Echoes of the Shattered Isles' },
    role: { es: 'Creador: diseño, programación y arte', en: 'Creator: design, programming and art' },
    context: { es: 'Brújula Labs · Windows y macOS', en: 'Brújula Labs · Windows & macOS' },
    summary: {
      es: 'Aventura de exploración entre islas flotantes: personajes en pixel art dentro de un mundo 3D estilizado, ocho Ecos que cambian el mundo (viento, piedra, luz, marea…) para abrir caminos y resolver puzles, cinco mazmorras con sus guardianes y una historia contada con lugares y recuerdos.',
      en: 'An exploration adventure across floating islands: pixel-art characters in a stylized 3D world, eight Echoes that change the world (wind, stone, light, tide…) to open paths and solve puzzles, five dungeons with their guardians and a story told through places and memories.',
    },
    highlights: [
      { es: 'Arquitectura por componentes en Unity con datos en ScriptableObjects y objetos del mundo guiados por estados.', en: 'Component-based Unity architecture with ScriptableObject data and state-driven world objects.' },
      { es: 'Guardado local, localización español/inglés, menú de opciones y soporte completo de mando.', en: 'Local saves, Spanish/English localization, options menu and full controller support.' },
      { es: 'Herramientas propias de pruebas automáticas en Play Mode, captura del tráiler y arte de tienda.', en: 'Custom tooling for automated Play Mode tests, trailer capture and store art.' },
    ],
    tech: ['unity', 'csharp', 'python'],
    video: {
      loop: '/media/echobound-loop.mp4',
      poster: '/media/echobound-poster.webp',
      trailer: { es: '/media/echobound-trailer-es.mp4', en: '/media/echobound-trailer-en.mp4' },
    },
  },
  {
    id: 'ikigai',
    kind: 'product',
    name: 'Ikigai',
    tagline: { es: 'Ecosistema de salud integral', en: 'Holistic health ecosystem' },
    role: { es: 'Desarrollo full stack', en: 'Full-stack development' },
    context: { es: 'Proyecto personal', en: 'Personal project' },
    summary: {
      es: 'Ecosistema de salud holístico (salud mental, nutrición y deporte) potenciado por asistentes de IA multimodales y control de voz en tiempo real.',
      en: 'Holistic health ecosystem (mental health, nutrition and fitness) powered by multimodal AI assistants and real-time voice control.',
    },
    highlights: [],
    tech: ['react-native', 'django', 'python', 'gemini-api', 'assemblyai'],
    // TODO(content): the APK download was removed from the repo; add a store or demo link if one exists.
  },
];
