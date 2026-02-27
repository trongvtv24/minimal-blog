// js/supabase.js
// ⚠️ HƯỚNG DẪN SETUP:
// 1. Vào https://supabase.com → Project Settings → API
// 2. Copy "Project URL" và "anon public key" vào đây
// 3. KHÔNG commit file này lên GitHub nếu project là public
//    (anon key an toàn nhờ RLS, nhưng vẫn tốt hơn là dùng .env)

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://jqvqklogmozqxuirqtgv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdnFrbG9nbW96cXh1aXJxdGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODMzNjEsImV4cCI6MjA4Nzc1OTM2MX0.-M24nLQfJXEFBygc8ZRmcHoDWW4-di5Nw7aXL7SEBPc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
