import { Children, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Context not provided!')
    }

    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    const checkAuthStatus = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/check-auth`, {
                withCredentials: true
            });
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();  //this is first piece of code to run as app begins to render as app component is wrapped by Authprovider
    }, []);


 const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      email,
      password
    }, { withCredentials: true });

    // Handle success
    if (res.data.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true, user: res.data.user };
    }

    // If success=false from backend 
    return { success: false, message: res.data.message || "Invalid credentials" };

  } catch (err) {
    // Check if this is an expected failure from backend
    console.error("Login error:", err); 
    if (err.response && err.response.status === 401) {
      return {
        success: false,
        message: err.response.data.message || "Incorrect email or password"
      };
    }

    // Unexpected error in server
    return {
      success: false,
      message: "Something went wrong. Please try again."
    };
  }
};;

    const logoutUser = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, {
                withCredentials: true
            });
        } catch (err) {
            return { error: true }
        }

        finally {
            setUser(null);
            setIsAuthenticated(false);
            return { error: false }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logoutUser,checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
}