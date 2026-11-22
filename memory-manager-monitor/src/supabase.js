import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvrebwuacerfsgztmdyl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmVid3VhY2VyZnNnenRtZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNzk4MTIsImV4cCI6MjExMDg1NTgxMn0.umZorE5QiziQNYgYQ-x_nhAGtVWVgzYbw2GjswhNWmo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)