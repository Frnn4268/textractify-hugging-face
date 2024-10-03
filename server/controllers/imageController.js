const { HfInference } = require("@huggingface/inference");
const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

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

    // Convert the description to speech
    const ttsModel = "facebook/fastspeech2-en-ljspeech";
    const ttsResult = await hf.textToSpeech({
      text: result.generated_text,
      model: ttsModel,
    });

    // Save the audio file
    const audioPath = path.join(__dirname, `../audio/${newImage._id}.wav`);
    fs.writeFileSync(audioPath, ttsResult.audio);

    // Update the image document with the audio path
    newImage.audioPath = audioPath;
    await newImage.save();

    res.json({ description: result.generated_text, audioPath });
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