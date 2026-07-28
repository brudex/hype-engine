import { asDisplayValue, getDeep } from '../utils/contextUtils';

export function resolveVariables(template, context) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const value = getDeep(context, path.trim());
    return value !== undefined ? asDisplayValue(value) : '';
  });
}

export function findVariableTokens(template) {
  if (typeof template !== 'string') return [];
  return [...template.matchAll(/\{\{([^}]+)\}\}/g)].map((match) => match[1].trim());
}
