export async function loader() {
    const load = await import('./loader');
    return load.default();
  }