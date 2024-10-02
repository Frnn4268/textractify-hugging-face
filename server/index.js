const express = require("express");
const multer = require("multer");
const { HfInference } = require("@huggingface/inference");
const { config } = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

config();

const app = express();
const upload = multer();

app.use(cors({
  origin: 'http://localhost:5173'
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB!");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
});

// Model and Schema definition
const imageSchema = new mongoose.Schema({
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

const hf = new HfInference(process.env.HG_ACCESS_TOKEN);

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const blob = req.file.buffer;
    const model = "Salesforce/blip-image-captioning-large";

    const result = await hf.imageToText({
      data: blob,
      model,
    });

    // Save the description into Database
    const newImage = new Image({
      description: result.generated_text,
    });

    await newImage.save();

    res.json({ description: result.generated_text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});