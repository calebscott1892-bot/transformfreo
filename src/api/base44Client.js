// Base44 was partially migrated out of this project.
// The Base44 SDK defaults to a local Supabase stack (e.g. 127.0.0.1:54321)
// which must never be referenced by the production client bundle.
//
// This module remains only to avoid import-path breakage, but any usage should
// be removed or replaced with app-owned backends (e.g. Vercel /api routes).

const unsupported = (name) => {
  throw new Error(
    `${name} is not available: Base44/Supabase client has been removed from this app. ` +
      'Use an app-owned API endpoint instead.'
  );
};

export const base44 = new Proxy(
  {},
  {
    get() {
      return () => unsupported('base44');
    }
  }
);

export const supabase = new Proxy(
  {},
  {
    get() {
      return () => unsupported('supabase');
    }
  }
);

export const login = async () => unsupported('login');
export const logout = async () => unsupported('logout');
export const getSession = async () => null;
