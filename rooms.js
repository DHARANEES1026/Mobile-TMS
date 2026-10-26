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


export default function Rooms() {

  // ====================================================
  // Form fields
  // ====================================================

  const [department, setDepartment] = useState("");

  const [programme, setProgramme] = useState("");

  const [block, setBlock] = useState("");

  const [roomNumber, setRoomNumber] = useState("");


  // ====================================================
  // Dropdown / list data
  // ====================================================

  const [departments, setDepartments] = useState([]);

  const [programmes, setProgrammes] = useState([]);

  const [blocks, setBlocks] = useState([]);

  const [rooms, setRooms] = useState([]);


  // ====================================================
  // Loading states
  // ====================================================

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [loadingProgrammes, setLoadingProgrammes] =
    useState(false);

  const [loadingBlocks, setLoadingBlocks] =
    useState(false);

  const [loadingRooms, setLoadingRooms] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  // ====================================================
  // Get login token
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


      const allProgrammes =
        Array.isArray(response.data)
          ? response.data
          : [];


      // Only programmes belonging
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

  const loadBlocks = async (
    departmentId,
    programmeId
  ) => {

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


      const allBlocks =
        Array.isArray(response.data)
          ? response.data
          : [];


      // Only blocks belonging
      // to selected department
      // and programme

      const filteredBlocks =
        allBlocks.filter(
          (item) => {

            const itemDepartmentId =
              item.department?._id ||
              item.department;

            const itemProgrammeId =
              item.programme?._id ||
              item.programme;


            return (
              String(
                itemDepartmentId
              ) ===
                String(
                  departmentId
                ) &&

              String(
                itemProgrammeId
              ) ===
                String(
                  programmeId
                )
            );
          }
        );


      console.log(
        "FILTERED BLOCKS:",
        JSON.stringify(
          filteredBlocks,
          null,
          2
        )
      );


      setBlocks(
        filteredBlocks
      );

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
  // Load Rooms
  // ====================================================

  const loadRooms = async () => {

    try {

      setLoadingRooms(true);

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
        "GET ROOMS:",
        `${API_URL}/room`
      );


      const response =
        await axios.get(
          `${API_URL}/room`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "ROOMS RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      if (
        Array.isArray(response.data)
      ) {

        setRooms(
          response.data
        );

      } else {

        setRooms([]);
      }

    } catch (error) {

      console.log(
        "LOAD ROOMS ERROR:",
        error.response?.data ||
        error.message
      );


      Alert.alert(
        "Error",
        "Unable to load rooms."
      );

    } finally {

      setLoadingRooms(false);
    }
  };


  // ====================================================
  // Load initial data
  // ====================================================

  useEffect(() => {

    loadDepartments();

    loadRooms();

  }, []);


  // ====================================================
  // Department changed
  // ====================================================

  const handleDepartmentChange = async (
    departmentId
  ) => {

    console.log(
      "SELECTED DEPARTMENT:",
      departmentId
    );


    // Set department

    setDepartment(
      departmentId
    );


    // Reset dependent fields

    setProgramme("");

    setBlock("");

    setProgrammes([]);

    setBlocks([]);


    // Load programmes

    if (departmentId) {

      await loadProgrammes(
        departmentId
      );
    }
  };


  // ====================================================
  // Programme changed
  // ====================================================

  const handleProgrammeChange = async (
    programmeId
  ) => {

    console.log(
      "SELECTED PROGRAMME:",
      programmeId
    );


    // Set programme

    setProgramme(
      programmeId
    );


    // Reset block

    setBlock("");

    setBlocks([]);


    // Load blocks

    if (
      department &&
      programmeId
    ) {

      await loadBlocks(
        department,
        programmeId
      );
    }
  };


  // ====================================================
  // Block changed
  // ====================================================

  const handleBlockChange = (
    blockId
  ) => {

    console.log(
      "SELECTED BLOCK:",
      blockId
    );


    setBlock(
      blockId
    );
  };


  // ====================================================
  // Add Room
  // ====================================================

  const handleAddRoom = async () => {

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
    // Validate Block
    // -----------------------------------------------

    if (!block) {

      Alert.alert(
        "Error",
        "Please select a block."
      );

      return;
    }


    // -----------------------------------------------
    // Validate Room Number
    // -----------------------------------------------

    if (!roomNumber.trim()) {

      Alert.alert(
        "Error",
        "Please enter room number."
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
      // Room data
      // ---------------------------------------------

      const roomData = {

        department:
          department,

        programme:
          programme,

        block:
          block,

        roomNumber:
          roomNumber.trim(),

      };


      console.log(
        "CREATE ROOM DATA:",
        JSON.stringify(
          roomData,
          null,
          2
        )
      );


      // ---------------------------------------------
      // Create room
      // ---------------------------------------------

      const response =
        await axios.post(
          `${API_URL}/room`,
          roomData,
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
        "CREATE ROOM RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      Alert.alert(
        "Success",
        "Room created successfully."
      );


      // ---------------------------------------------
      // Clear form
      // ---------------------------------------------

      setDepartment("");

      setProgramme("");

      setBlock("");

      setProgrammes([]);

      setBlocks([]);

      setRoomNumber("");


      // ---------------------------------------------
      // Reload rooms
      // ---------------------------------------------

      await loadRooms();

    } catch (error) {

      console.log(
        "CREATE ROOM ERROR"
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
        "Unable to create room.";


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


    // Populated object

    if (
      typeof departmentData ===
      "object"
    ) {

      return (
        departmentData.departmentName ||
        "N/A"
      );
    }


    // ObjectId

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


    // Populated object

    if (
      typeof programmeData ===
      "object"
    ) {

      return (
        programmeData.programmeName ||
        "N/A"
      );
    }


    // ObjectId

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
  // Get Block Name
  // ====================================================

  const getBlockName = (
    blockData
  ) => {

    if (!blockData) {
      return "N/A";
    }


    // Populated object

    if (
      typeof blockData ===
      "object"
    ) {

      return (
        blockData.blockName ||
        "N/A"
      );
    }


    // ObjectId

    const foundBlock =
      blocks.find(
        (item) =>
          String(item._id) ===
          String(blockData)
      );


    return (
      foundBlock?.blockName ||
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
        Room Management
      </Text>


      {/* =================================================
          ADD ROOM CARD
      ================================================= */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Add Room
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
            Block
        =============================================== */}

        <Text style={styles.label}>
          Block
        </Text>


        <View
          style={
            styles.pickerContainer
          }
        >

          {loadingBlocks ? (

            <ActivityIndicator
              style={styles.loader}
            />

          ) : (

            <Picker
              selectedValue={
                block
              }

              onValueChange={
                handleBlockChange
              }

              enabled={
                !!programme &&
                blocks.length > 0
              }
            >

              <Picker.Item
                label={
                  !programme
                    ? "Select Programme First"
                    : blocks.length > 0
                    ? "Select Block"
                    : "No Blocks Available"
                }

                value=""
              />


              {blocks.map(
                (item) => (

                  <Picker.Item
                    key={item._id}

                    label={
                      item.blockName
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
            Room Number
        =============================================== */}

        <Text style={styles.label}>
          Room Number
        </Text>


        <TextInput
          style={styles.input}

          placeholder="Enter room number"

          value={
            roomNumber
          }

          onChangeText={
            setRoomNumber
          }

          keyboardType="numeric"
        />


        {/* ===============================================
            Add Room Button
        =============================================== */}

        <TouchableOpacity
          style={[
            styles.button,
            saving &&
              styles.disabledButton,
          ]}

          onPress={
            handleAddRoom
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
              Add Room
            </Text>

          )}

        </TouchableOpacity>

      </View>


      {/* =================================================
          AVAILABLE ROOMS
      ================================================= */}

      <View style={styles.listCard}>

        <Text style={styles.listTitle}>
          Available Rooms
        </Text>


        {loadingRooms ? (

          <ActivityIndicator
            size="large"
            style={
              styles.listLoader
            }
          />

        ) : rooms.length === 0 ? (

          <Text
            style={
              styles.noData
            }
          >
            No rooms available.
          </Text>

        ) : (

          rooms.map(
            (item, index) => (

              <View
                key={item._id}
                style={
                  styles.roomItem
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


                {/* Room Details */}

                <View
                  style={
                    styles.roomDetails
                  }
                >

                  <Text
                    style={
                      styles.roomNumber
                    }
                  >
                    Room {item.roomNumber}
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


                  <Text
                    style={
                      styles.blockName
                    }
                  >
                    Block:{" "}
                    {
                      getBlockName(
                        item.block
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


  roomItem: {
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


  roomDetails: {
    flex: 1,
  },


  roomNumber: {
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

    marginBottom: 4,
  },


  blockName: {
    fontSize: 14,

    color: "#555",
  },

});