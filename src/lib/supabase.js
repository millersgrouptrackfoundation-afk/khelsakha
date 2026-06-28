import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://asrwfqnfaxseitvequfa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcndmcW5mYXhzZWl0dmVxdWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzYxMDcsImV4cCI6MjA5NzgxMjEwN30.3JeynxyZKqpDWyb9bLuu_38idaMBVJyUvkBq57A7hfM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)