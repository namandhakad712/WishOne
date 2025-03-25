# Vercel Deployment Guide for WishOne

This guide will help you deploy your WishOne application to Vercel and configure authentication correctly.

## Prerequisites

- A Vercel account
- Access to your Supabase project
- Google OAuth credentials (if using Google authentication)
- Google Gemini API key

## Deployment Steps

1. **Push your code to GitHub**
   - Make sure all your changes are committed and pushed to GitHub
   - Ensure all environment variables are properly set up in your .env.local file for testing before deployment

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com) and log in
   - Click "Add New..." and select "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework preset: Vite
     - Build command: `npm run build`
     - Output directory: `dist`

3. **Configure Environment Variables in Vercel**
   - In the Vercel dashboard, go to your project settings
   - Go to the "Environment Variables" tab
   - Add the following environment variables:
     ```
     VITE_SUPABASE_URL=https://wmlifncvyvddgzxrdwlx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtbGlmbmN2eXZkZGd6eHJkd2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDUyMTcsImV4cCI6MjA1NzEyMTIxN30.i1_CcAaoGx3f1GTh-noRmXETFd6f6kamkUWf8iQ8d1k
     VITE_GEMINI_API_KEY=AIzaSyC81EywHHPaslM_nTBEyBO-FWaXLc-tXvc
     ```

4. **Configure Vercel for Email Server (Optional)**
   - If you want to use the contact form functionality, you'll need to set up a separate server deployment
   - Create a new project for your server or use Vercel Serverless Functions
   - Add these additional environment variables for the email service:
     ```
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     EMAIL_TO=destination_email@gmail.com
     EMAIL_SERVICE=gmail
     ```

## Supabase Configuration

1. **Update URL Configuration in Supabase**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > URL Configuration
   - Set the Site URL to `https://wish-one-web.vercel.app` (or your custom domain)
   - Add the following redirect URLs:
     ```
     https://wish-one-web.vercel.app/auth/callback
     https://wish-one-web.vercel.app/calendar/callback
     ```

2. **Configure Google OAuth (if using)**
   - Go to your Google Cloud Console project
   - Navigate to "Credentials" > "OAuth 2.0 Client IDs"
   - Edit your OAuth client ID
   - Add the following to "Authorized redirect URIs":
     ```
     https://wmlifncvyvddgzxrdwlx.supabase.co/auth/v1/callback
     https://wish-one-web.vercel.app/auth/callback
     https://wish-one-web.vercel.app/calendar/callback
     ```
   - Save changes

3. **Verify Your Email Domains (Optional)**
   - If you're using email authentication, consider verifying your email domain in the Supabase dashboard
   - This improves email deliverability

## Testing the Deployment

1. After deployment, visit your Vercel deployment URL
2. Test the authentication flow:
   - Log in with email or Google
   - Verify that you're redirected back to the application
   - Check that your user data is correctly loaded

3. Test Google Calendar integration:
   - Try to connect to Google Calendar
   - Verify the OAuth flow works and redirects back to your application

4. Test the Contact Form functionality:
   - Go to the Help page and submit a test contact form
   - Verify that emails are being received correctly

## Custom Domain Setup (Optional)

1. In your Vercel project settings, go to "Domains"
2. Add your custom domain and follow Vercel's instructions for DNS configuration
3. Update your Supabase URL configurations with the new domain
4. Update your Google OAuth redirect URIs with the new domain

## Troubleshooting

- **Authentication Redirect Issues**:
  - Check the redirect URLs in both Supabase and Google OAuth settings
  - Make sure they match exactly with your Vercel deployment URL
  - Check browser console for any CORS errors

- **Environment Variable Problems**:
  - Verify that all environment variables are correctly set in Vercel
  - Redeploy your application after changing environment variables
  - Make sure there are no typos in your environment variable names

- **CORS Issues**:
  - If you encounter CORS errors, check the allowed origins in your Supabase project settings

- **Email Server Issues**:
  - If the contact form isn't working, check your server logs
  - Verify that the email credentials are correct
  - Test the server locally before deploying

## Production Considerations

- Enable RLS (Row Level Security) in Supabase for all your tables
- Set up proper backup strategies for your Supabase database
- Consider setting up CI/CD pipelines for automated deployments
- Monitor application performance and errors using Vercel Analytics
- Set up logging and monitoring for your email server

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Nodemailer Documentation](https://nodemailer.com/about/) 