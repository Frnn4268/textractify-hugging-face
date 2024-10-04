require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const Image = require("../models/Image");
const fs = require('fs');
const path = require('path');
const bucket = require('../firebaseConfig'); 

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

    const textToSpeechResult = await hf.textToSpeech({
      model: 'espnet/kan-bayashi_ljspeech_vits',
      inputs: result.generated_text,
    });

    // Ensure the temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save the audio file locally
    const audioFileName = `audio_${Date.now()}.flac`;
    const audioFilePath = path.join(tempDir, audioFileName);
    fs.writeFileSync(audioFilePath, Buffer.from(await textToSpeechResult.arrayBuffer()));

    // Upload the audio file to Firebase Storage
    await bucket.upload(audioFilePath, {
      destination: `audios/${audioFileName}`,
      public: true,
      metadata: { contentType: 'audio/flac' }
    });

    // Get the public URL for the audio file
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/audios/${audioFileName}`;

    console.log("Generated audio URL:", audioUrl);

    // Save the image file locally
    const imageFileName = `image_${Date.now()}.jpg`;
    const imageFilePath = path.join(tempDir, imageFileName);
    fs.writeFileSync(imageFilePath, blob);

    // Upload the image file to Firebase Storage
    await bucket.upload(imageFilePath, {
      destination: `images/${imageFileName}`,
      public: true,
      metadata: { contentType: 'image/jpeg' }
    });

    // Get the public URL for the image file
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/images/${imageFileName}`;

    console.log("Generated image URL:", imageUrl);

    // Save the description, audio URL, and image URL in the database
    const newImage = new Image({
      description: result.generated_text,
      audioPath: audioUrl,
      imagePath: imageUrl // Save the image URL
    });

    await newImage.save();
    res.json({ description: result.generated_text, audioPath: audioUrl, imagePath: imageUrl });

    // Clean up the local files
    fs.unlinkSync(audioFilePath);
    fs.unlinkSync(imageFilePath);
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