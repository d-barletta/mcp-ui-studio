import { Template } from '../types';
import { dashboardTemplates } from './dashboards';
import { formTemplates } from './forms';
import { tableTemplates } from './tables';
import { cardTemplates } from './cards';
import { chartTemplates } from './charts';
import { chatgptSdkTemplates } from './chatgpt-sdk';
import { remoteDomTemplates } from './remote-dom';

// Combine all templates from category files
export const templates: Template[] = [
  ...dashboardTemplates,
  ...formTemplates,
  ...tableTemplates,
  ...cardTemplates,
  ...chartTemplates,
  ...chatgptSdkTemplates,
  ...remoteDomTemplates,
];

// Re-export category-specific arrays for direct access if needed
export { dashboardTemplates } from './dashboards';
export { formTemplates } from './forms';
export { tableTemplates } from './tables';
export { cardTemplates } from './cards';
export { chartTemplates } from './charts';
export { chatgptSdkTemplates } from './chatgpt-sdk';
export { remoteDomTemplates } from './remote-dom';
