import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
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
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'wallet'],
        default: 'wallet'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
    },
    shippingAddress: {
        address: String,
        city: String,
        postalCode: String,
        country: String,
        phone: String
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    taxPrice: {
        type: Number,
        default: 0
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date
},
    {
        timestamps: true
    });




export default mongoose.model("Order", OrderSchema);