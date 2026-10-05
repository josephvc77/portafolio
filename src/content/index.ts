import { EXPERIENCE } from './experience';
import { PROJECTS } from './projects';
import { techById } from './stack';

export * from './types';
export * from './stack';
export * from './profile';
export * from './ui';
export { EXPERIENCE, PROJECTS };

/**
 * Fails the build on a dangling reference (unknown tech id, unknown project id)
 * so content edits can't silently break the stack graph or the timeline.
 */
export function validateContent(): void {
  const errors: string[] = [];
  const projectIds = new Set(PROJECTS.map((p) => p.id));
  const checkTech = (owner: string, ids: readonly string[]) =>
    ids.forEach((id) => !techById.has(id) && errors.push(`${owner}: unknown tech "${id}"`));

  for (const tech of techById.values()) {
    checkTech(`tech ${tech.id}.related`, 'related' in tech ? tech.related : []);
  }
  for (const exp of EXPERIENCE) {
    checkTech(`experience ${exp.id}`, exp.tech);
    exp.projects.forEach((id) => !projectIds.has(id) && errors.push(`experience ${exp.id}: unknown project "${id}"`));
  }
  for (const project of PROJECTS) {
    checkTech(`project ${project.id}`, project.tech);
    project.architecture?.forEach((layer) => checkTech(`project ${project.id}.architecture`, layer.tech));
  }

  if (errors.length) throw new Error(`Content validation failed:\n  ${errors.join('\n  ')}`);
}
