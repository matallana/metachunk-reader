const Image = require("../models/Image"); 
const mongoose = require("mongoose");

exports.getAllImages = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            throw new Error("Invalid pagination parameters");
        }

        const totalImages = await Image.countDocuments();
        const images = await Image.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            totalImages,
            page,
            totalPages: Math.ceil(totalImages / limit),
            results: images,
        });
    } catch (error) {
        console.error("Error in getAllImages:", error);
        res.status(500).json({ message: "Error retrieving images", error: error.message });
    }
};

exports.getImagesWithTextMetadata = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            throw new Error("Invalid pagination parameters");
        }

        const totalImages = await Image.countDocuments({ has_text_metadata: true });
        const images = await Image.find({ has_text_metadata: true })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            totalImages,
            page,
            totalPages: Math.ceil(totalImages / limit),
            results: images,
        });
    } catch (error) {
        console.error("Error in getImagesWithTextMetadata:", error);
        res.status(500).json({ message: "Error retrieving images with text metadata", error: error.message });
    }
};

exports.getImageById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar if ID have MongoDB format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`Invalid image ID requested: ${id}`);
            return res.status(400).json({ message: "Invalid image ID format" });
        }

        const image = await Image.findById(id);
        if (!image) {
            console.log(`Image not found for ID: ${id}`);
            return res.status(404).json({ message: "Image not found" });
        }

        res.json(image);
    } catch (error) {
        console.error(`Error in getImageById: ${error.message}`);
        res.status(500).json({ message: "Error retrieving image", error: error.message });
    }
};
