import type { L10n } from './types';

export type SectionId = 'about' | 'stack' | 'experience' | 'projects' | 'principles' | 'contact';

export const SECTIONS: readonly { id: SectionId; nav: L10n; eyebrow: L10n; title: L10n }[] = [
  {
    id: 'about',
    nav: { es: 'Perfil', en: 'Profile' },
    eyebrow: { es: 'Perfil', en: 'Profile' },
    title: { es: 'Ingeniería frontend para sistemas que no pueden fallar.', en: 'Frontend engineering for systems that can’t afford to fail.' },
  },
  {
    id: 'stack',
    nav: { es: 'Stack', en: 'Stack' },
    eyebrow: { es: 'Stack tecnológico', en: 'Tech stack' },
    title: { es: 'Un ecosistema, no una lista de logos.', en: 'An ecosystem, not a wall of logos.' },
  },
  {
    id: 'experience',
    nav: { es: 'Experiencia', en: 'Experience' },
    eyebrow: { es: 'Trayectoria', en: 'Experience' },
    title: { es: 'Sistemas institucionales en producción.', en: 'Institutional systems in production.' },
  },
  {
    id: 'projects',
    nav: { es: 'Proyectos', en: 'Projects' },
    eyebrow: { es: 'Proyectos', en: 'Projects' },
    title: { es: 'Trabajo real, usuarios reales.', en: 'Real work, real users.' },
  },
  {
    id: 'principles',
    nav: { es: 'Cómo trabajo', en: 'How I work' },
    eyebrow: { es: 'Más allá del código', en: 'Beyond the code' },
    title: { es: 'Cómo trabajo con equipos.', en: 'How I work with teams.' },
  },
  {
    id: 'contact',
    nav: { es: 'Contacto', en: 'Contact' },
    eyebrow: { es: 'Contacto', en: 'Contact' },
    title: { es: 'Construyamos algo sólido.', en: 'Let’s build something solid.' },
  },
];

export const UI = {
  skipLink: { es: 'Saltar al contenido', en: 'Skip to content' },
  primaryNav: { es: 'Navegación principal', en: 'Primary navigation' },
  openMenu: { es: 'Abrir menú', en: 'Open menu' },
  closeMenu: { es: 'Cerrar menú', en: 'Close menu' },
  themeToggle: { es: 'Cambiar tema claro/oscuro', en: 'Toggle light/dark theme' },
  switchLanguage: { es: 'Read in English', en: 'Leer en español' },
  hire: { es: 'Contratar', en: 'Hire me' },

  ctaProjects: { es: 'Ver proyectos', en: 'View projects' },
  ctaExperience: { es: 'Experiencia', en: 'Experience' },
  ctaContact: { es: 'Contactarme', en: 'Contact me' },
  downloadCv: { es: 'Descargar CV (PDF)', en: 'Download CV (PDF)' },
  availability: { es: 'Disponible para nuevos proyectos', en: 'Available for new work' },

  education: { es: 'Formación', en: 'Education' },
  usedIn: { es: 'Usado en', en: 'Used in' },
  worksWith: { es: 'Funciona con', en: 'Works with' },
  projectsInRole: { es: 'Proyectos en este rol', en: 'Projects in this role' },
  stackIntro: {
    es: 'Selecciona una tecnología para ver dónde la he usado y con qué se conecta.',
    en: 'Select a technology to see where I’ve used it and what it connects to.',
  },
  stackHint: {
    es: 'Usa las flechas para moverte entre tecnologías, Enter para seleccionar y Escape para limpiar.',
    en: 'Use the arrow keys to move between technologies, Enter to select and Escape to clear.',
  },
  stackTechnologies: { es: 'Tecnologías', en: 'Technologies' },
  stackSummary: { es: '{count} tecnologías en {groups} dominios', en: '{count} technologies across {groups} domains' },
  stackNotUsed: { es: 'Parte de mi stack de trabajo.', en: 'Part of my working stack.' },
  clearSelection: { es: 'Limpiar selección', en: 'Clear selection' },
  role: { es: 'Rol', en: 'Role' },
  context: { es: 'Contexto', en: 'Context' },
  basedIn: { es: 'Base', en: 'Based in' },
  core: { es: 'Núcleo', en: 'Core' },
  languages: { es: 'Idiomas', en: 'Languages' },
  stack: { es: 'Stack', en: 'Stack' },
  impact: { es: 'Impacto', en: 'Impact' },
  architecture: { es: 'Arquitectura', en: 'Architecture' },
  professionalWork: { es: 'Trabajo profesional', en: 'Professional work' },
  ownProducts: { es: 'Productos y proyectos propios', en: 'Products & own work' },
  viewLive: { es: 'Ver {name} en vivo', en: 'View {name} live' },
  opensInNewTab: { es: '(abre en una pestaña nueva)', en: '(opens in a new tab)' },
  watchTrailer: { es: 'Ver tráiler', en: 'Watch trailer' },
  gameplayOf: { es: 'Gameplay de {name}', en: '{name} gameplay' },

  contactLede: {
    es: 'Disponible para roles de liderazgo frontend, consultoría de arquitectura y rendimiento, o posiciones clave en equipos nacionales e internacionales.',
    en: 'Available for frontend leadership roles, architecture and performance consulting, or key positions on national and international teams.',
  },
  copyEmail: { es: 'Copiar correo', en: 'Copy email' },
  copied: { es: 'Correo copiado', en: 'Email copied' },
  copyFailed: { es: 'No se pudo copiar', en: 'Couldn’t copy' },
  form: {
    name: { es: 'Nombre', en: 'Name' },
    email: { es: 'Correo electrónico', en: 'Email' },
    message: { es: 'Mensaje', en: 'Message' },
    messageHint: { es: 'Cuéntame brevemente sobre tu proyecto o rol.', en: 'Briefly tell me about your project or role.' },
    submit: { es: 'Enviar mensaje', en: 'Send message' },
    sending: { es: 'Enviando…', en: 'Sending…' },
    success: { es: 'Mensaje enviado. Te responderé pronto.', en: 'Message sent. I’ll get back to you soon.' },
    error: { es: 'No se pudo enviar. Escríbeme directamente por correo.', en: 'Couldn’t send. Please email me directly.' },
    honeypot: { es: 'No llenes este campo', en: 'Don’t fill this out' },
  },
  footer: {
    es: 'Construido a mano con TypeScript, Vite, GSAP y Three.js.',
    en: 'Hand-built with TypeScript, Vite, GSAP and Three.js.',
  },
} satisfies Record<string, L10n | Record<string, L10n>>;

export const SEO = {
  title: {
    es: 'Joseph Valencia Cisneros — Frontend Engineer · Angular · TypeScript',
    en: 'Joseph Valencia Cisneros — Frontend Engineer · Angular · TypeScript',
  },
  description: {
    es: 'Frontend Engineer especializado en Angular y TypeScript. Sistemas institucionales a gran escala (NEN, RNP), accesibilidad WCAG y rendimiento web. Creador de nexusBPO.',
    en: 'Frontend Engineer specializing in Angular and TypeScript. Large-scale institutional systems (NEN, RNP), WCAG accessibility and web performance. Creator of nexusBPO.',
  },
} satisfies Record<string, L10n>;
