import type { L10n, Tech, TechGroup } from './types';

/**
 * Single registry of every technology referenced anywhere on the site.
 * Experiences and projects reference these ids, so a typo fails type-checking
 * and the stack constellation can derive "where was this used?" automatically.
 */
const TECH = [
  // Frontend
  { id: 'angular', label: 'Angular', group: 'frontend', related: ['typescript', 'rxjs', 'angular-material', 'scss', 'rest-api'] },
  { id: 'angularjs', label: 'AngularJS', group: 'frontend', related: ['javascript', 'angular'] },
  { id: 'react', label: 'React', group: 'frontend', related: ['javascript', 'typescript', 'scss'] },
  { id: 'react-native', label: 'React Native', group: 'frontend', related: ['react', 'typescript'] },
  { id: 'nextjs', label: 'Next.js', group: 'frontend', related: ['react', 'typescript', 'nodejs'] },
  { id: 'typescript', label: 'TypeScript', group: 'frontend', related: ['javascript', 'angular', 'react'] },
  { id: 'javascript', label: 'JavaScript (ES6+)', group: 'frontend' },
  { id: 'rxjs', label: 'RxJS', group: 'frontend', related: ['angular', 'typescript'] },
  { id: 'angular-material', label: 'Angular Material', group: 'frontend', related: ['angular'] },
  { id: 'html', label: 'HTML5', group: 'frontend', related: ['scss', 'wcag'] },
  { id: 'scss', label: 'CSS / SCSS', group: 'frontend', related: ['html', 'responsive'] },
  { id: 'bootstrap', label: 'Bootstrap', group: 'frontend', related: ['scss', 'html'] },
  { id: 'leaflet', label: 'Leaflet', group: 'frontend', related: ['angular'] },
  { id: 'unity', label: 'Unity', group: 'frontend', related: ['csharp'], note: { es: 'Motor de ECHOBOUND, mi videojuego.', en: 'Engine behind ECHOBOUND, my video game.' } },
  { id: 'csharp', label: 'C#', group: 'backend', related: ['unity'] },
  { id: 'threejs', label: 'Three.js / WebGL', group: 'frontend', related: ['typescript', 'angular'] },

  // Backend & integration
  { id: 'rest-api', label: 'REST APIs', group: 'backend', related: ['jwt', 'oauth2', 'java', 'django', 'express'] },
  { id: 'jwt', label: 'JWT', group: 'backend', related: ['rest-api', 'oauth2'] },
  { id: 'oauth2', label: 'OAuth2', group: 'backend', related: ['rest-api', 'jwt'] },
  { id: 'nodejs', label: 'Node.js', group: 'backend', related: ['express', 'typescript'] },
  { id: 'express', label: 'Express', group: 'backend', related: ['nodejs', 'rest-api'] },
  { id: 'python', label: 'Python', group: 'backend', related: ['django'] },
  { id: 'django', label: 'Django', group: 'backend', related: ['python', 'postgresql', 'rest-api'] },
  { id: 'java', label: 'Java', group: 'backend', related: ['spring-boot', 'oracle'] },
  { id: 'spring-boot', label: 'Spring Boot', group: 'backend', related: ['java', 'rest-api'] },
  { id: 'gemini-api', label: 'Gemini API', group: 'backend' },
  { id: 'assemblyai', label: 'AssemblyAI', group: 'backend' },

  // Data
  { id: 'sql', label: 'SQL', group: 'data', related: ['postgresql', 'oracle', 'sql-server', 'mysql'] },
  { id: 'postgresql', label: 'PostgreSQL', group: 'data', related: ['sql', 'django', 'prisma'] },
  { id: 'oracle', label: 'Oracle', group: 'data', related: ['sql', 'java'] },
  { id: 'sql-server', label: 'SQL Server', group: 'data', related: ['sql'] },
  { id: 'mysql', label: 'MySQL', group: 'data', related: ['sql'] },
  { id: 'mongodb', label: 'MongoDB', group: 'data', related: ['nodejs'] },
  { id: 'prisma', label: 'Prisma', group: 'data', related: ['postgresql', 'typescript'] },

  // DevOps & tooling
  { id: 'git', label: 'Git / GitFlow', group: 'devops', related: ['azure-devops', 'ci-cd'] },
  { id: 'docker', label: 'Docker', group: 'devops', related: ['ci-cd', 'linux'] },
  { id: 'ci-cd', label: 'CI/CD', group: 'devops', related: ['git', 'docker', 'azure-devops'] },
  { id: 'azure-devops', label: 'Azure DevOps', group: 'devops', related: ['git', 'ci-cd'] },
  { id: 'azure', label: 'Azure', group: 'devops' },
  { id: 'aws', label: 'AWS (S3, EC2, RDS)', group: 'devops' },
  { id: 'linux', label: 'Linux', group: 'devops' },
  { id: 'jira', label: 'Jira', group: 'devops', related: ['scrum'] },

  // Architecture & practice
  { id: 'component-architecture', label: { es: 'Arquitectura de componentes', en: 'Component architecture' }, group: 'architecture', related: ['angular', 'react', 'solid'] },
  { id: 'micro-sites', label: { es: 'Arquitectura de micro-sitios', en: 'Micro-site architecture' }, group: 'architecture', related: ['angular'] },
  { id: 'rbac', label: 'RBAC', group: 'architecture', related: ['jwt', 'django'] },
  { id: 'solid', label: 'SOLID', group: 'architecture', related: ['component-architecture'] },
  { id: 'scrum', label: 'Scrum / Kanban', group: 'architecture', related: ['jira'] },

  // UX, accessibility & performance
  { id: 'wcag', label: { es: 'Accesibilidad (WCAG)', en: 'Accessibility (WCAG)' }, group: 'ux', related: ['html', 'responsive'] },
  { id: 'responsive', label: { es: 'Diseño responsivo', en: 'Responsive design' }, group: 'ux', related: ['scss'] },
  { id: 'performance', label: 'Core Web Vitals', group: 'ux', related: ['seo'] },
  { id: 'seo', label: { es: 'SEO técnico', en: 'Technical SEO' }, group: 'ux', related: ['performance', 'html'] },
  { id: 'figma', label: 'Figma', group: 'ux', related: ['scss'] },
] as const satisfies readonly Tech[];

export type TechId = (typeof TECH)[number]['id'];

export const techById = new Map<string, (typeof TECH)[number]>(TECH.map((tech) => [tech.id, tech]));

export const TECH_LIST = TECH;

export const TECH_GROUPS: readonly { id: TechGroup; label: L10n }[] = [
  { id: 'frontend', label: { es: 'Frontend', en: 'Frontend' } },
  { id: 'backend', label: { es: 'Backend e integración', en: 'Backend & integration' } },
  { id: 'data', label: { es: 'Datos', en: 'Data' } },
  { id: 'devops', label: { es: 'DevOps y herramientas', en: 'DevOps & tooling' } },
  { id: 'architecture', label: { es: 'Arquitectura y práctica', en: 'Architecture & practice' } },
  { id: 'ux', label: { es: 'UX, accesibilidad y rendimiento', en: 'UX, accessibility & performance' } },
];
