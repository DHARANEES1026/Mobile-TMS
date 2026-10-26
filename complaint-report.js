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

export default function ComplaintReport() {
  const { user } = useAuth();

  const API_URL = "http://192.168.203.223:5000/api";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ==============================
     FETCH ALL COMPLAINTS
  ============================== */

  const fetchComplaints = async () => {
    if (!user?.token) {
      Alert.alert("Error", "Please login again");
      return;
    }

    try {
      setLoading(true);

      console.log("====================================");
      console.log("ADMIN COMPLAINT REPORT");
      console.log("====================================");

      console.log(
        "URL:",
        `${API_URL}/complaint`
      );

      console.log(
        "TOKEN EXISTS:",
        !!user.token
      );

      const response = await axios.get(
        `${API_URL}/complaint`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("COMPLAINT REPORT RESPONSE:");
      console.log(response.data);

      /*
        Backend may return:

        {
          complaints: [...]
        }

        OR directly:

        [...]
      */

      if (Array.isArray(response.data)) {
        setComplaints(response.data);
      } else if (
        Array.isArray(response.data?.complaints)
      ) {
        setComplaints(
          response.data.complaints
        );
      } else {
        setComplaints([]);
      }

    } catch (error) {
      console.log("====================================");
      console.log("COMPLAINT REPORT ERROR");
      console.log("====================================");

      console.log(
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Unable to load complaint report"
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
      fetchComplaints();
    }, [user?.token])
  );

  /* ==============================
     REFRESH
  ============================== */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  /* ==============================
     GET FIELD NAME
  ============================== */

  const getFieldName = (
    value,
    possibleFields
  ) => {
    if (!value) {
      return "N/A";
    }

    if (typeof value === "object") {
      for (const field of possibleFields) {
        if (value[field]) {
          return value[field];
        }
      }

      return "N/A";
    }

    return String(value);
  };

  /* ==============================
     GET USER NAME
  ============================== */

  const getUserName = (value) => {
    if (!value) {
      return "N/A";
    }

    if (typeof value === "object") {
      return (
        value.userName ||
        value.name ||
        value.email ||
        "N/A"
      );
    }

    return String(value);
  };

  /* ==============================
     COMPLAINT CARD
  ============================== */

  const renderComplaint = ({ item, index }) => {
    return (
      <View style={styles.card}>

        {/* COMPLAINT NUMBER */}

        <View style={styles.headerRow}>

          <Text style={styles.complaintNumber}>
            Complaint #{index + 1}
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

        {/* USER */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Raised By
          </Text>

          <Text style={styles.value}>
            {getUserName(item.user)}
          </Text>
        </View>

        {/* COMPLAINT TYPE */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Complaint Type
          </Text>

          <Text style={styles.value}>
            {item.complaintType || "N/A"}
          </Text>
        </View>

        {/* DESCRIPTION */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Description
          </Text>

          <Text style={styles.value}>
            {item.description || "N/A"}
          </Text>
        </View>

        {/* DEPARTMENT */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Department
          </Text>

          <Text style={styles.value}>
            {getFieldName(
              item.department,
              [
                "departmentName",
                "name",
              ]
            )}
          </Text>
        </View>

        {/* PROGRAMME */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Programme
          </Text>

          <Text style={styles.value}>
            {getFieldName(
              item.programme,
              [
                "programmeName",
                "name",
              ]
            )}
          </Text>
        </View>

        {/* BLOCK */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Block
          </Text>

          <Text style={styles.value}>
            {getFieldName(
              item.block,
              [
                "blockName",
                "name",
              ]
            )}
          </Text>
        </View>

        {/* ROOM */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Room
          </Text>

          <Text style={styles.value}>
            {getFieldName(
              item.room,
              [
                "roomNumber",
                "name",
              ]
            )}
          </Text>
        </View>

        {/* ASSIGNED STAFF */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Assigned Staff
          </Text>

          <Text style={styles.value}>
            {getUserName(
              item.assignedTo
            )}
          </Text>
        </View>

        {/* DATE */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Created Date
          </Text>

          <Text style={styles.value}>
            {item.createdAt
              ? new Date(
                  item.createdAt
                ).toLocaleString()
              : "N/A"}
          </Text>
        </View>

      </View>
    );
  };

  /* ==============================
     UI
  ============================== */

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Complaint Report
      </Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>
          Total Complaints
        </Text>

        <Text style={styles.summaryNumber}>
          {complaints.length}
        </Text>
      </View>

      {loading &&
      complaints.length === 0 ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item, index) =>
            item._id ||
            index.toString()
          }
          renderItem={renderComplaint}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <View
              style={
                styles.emptyContainer
              }
            >
              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Complaints Found
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                There are no complaints
                available in the system.
              </Text>

              <TouchableOpacity
                style={
                  styles.refreshButton
                }
                onPress={
                  fetchComplaints
                }
              >
                <Text
                  style={
                    styles.refreshText
                  }
                >
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
    color: "#222",
    marginBottom: 15,
  },

  summaryBox: {
    backgroundColor: "#1976D2",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },

  summaryLabel: {
    color: "#fff",
    fontSize: 15,
  },

  summaryNumber: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  complaintNumber: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },

  status: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontWeight: "bold",
    overflow: "hidden",
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

  section: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 3,
  },

  value: {
    fontSize: 15,
    color: "#222",
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