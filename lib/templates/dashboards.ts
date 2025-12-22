import { Template } from '../types';

export const dashboardTemplates: Template[] = [
  {
    id: 'external-dashboard',
    name: 'External Dashboard',
    description: 'Embed external analytics or monitoring dashboard',
    category: 'Dashboards',
    content: {
      type: 'externalUrl',
      iframeUrl: 'https://example.com/analytics',
    },
    previewCode: `{
  type: 'externalUrl',
  iframeUrl: 'https://example.com/analytics',
}`,
  },
];
