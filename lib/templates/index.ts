import { Template } from '../types';
import { dashboardTemplates } from './dashboards';
import { formTemplates } from './forms';

// Combine all templates from category files
export const templates: Template[] = [...dashboardTemplates, ...formTemplates];

// Re-export category-specific arrays for direct access if needed
export { dashboardTemplates } from './dashboards';
export { formTemplates } from './forms';
