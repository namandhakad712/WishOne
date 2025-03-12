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
    // Remove global headers - let Supabase handle auth automatically
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
      return { data, error };
    }

    // Create user record in the users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
        });

      if (insertError) {
        console.error("Error creating user record:", insertError);
      }
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
  try {
    console.log("Attempting to sign out...");
    
    // First, try the normal sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error during sign out:", error);
      
      // If there's a CORS error, connection closed, or any fetch error, try a client-side fallback
      if (
        error.message?.includes('Failed to fetch') || 
        error.message?.includes('CORS') ||
        error.message?.includes('ERR_CONNECTION_CLOSED') ||
        error.message?.includes('connection closed')
      ) {
        console.log("Network error detected during sign out, using client-side fallback");
        
        // Clear auth-related items from local storage
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.expires_at');
        localStorage.removeItem('supabase.auth.refresh_token');
        
        // Clear any other app-specific storage
        localStorage.removeItem('wishone_settings');
        
        // Also clear session storage
        sessionStorage.clear();
        
        console.log("Auth data cleared locally, redirecting to home page");
        
        // Force reload the page to clear any in-memory state
        window.location.href = '/';
        
        return true;
      }
      
      throw error;
    }
    
    console.log("Sign out successful");
    return true;
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    
    // Last resort fallback
    try {
      console.log("Using last resort fallback for sign out");
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Add a flag to indicate we're in a fallback sign out
      localStorage.setItem('wishone_fallback_signout', 'true');
      
      console.log("All storage cleared, redirecting to home page");
      window.location.href = '/';
      return true;
    } catch (e) {
      console.error("Even fallback failed:", e);
      throw error;
    }
  }
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
  
  const { data, error } = await supabase.auth.updateUser({
    data: profile
  });
  
  if (error) throw error;
  
  return data.user;
};

// Database operations
export const getBirthdays = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.log("No user logged in");
    throw new Error("No user logged in");
  }
  
  console.log(`Fetching birthdays for user: ${session.user.id}`);
  
  try {
    const { data, error } = await supabase
      .from("birthdays")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date");
    
    if (error) {
      console.error("Error fetching birthdays:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} birthdays`);
    return data || [];
  } catch (error) {
    console.error("Error in getBirthdays:", error);
    throw error;
  }
};

// Define types for our RPC functions
type DebugAuthUidResult = {
  current_auth_uid: string | null;
  is_authenticated: boolean;
};

type BirthdayRecord = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  date: string;
  relation: string;
  reminder_days: number;
  google_calendar_linked?: boolean;
  notes?: string;
};

type InsertBirthdayParams = {
  p_name: string;
  p_date: string;
  p_relation: string;
  p_reminder_days: number;
  p_notes?: string | null;
  p_google_calendar_linked?: boolean;
  p_user_id: string;
};

