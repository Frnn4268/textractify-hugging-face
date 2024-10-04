const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  description: String,
  audioPath: String, 
  imagePath: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;