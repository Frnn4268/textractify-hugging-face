require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const Image = require("../models/Image");

const hf = new HfInference(process.env.HG_ACCESS_TOKEN);

const uploadImage = async (req, res) => {
  try {
    const blob = req.file.buffer;
    const model = "Salesforce/blip-image-captioning-large";
    const result = await hf.imageToText({
      data: blob,
      model,
    });
    // Save the description in the database
    const newImage = new Image({
      description: result.generated_text,
    });
    await newImage.save();
    res.json({ description: result.generated_text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImage,
  getImages,
};