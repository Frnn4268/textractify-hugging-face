require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const Image = require("../models/Image");
const fs = require('fs');
const path = require('path');

const hf = new HfInference(process.env.HG_ACCESS_TOKEN);

const uploadImage = async (req, res) => {
  try {
    const blob = req.file.buffer;
    const model = "Salesforce/blip-image-captioning-large";
    const result = await hf.imageToText({
      data: blob,
      model,
    });

    console.log("Generated description:", result.generated_text);

    // Generate audio from the description
    const textToSpeechResult = await hf.textToSpeech({
      model: 'espnet/kan-bayashi_ljspeech_vits',
      inputs: result.generated_text,
    });

    // Ensure the audio directory exists
    const audioDir = path.join(__dirname, 'public', 'audios');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    // Save the audio file locally
    const audioFileName = `audio_${Date.now()}.flac`;
    const audioFilePath = path.join(audioDir, audioFileName);
    fs.writeFileSync(audioFilePath, Buffer.from(await textToSpeechResult.arrayBuffer()));

    // Generate the URL for the audio file
    const audioUrl = `/audios/${audioFileName}`;

    console.log("Generated audio URL:", audioUrl);

    // Save the description and audio URL in the database
    const newImage = new Image({
      description: result.generated_text,
      audioPath: audioUrl // Ensure this is the correct path or URL
    });

    await newImage.save();
    res.json({ description: result.generated_text, audioPath: audioUrl });
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