import React from "react";
import Dashboard from "./components/Dashboard.jsx";
import SolidSignIn from "./components/SolidSignIn.jsx";
import { useSolidAuth } from "./hooks/useSolidAuth.js";

export default function App() {
  const auth = useSolidAuth();

  if (auth.webId) {
    return <Dashboard webId={auth.webId} onLogout={auth.signOut} />;
  }

  return <SolidSignIn auth={auth} />;
}
