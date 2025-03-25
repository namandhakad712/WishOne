import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File, ChevronDown, ChevronRight, ArrowLeft, Code, Layout, Package, X, Copy, Check, ExternalLink } from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  description?: string;
  path?: string;
  content?: string;
}

const StructureOfProject: React.FC = () => {
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Example file contents - in a real app, you'd fetch these from your backend or filesystem
  const fileContents: Record<string, string> = {
    'src/App.tsx': `import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import ChatPage from "./components/ChatPage";
import ProfilePage from "./components/ProfilePage";
import WelcomeWindow from "./components/WelcomeWindow";
import LoginPage from "./pages/LoginPage";
import HelpPage from "./pages/HelpPage";
import CalendarPage from "./pages/CalendarPage";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import UserSynchronizer from "./components/UserSynchronizer";
import ConnectionStatus from "./components/ConnectionStatus";
import routes from "tempo-routes";
import { AuthCallback } from "./components/Auth/AuthCallback";
import { CalendarCallback } from "./components/Calendar/CalendarCallback";
import { RetroModeProvider } from "@/contexts/RetroModeContext";
import { GSAPProvider } from "./contexts/GSAPContext";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import StructureOfProject from "./pages/StructureOfProject";

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Check if this is the first time the user is visiting
    const hasVisitedBefore = localStorage.getItem('wishone_has_visited');
    
    if (!hasVisitedBefore) {
      setShowWelcome(true);
    }
  }, []);
  
  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('wishone_has_visited', 'true');
  };

  return (
    <RetroModeProvider>
      <GSAPProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            {showWelcome && <WelcomeWindow onClose={handleCloseWelcome} />}
            <UserSynchronizer />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/terms" element={<TermsConditionsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/structureofprojectbynaman" element={<StructureOfProject />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<HomeScreen />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/calendar/callback" element={<CalendarCallback />} />
              </Route>
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Toaster />
            {import.meta.env.DEV && <ConnectionStatus />}
          </>
        </Suspense>
      </GSAPProvider>
    </RetroModeProvider>
  );
}

export default App;`,

    'src/pages/StructureOfProject.tsx': `// This is the current file you're viewing
// It shows the project structure in a tree view
// and allows you to view code for specific files`,

    'src/components/HomeScreen.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
// HomeScreen component implementation...`,

    'src/components/ChatPage.tsx': `import React from 'react';
// ChatPage component implementation...`,

    'src/pages/LoginPage.tsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// LoginPage implementation...`,

    'src/pages/HelpPage.tsx': `import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
// HelpPage implementation with FAQs...`,

    'src/contexts/RetroModeContext.tsx': `import React, { createContext, useState, useContext } from 'react';
// RetroMode context implementation...`,

    'src/utils/animations.tsx': `// Animation utility functions
export const pageTransitions = { ... };
export const uiAnimations = { ... };
export const textAnimations = { ... };`,
  };

  const projectStructure: TreeNode = {
    name: 'WishOne',
    type: 'folder',
    description: 'Root project directory',
    children: [
      {
        name: 'src',
        type: 'folder',
        description: 'Source code directory containing all application code',
        children: [
          {
            name: 'assets',
            type: 'folder',
            description: 'Static assets like images, fonts, and other media files',
            children: [
              { name: 'images', type: 'folder', description: 'Image files used throughout the application' },
              { name: 'fonts', type: 'folder', description: 'Custom font files' },
            ]
          },
          {
            name: 'components',
            type: 'folder',
            description: 'Reusable UI components',
            children: [
              { name: 'ui', type: 'folder', description: 'Shadcn UI components' },
              { name: 'Auth', type: 'folder', description: 'Authentication-related components' },
              { name: 'Calendar', type: 'folder', description: 'Calendar-related components' },
              { 
                name: 'HomeScreen.tsx', 
                type: 'file', 
                description: 'Main home screen component',
                path: 'src/components/HomeScreen.tsx'
              },
              { 
                name: 'ChatPage.tsx', 
                type: 'file', 
                description: 'Chat interface component',
                path: 'src/components/ChatPage.tsx'
              },
              { name: 'ProfilePage.tsx', type: 'file', description: 'User profile component' },
              { name: 'WelcomeWindow.tsx', type: 'file', description: 'Welcome screen for new users' },
            ]
          },
          {
            name: 'contexts',
            type: 'folder',
            description: 'React context providers for state management',
            children: [
              { 
                name: 'RetroModeContext.tsx', 
                type: 'file', 
                description: 'Context for retro mode styling',
                path: 'src/contexts/RetroModeContext.tsx'
              },
              { name: 'GSAPContext.tsx', type: 'file', description: 'Context for GSAP animations' },
            ]
          },
          {
            name: 'hooks',
            type: 'folder',
            description: 'Custom React hooks',
            children: [
              { name: 'useGSAPAnimation.tsx', type: 'file', description: 'Hook for GSAP animations' },
            ]
          },
          {
            name: 'lib',
            type: 'folder',
            description: 'Third-party library configurations and utilities',
          },
          {
            name: 'pages',
            type: 'folder',
            description: 'Page-level components for routing',
            children: [
              { 
                name: 'LoginPage.tsx', 
                type: 'file', 
                description: 'User login page',
                path: 'src/pages/LoginPage.tsx'
              },
              { 
                name: 'HelpPage.tsx', 
                type: 'file', 
                description: 'Help and FAQ page',
                path: 'src/pages/HelpPage.tsx'
              },
              { name: 'CalendarPage.tsx', type: 'file', description: 'Calendar view page' },
              { name: 'TermsConditionsPage.tsx', type: 'file', description: 'Terms and conditions page' },
              { name: 'PrivacyPolicyPage.tsx', type: 'file', description: 'Privacy policy page' },
              { 
                name: 'StructureOfProject.tsx', 
                type: 'file', 
                description: 'This page - showing project structure',
                path: 'src/pages/StructureOfProject.tsx'
              },
            ]
          },
          {
            name: 'server',
            type: 'folder',
            description: 'Server-side code and API interactions',
          },
          {
            name: 'services',
            type: 'folder',
            description: 'Service layers for API interactions',
          },
          {
            name: 'stories',
            type: 'folder',
            description: 'Storybook stories for component documentation',
          },
          {
            name: 'styles',
            type: 'folder',
            description: 'Global styles and theme configurations',
          },
          {
            name: 'test',
            type: 'folder',
            description: 'Test files and utilities',
          },
          {
            name: 'types',
            type: 'folder',
            description: 'TypeScript type definitions',
          },
          {
            name: 'utils',
            type: 'folder',
            description: 'Utility functions and helpers',
            children: [
              { 
                name: 'animations.tsx', 
                type: 'file', 
                description: 'Animation utility functions',
                path: 'src/utils/animations.tsx'
              },
            ]
          },
          { 
            name: 'App.tsx', 
            type: 'file', 
            description: 'Main application component with routing',
            path: 'src/App.tsx'
          },
          { name: 'index.tsx', type: 'file', description: 'Entry point for the application' },
          { name: 'main.tsx', type: 'file', description: 'Main rendering file' },
          { name: 'index.css', type: 'file', description: 'Global CSS styles' },
          { name: 'vite-env.d.ts', type: 'file', description: 'TypeScript declarations for Vite' },
        ]
      },
      {
        name: 'public',
        type: 'folder',
        description: 'Publicly accessible files',
        children: [
          { name: 'favicon.ico', type: 'file', description: 'Website favicon' },
          { name: 'index.html', type: 'file', description: 'HTML entry point' },
        ]
      },
      { name: 'package.json', type: 'file', description: 'NPM package configuration' },
      { name: 'tsconfig.json', type: 'file', description: 'TypeScript configuration' },
      { name: 'vite.config.ts', type: 'file', description: 'Vite build configuration' },
      { name: 'README.md', type: 'file', description: 'Project documentation' },
    ]
  };

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileClick = (node: TreeNode) => {
    if (node.type === 'file' && node.path && fileContents[node.path]) {
      setSelectedFile({
        ...node,
        content: fileContents[node.path]
      });
    }
  };

  const closeFileView = () => {
    setSelectedFile(null);
  };

  const copyToClipboard = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTree = (node: TreeNode, path: string = '', level: number = 0) => {
    const fullPath = path ? `${path}.${node.name}` : node.name;
    const isExpanded = expandedNodes.has(fullPath);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <motion.div 
        key={fullPath} 
        className="select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
      >
        <div 
          className={`flex items-center py-1.5 pl-${level * 4} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-all duration-200`}
          onClick={() => {
            if (hasChildren) {
              toggleNode(fullPath);
            } else {
              handleFileClick(node);
            }
          }}
        >
          <div className="w-6 flex justify-center">
            {hasChildren ? (
              isExpanded ? 
                <ChevronDown className="h-4 w-4 text-blue-500 transition-transform duration-200" /> : 
                <ChevronRight className="h-4 w-4 text-blue-500 transition-transform duration-200" />
            ) : <div className="w-4" />}
          </div>
          
          <div className="mr-2">
            {node.type === 'folder' ? (
              <Folder className="h-5 w-5 text-yellow-400" />
            ) : (
              <File className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          <span className={`font-medium ${node.type === 'folder' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
            {node.name}
          </span>
          
          {node.description && (
            <span className="ml-4 text-xs text-gray-500 dark:text-gray-400 hidden md:inline">
              {node.description}
            </span>
          )}
        </div>
        
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div 
              className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {node.children!.map(child => renderTree(child, fullPath, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center justify-between"
        >
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WishOne Project Structure
            </h1>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </motion.div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 mb-8 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <div className="flex items-center gap-4 mb-6">
            <Code className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Codebase Overview</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            WishOne is structured as a modern React application built with TypeScript, Vite, and various supporting libraries.
            Click on any file in the tree to view its contents.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Layout className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Frontend</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                React components, pages, and UI elements
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Logic</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hooks, contexts, and utility functions
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Infrastructure</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Build configuration, types, and assets
              </p>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-5/12"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
              <div className="flex items-center gap-4 mb-6">
                <Folder className="h-6 w-6 text-yellow-400" />
                <h2 className="text-xl font-semibold">Project Tree</h2>
              </div>
              
              <div className={`text-sm overflow-auto max-h-[600px] pr-2 ${theme === 'dark' ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                {renderTree(projectStructure)}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full lg:w-7/12"
          >
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div 
                  key="file-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 sticky top-8 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">{selectedFile.path}</h3>
                    </div>
                    <div className="flex gap-2">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Copy code"
                      >
                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={closeFileView}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Close"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className={`bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-auto max-h-[70vh] ${theme === 'dark' ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                    <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-all">
                      {selectedFile.content}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col items-center justify-center h-[300px] backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
                >
                  <File className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                    Click on any file in the project tree to view its contents.
                  </p>
                  <div className="text-xs bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-2">
                    <span className="text-blue-500">Tip:</span> Folders can be expanded by clicking on them.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Created by <span className="font-medium">Naman</span> • WishOne Project © {new Date().getFullYear()}</p>
        </motion.div>
      </div>
      
      <style>
        {`
          .custom-scrollbar-light::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar-light::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 4px;
          }
          .custom-scrollbar-light::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 4px;
          }
          .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          
          .custom-scrollbar-dark::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 4px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `}
      </style>
    </div>
  );
};

export default StructureOfProject; 