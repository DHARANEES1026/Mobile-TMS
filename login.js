import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../src/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://192.168.203.223:5000/api/auth/login",
        {
          email: email.trim(),
          password: password,
        }
      );

      console.log("================================");
      console.log("LOGIN RESPONSE:");
      console.log(JSON.stringify(response.data, null, 2));
      console.log("================================");

      const responseData = response.data;

      /*
       * Some backends return:
       *
       * {
       *   token: "...",
       *   role: "Admin"
       * }
       *
       * Others return:
       *
       * {
       *   token: "...",
       *   user: {
       *      role: "Admin"
       *   }
       * }
       */

      const userData = responseData.user || responseData;

      /*
       * Get role
       */
      let role = userData.role;

      console.log("ROLE BEFORE PROCESSING:", role);

      /*
       * If role is an object:
       *
       * role: {
       *   _id: "...",
       *   name: "Admin"
       * }
       */
      if (role && typeof role === "object") {
        role =
          role.name ||
          role.roleName ||
          role.title ||
          role.role ||
          "";
      }

      /*
       * Convert role to lowercase so that:
       *
       * Admin
       * admin
       * ADMIN
       *
       * are all treated the same.
       */
      role = String(role || "")
        .trim()
        .toLowerCase();

      console.log("FINAL ROLE:", role);

      /*
       * Save login information
       */
      await login(responseData);

      /*
       * ADMIN
       */
      if (
        role === "admin" ||
        role === "administrator" ||
        role === "superadmin" ||
        role === "super admin"
      ) {
        console.log("GOING TO ADMIN DASHBOARD");

        router.replace("/admin");
        return;
      }

      /*
       * STAFF
       */
      if (
        role === "staff" ||
        role === "networking staff" ||
        role === "plumber" ||
        role === "electrician" ||
        role === "software developer"
      ) {
        console.log("GOING TO STAFF DASHBOARD");

        router.replace("/staff");
        return;
      }

      /*
       * USER
       */
      if (role === "user") {
        console.log("GOING TO USER DASHBOARD");

        router.replace("/user");
        return;
      }

      /*
       * Unknown role
       */
      console.log("UNKNOWN ROLE:", role);

      Alert.alert(
        "Login Error",
        `Unknown role received from server: ${
          role || "No role received"
        }`
      );
    } catch (error) {
      console.log(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Login Failed",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Ticket Management System
      </Text>

      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f6fa",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});