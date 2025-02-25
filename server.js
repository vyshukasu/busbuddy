const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Define Bus Schema
const BusSchema = new mongoose.Schema({
    from: String,
    to: String,
    date: String,
    price: Number,
    departureTime: String
});
const Bus = mongoose.model("Bus", BusSchema);

// ✅ API to Search Buses
app.get("/api/buses/search", async (req, res) => {
    const { from, to, date } = req.query;

    console.log("Received search request:", { from, to, date });

    try {
        if (!from || !to || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const buses = await Bus.find({ from, to, date });

        console.log("Buses found:", buses);

        if (!buses || buses.length === 0) {
            return res.status(200).json([]); // Return empty array if no buses found
        }

        res.json(buses);
    } catch (err) {
        console.error("Error fetching buses:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// ✅ Serve Static Files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Redirect root URL (`/`) to home.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Start Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔗 Open http://localhost:${PORT} to view the app`);
});
app.use(express.static("public"));

