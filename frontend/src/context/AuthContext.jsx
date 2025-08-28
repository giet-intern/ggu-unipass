import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsAuth(true);
          setUser({
            username: decodedToken.sub,
            role: decodedToken.role,
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token found", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (loginResponse) => {
    const { token, user } = loginResponse;
    localStorage.setItem("token", token);
    setIsAuth(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ isAuth, user, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
