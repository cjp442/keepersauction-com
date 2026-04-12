import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example of a real-time subscription
async function setupRealTimeSubscription() {
    const subscription = supabase
        .from('your-table-name')
        .on('INSERT', payload => {
            console.log('New entry added:', payload);
        })
        .subscribe();
    return subscription;
}

// Transaction handling example
async function handleTransaction() {
    const { data, error } = await supabase
        .from('your-table-name')
        .upsert([{ id: 1, name: 'New Name' }]);
    if (error) {
        console.error('Transaction error:', error);
        return;
    }
    console.log('Transaction success:', data);
}
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
