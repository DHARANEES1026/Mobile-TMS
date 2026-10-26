import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";


// ======================================================
// API URL
// ======================================================

const API_URL = "http://192.168.203.223:5000/api";


export default function Programmes() {

  // ====================================================
  // Form fields
  // ====================================================

  const [department, setDepartment] = useState("");

  const [programmeName, setProgrammeName] =
    useState("");

  const [programmeShortName, setProgrammeShortName] =
    useState("");


  // ====================================================
  // Data
  // ====================================================

  const [departments, setDepartments] =
    useState([]);

  const [programmes, setProgrammes] =
    useState([]);


  // ====================================================
  // Loading
  // ====================================================

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [loadingProgrammes, setLoadingProgrammes] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  // ====================================================
  // Get token
  // ====================================================

  const getToken = async () => {

    try {

      const savedUser =
        await AsyncStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      const user =
        JSON.parse(savedUser);

      return user.token || null;

    } catch (error) {

      console.log(
        "GET TOKEN ERROR:",
        error
      );

      return null;
    }
  };


  // ====================================================
  // Load Departments
  // ====================================================

  const loadDepartments = async () => {

    try {

      setLoadingDepartments(true);

      const token =
        await getToken();

      if (!token) {

        Alert.alert(
          "Login Required",
          "Please login again."
        );

        return;
      }


      console.log(
        "GET DEPARTMENTS:",
        `${API_URL}/departments`
      );


      const response =
        await axios.get(
          `${API_URL}/departments`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "DEPARTMENTS:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      if (
        Array.isArray(
          response.data
        )
      ) {

        setDepartments(
          response.data
        );

      } else {

        setDepartments([]);
      }


    } catch (error) {

      console.log(
        "LOAD DEPARTMENTS ERROR:",
        error.response?.data ||
        error.message
      );


      Alert.alert(
        "Error",
        "Unable to load departments."
      );

    } finally {

      setLoadingDepartments(false);
    }
  };


  // ====================================================
  // Load Programmes
  // ====================================================

  const loadProgrammes = async () => {

    try {

      setLoadingProgrammes(true);

      const token =
        await getToken();

      if (!token) {

        Alert.alert(
          "Login Required",
          "Please login again."
        );

        return;
      }


      console.log(
        "GET PROGRAMMES:",
        `${API_URL}/programme`
      );


      const response =
        await axios.get(
          `${API_URL}/programme`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "PROGRAMMES:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      if (
        Array.isArray(
          response.data
        )
      ) {

        setProgrammes(
          response.data
        );

      } else {

        setProgrammes([]);
      }


    } catch (error) {

      console.log(
        "LOAD PROGRAMMES ERROR:",
        error.response?.data ||
        error.message
      );


      Alert.alert(
        "Error",
        "Unable to load programmes."
      );

    } finally {

      setLoadingProgrammes(false);
    }
  };


  // ====================================================
  // Load data when page opens
  // ====================================================

  useEffect(() => {

    loadDepartments();

    loadProgrammes();

  }, []);


  // ====================================================
  // Add Programme
  // ====================================================

  const handleAddProgramme = async () => {

    // -----------------------------------------------
    // Validate Department
    // -----------------------------------------------

    if (!department) {

      Alert.alert(
        "Error",
        "Please select a department."
      );

      return;
    }


    // -----------------------------------------------
    // Validate Programme Name
    // -----------------------------------------------

    if (!programmeName.trim()) {

      Alert.alert(
        "Error",
        "Please enter programme name."
      );

      return;
    }


    // -----------------------------------------------
    // Validate Short Name
    // -----------------------------------------------

    if (!programmeShortName.trim()) {

      Alert.alert(
        "Error",
        "Please enter programme short name."
      );

      return;
    }


    try {

      setSaving(true);


      const token =
        await getToken();


      if (!token) {

        Alert.alert(
          "Login Required",
          "Please login again."
        );

        return;
      }


      // ---------------------------------------------
      // Request data
      // ---------------------------------------------

      const programmeData = {

        department: department,

        programmeName:
          programmeName.trim(),

        programmeShortName:
          programmeShortName.trim(),

      };


      console.log(
        "CREATE PROGRAMME DATA:",
        JSON.stringify(
          programmeData,
          null,
          2
        )
      );


      // ---------------------------------------------
      // Create Programme
      // ---------------------------------------------

      const response =
        await axios.post(
          `${API_URL}/programme`,
          programmeData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      console.log(
        "CREATE PROGRAMME RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      Alert.alert(
        "Success",
        "Programme created successfully."
      );


      // ---------------------------------------------
      // Clear form
      // ---------------------------------------------

      setDepartment("");

      setProgrammeName("");

      setProgrammeShortName("");


      // ---------------------------------------------
      // Reload programmes
      // ---------------------------------------------

      loadProgrammes();


    } catch (error) {

      console.log(
        "CREATE PROGRAMME ERROR"
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "SERVER RESPONSE:",
        error.response?.data
      );

      console.log(
        "ERROR:",
        error.message
      );


      const message =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Unable to create programme.";


      Alert.alert(
        "Error",
        message
      );

    } finally {

      setSaving(false);
    }
  };


  // ====================================================
  // Get Department Name
  // ====================================================

  const getDepartmentName = (
    departmentData
  ) => {

    if (!departmentData) {
      return "N/A";
    }


    // If populated object
    if (
      typeof departmentData ===
      "object"
    ) {

      return (
        departmentData.departmentName ||
        "N/A"
      );
    }


    // If only ObjectId
    const foundDepartment =
      departments.find(
        (item) =>
          String(item._id) ===
          String(departmentData)
      );


    return (
      foundDepartment?.departmentName ||
      "N/A"
    );
  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <ScrollView
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
    >


      {/* =================================================
          TITLE
      ================================================= */}

      <Text style={styles.title}>
        Programme Management
      </Text>


      {/* =================================================
          ADD PROGRAMME CARD
      ================================================= */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Add Programme
        </Text>


        {/* ===============================================
            Department
        =============================================== */}

        <Text style={styles.label}>
          Department
        </Text>


        <View
          style={
            styles.pickerContainer
          }
        >

          {loadingDepartments ? (

            <ActivityIndicator
              style={styles.loader}
            />

          ) : (

            <Picker
              selectedValue={
                department
              }

              onValueChange={
                (value) =>
                  setDepartment(value)
              }
            >

              <Picker.Item
                label="Select Department"
                value=""
              />


              {departments.map(
                (item) => (

                  <Picker.Item
                    key={item._id}
                    label={
                      `${item.departmentName} (${item.departmentShortName})`
                    }
                    value={item._id}
                  />

                )
              )}

            </Picker>

          )}

        </View>


        {/* ===============================================
            Programme Name
        =============================================== */}

        <Text style={styles.label}>
          Programme Name
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Enter programme name"
          value={
            programmeName
          }
          onChangeText={
            setProgrammeName
          }
        />


        {/* ===============================================
            Programme Short Name
        =============================================== */}

        <Text style={styles.label}>
          Programme Short Name
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Enter programme short name"
          value={
            programmeShortName
          }
          onChangeText={
            setProgrammeShortName
          }
          autoCapitalize="characters"
        />


        {/* ===============================================
            Add Button
        =============================================== */}

        <TouchableOpacity
          style={[
            styles.button,
            saving &&
              styles.disabledButton,
          ]}
          onPress={
            handleAddProgramme
          }
          disabled={saving}
        >

          {saving ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text
              style={
                styles.buttonText
              }
            >
              Add Programme
            </Text>

          )}

        </TouchableOpacity>

      </View>


      {/* =================================================
          AVAILABLE PROGRAMMES
      ================================================= */}

      <View style={styles.listCard}>

        <Text style={styles.listTitle}>
          Available Programmes
        </Text>


        {loadingProgrammes ? (

          <ActivityIndicator
            size="large"
            style={styles.listLoader}
          />

        ) : programmes.length === 0 ? (

          <Text
            style={
              styles.noData
            }
          >
            No programmes available.
          </Text>

        ) : (

          programmes.map(
            (item, index) => (

              <View
                key={item._id}
                style={
                  styles.programmeItem
                }
              >

                <Text
                  style={
                    styles.serialNumber
                  }
                >
                  {index + 1}
                </Text>


                <View
                  style={
                    styles.programmeDetails
                  }
                >

                  <Text
                    style={
                      styles.programmeName
                    }
                  >
                    {item.programmeName}
                  </Text>


                  <Text
                    style={
                      styles.shortName
                    }
                  >
                    Short Name:{" "}
                    {
                      item.programmeShortName
                    }
                  </Text>


                  <Text
                    style={
                      styles.departmentName
                    }
                  >
                    Department:{" "}
                    {
                      getDepartmentName(
                        item.department
                      )
                    }
                  </Text>

                </View>

              </View>

            )
          )

        )}

      </View>

    </ScrollView>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  container: {
    padding: 20,
    backgroundColor: "#f5f6fa",
    flexGrow: 1,
  },


  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },


  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },


  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },


  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 7,
    marginTop: 8,
  },


  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },


  loader: {
    padding: 15,
  },


  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },


  button: {
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },


  disabledButton: {
    opacity: 0.6,
  },


  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },


  listCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 30,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },


  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },


  listLoader: {
    marginVertical: 30,
  },


  noData: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    padding: 20,
  },


  programmeItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },


  serialNumber: {
    width: 35,
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
  },


  programmeDetails: {
    flex: 1,
  },


  programmeName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },


  shortName: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },


  departmentName: {
    fontSize: 14,
    color: "#333",
  },

});