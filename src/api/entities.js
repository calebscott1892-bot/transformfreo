import { base44, supabase, login, logout, getSession } from './base44Client';

// Base44-compatible auth entity (Supabase-backed)
export const User = base44.auth;

// Auth helpers for direct Supabase access
export { supabase, login, logout, getSession };