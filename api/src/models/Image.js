const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    filename: String,
    width: Number,
    height: Number,
    format: String,
    mode: String,
    bit_depth: Number,
    color_type: Boolean,
    alpha: Boolean,
    text_chunks: [String],
    text_hash: String,
    physical_dimensions: {
        pixels_per_unit_x: Number,
        pixels_per_unit_y: Number,
        unit_specifier: String,
    },
    has_text_metadata: Boolean,
}, { timestamps: true });

module.exports = mongoose.model("Image", ImageSchema);
