import { templates } from '@/lib/templates';
import StudioClient from './studio-client';

export function generateStaticParams() {
  return templates.map((template) => ({
    templateId: template.id,
  }));
}

export default function Page() {
  return <StudioClient />;
}
