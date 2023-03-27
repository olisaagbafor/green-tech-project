import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    products: [{
        product: {
            _id: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            brand: String,
            price: {
                type: Number,
                default: 0
            }
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


CartSchema.methods.addProduct = async function (product, quantity) {
    const cart = this;
    const cartProduct = cart.products.find(p => p.product._id.toString() === product._id.toString());
    if (cartProduct) {
        cartProduct.quantity += quantity;
    } else {
        cart.products.push({ product, quantity });
    }
    cart.totalAmount = cart.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0);
    await cart.save();
    return cart;
}

CartSchema.methods.removeProduct = async function (productId, quantity) {
    let cart = this;

    cart.products = cart.products.map(p => {
        if (p.product._id.toString() === productId.toString()) {
            p.quantity -= quantity;
            if (p.quantity <= 0) {
                return null;
            }
        }
        return p;
    });
    cart.products = cart.products.filter(p => p !== null);
    cart.totalAmount = cart.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0);
    await cart.save();
    return cart;
}

CartSchema.methods.checkout = async function () {
    const cart = this;
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();
    return cart;
}

export default mongoose.model("Cart", CartSchema);