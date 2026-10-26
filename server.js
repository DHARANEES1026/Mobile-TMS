require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ==============================
   MIDDLEWARE
============================== */

app.use(cors());
app.use(express.json());

/* ==============================
   ROUTES
============================== */

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const programmeRoutes = require("./routes/programmeRoutes");
const blockRoutes = require("./routes/blockRoutes");
const roomRoutes = require("./routes/roomRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const roleRoutes = require("./routes/roleRoutes");

/* ==============================
   API ROUTES
============================== */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/programme", programmeRoutes);

app.use("/api/block", blockRoutes);

app.use("/api/room", roomRoutes);

app.use("/api/complaint", complaintRoutes);

app.use("/api/master/role", roleRoutes);

/* ==============================
   TEST ROUTE
============================== */

app.get("/", (req, res) => {
  res.json({
    message: "Ticket Management System API is running",
  });
});

/* ==============================
   DATABASE CONNECTION
============================== */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("====================================");
    console.log("MongoDB Connected Successfully");
    console.log("====================================");
  } catch (error) {
    console.error("====================================");
    console.error("MongoDB Connection Error");
    console.error("====================================");
    console.error(error.message);

    process.exit(1);
  }
};

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log("====================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Mobile: http://192.168.203.223:${PORT}`);
    console.log("====================================");
  });
};

startServer();