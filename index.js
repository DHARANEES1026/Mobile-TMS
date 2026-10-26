import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";

import { useRouter } from "expo-router";
import Header from "../../src/components/Header";

export default function AdminDashboard() {
  const router = useRouter();

  const menu = [
    ["Departments", "/admin/departments"],
    ["Programmes", "/admin/programmes"],
    ["Blocks", "/admin/blocks"],
    ["Rooms", "/admin/rooms"],
    ["Users", "/admin/users"],
    ["Assign Complaint", "/admin/assign-complaint"],
    ["Complaint Report", "/admin/complaint-report"]
  ];

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          Admin Dashboard
        </Text>

        {menu.map(([title, path]) => (
          <TouchableOpacity
            key={path}
            style={styles.button}
            onPress={() => router.push(path)}
          >
            <Text style={styles.buttonText}>
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  content: {
    padding: 20
  },

  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20
  },

  button: {
    backgroundColor: "#1976D2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold"
  }
});