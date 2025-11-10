const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // built-in

// I am using Node's built-in crypto for password hashing instead of bcrypt,
// to ensure compatibility without additional installation steps

//I can use bcrypt too, but this is much faster for setup,
//and easy for anyone to run without extra installations

//Thanks and Regards, Parthiv Abhani (PRN: 23070521106)


const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "kommunityevents";
let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected successfully to MongoDB");

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log("Server started at port:", PORT);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

// --- Simple hash helper functions using crypto ---
function hashPassword(password) {
  // SHA-256 hash, encoded in hex
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hashed) {
  const hashToCompare = hashPassword(password);
  return hashToCompare === hashed;
}

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = hashPassword(password);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: result.insertedId }, "parthivatlas123", { expiresIn: "30d" });
    res.status(201).json({ message: "User created", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error during signup" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "parthivatlas123", { expiresIn: "30d" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

// GET ALL EVENTS
app.get("/api/events", async (req, res) => {
  try {
    const events = await db.collection("events").find({}).toArray();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// CREATE EVENT
app.post("/api/events", async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const result = await db.collection("events").insertOne({
      title,
      description,
      date,
      location,
    });

    res.status(201).json({ message: "Event created", eventId: result.insertedId });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.get("/", (req, res) => {
  res.send("Backend is running with MongoDB Compass!");
});
