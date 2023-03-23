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
    sizes: [String],
    colors: [String],
    price: Number,
    quantity: Number,
    rating: Number,
    isPublished: {
        type: Boolean,
        default: true
    },
    description: String,
    images: [String],
},
    {
        timestamps: true
    });

export default mongoose.model("Product", ProductSchema);