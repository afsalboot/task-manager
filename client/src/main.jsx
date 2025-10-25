import react from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <Toaster position="top-right" />
      <App />
    </AppProvider>
  </BrowserRouter>
);
