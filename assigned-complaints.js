import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import axios from "axios";

import { useAuth } from "../../src/context/AuthContext";


export default function AssignedComplaints() {

  const { user } = useAuth();

  const API_URL =
    "http://192.168.203.223:5000/api";

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);


  // =====================================================
  // GET ASSIGNED COMPLAINTS
  // =====================================================
  const fetchAssignedComplaints = async () => {

    if (!user?.token) {

      Alert.alert(
        "Login Required",
        "Please login again."
      );

      return;
    }

    try {

      setLoading(true);

      console.log(
        "===================================="
      );

      console.log(
        "GET ASSIGNED COMPLAINTS"
      );

      console.log(
        "TOKEN EXISTS:",
        !!user.token
      );

      console.log(
        "API:",
        `${API_URL}/complaint`
      );

      console.log(
        "===================================="
      );


      const response = await axios.get(
        `${API_URL}/complaint`,
        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );


      console.log(
        "STAFF COMPLAINT RESPONSE:"
      );

      console.log(response.data);


      let data = [];


      if (Array.isArray(response.data)) {

        data = response.data;

      } else if (
        Array.isArray(
          response.data?.complaints
        )
      ) {

        data =
          response.data.complaints;

      }


      console.log(
        "ASSIGNED COMPLAINT COUNT:",
        data.length
      );


      setComplaints(data);

    } catch (error) {

      console.log(
        "GET ASSIGNED COMPLAINTS ERROR:"
      );

      console.log(
        error.response?.data ||
        error.message
      );


      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Unable to load assigned complaints"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // SCREEN FOCUS
  // =====================================================
  useFocusEffect(
    useCallback(() => {

      fetchAssignedComplaints();

    }, [user?.token])
  );


  // =====================================================
  // REFRESH
  // =====================================================
  const onRefresh = async () => {

    setRefreshing(true);

    await fetchAssignedComplaints();

    setRefreshing(false);
  };


  // =====================================================
  // UPDATE STATUS
  // =====================================================
  const updateStatus = async (
    complaintId,
    status
  ) => {

    if (!user?.token) {
      return;
    }

    try {

      const response =
        await axios.put(
          `${API_URL}/complaint/${complaintId}/status`,
          {
            status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      Alert.alert(
        "Success",
        response.data?.msg ||
          "Status updated successfully"
      );


      fetchAssignedComplaints();

    } catch (error) {

      console.log(
        "UPDATE STATUS ERROR:",
        error.response?.data ||
          error.message
      );


      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          "Unable to update status"
      );
    }
  };


  // =====================================================
  // COMPLAINT CARD
  // =====================================================
  const renderComplaint = ({
    item,
  }) => {

    const userName =
      item.user?.userName ||
      item.user?.name ||
      "Unknown User";


    const department =
      item.department?.departmentName ||
      "-";


    const programme =
      item.programme?.programmeName ||
      "-";


    const block =
      item.block?.blockName ||
      "-";


    const room =
      item.room?.roomNumber ||
      "-";


    return (

      <View style={styles.card}>

        <Text style={styles.title}>
          {item.complaintType ||
            "Complaint"}
        </Text>


        <View style={styles.row}>

          <Text style={styles.label}>
            Raised By:
          </Text>

          <Text style={styles.value}>
            {userName}
          </Text>

        </View>


        <View style={styles.row}>

          <Text style={styles.label}>
            Description:
          </Text>

          <Text style={styles.value}>
            {item.description ||
              "-"}
          </Text>

        </View>


        <View style={styles.row}>

          <Text style={styles.label}>
            Department:
          </Text>

          <Text style={styles.value}>
            {department}
          </Text>

        </View>


        <View style={styles.row}>

          <Text style={styles.label}>
            Programme:
          </Text>

          <Text style={styles.value}>
            {programme}
          </Text>

        </View>


        <View style={styles.row}>

          <Text style={styles.label}>
            Block:
          </Text>

          <Text style={styles.value}>
            {block}
          </Text>

        </View>


        <View style={styles.row}>

          <Text style={styles.label}>
            Room:
          </Text>

          <Text style={styles.value}>
            {room}
          </Text>

        </View>


        <View style={styles.row}>

          <Text style={styles.label}>
            Status:
          </Text>

          <Text
            style={[
              styles.status,
              item.status ===
                "Completed"
                ? styles.completed
                : styles.pending,
            ]}
          >
            {item.status ||
              "Pending"}
          </Text>

        </View>


        <Text style={styles.updateTitle}>
          Update Status
        </Text>


        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={styles.statusButton}
            onPress={() =>
              updateStatus(
                item._id,
                "In Progress"
              )
            }
          >

            <Text
              style={styles.buttonText}
            >
              In Progress
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.statusButton}
            onPress={() =>
              updateStatus(
                item._id,
                "On Hold"
              )
            }
          >

            <Text
              style={styles.buttonText}
            >
              On Hold
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.completeButton}
            onPress={() =>
              updateStatus(
                item._id,
                "Completed"
              )
            }
          >

            <Text
              style={styles.buttonText}
            >
              Completed
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    );
  };


  // =====================================================
  // LOADING
  // =====================================================
  if (
    loading &&
    complaints.length === 0
  ) {

    return (

      <View style={styles.center}>

        <ActivityIndicator
          size="large"
        />

        <Text style={styles.loadingText}>
          Loading assigned complaints...
        </Text>

      </View>

    );
  }


  // =====================================================
  // MAIN SCREEN
  // =====================================================
  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Assigned Complaints
        </Text>

        <Text style={styles.count}>
          Total: {complaints.length}
        </Text>

      </View>


      {complaints.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyTitle}>
            No Assigned Complaints
          </Text>

          <Text style={styles.emptyText}>
            Complaints assigned to you
            will appear here.
          </Text>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={
              fetchAssignedComplaints
            }
          >

            <Text
              style={styles.refreshText}
            >
              Refresh
            </Text>

          </TouchableOpacity>

        </View>

      ) : (

        <FlatList
          data={complaints}
          keyExtractor={(item) =>
            item._id
          }
          renderItem={
            renderComplaint
          }
          contentContainerStyle={
            styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />

      )}

    </View>

  );
}


// =====================================================
// STYLES
// =====================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  count: {
    marginTop: 5,
    fontSize: 15,
    color: "#666",
  },

  list: {
    padding: 15,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },

  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },

  label: {
    width: 110,
    fontWeight: "bold",
    color: "#444",
  },

  value: {
    flex: 1,
    color: "#333",
  },

  status: {
    fontWeight: "bold",
  },

  pending: {
    color: "#e67e22",
  },

  completed: {
    color: "#27ae60",
  },

  updateTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  statusButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  completeButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  refreshButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },

  refreshText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

});