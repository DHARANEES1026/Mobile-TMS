import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.203.223:5000/api";

const Users = () => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================
  const getToken = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        return null;
      }

      const parsedUser = JSON.parse(userData);

      return parsedUser.token;
    } catch (error) {
      console.log("TOKEN ERROR:", error);
      return null;
    }
  };

  // ==========================================
  // LOAD ALL DATA
  // ==========================================
  useEffect(() => {
    loadRoles();
    loadDepartments();
    loadProgrammes();
    loadUsers();
  }, []);

  // ==========================================
  // LOAD ROLES
  // ==========================================
  const loadRoles = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `${API_URL}/master/role`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ROLES:", response.data);

      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else if (Array.isArray(response.data.roles)) {
        setRoles(response.data.roles);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.log(
        "LOAD ROLES ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // LOAD DEPARTMENTS
  // ==========================================
  const loadDepartments = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `${API_URL}/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DEPARTMENTS:", response.data);

      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (Array.isArray(response.data.departments)) {
        setDepartments(response.data.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.log(
        "LOAD DEPARTMENTS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // LOAD PROGRAMMES
  // ==========================================
  const loadProgrammes = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `${API_URL}/programme`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROGRAMMES:", response.data);

      if (Array.isArray(response.data)) {
        setProgrammes(response.data);
      } else if (Array.isArray(response.data.programmes)) {
        setProgrammes(response.data.programmes);
      } else {
        setProgrammes([]);
      }
    } catch (error) {
      console.log(
        "LOAD PROGRAMMES ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================
  const loadUsers = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `${API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("USERS:", response.data);

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log(
        "LOAD USERS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // FILTER PROGRAMMES BY DEPARTMENT
  // ==========================================
  const filteredProgrammes = programmes.filter((item) => {
    if (!department) {
      return false;
    }

    const departmentId =
      typeof item.department === "object"
        ? item.department?._id
        : item.department;

    return departmentId === department;
  });

  // ==========================================
  // DEPARTMENT CHANGE
  // ==========================================
  const handleDepartmentChange = (value) => {
    setDepartment(value);

    // Clear programme when department changes
    setProgramme("");
  };

  // ==========================================
  // CREATE USER
  // ==========================================
  const handleCreateUser = async () => {
    if (
      !userName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !password.trim() ||
      !role ||
      !department ||
      !programme
    ) {
      Alert.alert(
        "Validation Error",
        "Please fill all fields."
      );
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login again."
        );
        return;
      }

      const userData = {
        userName: userName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        department,
        programme,
      };

      console.log("CREATE USER DATA:", userData);

      const response = await axios.post(
        `${API_URL}/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("CREATE USER RESPONSE:", response.data);

      Alert.alert(
        "Success",
        "User created successfully."
      );

      // Clear form
      setUserName("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setRole("");
      setDepartment("");
      setProgramme("");

      // Refresh users
      loadUsers();
    } catch (error) {
      console.log(
        "CREATE USER ERROR:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.msg ||
          "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ROLE NAME
  // ==========================================
  const getRoleName = (roleData) => {
    if (!roleData) {
      return "N/A";
    }

    if (typeof roleData === "object") {
      return (
        roleData.roleName ||
        roleData.name ||
        roleData.type ||
        "N/A"
      );
    }

    const foundRole = roles.find(
      (item) => item._id === roleData
    );

    return (
      foundRole?.roleName ||
      foundRole?.name ||
      foundRole?.type ||
      "N/A"
    );
  };

  // ==========================================
  // DEPARTMENT NAME
  // ==========================================
  const getDepartmentName = (departmentData) => {
    if (!departmentData) {
      return "N/A";
    }

    if (typeof departmentData === "object") {
      return (
        departmentData.departmentName ||
        departmentData.name ||
        "N/A"
      );
    }

    const foundDepartment = departments.find(
      (item) => item._id === departmentData
    );

    return (
      foundDepartment?.departmentName ||
      foundDepartment?.name ||
      "N/A"
    );
  };

  // ==========================================
  // PROGRAMME NAME
  // ==========================================
  const getProgrammeName = (programmeData) => {
    if (!programmeData) {
      return "N/A";
    }

    if (typeof programmeData === "object") {
      return (
        programmeData.programmeName ||
        programmeData.name ||
        "N/A"
      );
    }

    const foundProgramme = programmes.find(
      (item) => item._id === programmeData
    );

    return (
      foundProgramme?.programmeName ||
      foundProgramme?.name ||
      "N/A"
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>User Management</Text>

      {/* ==========================================
          USER NAME
      ========================================== */}
      <Text style={styles.label}>User Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter user name"
        value={userName}
        onChangeText={setUserName}
      />

      {/* ==========================================
          PHONE NUMBER
      ========================================== */}
      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* ==========================================
          EMAIL
      ========================================== */}
      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* ==========================================
          PASSWORD
      ========================================== */}
      <Text style={styles.label}>Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* ==========================================
          ROLE DROPDOWN
      ========================================== */}
      <Text style={styles.label}>Role</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value)}
        >
          <Picker.Item
            label="Select Role"
            value=""
          />

          {roles.map((item) => (
            <Picker.Item
              key={item._id}
              label={
                item.roleName ||
                item.name ||
                item.type ||
                "Role"
              }
              value={item._id}
            />
          ))}
        </Picker>
      </View>

      {/* ==========================================
          DEPARTMENT DROPDOWN
      ========================================== */}
      <Text style={styles.label}>Department</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={department}
          onValueChange={handleDepartmentChange}
        >
          <Picker.Item
            label="Select Department"
            value=""
          />

          {departments.map((item) => (
            <Picker.Item
              key={item._id}
              label={`${item.departmentName} (${item.departmentShortName})`}
              value={item._id}
            />
          ))}
        </Picker>
      </View>

      {/* ==========================================
          PROGRAMME DROPDOWN
      ========================================== */}
      <Text style={styles.label}>Programme</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={programme}
          onValueChange={(value) => setProgramme(value)}
          enabled={!!department}
        >
          <Picker.Item
            label={
              department
                ? "Select Programme"
                : "Select Department First"
            }
            value=""
          />

          {filteredProgrammes.map((item) => (
            <Picker.Item
              key={item._id}
              label={`${item.programmeName} (${item.programmeShortName})`}
              value={item._id}
            />
          ))}
        </Picker>
      </View>

      {/* ==========================================
          CREATE USER BUTTON
      ========================================== */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Create User
          </Text>
        )}
      </TouchableOpacity>

      {/* ==========================================
          AVAILABLE USERS
      ========================================== */}
      <Text style={styles.listTitle}>
        Available Users
      </Text>

      {users.length === 0 ? (
        <Text style={styles.noData}>
          No users available
        </Text>
      ) : (
        users.map((item, index) => (
          <View
            key={item._id}
            style={styles.userCard}
          >
            <Text style={styles.serial}>
              {index + 1}
            </Text>

            <Text style={styles.userName}>
              {item.userName || item.name || "N/A"}
            </Text>

            <Text style={styles.info}>
              Phone: {item.phoneNumber || "N/A"}
            </Text>

            <Text style={styles.info}>
              Email: {item.email || "N/A"}
            </Text>

            <Text style={styles.info}>
              Role: {getRoleName(item.role)}
            </Text>

            <Text style={styles.info}>
              Department:{" "}
              {getDepartmentName(item.department)}
            </Text>

            <Text style={styles.info}>
              Programme:{" "}
              {getProgrammeName(item.programme)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Users;

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
  },

  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 5,
  },

  button: {
    backgroundColor: "#007bff",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  listTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },

  noData: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },

  userCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  serial: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  info: {
    fontSize: 14,
    color: "#444",
    marginTop: 3,
  },
});