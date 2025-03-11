# WishOne ✨

WishOne is a modern birthday reminder and companion application that helps you remember and celebrate special occasions with the people you care about. With an AI-powered chat companion, beautiful calendar interface, and personalized birthday wishes, WishOne makes sure you never miss an important date again.

## Features

- **Birthday Calendar**: Track and manage birthdays with a beautiful, intuitive calendar interface
- **AI Companion**: Chat with an emotionally intelligent AI that helps you craft personalized birthday wishes
- **Reminders**: Set customized reminders so you never forget an important date
- **Google Calendar Integration**: Sync birthdays with your Google Calendar
- **Profile Management**: Create and manage multiple profiles

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Tailwind CSS, shadcn/ui
- **Database**: Supabase
- **AI Integration**: Google Gemini AI
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
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

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src`: Source code
  - `/components`: React components
    - `/ui`: UI components (buttons, inputs, etc.)
  - `/lib`: Utility functions and services
  - `/types`: TypeScript type definitions

## Offline Use

To download the project for offline use, run the included PowerShell script:

```bash
powershell -ExecutionPolicy Bypass -File download-project.ps1
```

This will create a zip file containing the entire project (excluding node_modules and other large directories).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Supabase](https://supabase.io/) for the backend services
- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities

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
