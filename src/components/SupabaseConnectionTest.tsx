import React, { useState, useEffect } from "react";
import { checkConnection } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const testConnection = async () => {
    setIsChecking(true);
    setStatus("loading");
    setErrorMessage(null);

    try {
      const result = await checkConnection();
      
      if (result.connected) {
        setStatus("connected");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Unknown error occurred");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Testing connection to your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Testing connection...</p>
          </div>
        )}

        {status === "connected" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-green-500 font-medium">Connected successfully!</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Your application is properly connected to Supabase.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-500 font-medium">Connection failed</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {errorMessage || "Could not connect to Supabase."}
            </p>
            <div className="mt-4 space-y-2 w-full">
              <p className="text-sm font-medium">Possible solutions:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Check your Supabase URL and API key in .env.local file</li>
                <li>Verify that your Supabase project is active</li>
                <li>Check if your IP is allowed in Supabase settings</li>
                <li>Ensure your database is not paused</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={testConnection} 
          disabled={isChecking} 
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Connection Again"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 