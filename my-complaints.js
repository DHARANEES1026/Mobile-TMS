import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import axios from "axios";
import { useFocusEffect } from "expo-router";

import { useAuth } from "../../src/context/AuthContext";

export default function MyComplaints() {
  const { user } = useAuth();

  const API_URL = "http://192.168.203.223:5000/api";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ==============================
     FETCH MY COMPLAINTS
  ============================== */

  const fetchMyComplaints = async () => {
    if (!user?.token) {
      Alert.alert("Error", "Please login again");
      return;
    }

    try {
      setLoading(true);

      console.log("====================================");
      console.log("FETCH MY COMPLAINTS");
      console.log("====================================");

      console.log("URL:", `${API_URL}/complaint`);
      console.log("TOKEN EXISTS:", !!user.token);

      const response = await axios.get(
        `${API_URL}/complaint`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("COMPLAINT RESPONSE:");
      console.log(response.data);

      /*
        Backend may return either:
        1. an array
        2. { complaints: [...] }
      */

      if (Array.isArray(response.data)) {
        setComplaints(response.data);
      } else if (Array.isArray(response.data?.complaints)) {
        setComplaints(response.data.complaints);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.log("====================================");
      console.log("FETCH COMPLAINT ERROR");
      console.log("====================================");

      console.log(
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Unable to load complaints"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ==============================
     LOAD WHEN SCREEN OPENS
  ============================== */

  useFocusEffect(
    useCallback(() => {
      fetchMyComplaints();
    }, [user?.token])
  );

  /* ==============================
     REFRESH
  ============================== */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyComplaints();
  };

  /* ==============================
     GET NAME
  ============================== */

  const getName = (value, field) => {
    if (!value) {
      return "N/A";
    }

    if (typeof value === "object") {
      return value[field] || value.name || "N/A";
    }

    return String(value);
  };

  /* ==============================
     COMPLAINT CARD
  ============================== */

  const renderComplaint = ({ item }) => {
    return (
      <View style={styles.card}>

        <View style={styles.row}>
          <Text style={styles.label}>
            Complaint Type:
          </Text>

          <Text style={styles.value}>
            {item.complaintType || "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Description:
          </Text>

          <Text style={styles.value}>
            {item.description || "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Department:
          </Text>

          <Text style={styles.value}>
            {getName(
              item.department,
              "departmentName"
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Programme:
          </Text>

          <Text style={styles.value}>
            {getName(
              item.programme,
              "programmeName"
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Block:
          </Text>

          <Text style={styles.value}>
            {getName(
              item.block,
              "blockName"
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Room:
          </Text>

          <Text style={styles.value}>
            {getName(
              item.room,
              "roomNumber"
            )}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>
            Status
          </Text>

          <Text
            style={[
              styles.status,
              item.status === "Completed"
                ? styles.completed
                : item.status === "In Progress"
                ? styles.inProgress
                : item.status === "Assigned"
                ? styles.assigned
                : styles.pending,
            ]}
          >
            {item.status || "Pending"}
          </Text>
        </View>

        {item.assignedTo && (
          <View style={styles.assignedContainer}>
            <Text style={styles.label}>
              Assigned To:
            </Text>

            <Text style={styles.value}>
              {typeof item.assignedTo === "object"
                ? item.assignedTo.userName ||
                  item.assignedTo.email ||
                  "Staff"
                : String(item.assignedTo)}
            </Text>
          </View>
        )}

      </View>
    );
  };

  /* ==============================
     UI
  ============================== */

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        My Complaint Status
      </Text>

      {loading && complaints.length === 0 ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item, index) =>
            item._id || index.toString()
          }
          renderItem={renderComplaint}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>

              <Text style={styles.emptyTitle}>
                No Complaints Found
              </Text>

              <Text style={styles.emptyText}>
                You have not submitted any complaints yet.
              </Text>

              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchMyComplaints}
              >
                <Text style={styles.refreshText}>
                  Refresh
                </Text>
              </TouchableOpacity>

            </View>
          }
          contentContainerStyle={
            complaints.length === 0
              ? styles.emptyList
              : styles.list
          }
        />
      )}

    </View>
  );
}

/* ==============================
   STYLES
============================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#222",
  },

  loader: {
    marginTop: 30,
  },

  list: {
    paddingBottom: 20,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,

    borderWidth: 1,
    borderColor: "#ddd",

    elevation: 2,
  },

  row: {
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 2,
  },

  value: {
    fontSize: 15,
    color: "#222",
  },

  statusContainer: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  statusLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },

  status: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontWeight: "bold",
  },

  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },

  assigned: {
    backgroundColor: "#cfe2ff",
    color: "#084298",
  },

  inProgress: {
    backgroundColor: "#cff4fc",
    color: "#055160",
  },

  completed: {
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
  },

  assignedContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },

  refreshButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  refreshText: {
    color: "#fff",
    fontWeight: "bold",
  },
});