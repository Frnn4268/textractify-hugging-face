const { HfInference } = require("@huggingface/inference");
const Image = require("../models/Image");
const { TextToSpeechClient } = require('@google-cloud/text-to-speech'); // Ejemplo con Google Text-to-Speech
const fs = require('fs');
const util = require('util');
const path = require('path');

const hf = new HfInference(process.env.HG_ACCESS_TOKEN);
const ttsClient = new TextToSpeechClient();

const uploadImage = async (req, res) => {
  try {
    const blob = req.file.buffer;
    const model = "Salesforce/blip-image-captioning-large";

    const result = await hf.imageToText({
      data: blob,
      model,
    });

    const description = result.generated_text;

    // Generate audio from the description
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: description },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Save the audio file
    const audioFileName = `${Date.now()}.mp3`;
    const audioFilePath = path.join(__dirname, '..', 'public', 'audio', audioFileName);
    await util.promisify(fs.writeFile)(audioFilePath, response.audioContent, 'binary');

    // Guardar la descripción y la URL del audio en la base de datos
    const newImage = new Image({
      description,
      audioUrl: `/public/audio/${audioFileName}`,
    });

    await newImage.save();

    res.json({ description, audioUrl: newImage.audioUrl });
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