// Copy and paste this entire script into your browser console to test Supabase connection

(async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase connection...");
  
  // Get environment variables from the window
  const supabaseUrl = window.ENV_SUPABASE_URL || "";
  const supabaseAnonKey = window.ENV_SUPABASE_ANON_KEY || "";
  
  // Check if we can access the environment variables
  console.log("Looking for Supabase credentials in window...");
  if (!supabaseUrl || !supabaseAnonKey) {
    // Try to extract from the page
    console.log("No credentials found in window, trying to extract from page...");
    
    // Look for script tags that might contain the environment variables
    const scripts = document.querySelectorAll('script');
    let foundCredentials = false;
    
    scripts.forEach(script => {
      const content = script.textContent || "";
      if (content.includes("VITE_SUPABASE_URL") || content.includes("supabaseUrl")) {
        console.log("Found potential Supabase configuration in script:", script);
        foundCredentials = true;
      }
    });
    
    if (!foundCredentials) {
      console.error("❌ Could not find Supabase credentials in the page!");
      console.log("Try running this in your terminal instead:");
      console.log("echo $VITE_SUPABASE_URL");
      console.log("echo $VITE_SUPABASE_ANON_KEY");
      return;
    }
  }
  
  // Try to access window.supabase if it exists
  if (window.supabase) {
    console.log("Found Supabase client in window.supabase!");
    
    try {
      const { data, error } = await window.supabase.from("users").select("count()", { count: "exact" }).limit(1);
      
      if (error) {
        console.error("❌ Error accessing Supabase:", error);
        console.log("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log("✅ Successfully connected to Supabase!");
        console.log("Data:", data);
      }
    } catch (e) {
      console.error("❌ Exception when trying to use Supabase client:", e);
    }
  } else {
    console.log("No Supabase client found in window.supabase");
  }
  
  // Try a direct fetch to Supabase
  console.log("\nTesting direct fetch to Supabase...");
  try {
    // Try to get the URL and key from the page if not found in window
    const extractedUrl = supabaseUrl || 
      document.querySelector('meta[name="supabase-url"]')?.getAttribute('content') ||
      prompt("Enter your Supabase URL:");
      
    const extractedKey = supabaseAnonKey || 
      document.querySelector('meta[name="supabase-key"]')?.getAttribute('content') ||
      prompt("Enter your Supabase anon key:");
    
    if (!extractedUrl || !extractedKey) {
      console.error("❌ Could not get Supabase URL or key!");
      return;
    }
    
    console.log(`Using URL: ${extractedUrl.substring(0, 20)}...`);
    console.log(`Using key: ${extractedKey.substring(0, 10)}...`);
    
    const response = await fetch(`${extractedUrl}/rest/v1/users?select=count`, {
      headers: {
        "apikey": extractedKey,
        "Authorization": `Bearer ${extractedKey}`
      }
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API request failed with status ${response.status}: ${errorText}`);
      
      // Parse the error if it's JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log("Error details:", errorJson);
      } catch (e) {
        // Not JSON, just show the text
      }
    } else {
      const data = await response.json();
      console.log("✅ Success! Received data:", data);
      console.log("Supabase connection is working correctly!");
    }
  } catch (error) {
    console.error("❌ Error connecting to Supabase:", error);
    console.log("Check your API key and URL, and make sure your Supabase project is active.");
  }
})(); 