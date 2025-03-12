import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR: Supabase environment variables are missing!");
  console.error("Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file");
}

// Debug logs (only in development)
if (import.meta.env.DEV) {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key (first 10 chars):", 
    supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + "..." : "undefined");
}

// Create the Supabase client with explicit options
const supabase = createClient<Database>(
  supabaseUrl || "", 
  supabaseAnonKey || "",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey || "",
        'Authorization': `Bearer ${supabaseAnonKey || ""}`,
      },
    },
  }
);

// Authentication methods
export const signUp = async (email: string, password: string) => {
  console.log("Attempting to sign up with email:", email);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error("Supabase signup error:", error);
      console.error("Error message:", error.message);
      console.error("Error status:", error.status);
    }
    
    return { data, error };
  } catch (e) {
    console.error("Unexpected error during signup:", e);
    throw e;
  }
};

export const signIn = async (email: string, password: string) => {
  console.log("Attempting to sign in with email:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Supabase signin error:", error);
      console.error("Error message:", error.message);
      console.error("Error status:", error.status);
    } else {
      console.log("Signin successful, user:", data.user?.email);
    }
    
    // Return both data and error
    return { data, error };
  } catch (unexpectedError) {
    console.error("Unexpected error during signin:", unexpectedError);
    throw unexpectedError;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  return true;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  
  return data.user;
};

// Session management
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  return data.session;
};

// Password reset
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
  
  return data;
};

// Update user profile
export const updateProfile = async (profile: { full_name?: string; avatar_url?: string }) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) throw new Error("No user logged in");
  
  const { data, error } = await supabase
    .from("users")
    .update(profile)
    .eq("id", user.user.id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

// Database operations
export const getBirthdays = async () => {
  console.log("Getting birthdays from Supabase");
  
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    console.log("No user logged in");
    throw new Error("No user logged in");
  }
  
  console.log(`Fetching birthdays for user: ${user.user.id}`);
  
  const { data, error } = await supabase
    .from("birthdays")
    .select("*")
    .eq("user_id", user.user.id)
    .order("date");
  
  if (error) {
    console.error("Error fetching birthdays:", error);
    throw error;
  }
  
  console.log(`Found ${data?.length || 0} birthdays`);
  if (data && data.length > 0) {
    console.log("Sample birthday data:", data[0]);
  }
  
  return data;
};

export const addBirthday = async (birthday: {
  name: string;
  date: string;
  relation: string;
  reminder_days: number;
  google_calendar_linked?: boolean;
  notes?: string;
}) => {
  console.log("Adding birthday to Supabase:", birthday);
  
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    console.log("No user logged in");
    throw new Error("No user logged in");
  }
  
  // Ensure the date is in the correct format (YYYY-MM-DD)
  let formattedDate = birthday.date;
  if (formattedDate && !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    console.warn("Date format is not YYYY-MM-DD, attempting to format:", formattedDate);
    try {
      const dateObj = new Date(formattedDate);
      formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      console.log("Reformatted date:", formattedDate);
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }
  
  const birthdayData = {
    ...birthday,
    date: formattedDate,
    user_id: user.user.id,
  };
  
  console.log("Saving birthday data:", birthdayData);
  
  const { data, error } = await supabase
    .from("birthdays")
    .insert(birthdayData)
    .select()
    .single();
  
  if (error) {
    console.error("Error adding birthday:", error);
    throw error;
  }
  
  console.log("Birthday added successfully:", data);
  
  return data;
};

export const updateBirthday = async (
  id: string,
  updates: Partial<{
    name: string;
    date: string;
    relation: string;
    reminder_days: number;
    google_calendar_linked: boolean;
    notes: string;
  }>
) => {
  const { data, error } = await supabase
    .from("birthdays")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

export const deleteBirthday = async (id: string) => {
  const { error } = await supabase
    .from("birthdays")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  
  return true;
};

// User settings management
export const saveUserSettings = async (settings: any) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) throw new Error("No user logged in");
  
  const { data, error } = await supabase
    .from("users")
    .update({ settings })
    .eq("id", user.user.id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Also save to localStorage as a fallback
  localStorage.setItem('wishone_settings', JSON.stringify(settings));
  
  return data;
};

export const getUserSettings = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    // If not logged in, try to get from localStorage
    const localSettings = localStorage.getItem('wishone_settings');
    return localSettings ? JSON.parse(localSettings) : null;
  }
  
  const { data, error } = await supabase
    .from("users")
    .select("settings")
    .eq("id", user.user.id)
    .single();
  
  if (error) {
    console.error("Error fetching user settings:", error);
    // Fallback to localStorage if there's an error
    const localSettings = localStorage.getItem('wishone_settings');
    return localSettings ? JSON.parse(localSettings) : null;
  }
  
  // If settings exist in Supabase, also update localStorage
  if (data?.settings) {
    localStorage.setItem('wishone_settings', JSON.stringify(data.settings));
  }
  
  return data?.settings || null;
};

// Upload profile picture to storage
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) throw new Error("No user logged in");
  
  // Create a unique file path for the user's avatar
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;
  
  // Upload the file to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw uploadError;
  }
  
  // Get the public URL for the uploaded file
  const { data } = supabase.storage
    .from('profiles')
    .getPublicUrl(filePath);
  
  if (!data.publicUrl) {
    throw new Error("Could not get public URL for uploaded file");
  }
  
  return data.publicUrl;
};

// Export the Supabase client
export { supabase };

// Export a function to check if Supabase is connected
export const checkConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Check if the API key is set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in environment variables");
      return { 
        connected: false, 
        error: "Missing Supabase credentials. Please check your environment variables." 
      };
    }
    
    // First, check if we can connect to Supabase at all
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error("Auth error:", authError);
      
      // Check for API key errors
      if (authError.message.includes("No API key found") || 
          authError.message.includes("apikey") ||
          authError.message.includes("API key")) {
        return { 
          connected: false, 
          error: "API key error. Please check your Supabase configuration." 
        };
      }
      
      return { 
        connected: false, 
        error: `Auth error: ${authError.message}` 
      };
    }
    
    // Try a simple query to check database connection
    console.log("Testing database connection...");
    const { data, error } = await supabase.from("users").select("count()", { count: "exact" }).limit(1);
    
    if (error) {
      console.error("Database error:", error);
      
      // Check for API key errors
      if (error.message.includes("No API key found") || 
          error.message.includes("apikey") ||
          error.message.includes("API key")) {
        return { 
          connected: false, 
          error: "API key error. Please check your Supabase configuration." 
        };
      }
      
      // Check if the error is related to the table not existing
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return { 
          connected: false, 
          error: "The 'users' table does not exist. Please create the required database tables." 
        };
      }
      
      return { 
        connected: false, 
        error: `Database error: ${error.message}` 
      };
    }
    
    console.log("Connection successful!");
    return { connected: true, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    if (error instanceof Error) {
      // Check for API key errors
      if (error.message.includes("No API key found") || 
          error.message.includes("apikey") ||
          error.message.includes("API key")) {
        return { 
          connected: false, 
          error: "API key error. Please check your Supabase configuration." 
        };
      }
      
      return { connected: false, error: `Unexpected error: ${error.message}` };
    }
    return { connected: false, error: "Unknown error occurred" };
  }
}; 