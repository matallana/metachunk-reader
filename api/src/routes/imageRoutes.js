const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.get("/", imageController.getAllImages);
router.get("/text-metadata", imageController.getImagesWithTextMetadata);
router.get("/:id", imageController.getImageById);


module.exports = router;
