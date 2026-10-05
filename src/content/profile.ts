import type { L10n, Metric } from './types';

export const SITE_URL = 'https://joseph-valencia-frontend.netlify.app';

export const PROFILE = {
  name: 'Joseph Valencia Cisneros',
  shortName: 'JVC',
  email: 'noskedev@gmail.com',
  cv: '/CV_Joseph_Valencia_Cisneros.pdf',
  social: {
    github: 'https://github.com/josephvc77',
    linkedin: 'https://www.linkedin.com/in/joseph-valencia-cisneros/',
  },
  company: { name: 'nexusBPO', url: 'https://nexusbpo.net/' },

  /** Identity as stated by the owner: no inflated titles. */
  roles: [
    { es: 'Frontend Engineer', en: 'Frontend Engineer' },
    { es: 'Angular Developer', en: 'Angular Developer' },
    { es: 'Especialista en TypeScript', en: 'TypeScript Specialist' },
  ] satisfies L10n[],

  pitch: {
    es: 'Construyo aplicaciones web escalables, accesibles y visualmente cuidadas — desde sistemas institucionales con decenas de miles de usuarios hasta experiencias interactivas.',
    en: 'I build scalable, accessible and visually refined web applications — from institutional systems serving tens of thousands of users to interactive experiences.',
  } satisfies L10n,

  location: { es: 'México · Nayarit / CDMX / Morelia', en: 'Mexico · Nayarit / Mexico City / Morelia' } satisfies L10n,
  languages: { es: 'Español nativo · Inglés técnico B1/B2', en: 'Native Spanish · Technical English B1/B2' } satisfies L10n,

  about: [
    {
      es: 'Desarrollo frontend de punta a punta: defino estándares de arquitectura y buenas prácticas, hago code reviews y coordino de cerca con equipos backend, QA y stakeholders.',
      en: 'I own frontend development end to end: I set architecture standards and best practices, run code reviews and work closely with backend, QA and stakeholders.',
    },
    {
      es: 'He trabajado bajo presión en proyectos gubernamentales y empresariales con fechas estrictas y alto impacto operativo a nivel nacional.',
      en: 'I’ve shipped government and enterprise projects under strict deadlines and with nationwide operational impact.',
    },
    {
      es: 'Mi enfoque combina comunicación clara, pensamiento analítico para resolver problemas complejos y un compromiso constante con el rendimiento y la accesibilidad (WCAG).',
      en: 'My approach combines clear communication, analytical problem solving and a constant focus on performance and accessibility (WCAG).',
    },
  ] satisfies L10n[],

  stats: [
    { value: '4+', label: { es: 'años de experiencia profesional', en: 'years of professional experience' } },
    { value: '50,000+', label: { es: 'usuarios en NEN', en: 'users on NEN' } },
    { value: '80+', label: { es: 'componentes Angular en NEN', en: 'Angular components on NEN' } },
    { value: 'B1/B2', label: { es: 'inglés técnico', en: 'technical English' } },
  ] satisfies Metric[],

  education: [
    {
      period: '2021 – 2023',
      degree: { es: 'Ingeniería en Desarrollo y Gestión de Software', en: 'B.Eng. in Software Development & Management' },
      school: 'Universidad Tecnológica de Morelia',
    },
    {
      period: '2019 – 2021',
      degree: {
        es: 'TSU en Tecnologías de la Información — Desarrollo de Software Multiplataforma',
        en: 'Associate degree in IT — Multiplatform Software Development',
      },
      school: 'Universidad Tecnológica de Morelia',
    },
  ] satisfies { period: string; degree: L10n; school: string }[],

  /** "How I work" — from the original Leadership section. */
  principles: [
    {
      title: { es: 'Code reviews constructivos', en: 'Constructive code reviews' },
      body: {
        es: 'Estándares de Clean Code y legibilidad mediante revisiones orientadas al crecimiento del equipo.',
        en: 'Clean-code and readability standards through reviews aimed at growing the team.',
      },
    },
    {
      title: { es: 'Liderazgo técnico', en: 'Technical leadership' },
      body: {
        es: 'Acompañamiento a desarrolladores junior y mid-level, y definición de arquitecturas frontend modulares.',
        en: 'Mentoring junior and mid-level developers and defining modular frontend architectures.',
      },
    },
    {
      title: { es: 'Trabajo bajo presión', en: 'Composure under pressure' },
      body: {
        es: 'Decisiones críticas con serenidad en entornos de alta visibilidad y fechas estrictas.',
        en: 'Calm, critical decisions in high-visibility environments with strict deadlines.',
      },
    },
    {
      title: { es: 'Comunicación efectiva', en: 'Effective communication' },
      body: {
        es: 'Puente entre perfiles técnicos (backend, QA) y no técnicos (stakeholders funcionales).',
        en: 'A bridge between technical (backend, QA) and non-technical (functional stakeholder) profiles.',
      },
    },
    {
      title: { es: 'Pensamiento analítico', en: 'Analytical thinking' },
      body: {
        es: 'Descomponer problemas complejos en soluciones viables, limpias y mantenibles.',
        en: 'Breaking complex problems into viable, clean and maintainable solutions.',
      },
    },
    {
      title: { es: 'Enfoque a resultados', en: 'Results-driven' },
      body: {
        es: 'Organización autónoma con Scrum y Kanban, priorizando valor de negocio y estabilidad en producción.',
        en: 'Self-organized with Scrum and Kanban, prioritizing business value and production stability.',
      },
    },
  ] satisfies { title: L10n; body: L10n }[],
};
