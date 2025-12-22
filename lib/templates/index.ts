import { Template } from '../types';
import { dashboardTemplates } from './dashboards';
import { formTemplates } from './forms';
import { tableTemplates } from './tables';
import { cardTemplates } from './cards';
import { chartTemplates } from './charts';

// Combine all templates from category files
export const templates: Template[] = [
  ...dashboardTemplates,
  ...formTemplates,
  ...tableTemplates,
  ...cardTemplates,
  ...chartTemplates,
];

// Re-export category-specific arrays for direct access if needed
export { dashboardTemplates } from './dashboards';
export { formTemplates } from './forms';
export { tableTemplates } from './tables';
export { cardTemplates } from './cards';
export { chartTemplates } from './charts';
