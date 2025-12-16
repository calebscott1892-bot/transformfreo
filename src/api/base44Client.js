// Import the correct public exports from the SDK to avoid rollup build errors
import { base44 } from 'base44-to-supabase-sdk/src/api/base44Client.js';
import { supabase } from 'base44-to-supabase-sdk/src/lib/supabase-client.js';

// Re‑export the clients so other files can import them
export { base44, supabase };

// Auth helpers
export const login = async (provider = 'dev', email, password) => {
  if (provider === 'password') {
    return supabase.auth.signInWithPassword({ email, password });
  }
  return base44.auth.login(provider);
};

export const logout = async () => supabase.auth.signOut();

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
};
