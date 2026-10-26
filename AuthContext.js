import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Check saved login
   */
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        console.log(
          "SAVED USER:",
          JSON.stringify(parsedUser, null, 2)
        );

        setUser(parsedUser);
      }
    } catch (error) {
      console.log("LOAD USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Login
   */
  const login = async (userData) => {
    try {
      console.log(
        "AUTH LOGIN DATA:",
        JSON.stringify(userData, null, 2)
      );

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setUser(userData);
    } catch (error) {
      console.log("AUTH LOGIN ERROR:", error);
    }
  };

  /*
   * Logout
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};