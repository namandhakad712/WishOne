import { useEffect } from 'react';
import { ensureUserSynchronized, signOut } from '@/lib/supabaseClient';

/**
 * This component ensures that the user's auth state is synchronized with the database.
 * It should be included near the root of your application.
 */
export default function UserSynchronizer() {
  useEffect(() => {
    const synchronizeUser = async () => {
      try {
        // Check if we're coming from a fallback sign out
        const fallbackSignout = localStorage.getItem('wishone_fallback_signout');
        if (fallbackSignout) {
          // Clear the flag
          localStorage.removeItem('wishone_fallback_signout');
          console.log('Detected fallback sign out, skipping synchronization');
          return;
        }

        console.log('Synchronizing user on app load...');
        await ensureUserSynchronized();
      } catch (error) {
        console.error('Error synchronizing user:', error);
        
        // If we encounter a critical error during synchronization,
        // attempt a clean sign out as a last resort
        try {
          console.log('Attempting emergency sign out due to synchronization error');
          await signOut();
        } catch (signOutError) {
          console.error('Even emergency sign out failed:', signOutError);
          // At this point, we've done all we can - the app will need to be refreshed
        }
      }
    };

    synchronizeUser();
  }, []);

  // This component doesn't render anything
  return null;
} 