const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  description: String,
  translatedDescription: String,
  audioPath: String, 
  translatedAudioPath: String,
  imagePath: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;