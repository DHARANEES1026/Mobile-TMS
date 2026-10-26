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

import { useRouter } from "expo-router";

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";


// ======================================================
// API URL
// ======================================================

const API_URL = "http://192.168.203.223:5000/api";


export default function RaiseComplaint() {
  const router = useRouter();

  // ======================================================
  // Complaint fields
  // ======================================================

  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");


  // ======================================================
  // Dropdown selected values
  // ======================================================

  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");


  // ======================================================
  // Dropdown data
  // ======================================================

  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms] = useState([]);


  // ======================================================
  // Loading states
  // ======================================================

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [loadingProgrammes, setLoadingProgrammes] =
    useState(false);

  const [loadingBlocks, setLoadingBlocks] =
    useState(false);

  const [loadingRooms, setLoadingRooms] =
    useState(false);

  const [loadingSubmit, setLoadingSubmit] =
    useState(false);


  // ======================================================
  // Get login token
  // ======================================================

  const getToken = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      const user = JSON.parse(savedUser);

      return user.token || null;
    } catch (error) {
      console.log("GET TOKEN ERROR:", error);
      return null;
    }
  };


  // ======================================================
  // Load Departments
  // ======================================================

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login before raising a complaint."
        );

        router.replace("/login");
        return;
      }

      console.log(
        "GET DEPARTMENTS:",
        `${API_URL}/departments`
      );

      const response = await axios.get(
        `${API_URL}/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "DEPARTMENTS RESPONSE:",
        JSON.stringify(response.data, null, 2)
      );

      setDepartments(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log("================================");
      console.log("LOAD DEPARTMENTS ERROR");
      console.log("================================");

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      Alert.alert(
        "Error",
        "Unable to load departments."
      );
    } finally {
      setLoadingDepartments(false);
    }
  };


  // ======================================================
  // Load Programmes
  // ======================================================

  const loadProgrammes = async (departmentId) => {
    try {
      setLoadingProgrammes(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );

        router.replace("/login");
        return;
      }

      console.log(
        "GET PROGRAMMES:",
        `${API_URL}/programme`
      );

      const response = await axios.get(
        `${API_URL}/programme`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PROGRAMMES RESPONSE:",
        JSON.stringify(response.data, null, 2)
      );

      const allProgrammes = Array.isArray(response.data)
        ? response.data
        : [];

      // Filter programmes belonging to selected department
      const filteredProgrammes = allProgrammes.filter(
        (item) => {
          const itemDepartmentId =
            item.department?._id ||
            item.department;

          return (
            String(itemDepartmentId) ===
            String(departmentId)
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

      setProgrammes(filteredProgrammes);
    } catch (error) {
      console.log("================================");
      console.log("LOAD PROGRAMMES ERROR");
      console.log("================================");

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      Alert.alert(
        "Error",
        "Unable to load programmes."
      );
    } finally {
      setLoadingProgrammes(false);
    }
  };


  // ======================================================
  // Load Blocks
  // ======================================================

  const loadBlocks = async (
    departmentId,
    programmeId
  ) => {
    try {
      setLoadingBlocks(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );

        router.replace("/login");
        return;
      }

      console.log(
        "GET BLOCKS:",
        `${API_URL}/block`
      );

      const response = await axios.get(
        `${API_URL}/block`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "BLOCKS RESPONSE:",
        JSON.stringify(response.data, null, 2)
      );

      const allBlocks = Array.isArray(response.data)
        ? response.data
        : [];

      // Filter blocks by department and programme
      const filteredBlocks = allBlocks.filter(
        (item) => {
          const itemDepartmentId =
            item.department?._id ||
            item.department;

          const itemProgrammeId =
            item.programme?._id ||
            item.programme;

          return (
            String(itemDepartmentId) ===
              String(departmentId) &&
            String(itemProgrammeId) ===
              String(programmeId)
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

      setBlocks(filteredBlocks);
    } catch (error) {
      console.log("================================");
      console.log("LOAD BLOCKS ERROR");
      console.log("================================");

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      Alert.alert(
        "Error",
        "Unable to load blocks."
      );
    } finally {
      setLoadingBlocks(false);
    }
  };


  // ======================================================
  // Load Rooms
  // ======================================================

  const loadRooms = async (
    departmentId,
    programmeId,
    blockId
  ) => {
    try {
      setLoadingRooms(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );

        router.replace("/login");
        return;
      }

      console.log(
        "GET ROOMS:",
        `${API_URL}/room`
      );

      const response = await axios.get(
        `${API_URL}/room`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ROOMS RESPONSE:",
        JSON.stringify(response.data, null, 2)
      );

      const allRooms = Array.isArray(response.data)
        ? response.data
        : [];

      // Filter rooms by department,
      // programme and block
      const filteredRooms = allRooms.filter(
        (item) => {
          const itemDepartmentId =
            item.department?._id ||
            item.department;

          const itemProgrammeId =
            item.programme?._id ||
            item.programme;

          const itemBlockId =
            item.block?._id ||
            item.block;

          return (
            String(itemDepartmentId) ===
              String(departmentId) &&
            String(itemProgrammeId) ===
              String(programmeId) &&
            String(itemBlockId) ===
              String(blockId)
          );
        }
      );

      console.log(
        "FILTERED ROOMS:",
        JSON.stringify(
          filteredRooms,
          null,
          2
        )
      );

      setRooms(filteredRooms);
    } catch (error) {
      console.log("================================");
      console.log("LOAD ROOMS ERROR");
      console.log("================================");

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      Alert.alert(
        "Error",
        "Unable to load rooms."
      );
    } finally {
      setLoadingRooms(false);
    }
  };


  // ======================================================
  // Load departments when screen opens
  // ======================================================

  useEffect(() => {
    loadDepartments();
  }, []);


  // ======================================================
  // Department changed
  // ======================================================

  const handleDepartmentChange = async (
    departmentId
  ) => {
    console.log(
      "SELECTED DEPARTMENT:",
      departmentId
    );

    // Set selected department
    setDepartment(departmentId);

    // Reset dependent dropdowns
    setProgramme("");
    setBlock("");
    setRoom("");

    setProgrammes([]);
    setBlocks([]);
    setRooms([]);

    // Load programmes for selected department
    if (departmentId) {
      await loadProgrammes(departmentId);
    }
  };


  // ======================================================
  // Programme changed
  // ======================================================

  const handleProgrammeChange = async (
    programmeId
  ) => {
    console.log(
      "SELECTED PROGRAMME:",
      programmeId
    );

    // Set selected programme
    setProgramme(programmeId);

    // Reset dependent dropdowns
    setBlock("");
    setRoom("");

    setBlocks([]);
    setRooms([]);

    // Load blocks
    if (programmeId && department) {
      await loadBlocks(
        department,
        programmeId
      );
    }
  };


  // ======================================================
  // Block changed
  // ======================================================

  const handleBlockChange = async (
    blockId
  ) => {
    console.log(
      "SELECTED BLOCK:",
      blockId
    );

    // Set selected block
    setBlock(blockId);

    // Reset room
    setRoom("");
    setRooms([]);

    // Load rooms
    if (
      blockId &&
      department &&
      programme
    ) {
      await loadRooms(
        department,
        programme,
        blockId
      );
    }
  };


  // ======================================================
  // Room changed
  // ======================================================

  const handleRoomChange = (roomId) => {
    console.log(
      "SELECTED ROOM:",
      roomId
    );

    setRoom(roomId);
  };


  // ======================================================
  // Submit Complaint
  // ======================================================

  const handleSubmit = async () => {
    // ----------------------------------------------
    // Validate complaint type
    // ----------------------------------------------

    if (!complaintType.trim()) {
      Alert.alert(
        "Error",
        "Please enter complaint type."
      );
      return;
    }


    // ----------------------------------------------
    // Validate description
    // ----------------------------------------------

    if (!description.trim()) {
      Alert.alert(
        "Error",
        "Please enter complaint description."
      );
      return;
    }


    // ----------------------------------------------
    // Validate Department
    // ----------------------------------------------

    if (!department) {
      Alert.alert(
        "Error",
        "Please select a department."
      );
      return;
    }


    // ----------------------------------------------
    // Validate Programme
    // ----------------------------------------------

    if (!programme) {
      Alert.alert(
        "Error",
        "Please select a programme."
      );
      return;
    }


    // ----------------------------------------------
    // Validate Block
    // ----------------------------------------------

    if (!block) {
      Alert.alert(
        "Error",
        "Please select a block."
      );
      return;
    }


    // ----------------------------------------------
    // Validate Room
    // ----------------------------------------------

    if (!room) {
      Alert.alert(
        "Error",
        "Please select a room."
      );
      return;
    }


    try {
      setLoadingSubmit(true);

      // --------------------------------------------
      // Get logged-in user
      // --------------------------------------------

      const savedUser =
        await AsyncStorage.getItem("user");

      if (!savedUser) {
        Alert.alert(
          "Login Required",
          "Please login before raising a complaint."
        );

        router.replace("/login");
        return;
      }


      const user = JSON.parse(savedUser);

      console.log(
        "LOGGED USER:",
        JSON.stringify(
          user,
          null,
          2
        )
      );


      const token = user.token;


      if (!token) {
        Alert.alert(
          "Authentication Error",
          "Login token not found. Please login again."
        );

        router.replace("/login");
        return;
      }


      // --------------------------------------------
      // Complaint data
      // --------------------------------------------

      const complaintData = {
        complaintType:
          complaintType.trim(),

        description:
          description.trim(),

        department: department,

        programme: programme,

        block: block,

        room: room,
      };


      console.log(
        "================================"
      );

      console.log(
        "COMPLAINT DATA:"
      );

      console.log(
        JSON.stringify(
          complaintData,
          null,
          2
        )
      );

      console.log(
        "TOKEN EXISTS:",
        !!token
      );

      console.log(
        "POST URL:",
        `${API_URL}/complaint`
      );

      console.log(
        "================================"
      );


      // --------------------------------------------
      // Submit complaint
      // --------------------------------------------

      const response = await axios.post(
        `${API_URL}/complaint`,
        complaintData,
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
        "COMPLAINT RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      // --------------------------------------------
      // Success
      // --------------------------------------------

      Alert.alert(
        "Success",
        "Complaint submitted successfully!",
        [
          {
            text: "OK",

            onPress: () => {
              setComplaintType("");
              setDescription("");

              setDepartment("");
              setProgramme("");
              setBlock("");
              setRoom("");

              setProgrammes([]);
              setBlocks([]);
              setRooms([]);

              router.replace(
                "/user/my-complaints"
              );
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        "================================"
      );

      console.log(
        "COMPLAINT SUBMIT ERROR"
      );

      console.log(
        "================================"
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


      let message =
        "Unable to submit complaint.";


      // --------------------------------------------
      // Unauthorized
      // --------------------------------------------

      if (
        error.response?.status === 401
      ) {
        message =
          "Your login session has expired. Please login again.";

        await AsyncStorage.removeItem(
          "user"
        );

        router.replace("/login");
      }


      // --------------------------------------------
      // Bad request
      // --------------------------------------------

      else if (
        error.response?.status === 400
      ) {
        message =
          error.response?.data?.message ||
          error.response?.data?.msg ||
          "Invalid complaint data.";
      }


      // --------------------------------------------
      // Not found
      // --------------------------------------------

      else if (
        error.response?.status === 404
      ) {
        message =
          "Complaint API endpoint was not found. Check your backend route.";
      }


      // --------------------------------------------
      // Server error
      // --------------------------------------------

      else if (
        error.response?.status >= 500
      ) {
        message =
          "Server error. Please check your backend console.";
      }


      // --------------------------------------------
      // Network error
      // --------------------------------------------

      else if (!error.response) {
        message =
          "Cannot connect to the backend server. Make sure your backend is running and the IP address is correct.";
      }


      // --------------------------------------------
      // Other errors
      // --------------------------------------------

      else {
        message =
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          message;
      }


      Alert.alert(
        "Submit Failed",
        message
      );
    } finally {
      setLoadingSubmit(false);
    }
  };


  // ======================================================
  // UI
  // ======================================================

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
    >

      {/* ==================================================
          TITLE
      ================================================== */}

      <Text style={styles.title}>
        Raise Complaint
      </Text>


      {/* ==================================================
          COMPLAINT TYPE
      ================================================== */}

      <Text style={styles.label}>
        Complaint Type
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Example: PC Hardware"
        value={complaintType}
        onChangeText={
          setComplaintType
        }
      />


      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        placeholder="Enter complaint description"
        value={description}
        onChangeText={
          setDescription
        }
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />


      {/* ==================================================
          DEPARTMENT
      ================================================== */}

      <Text style={styles.label}>
        Department
      </Text>

      <View style={styles.pickerContainer}>

        {loadingDepartments ? (
          <ActivityIndicator
            style={styles.loader}
          />
        ) : (
          <Picker
            selectedValue={department}
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
                  value={item._id}
                />
              )
            )}

          </Picker>
        )}

      </View>


      {/* ==================================================
          PROGRAMME
      ================================================== */}

      <Text style={styles.label}>
        Programme
      </Text>

      <View style={styles.pickerContainer}>

        {loadingProgrammes ? (
          <ActivityIndicator
            style={styles.loader}
          />
        ) : (
          <Picker
            selectedValue={programme}
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
                  value={item._id}
                />
              )
            )}

          </Picker>
        )}

      </View>


      {/* ==================================================
          BLOCK
      ================================================== */}

      <Text style={styles.label}>
        Block
      </Text>

      <View style={styles.pickerContainer}>

        {loadingBlocks ? (
          <ActivityIndicator
            style={styles.loader}
          />
        ) : (
          <Picker
            selectedValue={block}
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
                  label={item.blockName}
                  value={item._id}
                />
              )
            )}

          </Picker>
        )}

      </View>


      {/* ==================================================
          ROOM
      ================================================== */}

      <Text style={styles.label}>
        Room
      </Text>

      <View style={styles.pickerContainer}>

        {loadingRooms ? (
          <ActivityIndicator
            style={styles.loader}
          />
        ) : (
          <Picker
            selectedValue={room}
            onValueChange={
              handleRoomChange
            }
            enabled={
              !!block &&
              rooms.length > 0
            }
          >

            <Picker.Item
              label={
                !block
                  ? "Select Block First"
                  : rooms.length > 0
                  ? "Select Room"
                  : "No Rooms Available"
              }
              value=""
            />

            {rooms.map(
              (item) => (
                <Picker.Item
                  key={item._id}
                  label={
                    `Room ${item.roomNumber}`
                  }
                  value={item._id}
                />
              )
            )}

          </Picker>
        )}

      </View>


      {/* ==================================================
          SUBMIT BUTTON
      ================================================== */}

      <TouchableOpacity
        style={[
          styles.button,
          loadingSubmit &&
            styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={loadingSubmit}
      >

        {loadingSubmit ? (
          <ActivityIndicator
            color="#fff"
          />
        ) : (
          <Text
            style={styles.buttonText}
          >
            Submit Complaint
          </Text>
        )}

      </TouchableOpacity>

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
    marginBottom: 25,
  },


  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 7,
    marginTop: 8,
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


  textArea: {
    height: 120,
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


  button: {
    backgroundColor: "#1976D2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },


  disabledButton: {
    opacity: 0.6,
  },


  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

});