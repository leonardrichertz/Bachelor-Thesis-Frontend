import { lazy } from 'react';

export async function loader() {
  const load = await import('./loader');
  return load.default();
}

export const Component = lazy(() => import('./page'));