export const addBirthday = async (birthday: {
  name: string;
  date: string;
  relation: string;
  reminder_days: number;
  google_calendar_linked?: boolean;
  notes?: string;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.log("No user logged in");
    throw new Error("No user logged in");
  }
  
  try {
    console.log("Adding birthday:", birthday);
    console.log("User ID:", session.user.id);
    
    // Debug: Check if auth.uid() is working correctly
    try {
      // Use any to bypass TypeScript errors
      const { data: authDebug, error: debugError } = await (supabase.rpc as any)('debug_auth_uid');
      
      if (debugError) {
        console.error("Debug auth error:", debugError);
      } else {
        console.log("Auth debug info:", authDebug);
      }
    } catch (debugErr) {
      console.error("Error running auth debug:", debugErr);
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
        throw new Error("Invalid date format");
      }
    }
    
    const birthdayData = {
      ...birthday,
      date: formattedDate,
      user_id: session.user.id
    };
    
    console.log("Saving birthday data:", birthdayData);
    
    // First try with upsert instead of insert
    const { data, error } = await supabase
      .from("birthdays")
      .upsert(birthdayData)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding birthday:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      
      // If upsert fails, try a direct insert as a fallback
      if (error.code === '42501' || error.message.includes('policy')) {
        console.log("Trying direct insert as fallback...");
        const { data: insertData, error: insertError } = await supabase
          .from("birthdays")
          .insert(birthdayData)
          .select()
          .single();
          
        if (insertError) {
          console.error("Fallback insert also failed:", insertError);
          throw insertError;
        }
        
        console.log("Birthday added successfully via fallback:", insertData);
        return insertData;
      }
      
      throw error;
    }
    
    console.log("Birthday added successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in addBirthday:", error);
    
    // Try one more approach if all else fails - direct SQL
    try {
      console.log("Attempting final fallback with direct SQL...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) throw new Error("No user logged in");
      
      const params = { 
        p_name: birthday.name,
        p_date: birthday.date,
        p_relation: birthday.relation,
        p_reminder_days: birthday.reminder_days,
        p_notes: birthday.notes || null,
        p_google_calendar_linked: birthday.google_calendar_linked || false,
        p_user_id: session.user.id
      };
      
      // Use any to bypass TypeScript errors
      const { data: sqlData, error: sqlError } = await (supabase.rpc as any)('insert_birthday', params);
      
      if (sqlError) {
        console.error("SQL fallback also failed:", sqlError);
        throw sqlError;
      }
      
      console.log("Birthday added successfully via SQL fallback:", sqlData);
      return sqlData;
    } catch (finalError) {
      console.error("All fallback attempts failed:", finalError);
      throw error; // Throw the original error
    }
  }
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
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) throw new Error("No user logged in");
  
  try {
    const { data, error } = await supabase
      .from("birthdays")
      .update(updates)
      .eq("id", id)
      .eq("user_id", session.user.id) // Ensure user owns this birthday
      .select()
      .single();
    
    if (error) {
      console.error("Error updating birthday:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateBirthday:", error);
    throw error;
  }
};

export const deleteBirthday = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) throw new Error("No user logged in");
  
  try {
    const { error } = await supabase
      .from("birthdays")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id); // Ensure user owns this birthday
    
    if (error) {
      console.error("Error deleting birthday:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteBirthday:", error);
    throw error;
  }
};

// User settings management
export const saveUserSettings = async (settings: any) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) throw new Error("No user logged in");
  
  try {
    // First, check if user exists in the users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", session.user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking if user exists:", checkError);
    }
    
    if (!existingUser) {
      // Try to update the user record first
      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          settings: settings,
          email: session.user.email
        })
        .eq("id", session.user.id);
      
      if (updateError) {
        console.log("User doesn't exist, creating new record");
        // If update fails, try to insert
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: session.user.id,
            email: session.user.email || '',
            settings: settings
          })
          .single();
          
        if (insertError) {
          if (insertError.code === '23505') {
            // If we get a duplicate key error, try updating again
            console.log("Duplicate key detected, trying update instead");
            const { error: finalUpdateError } = await supabase
              .from("users")
              .update({ settings: settings })
              .eq("id", session.user.id);
              
            if (finalUpdateError) {
              console.error("Final update attempt failed:", finalUpdateError);
              throw finalUpdateError;
            }
          } else {
            console.error("Error creating user record:", insertError);
            throw insertError;
          }
        }
      }
    } else {
      // Update existing user's settings
      const { error: updateError } = await supabase
        .from("users")
        .update({ settings })
        .eq("id", session.user.id);
        
      if (updateError) {
        console.error("Error updating user settings:", updateError);
        throw updateError;
      }
    }
    
    // Save to localStorage as fallback
    localStorage.setItem('wishone_settings', JSON.stringify(settings));
    
    return { settings };
  } catch (error) {
    console.error("Error saving settings:", error);
    // Save to localStorage even if the database operation fails
    localStorage.setItem('wishone_settings', JSON.stringify(settings));
    return { settings };
  }
};

