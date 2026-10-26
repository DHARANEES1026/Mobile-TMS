import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { useAuth } from "../../src/context/AuthContext";

export default function Departments() {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentShortName, setDepartmentShortName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const API_URL = "http://192.168.203.223:5000/api";

  // ==============================
  // GET ALL DEPARTMENTS
  // ==============================
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setFetching(true);

      const response = await axios.get(
        `${API_URL}/departments`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("DEPARTMENTS:", response.data);

      setDepartments(response.data);
    } catch (error) {
      console.log(
        "GET DEPARTMENTS ERROR:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          "Unable to load departments"
      );
    } finally {
      setFetching(false);
    }
  };

  // ==============================
  // ADD DEPARTMENT
  // ==============================
  const addDepartment = async () => {
    if (!departmentName.trim() || !departmentShortName.trim()) {
      Alert.alert(
        "Error",
        "Please enter department name and short name"
      );
      return;
    }

    if (!user?.token) {
      Alert.alert(
        "Error",
        "Authentication token not found. Please login again."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/departments`,
        {
          departmentName: departmentName.trim(),
          departmentShortName: departmentShortName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "ADD DEPARTMENT RESPONSE:",
        response.data
      );

      Alert.alert(
        "Success",
        response.data?.msg || "Department added successfully"
      );

      // Clear input fields
      setDepartmentName("");
      setDepartmentShortName("");

      // Refresh department list
      fetchDepartments();
    } catch (error) {
      console.log(
        "ADD DEPARTMENT ERROR:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Unable to add department"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RENDER DEPARTMENT
  // ==============================
  const renderDepartment = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>
          {item.departmentName}
        </Text>

        <Text style={styles.shortName}>
          Short Name: {item.departmentShortName}
        </Text>
      </View>
    );
  };

  // ==============================
  // UI
  // ==============================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Department Management
      </Text>

      {/* Department Name */}
      <TextInput
        style={styles.input}
        placeholder="Department Name"
        value={departmentName}
        onChangeText={setDepartmentName}
      />

      {/* Short Name */}
      <TextInput
        style={styles.input}
        placeholder="Short Name"
        value={departmentShortName}
        onChangeText={setDepartmentShortName}
        autoCapitalize="characters"
      />

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={addDepartment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Adding..."
            : "Add Department"}
        </Text>
      </TouchableOpacity>

      {/* Department List */}
      {fetching ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(item) =>
            item._id.toString()
          }
          renderItem={renderDepartment}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No departments found
            </Text>
          }
          refreshing={fetching}
          onRefresh={fetchDepartments}
        />
      )}
    </View>
  );
}

// ==============================
// STYLES
// ==============================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  name: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },

  shortName: {
    fontSize: 15,
    color: "#555",
  },

  loader: {
    marginTop: 30,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    fontSize: 16,
  },
});