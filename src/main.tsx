import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import { AuthProvider } from "react-oidc-context";
import {  RouterProvider } from "react-router";
import router from "./routes/route.tsx";
import { Theme } from "@radix-ui/themes";
import "./index.css";


const oidcConfig = {
  authority: "http://localhost:9090/realms/event-ticket-platform",
  client_id: "event-ticket-platform-app",
  redirect_uri: "http://localhost:5173/callback",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme accentColor="amber" radius="large" className="h-full">
      <AuthProvider {...oidcConfig}>
        <RouterProvider router={router} />
      </AuthProvider>
    </Theme>
  </StrictMode>,
);
