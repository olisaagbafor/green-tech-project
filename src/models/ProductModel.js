import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a Product name"],
    },
    brand: {
        type: String,
        required: [true, "Please add a Product brand"],
    },
    category: String,
    tags: [String],
    size: String,
    color: String,
    price: {
        type: Number,
        required: [true, "Please add a Product price"],
    },
    quantity: {
        type: Number,
        required: [true, "Please add a Product quantity"],
    },
    rating: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    description: String,
    image: String,
},
    {
        timestamps: true
    });

export default mongoose.model("Product", ProductSchema);