export const getUserSettings = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    // If not logged in, try to get from localStorage
    const localSettings = localStorage.getItem('wishone_settings');
    return localSettings ? JSON.parse(localSettings) : null;
  }
  
  try {
    // First, check if user exists in the users table
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("settings")
      .eq("id", session.user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // User doesn't exist in the users table, try to create them
        try {
          const { error: upsertError } = await supabase
            .from("users")
            .upsert({
              id: session.user.id,
              email: session.user.email || '',
              settings: null
            });
            
          if (upsertError && upsertError.code !== '23505') {
            console.error("Error creating user record:", upsertError);
          }
        } catch (insertError) {
          console.error("Error in user upsert:", insertError);
        }
        
        // Fallback to localStorage
        const localSettings = localStorage.getItem('wishone_settings');
        return localSettings ? JSON.parse(localSettings) : null;
      }
      
      console.error("Error fetching user settings:", error);
      // Fallback to localStorage for other errors
      const localSettings = localStorage.getItem('wishone_settings');
      return localSettings ? JSON.parse(localSettings) : null;
    }
    
    // If settings exist in Supabase, also update localStorage
    if (existingUser?.settings) {
      localStorage.setItem('wishone_settings', JSON.stringify(existingUser.settings));
    }
    
    return existingUser?.settings || null;
  } catch (error) {
    console.error("Error getting settings:", error);
    // Fallback to localStorage
    const localSettings = localStorage.getItem('wishone_settings');
    return localSettings ? JSON.parse(localSettings) : null;
  }
};

// Compress image before upload
const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Upload profile picture to storage
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) throw new Error("No user logged in");
  
  try {
    console.log("Starting profile picture upload process");
    
    // Compress the image
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg',
    });
    
    // Create a unique file path for the user's avatar
    const fileName = `avatar-${Math.random().toString(36).substring(2)}.jpg`;
    
    // Try to upload directly to the root of the bucket
    console.log("Uploading to profiles bucket");
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      console.error("Error details:", uploadError.message);
      
      // If direct upload fails, fall back to data URL
      console.log("Using data URL fallback for image");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            console.log("Data URL fallback successful");
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert image to data URL"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);
    
    if (!data.publicUrl) {
      throw new Error("Could not get public URL for uploaded file");
    }
    
    console.log("Upload successful, URL:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("Error processing or uploading image:", error);
    
    // Final fallback - use a data URL
    console.log("Using data URL fallback for image after error");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          console.log("Data URL fallback successful");
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to data URL"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
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

// Check if a user exists in both auth and public tables
export const checkUserExistence = async (userId: string) => {
  try {
    console.log("Checking user existence in both tables for ID:", userId);
    
    // Use the RPC function to check both tables
    const { data, error } = await (supabase.rpc as any)(
      'user_exists_in_both_tables',
      { user_id: userId }
    );
    
    if (error) {
      console.error("Error checking user existence:", error);
      return { exists_in_auth: false, exists_in_public: false, error };
    }
    
    console.log("User existence check result:", data);
    
    // If user exists in auth but not in public, create the public record
    if (data && data.exists_in_auth && !data.exists_in_public) {
      console.log("User exists in auth but not in public, creating public record");
      
      // Get user details from auth
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error("Error getting user details:", userError);
        return { ...data, error: userError };
      }
      
      // Create the public user record
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userData.user.id,
          email: userData.user.email || '',
        });
        
      if (insertError) {
        console.error("Error creating public user record:", insertError);
        return { ...data, error: insertError };
      }
      
      console.log("Public user record created successfully");
      return { exists_in_auth: true, exists_in_public: true };
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error checking user existence:", error);
    return { exists_in_auth: false, exists_in_public: false, error };
  }
};

// Delete a user completely from both auth and public tables
export const deleteUserCompletely = async (userId: string) => {
  try {
    console.log("Deleting user completely:", userId);
    
    // Use the RPC function to delete the user
    const { error } = await (supabase.rpc as any)(
      'delete_user_completely',
      { user_id: userId }
    );
    
    if (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
    
    console.log("User deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteUserCompletely:", error);
    throw error;
  }
};

// Add a function to check and synchronize the current user
export const ensureUserSynchronized = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log("No user logged in, nothing to synchronize");
      return null;
    }
    
    console.log("Ensuring user is synchronized:", session.user.id);
    
    // Check if user exists in both tables
    const existence = await checkUserExistence(session.user.id);
    
    if (existence.error) {
      console.error("Error checking user existence:", existence.error);
      return null;
    }
    
    // If user doesn't exist in auth, sign them out
    if (!existence.exists_in_auth) {
      console.log("User doesn't exist in auth, signing out");
      await signOut();
      return null;
    }
    
    // If user exists in auth but not in public, the checkUserExistence function
    // will have already created the public record
    
    return session.user;
  } catch (error) {
    console.error("Error in ensureUserSynchronized:", error);
    return null;
  }
}; 