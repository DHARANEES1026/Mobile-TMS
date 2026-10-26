import React from "react";
import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Admin Dashboard",
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="departments"
        options={{
          title: "Departments",
        }}
      />

      <Stack.Screen
        name="programmes"
        options={{
          title: "Programmes",
        }}
      />

      <Stack.Screen
        name="blocks"
        options={{
          title: "Blocks",
        }}
      />

      <Stack.Screen
        name="rooms"
        options={{
          title: "Rooms",
        }}
      />

      <Stack.Screen
        name="users"
        options={{
          title: "Users",
        }}
      />

      <Stack.Screen
        name="assign-complaint"
        options={{
          title: "Assign Complaint",
        }}
      />

      <Stack.Screen
        name="complaint-report"
        options={{
          title: "Complaint Report",
        }}
      />
    </Stack>
  );
}