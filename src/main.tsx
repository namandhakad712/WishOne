import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SupabaseProvider } from "./contexts/SupabaseContext";
import { TextColorProvider } from "./contexts/TextColorContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <SupabaseProvider>
        <TextColorProvider>
          <App />
        </TextColorProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
