import React from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface ApiKeyMissingProps {
  service: string;
  envVarName: string;
}

const ApiKeyMissing: React.FC<ApiKeyMissingProps> = ({ 
  service = "Gemini AI",
  envVarName = "VITE_GEMINI_API_KEY"
}) => {
  return (
    <Alert variant="destructive" className="mb-4 max-w-md bg-white/70 backdrop-blur-sm border border-red-200/50 shadow-lg">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-lg font-semibold text-red-600">API Key Missing or Invalid</AlertTitle>
      <AlertDescription className="mt-2 text-gray-700">
        <p className="mb-3">
          The {service} API key is missing or invalid. To fix this:
        </p>
        
        <ol className="list-decimal pl-5 mb-4 space-y-2 text-sm">
          <li>
            Create or get your API key from the {service} website
          </li>
          <li>
            Create a <code className="bg-white/70 px-1 py-0.5 rounded border border-white/40">
              .env.local
            </code> file in the project root
          </li>
          <li>
            Add your API key to the file:
            <pre className="bg-white/70 p-2 rounded text-xs mt-1 overflow-x-auto border border-white/40">
              {envVarName}=your_api_key_here
            </pre>
          </li>
          <li>
            Restart your development server
          </li>
        </ol>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center bg-white/80 border border-purple-200 text-purple-700 hover:bg-white/90"
            onClick={() => window.open("https://ai.google.dev/", "_blank")}
          >
            Get API Key
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center bg-white/80 border border-purple-200 text-purple-700 hover:bg-white/90"
            onClick={() => window.open("https://ai.google.dev/tutorials/setup", "_blank")}
          >
            Setup Guide
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ApiKeyMissing; 