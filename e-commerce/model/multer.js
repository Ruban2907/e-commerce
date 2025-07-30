const mongoose = require ("mongoose");
const multerSchema = new mongoose.Schema({
    picture: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    },
    cost: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Multer = mongoose.model("multer", multerSchema);
module.exports = Multer;