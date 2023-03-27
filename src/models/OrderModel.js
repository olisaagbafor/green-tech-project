import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: {
        _id: mongoose.Types.ObjectId,
        name: String,
        email: String,
        phone: Number,
    },
    products: [{
        _id: {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        },
        name: String,
        brand: String,
        price: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        },
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    });

export default mongoose.model("Cart", CartSchema);