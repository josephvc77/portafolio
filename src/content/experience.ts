import type { Experience } from './types';

/** Most recent first. Copy ported from the original site; English is a faithful translation. */
export const EXPERIENCE: readonly Experience[] = [
  {
    id: 'sep-nayarit',
    short: { es: 'SEP · Nayarit', en: 'SEP · Nayarit' },
    period: '2024 – 2026',
    role: { es: 'Frontend Senior / Líder Frontend', en: 'Senior Frontend Engineer / Frontend Lead' },
    org: { es: 'Secretaría de Educación Pública (SEP)', en: 'Secretaría de Educación Pública (SEP)' },
    location: { es: 'Nayarit', en: 'Nayarit, Mexico' },
    summary: {
      es: 'Lideré el desarrollo técnico frontend del Proyecto NEN, definiendo la arquitectura del sitio, la estructura modular de componentes y los estándares de código limpio para asegurar la escalabilidad del sistema.',
      en: 'Led frontend technical development of the NEN project, defining the site architecture, the modular component structure and the clean-code standards that keep the system scalable.',
    },
    highlights: [
      {
        es: 'Diseñé e implementé interfaces complejas y flujos críticos de datos, garantizando una navegación fluida y accesible para usuarios institucionales.',
        en: 'Designed and built complex interfaces and critical data flows, keeping navigation smooth and accessible for institutional users.',
      },
      {
        es: 'Aseguré la integridad del frontend mediante validaciones avanzadas, reduciendo significativamente las incidencias críticas en producción.',
        en: 'Hardened the frontend with advanced validation, significantly reducing critical production incidents.',
      },
      {
        es: 'Coordiné la resolución de bugs complejos con el equipo backend (Java), optimizando la comunicación de APIs REST y el rendimiento de la plataforma.',
        en: 'Coordinated complex bug resolution with the Java backend team, improving REST API communication and platform performance.',
      },
      {
        es: 'Gestioné despliegues en entornos de prueba con Docker y flujos colaborativos con Git/GitFlow.',
        en: 'Managed test-environment deployments with Docker and collaborative Git/GitFlow workflows.',
      },
    ],
    tech: ['angular', 'typescript', 'rest-api', 'java', 'docker', 'git', 'component-architecture', 'wcag'],
    projects: ['nen'],
  },
  {
    id: 'sep-cdmx',
    short: { es: 'SEP · CDMX', en: 'SEP · Mexico City' },
    period: '2023 – 2026',
    role: { es: 'Frontend Engineer / Full Stack Developer', en: 'Frontend Engineer / Full Stack Developer' },
    org: { es: 'Secretaría de Educación Pública (SEP)', en: 'Secretaría de Educación Pública (SEP)' },
    location: { es: 'CDMX', en: 'Mexico City' },
    summary: {
      es: 'Formé parte del equipo core del Registro Nacional de Profesionistas (RNP), implementando una arquitectura frontend basada en micro-sitios para atender la alta demanda de usuarios a nivel nacional.',
      en: 'Core team member of the National Registry of Professionals (RNP), implementing a micro-site frontend architecture to serve high nationwide user demand.',
    },
    highlights: [
      {
        es: 'Dirigí el diseño y desarrollo de una plataforma institucional centralizada para la gestión de inmuebles arrendados, digitalizando procesos operativos internos.',
        en: 'Led design and development of a centralized institutional platform for leased-property management, digitizing internal operations.',
      },
      {
        es: 'Diseñé e integré servicios backend en Python y Django con capas de presentación en HTML5, CSS3, SCSS y Bootstrap.',
        en: 'Designed and integrated Python/Django backend services with HTML5, CSS3, SCSS and Bootstrap presentation layers.',
      },
      {
        es: 'Implementé control de acceso basado en roles (RBAC), módulos CRUD administrativos y filtros avanzados para el manejo seguro de registros masivos.',
        en: 'Implemented role-based access control (RBAC), admin CRUD modules and advanced filtering for safe handling of large record sets.',
      },
    ],
    tech: ['angular', 'typescript', 'micro-sites', 'python', 'django', 'html', 'scss', 'bootstrap', 'rbac'],
    projects: ['rnp', 'arrendamientos'],
  },
  {
    id: 'ia-interactive',
    short: { es: 'IA Interactive', en: 'IA Interactive' },
    period: '2022 – 2023',
    role: { es: 'Desarrollador Frontend', en: 'Frontend Developer' },
    org: { es: 'IA Interactive', en: 'IA Interactive' },
    location: { es: 'Morelia, Michoacán', en: 'Morelia, Michoacán, Mexico' },
    summary: {
      es: 'Desarrollé arquitecturas de componentes reutilizables en React para landing pages dinámicas de alta conversión en lanzamientos cinematográficos internacionales en LATAM.',
      en: 'Built reusable React component architectures for dynamic, high-conversion landing pages supporting international film releases across LATAM.',
    },
    highlights: [
      {
        es: 'Implementé sistemas de tematización escalables con SCSS, manteniendo la consistencia visual entre múltiples proyectos concurrentes.',
        en: 'Implemented scalable SCSS theming systems, keeping visual consistency across multiple concurrent projects.',
      },
      {
        es: 'Apliqué SEO técnico y optimización de rendimiento (Core Web Vitals), reduciendo tiempos de carga y mejorando la retención.',
        en: 'Applied technical SEO and performance optimization (Core Web Vitals), cutting load times and improving retention.',
      },
      {
        es: 'Colaboré con equipos multiculturales de diseño (Figma) y marketing para traducir mockups complejos a código interactivo de alta fidelidad.',
        en: 'Worked with multicultural design (Figma) and marketing teams to turn complex mockups into high-fidelity interactive code.',
      },
    ],
    tech: ['react', 'javascript', 'scss', 'seo', 'performance', 'responsive', 'figma', 'git'],
    projects: ['cinema-landings'],
  },
];
