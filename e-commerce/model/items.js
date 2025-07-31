const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    images: [{
        data: { 
            type: Buffer, 
            required: true 
        },
        contentType: { 
            type: String, 
            required: true 
        }
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    colors: [{
        type: String,
        required: true,
        trim: true
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;