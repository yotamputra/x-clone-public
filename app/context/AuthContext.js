import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");

      if (token) {
        setIsSignedIn(true);
      }

      setLoading(false);
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};
