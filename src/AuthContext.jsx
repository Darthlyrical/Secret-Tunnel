import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  async function signup(name) {
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name, password: "password" }),
    });
    const data = await res.json();
    setToken(data.token);
    setLocation("TABLET");
  }

  async function authenticate() {
    const res = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setLocation("TUNNEL");
    }
  }

  const value = { location, token, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
