const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  audioPath: String, 
  imagePath: String,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;