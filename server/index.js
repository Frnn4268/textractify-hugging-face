const express = require("express");
const multer = require("multer");
const { HfInference } = require("@huggingface/inference");
const { config } = require("dotenv");
const cors = require("cors");

config();

const app = express();
const upload = multer();

app.use(cors({
  origin: 'http://localhost:5173'
}));

const hf = new HfInference(process.env.HG_ACCESS_TOKEN);

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const blob = req.file.buffer;
    const model = "Salesforce/blip-image-captioning-large";

    const result = await hf.imageToText({
      data: blob,
      model,
    });

    res.json({ description: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});