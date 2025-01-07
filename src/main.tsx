import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./contexts/userContextProvider";
import Account from "./pages/account/Account";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import SavedNetworks from "./pages/savedNetworks/SavedNetworks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Register />} />
          <Route path="/account" element={<SavedNetworks />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>,
);
