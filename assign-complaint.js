import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";

import axios from "axios";
import { useFocusEffect } from "expo-router";

import { useAuth } from "../../src/context/AuthContext";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "http://192.168.203.223:5000/api";

// =====================================================
// ASSIGN COMPLAINT SCREEN
// =====================================================

const AssignComplaint = () => {
  const { user } = useAuth();

  // ---------------------------------------------------
  // STATES
  // ---------------------------------------------------

  const [complaints, setComplaints] =
    useState([]);

  const [staffUsers, setStaffUsers] =
    useState([]);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [assigning, setAssigning] =
    useState(false);

  // =====================================================
  // LOAD COMPLAINTS AND STAFF
  // =====================================================

  const loadData = async () => {
    if (!user?.token) {
      console.log(
        "No authentication token"
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "===================================="
      );

      console.log(
        "LOADING ASSIGN COMPLAINT DATA"
      );

      console.log(
        "===================================="
      );

      console.log(
        "API URL:",
        API_URL
      );

      // -------------------------------------------------
      // AUTH CONFIG
      // -------------------------------------------------

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type":
            "application/json",
        },
      };

      // =================================================
      // GET COMPLAINTS
      // =================================================

      console.log(
        "GET:",
        `${API_URL}/complaint`
      );

      const complaintResponse =
        await axios.get(
          `${API_URL}/complaint`,
          config
        );

      console.log(
        "COMPLAINT RESPONSE:",
        complaintResponse.data
      );

      let complaintData = [];

      if (
        Array.isArray(
          complaintResponse.data
        )
      ) {
        complaintData =
          complaintResponse.data;
      } else if (
        Array.isArray(
          complaintResponse.data?.complaints
        )
      ) {
        complaintData =
          complaintResponse.data.complaints;
      }

      // =================================================
      // GET STAFF
      // =================================================

      console.log(
        "GET:",
        `${API_URL}/users/staff`
      );

      const staffResponse =
        await axios.get(
          `${API_URL}/users/staff`,
          config
        );

      console.log(
        "STAFF RESPONSE:",
        staffResponse.data
      );

      let staffData = [];

      if (
        Array.isArray(
          staffResponse.data
        )
      ) {
        staffData =
          staffResponse.data;
      } else if (
        Array.isArray(
          staffResponse.data?.staff
        )
      ) {
        staffData =
          staffResponse.data.staff;
      } else if (
        Array.isArray(
          staffResponse.data?.users
        )
      ) {
        staffData =
          staffResponse.data.users;
      }

      console.log(
        "TOTAL COMPLAINTS:",
        complaintData.length
      );

      console.log(
        "TOTAL STAFF:",
        staffData.length
      );

      setComplaints(
        complaintData
      );

      setStaffUsers(
        staffData
      );

    } catch (error) {
      console.log(
        "===================================="
      );

      console.log(
        "LOAD DATA ERROR"
      );

      console.log(
        "===================================="
      );

      console.log(
        "Status:",
        error.response?.status
      );

      console.log(
        "Response:",
        error.response?.data
      );

      console.log(
        "Message:",
        error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Unable to load complaints and staff"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA WHEN SCREEN OPENS
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.token])
  );

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadData();

    } finally {
      setRefreshing(false);
    }
  };

  // =====================================================
  // GET STAFF NAME
  // =====================================================

  const getStaffName = (staff) => {
    if (!staff) {
      return "Unknown Staff";
    }

    return (
      staff.userName ||
      staff.name ||
      staff.email ||
      "Unknown Staff"
    );
  };

  // =====================================================
  // GET COMPLAINT TYPE
  // =====================================================

  const getComplaintType = (
    complaint
  ) => {
    return (
      complaint?.complaintType ||
      "Unknown Complaint"
    );
  };

  // =====================================================
  // GET DESCRIPTION
  // =====================================================

  const getDescription = (
    complaint
  ) => {
    return (
      complaint?.description ||
      "No description"
    );
  };

  // =====================================================
  // GET ASSIGNED STAFF NAME
  // =====================================================

  const getAssignedStaff = (
    complaint
  ) => {
    if (
      !complaint?.assignedTo
    ) {
      return "Not Assigned";
    }

    // If populated object
    if (
      typeof complaint.assignedTo ===
      "object"
    ) {
      return getStaffName(
        complaint.assignedTo
      );
    }

    // If only ObjectId is returned
    const staff =
      staffUsers.find(
        (item) =>
          item._id ===
          complaint.assignedTo
      );

    if (staff) {
      return getStaffName(
        staff
      );
    }

    return "Assigned Staff";
  };

  // =====================================================
  // ASSIGN COMPLAINT
  // =====================================================

  const assignComplaint = async (
    complaintId,
    staffId,
    staffName
  ) => {
    console.log(
      "===================================="
    );

    console.log(
      "ASSIGN COMPLAINT FUNCTION CALLED"
    );

    console.log(
      "===================================="
    );

    console.log(
      "Complaint ID:",
      complaintId
    );

    console.log(
      "Staff ID:",
      staffId
    );

    console.log(
      "Staff Name:",
      staffName
    );

    console.log(
      "API URL:",
      API_URL
    );

    // -------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------

    if (!user?.token) {
      console.log(
        "ERROR: No login token"
      );

      Alert.alert(
        "Error",
        "Please login again"
      );

      return;
    }

    // -------------------------------------------------
    // CHECK COMPLAINT ID
    // -------------------------------------------------

    if (!complaintId) {
      console.log(
        "ERROR: Complaint ID missing"
      );

      Alert.alert(
        "Error",
        "Complaint ID is missing"
      );

      return;
    }

    // -------------------------------------------------
    // CHECK STAFF ID
    // -------------------------------------------------

    if (!staffId) {
      console.log(
        "ERROR: Staff ID missing"
      );

      Alert.alert(
        "Error",
        "Staff ID is missing"
      );

      return;
    }

    try {
      setAssigning(true);

      const url =
        `${API_URL}/complaint/${complaintId}/assign`;

      console.log(
        "PUT REQUEST URL:",
        url
      );

      console.log(
        "REQUEST BODY:",
        {
          assignedTo: staffId,
        }
      );

      // =================================================
      // ASSIGN API REQUEST
      // =================================================

      const response =
        await axios.put(
          url,
          {
            assignedTo: staffId,
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

      console.log(
        "===================================="
      );

      console.log(
        "ASSIGN API SUCCESS"
      );

      console.log(
        "===================================="
      );

      console.log(
        "STATUS:",
        response.status
      );

      console.log(
        "RESPONSE:",
        response.data
      );

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      Alert.alert(
        "Success",
        `Complaint assigned to ${staffName}`
      );

      // -------------------------------------------------
      // Close staff list
      // -------------------------------------------------

      setSelectedComplaint(
        null
      );

      // -------------------------------------------------
      // Reload data
      // -------------------------------------------------

      await loadData();

    } catch (error) {
      console.log(
        "===================================="
      );

      console.log(
        "ASSIGN COMPLAINT ERROR"
      );

      console.log(
        "===================================="
      );

      console.log(
        "URL:",
        `${API_URL}/complaint/${complaintId}/assign`
      );

      console.log(
        "Status:",
        error.response?.status
      );

      console.log(
        "Response:",
        error.response?.data
      );

      console.log(
        "Message:",
        error.message
      );

      Alert.alert(
        "Assignment Failed",
        error.response?.data?.msg ||
          error.response?.data?.message ||
          error.message ||
          "Unable to assign complaint"
      );

    } finally {
      setAssigning(false);
    }
  };

  // =====================================================
  // CONFIRM ASSIGNMENT
  // =====================================================

  const confirmAssignment = (
    complaintId,
    staffId,
    staffName
  ) => {
    console.log(
      "===================================="
    );

    console.log(
      "CONFIRM ASSIGNMENT"
    );

    console.log(
      "===================================="
    );

    console.log(
      "Complaint ID:",
      complaintId
    );

    console.log(
      "Staff ID:",
      staffId
    );

    console.log(
      "Staff Name:",
      staffName
    );

    Alert.alert(
      "Assign Complaint",
      `Do you want to assign this complaint to ${staffName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",

          onPress: () => {
            console.log(
              "Assignment cancelled"
            );
          },
        },

        {
          text: "Assign",

          onPress: () => {
            console.log(
              "ASSIGN CONFIRMED"
            );

            assignComplaint(
              complaintId,
              staffId,
              staffName
            );
          },
        },
      ]
    );
  };

  // =====================================================
  // SELECT COMPLAINT
  // =====================================================

  const handleSelectComplaint = (
    complaint
  ) => {
    console.log(
      "SELECTED COMPLAINT:",
      complaint._id
    );

    if (
      selectedComplaint?._id ===
      complaint._id
    ) {
      setSelectedComplaint(
        null
      );
    } else {
      setSelectedComplaint(
        complaint
      );
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading complaints...
        </Text>
      </View>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={
            handleRefresh
          }
        />
      }
    >
      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <Text style={styles.title}>
        Assign Complaints
      </Text>

      {/* =================================================
          NO COMPLAINTS
      ================================================= */}

      {complaints.length ===
      0 ? (
        <View
          style={
            styles.emptyContainer
          }
        >
          <Text
            style={
              styles.emptyText
            }
          >
            No complaints found
          </Text>
        </View>
      ) : (
        complaints.map(
          (complaint) => {
            const isSelected =
              selectedComplaint?._id ===
              complaint._id;

            return (
              <View
                key={
                  complaint._id
                }
                style={
                  styles.complaintCard
                }
              >
                {/* =========================================
                    COMPLAINT TYPE
                ========================================== */}

                <Text
                  style={
                    styles.complaintTitle
                  }
                >
                  {getComplaintType(
                    complaint
                  )}
                </Text>

                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <Text
                  style={
                    styles.label
                  }
                >
                  Description
                </Text>

                <Text
                  style={
                    styles.description
                  }
                >
                  {getDescription(
                    complaint
                  )}
                </Text>

                {/* =========================================
                    STATUS
                ========================================== */}

                <Text
                  style={
                    styles.label
                  }
                >
                  Status
                </Text>

                <View
                  style={[
                    styles.statusBadge,

                    complaint.status ===
                      "Assigned" &&
                      styles.assignedBadge,

                    complaint.status ===
                      "In Progress" &&
                      styles.progressBadge,

                    complaint.status ===
                      "Completed" &&
                      styles.completedBadge,
                  ]}
                >
                  <Text
                    style={
                      styles.statusText
                    }
                  >
                    {complaint.status ||
                      "Pending"}
                  </Text>
                </View>

                {/* =========================================
                    ASSIGNED STAFF
                ========================================== */}

                <Text
                  style={
                    styles.label
                  }
                >
                  Assigned To
                </Text>

                <Text
                  style={
                    styles.assignedStaff
                  }
                >
                  {getAssignedStaff(
                    complaint
                  )}
                </Text>

                {/* =========================================
                    ASSIGN COMPLAINT BUTTON
                ========================================== */}

                <TouchableOpacity
                  style={
                    styles.assignMainButton
                  }
                  onPress={() => {
                    console.log(
                      "===================================="
                    );

                    console.log(
                      "ASSIGN COMPLAINT BUTTON CLICKED"
                    );

                    console.log(
                      "===================================="
                    );

                    console.log(
                      "Complaint ID:",
                      complaint._id
                    );

                    handleSelectComplaint(
                      complaint
                    );
                  }}
                >
                  <Text
                    style={
                      styles.assignMainButtonText
                    }
                  >
                    {isSelected
                      ? "Hide Staff"
                      : "Assign Complaint"}
                  </Text>
                </TouchableOpacity>

                {/* =========================================
                    STAFF LIST
                ========================================== */}

                {isSelected && (
                  <View
                    style={
                      styles.staffContainer
                    }
                  >
                    <Text
                      style={
                        styles.staffTitle
                      }
                    >
                      Select Staff
                    </Text>

                    {staffUsers.length ===
                    0 ? (
                      <Text
                        style={
                          styles.noStaffText
                        }
                      >
                        No staff members found
                      </Text>
                    ) : (
                      staffUsers.map(
                        (staff) => {
                          const staffName =
                            getStaffName(
                              staff
                            );

                          const isAlreadyAssigned =
                            complaint.assignedTo &&
                            typeof complaint.assignedTo ===
                              "object" &&
                            complaint.assignedTo
                              ._id ===
                              staff._id;

                          return (
                            <View
                              key={
                                staff._id
                              }
                              style={
                                styles.staffCard
                              }
                            >
                              {/* ==========================
                                  STAFF INFORMATION
                              =========================== */}

                              <View
                                style={
                                  styles.staffInfo
                                }
                              >
                                <Text
                                  style={
                                    styles.staffName
                                  }
                                >
                                  {
                                    staffName
                                  }
                                </Text>

                                {staff.email && (
                                  <Text
                                    style={
                                      styles.staffEmail
                                    }
                                  >
                                    {
                                      staff.email
                                    }
                                  </Text>
                                )}

                                {staff.phoneNumber && (
                                  <Text
                                    style={
                                      styles.staffPhone
                                    }
                                  >
                                    {
                                      staff.phoneNumber
                                    }
                                  </Text>
                                )}
                              </View>

                              {/* ==========================
                                  ASSIGN TO STAFF BUTTON
                              =========================== */}

                              <TouchableOpacity
                                style={[
                                  styles.assignStaffButton,

                                  isAlreadyAssigned &&
                                    styles.assignedButton,
                                ]}
                                disabled={
                                  assigning
                                }
                                onPress={() => {
                                  console.log(
                                    "===================================="
                                  );

                                  console.log(
                                    "ASSIGN TO THIS STAFF BUTTON CLICKED"
                                  );

                                  console.log(
                                    "===================================="
                                  );

                                  console.log(
                                    "Complaint ID:",
                                    complaint._id
                                  );

                                  console.log(
                                    "Staff ID:",
                                    staff._id
                                  );

                                  console.log(
                                    "Staff Name:",
                                    staffName
                                  );

                                  // ---------------------------------
                                  // DO NOT depend on another button
                                  // ---------------------------------

                                  confirmAssignment(
                                    complaint._id,
                                    staff._id,
                                    staffName
                                  );
                                }}
                              >
                                {assigning ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                  />
                                ) : (
                                  <Text
                                    style={
                                      styles.assignStaffButtonText
                                    }
                                  >
                                    {isAlreadyAssigned
                                      ? "Assigned"
                                      : "Assign to This Staff"}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            </View>
                          );
                        }
                      )
                    )}
                  </View>
                )}
              </View>
            );
          }
        )
      )}
    </ScrollView>
  );
};

export default AssignComplaint;

// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },

    contentContainer: {
      padding: 16,
      paddingBottom: 50,
    },

    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#222",
      marginBottom: 20,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },

    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: "#555",
    },

    emptyContainer: {
      backgroundColor: "#fff",
      padding: 30,
      borderRadius: 10,
      alignItems: "center",
    },

    emptyText: {
      fontSize: 16,
      color: "#777",
    },

    complaintCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,

      elevation: 4,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    complaintTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#222",
      marginBottom: 12,
    },

    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#555",
      marginTop: 10,
      marginBottom: 5,
    },

    description: {
      fontSize: 15,
      color: "#333",
      lineHeight: 22,
    },

    statusBadge: {
      alignSelf: "flex-start",
      backgroundColor: "#f0ad4e",
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
    },

    assignedBadge: {
      backgroundColor: "#28a745",
    },

    progressBadge: {
      backgroundColor: "#007bff",
    },

    completedBadge: {
      backgroundColor: "#198754",
    },

    statusText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 13,
    },

    assignedStaff: {
      fontSize: 15,
      color: "#333",
      marginBottom: 5,
    },

    assignMainButton: {
      backgroundColor: "#007bff",
      paddingVertical: 13,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 15,
    },

    assignMainButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },

    staffContainer: {
      marginTop: 18,
      paddingTop: 16,

      borderTopWidth: 1,
      borderTopColor: "#ddd",
    },

    staffTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#222",
      marginBottom: 12,
    },

    noStaffText: {
      textAlign: "center",
      color: "#777",
      padding: 15,
    },

    staffCard: {
      backgroundColor: "#f8f9fa",

      borderWidth: 1,
      borderColor: "#ddd",

      borderRadius: 9,

      padding: 13,

      marginBottom: 12,
    },

    staffInfo: {
      marginBottom: 12,
    },

    staffName: {
      fontSize: 17,
      fontWeight: "bold",
      color: "#222",
    },

    staffEmail: {
      fontSize: 13,
      color: "#666",
      marginTop: 4,
    },

    staffPhone: {
      fontSize: 13,
      color: "#666",
      marginTop: 3,
    },

    assignStaffButton: {
      backgroundColor: "#28a745",

      paddingVertical: 12,

      borderRadius: 7,

      alignItems: "center",

      justifyContent: "center",
    },

    assignedButton: {
      backgroundColor: "#6c757d",
    },

    assignStaffButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
  });