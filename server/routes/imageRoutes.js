const express = require("express");
const { uploadImage, getImages, deleteImage } = require("../controllers/imageController");

const router = express.Router();

router.post("/upload", uploadImage);
router.get("/images", getImages);
router.delete("/images/:id", deleteImage);

module.exports = router;