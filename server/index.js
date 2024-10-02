const express = require("express");
const multer = require("multer");
const { config } = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const imageRoutes = require("./routes/imageRoutes");

config();

const app = express();
const upload = multer();

app.use(cors({
  origin: 'http://localhost:5173'
}));

// MongoDB connection
connectDB();

// Routes
app.use("/api", upload.single("image"), imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});