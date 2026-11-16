import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { seedDatabase } from "@/lib/data/seed";

// Initialize seed data on app load
seedDatabase();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);