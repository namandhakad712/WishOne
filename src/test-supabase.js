// Test script to verify Supabase connection
console.log("Starting Supabase connection test...");

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Environment variables:");
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_ANON_KEY (first 10 chars):", 
  supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + "..." : "undefined");

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR: Supabase environment variables are not set correctly!");
  console.log("Make sure you have a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  console.log("Also make sure you've restarted your development server after updating the .env.local file");
} else {
  console.log("Environment variables are set correctly!");
}

// Test direct fetch to Supabase
console.log("\nTesting direct fetch to Supabase...");
fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
  headers: {
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${supabaseAnonKey}`
  }
})
.then(response => {
  console.log("Response status:", response.status);
  if (!response.ok) {
    return response.text().then(text => {
      throw new Error(`API request failed with status ${response.status}: ${text}`);
    });
  }
  return response.json();
})
.then(data => {
  console.log("Success! Received data:", data);
  console.log("Supabase connection is working correctly!");
})
.catch(error => {
  console.error("Error connecting to Supabase:", error);
  console.log("Check your API key and URL, and make sure your Supabase project is active.");
}); 