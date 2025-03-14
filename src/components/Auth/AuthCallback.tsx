import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          return;
        }
        
        if (data?.session) {
          // Check if user exists in the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error checking user:', userError);
          }
          
          // If user doesn't exist in the users table, create a record
          if (!userData) {
            // Generate a random avatar from DiceBear lorelei-neutral style
            const seed = data.session.user.id || Math.random().toString(36).substring(2);
            const avatarUrl = `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${seed}`;
            
            console.log("Generated avatar URL for OAuth user:", avatarUrl);
            
            // Check if user already has an avatar from OAuth provider
            const existingAvatarUrl = data.session.user.user_metadata?.avatar_url;
            console.log("Existing avatar from OAuth provider:", existingAvatarUrl);
            
            // Only set our random avatar if the user doesn't already have one from the OAuth provider
            if (!existingAvatarUrl) {
              // Update user metadata with the avatar URL
              const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: avatarUrl }
              });
              
              if (updateError) {
                console.error("Error setting default avatar:", updateError);
                console.error("Update error details:", JSON.stringify(updateError));
              } else {
                console.log("Default avatar set successfully:", avatarUrl);
                
                // Verify the update was successful
                const { data: updatedUser } = await supabase.auth.getUser();
                console.log("Updated user metadata:", updatedUser?.user?.user_metadata);
              }
            }
            
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email,
                avatar_url: existingAvatarUrl || avatarUrl
                // Add any other fields you want to initialize
              });
              
            if (insertError) {
              console.error('Error creating user record:', insertError);
              console.error("Insert error details:", JSON.stringify(insertError));
            } else {
              console.log("User record created successfully in users table");
            }
          }
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-700">Completing authentication...</h2>
          <p className="text-gray-500 mt-2">Please wait while we set up your account.</p>
        </div>
      )}
    </div>
  );
} 