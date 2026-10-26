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


export default function Blocks() {

  // ====================================================
  // Form fields
  // ====================================================

  const [department, setDepartment] = useState("");

  const [programme, setProgramme] = useState("");

  const [blockName, setBlockName] = useState("");


  // ====================================================
  // Dropdown data
  // ====================================================

  const [departments, setDepartments] = useState([]);

  const [programmes, setProgrammes] = useState([]);

  const [blocks, setBlocks] = useState([]);


  // ====================================================
  // Loading states
  // ====================================================

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [loadingProgrammes, setLoadingProgrammes] =
    useState(false);

  const [loadingBlocks, setLoadingBlocks] =
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
        "DEPARTMENTS RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      if (
        Array.isArray(response.data)
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

  const loadProgrammes = async (
    departmentId
  ) => {

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
        "PROGRAMMES RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      const allProgrammes =
        Array.isArray(response.data)
          ? response.data
          : [];


      // Filter programmes belonging
      // to selected department

      const filteredProgrammes =
        allProgrammes.filter(
          (item) => {

            const itemDepartmentId =
              item.department?._id ||
              item.department;

            return (
              String(
                itemDepartmentId
              ) ===
              String(
                departmentId
              )
            );
          }
        );


      console.log(
        "FILTERED PROGRAMMES:",
        JSON.stringify(
          filteredProgrammes,
          null,
          2
        )
      );


      setProgrammes(
        filteredProgrammes
      );

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
  // Load Blocks
  // ====================================================

  const loadBlocks = async () => {

    try {

      setLoadingBlocks(true);

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
        "GET BLOCKS:",
        `${API_URL}/block`
      );


      const response =
        await axios.get(
          `${API_URL}/block`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "BLOCKS RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      if (
        Array.isArray(response.data)
      ) {

        setBlocks(
          response.data
        );

      } else {

        setBlocks([]);
      }

    } catch (error) {

      console.log(
        "LOAD BLOCKS ERROR:",
        error.response?.data ||
        error.message
      );


      Alert.alert(
        "Error",
        "Unable to load blocks."
      );

    } finally {

      setLoadingBlocks(false);
    }
  };


  // ====================================================
  // Load data when page opens
  // ====================================================

  useEffect(() => {

    loadDepartments();

    loadBlocks();

  }, []);


  // ====================================================
  // Department Changed
  // ====================================================

  const handleDepartmentChange = async (
    departmentId
  ) => {

    console.log(
      "SELECTED DEPARTMENT:",
      departmentId
    );


    // Set selected department
    setDepartment(
      departmentId
    );


    // Reset programme
    setProgramme("");

    setProgrammes([]);


    // Load programmes
    // for selected department

    if (departmentId) {

      await loadProgrammes(
        departmentId
      );
    }
  };


  // ====================================================
  // Programme Changed
  // ====================================================

  const handleProgrammeChange = (
    programmeId
  ) => {

    console.log(
      "SELECTED PROGRAMME:",
      programmeId
    );


    setProgramme(
      programmeId
    );
  };


  // ====================================================
  // Add Block
  // ====================================================

  const handleAddBlock = async () => {

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
    // Validate Programme
    // -----------------------------------------------

    if (!programme) {

      Alert.alert(
        "Error",
        "Please select a programme."
      );

      return;
    }


    // -----------------------------------------------
    // Validate Block Name
    // -----------------------------------------------

    if (!blockName.trim()) {

      Alert.alert(
        "Error",
        "Please enter block name."
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
      // Block data
      // ---------------------------------------------

      const blockData = {

        department:
          department,

        programme:
          programme,

        blockName:
          blockName.trim(),

      };


      console.log(
        "CREATE BLOCK DATA:",
        JSON.stringify(
          blockData,
          null,
          2
        )
      );


      // ---------------------------------------------
      // Create block
      // ---------------------------------------------

      const response =
        await axios.post(
          `${API_URL}/block`,
          blockData,
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
        "CREATE BLOCK RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      Alert.alert(
        "Success",
        "Block created successfully."
      );


      // ---------------------------------------------
      // Clear form
      // ---------------------------------------------

      setDepartment("");

      setProgramme("");

      setProgrammes([]);

      setBlockName("");


      // ---------------------------------------------
      // Reload blocks
      // ---------------------------------------------

      await loadBlocks();

    } catch (error) {

      console.log(
        "CREATE BLOCK ERROR"
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
        "Unable to create block.";


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


    // If ObjectId

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
  // Get Programme Name
  // ====================================================

  const getProgrammeName = (
    programmeData
  ) => {

    if (!programmeData) {
      return "N/A";
    }


    // If populated object

    if (
      typeof programmeData ===
      "object"
    ) {

      return (
        programmeData.programmeName ||
        "N/A"
      );
    }


    // If ObjectId

    const foundProgramme =
      programmes.find(
        (item) =>
          String(item._id) ===
          String(programmeData)
      );


    return (
      foundProgramme?.programmeName ||
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
        Block Management
      </Text>


      {/* =================================================
          ADD BLOCK CARD
      ================================================= */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Add Block
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
                handleDepartmentChange
              }

              enabled={
                departments.length > 0
              }
            >

              <Picker.Item
                label={
                  departments.length > 0
                    ? "Select Department"
                    : "No Departments Available"
                }
                value=""
              />


              {departments.map(
                (item) => (

                  <Picker.Item
                    key={item._id}

                    label={
                      `${item.departmentName} (${item.departmentShortName})`
                    }

                    value={
                      item._id
                    }
                  />

                )
              )}

            </Picker>

          )}

        </View>


        {/* ===============================================
            Programme
        =============================================== */}

        <Text style={styles.label}>
          Programme
        </Text>


        <View
          style={
            styles.pickerContainer
          }
        >

          {loadingProgrammes ? (

            <ActivityIndicator
              style={styles.loader}
            />

          ) : (

            <Picker
              selectedValue={
                programme
              }

              onValueChange={
                handleProgrammeChange
              }

              enabled={
                !!department &&
                programmes.length > 0
              }
            >

              <Picker.Item
                label={
                  !department
                    ? "Select Department First"
                    : programmes.length > 0
                    ? "Select Programme"
                    : "No Programmes Available"
                }

                value=""
              />


              {programmes.map(
                (item) => (

                  <Picker.Item
                    key={item._id}

                    label={
                      `${item.programmeName} (${item.programmeShortName})`
                    }

                    value={
                      item._id
                    }
                  />

                )
              )}

            </Picker>

          )}

        </View>


        {/* ===============================================
            Block Name
        =============================================== */}

        <Text style={styles.label}>
          Block Name
        </Text>


        <TextInput
          style={styles.input}

          placeholder="Enter block name"

          value={
            blockName
          }

          onChangeText={
            setBlockName
          }
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
            handleAddBlock
          }

          disabled={
            saving
          }
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
              Add Block
            </Text>

          )}

        </TouchableOpacity>

      </View>


      {/* =================================================
          AVAILABLE BLOCKS
      ================================================= */}

      <View style={styles.listCard}>

        <Text style={styles.listTitle}>
          Available Blocks
        </Text>


        {loadingBlocks ? (

          <ActivityIndicator
            size="large"
            style={
              styles.listLoader
            }
          />

        ) : blocks.length === 0 ? (

          <Text
            style={
              styles.noData
            }
          >
            No blocks available.
          </Text>

        ) : (

          blocks.map(
            (item, index) => (

              <View
                key={item._id}
                style={
                  styles.blockItem
                }
              >

                {/* Serial Number */}

                <Text
                  style={
                    styles.serialNumber
                  }
                >
                  {index + 1}
                </Text>


                {/* Block Details */}

                <View
                  style={
                    styles.blockDetails
                  }
                >

                  <Text
                    style={
                      styles.blockName
                    }
                  >
                    {item.blockName}
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


                  <Text
                    style={
                      styles.programmeName
                    }
                  >
                    Programme:{" "}
                    {
                      getProgrammeName(
                        item.programme
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


  blockItem: {
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


  blockDetails: {
    flex: 1,
  },


  blockName: {
    fontSize: 17,

    fontWeight: "bold",

    marginBottom: 5,
  },


  departmentName: {
    fontSize: 14,

    color: "#333",

    marginBottom: 4,
  },


  programmeName: {
    fontSize: 14,

    color: "#555",
  },

});