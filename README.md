# WishOne ✨

WishOne is a modern birthday reminder and companion application that helps you remember and celebrate special occasions with the people you care about. With an AI-powered chat companion, beautiful calendar interface, and personalized birthday wishes, WishOne makes sure you never miss an important date again.

## Features

- **Birthday Calendar**: Track and manage birthdays with a beautiful, intuitive calendar interface
- **AI Companion**: Chat with an emotionally intelligent AI that helps you craft personalized birthday wishes
- **Reminders**: Set customized reminders so you never forget an important date
- **Google Calendar Integration**: Sync birthdays with your Google Calendar
- **Profile Management**: Create and manage multiple profiles
- **Help Center**: Access a comprehensive help center with searchable FAQ categories
- **Contact Support**: Submit inquiries, bug reports, or feature suggestions through the integrated support form
- **Responsive Design**: Beautiful user interface that works across all device sizes
- **Offline Support**: Access your data even without an internet connection

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Tailwind CSS, shadcn/ui, Framer Motion
- **Database**: Supabase
- **AI Integration**: Google Gemini AI
- **Authentication**: Supabase Auth
- **Email Service**: Nodemailer with Gmail SMTP
- **Animations**: Framer Motion, GSAP

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wishone.git
   cd wishone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Start the email server for contact form functionality:
   ```bash
   npm run server
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src`: Source code
  - `/components`: React components
    - `/ui`: UI components (buttons, inputs, etc.)
  - `/pages`: Page components
  - `/hooks`: Custom React hooks
  - `/contexts`: React context providers
  - `/services`: API services
  - `/utils`: Utility functions
  - `/lib`: Utility functions and services
  - `/types`: TypeScript type definitions
  - `/server`: Back-end server code for email services

## Deployment

For deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed steps on deploying to Vercel.

## Database Setup

For database setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed steps on setting up Supabase.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Supabase](https://supabase.io/) for the backend services
- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [Framer Motion](https://www.framer.com/motion/) for animations

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# WishOne App

## Contact Form Email Setup

This application includes a contact form on the Help page that sends emails using Gmail SMTP.

### Setting Up the Email Server

1. Install the required dependencies:
   ```
   npm install
   ```

2. Start the email server:
   ```
   npm run server
   ```
   This will start the server on port 3001.

3. Start the application:
   ```
   npm run dev
   ```

4. The contact form on the Help page will now send emails to your Gmail account.

### How It Works

- When users fill out the contact form on the Help page, the form data is sent to the API endpoint.
- The server uses Nodemailer with Gmail SMTP to send an email to your address.
- Different contact types (App Support, Bug Report, Feature Suggestion) have different subject line formats for easy categorization.
- All emails are sent to `codinggeneraltutorials@gmail.com`.

### Troubleshooting

- If you're having issues with authentication, make sure your Gmail account has 2-factor authentication enabled and you're using an app password.
- Check the server console for error messages if emails aren't being sent.
- The server must be running on port 3001 for the form to work correctly.
