require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Logging Middleware for Requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);

    if (Object.keys(req.body).length) {
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
    }

    // Intercept response to log status
    const originalSend = res.send;
    res.send = function (data) {
        let statusEmoji = "✅"; // Green for 200
        if (res.statusCode >= 400 && res.statusCode < 500) statusEmoji = "🟠"; // Orange for 400 errors
        if (res.statusCode >= 500) statusEmoji = "❌"; // Red for 500 errors

        console.log(`${statusEmoji} Response Status: ${res.statusCode}`);
        // console.log("Response Body:", typeof data === "object" ? JSON.stringify(data, null, 2) : data); // Uncomment for debug

        originalSend.apply(res, arguments);
    };

    next();
});

// Routes
app.use("/api/images", imageRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
