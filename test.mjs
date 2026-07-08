import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.GESTIVA_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.GESTIVA_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) console.error("Error reading products:", error);
  else {
    console.log(`Found ${products.length} products anonymously.`);
    products.forEach(p => console.log(`- ID: ${p.id}, Name: ${p.name}, Unit: ${p.unit}, Category: ${p.category}`));
  }
}

check();
