require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const Image = require("../models/Image");
const fs = require('fs');
const path = require('path');
const bucket = require('../firebaseConfig');

const hf = new HfInference(process.env.HG_ACCESS_TOKEN);

const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const blob = req.file.buffer;
    const model = "Salesforce/blip-image-captioning-large";
    const result = await hf.imageToText({
      data: blob,
      model,
    });

    console.log("Generated description:", result.generated_text);

    const translation = await hf.translation({
      model: 'facebook/mbart-large-50-many-to-many-mmt',
      inputs: result.generated_text,
      parameters: {
        src_lang: 'en_XX', // English
        tgt_lang: 'es_XX', // Spanish
      },
    });

    const translatedText = translation.translation_text;
    console.log("Descripción traducida a español:", translatedText);

    // Texto a voz del texto original en inglés
    const textToSpeechResult = await hf.textToSpeech({
      model: 'espnet/kan-bayashi_ljspeech_vits',
      inputs: result.generated_text,
    });

    // Texto a voz del texto traducido
    const textToSpeechTranslatedResult = await hf.textToSpeech({
      model: 'facebook/mms-tts-spa',
      inputs: translatedText, // Usar la variable translatedText que contiene el texto traducido
    });

    // Ensure the temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Guardar el archivo de audio original localmente
    const audioFileName = `audio_${Date.now()}.flac`;
    const audioFilePath = path.join(tempDir, audioFileName);
    fs.writeFileSync(audioFilePath, Buffer.from(await textToSpeechResult.arrayBuffer()));

    // Subir el archivo de audio original a Firebase Storage
    await bucket.upload(audioFilePath, {
      destination: `audios/${audioFileName}`,
      public: true,
      metadata: { contentType: 'audio/flac' }
    });

    // Obtener la URL pública del archivo de audio original
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/audios/${audioFileName}`;
    console.log("Generated audio URL:", audioUrl);

    // Guardar el archivo de audio traducido localmente
    const translatedAudioFileName = `translated_audio_${Date.now()}.flac`;
    const translatedAudioFilePath = path.join(tempDir, translatedAudioFileName);
    fs.writeFileSync(translatedAudioFilePath, Buffer.from(await textToSpeechTranslatedResult.arrayBuffer()));

    // Subir el archivo de audio traducido a Firebase Storage
    await bucket.upload(translatedAudioFilePath, {
      destination: `audios/${translatedAudioFileName}`,
      public: true,
      metadata: { contentType: 'audio/flac' }
    });

    // Obtener la URL pública del archivo de audio traducido
    const translatedAudioUrl = `https://storage.googleapis.com/${bucket.name}/audios/${translatedAudioFileName}`;
    console.log("Generated translated audio URL:", translatedAudioUrl);

    // Guardar el archivo de imagen localmente
    const imageFileName = `image_${Date.now()}.jpg`;
    const imageFilePath = path.join(tempDir, imageFileName);
    fs.writeFileSync(imageFilePath, blob);

    // Subir el archivo de imagen a Firebase Storage
    await bucket.upload(imageFilePath, {
      destination: `images/${imageFileName}`,
      public: true,
      metadata: { contentType: 'image/jpeg' }
    });

    // Obtener la URL pública del archivo de imagen
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/images/${imageFileName}`;
    console.log("Generated image URL:", imageUrl);

    // Guardar la descripción, la URL de los audios (original y traducido) y la URL de la imagen en la base de datos
    const newImage = new Image({
      description: result.generated_text,
      translatedDescription: translatedText,
      audioPath: audioUrl,
      translatedAudioPath: translatedAudioUrl, // Guardar la URL del audio traducido
      imagePath: imageUrl // Guardar la URL de la imagen
    });

    await newImage.save();
    res.json({
      description: result.generated_text,
      translatedDescription: translatedText,  // Agregado aquí
      audioPath: audioUrl,
      translatedAudioPath: translatedAudioUrl,
      imagePath: imageUrl
    });

    // Clean up the local files
    fs.unlinkSync(audioFilePath);
    fs.unlinkSync(translatedAudioFilePath);
    fs.unlinkSync(imageFilePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete audio file from Firebase Storage
    const audioFileName = path.basename(image.audioPath);
    await bucket.file(`audios/${audioFileName}`).delete();

    // Delete translated audio file from Firebase Storage
    const translatedAudioFileName = path.basename(image.translatedAudioPath);
    await bucket.file(`audios/${translatedAudioFileName}`).delete();

    // Delete image file from Firebase Storage
    const imageFileName = path.basename(image.imagePath);
    await bucket.file(`images/${imageFileName}`).delete();

    // Delete the image record from the database
    await Image.findByIdAndDelete(id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
};
