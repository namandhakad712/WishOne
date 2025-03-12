// Simple script to test Supabase connection
// Run with: node supabase-test.js

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual values from .env.local
const supabaseUrl = 'https://wmlifncvyvddgzxrdwlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtbGlmbmN2eXZkZGd6eHJkd2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDUyMTcsImV4cCI6MjA1NzEyMTIxN30.i1_CcAaoGx3f1GTh-noRmXETFd6f6kamkUWf8iQ8d1k';

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test authentication
    console.log('Testing auth...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth error:', authError);
    } else {
      console.log('Auth connection successful!');
    }
    
    // Test database
    console.log('Testing database...');
    const { data, error } = await supabase.from('users').select('count()', { count: 'exact' }).limit(1);
    
    if (error) {
      console.error('Database error:', error);
      
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('The "users" table does not exist. You need to create it first.');
      }
    } else {
      console.log('Database connection successful!');
      console.log('Data:', data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection(); 