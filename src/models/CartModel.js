import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
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
    }
},
    {
        timestamps: true
    });


CartSchema.methods.addProduct = async function (product, quantity) {
    const cart = this;
    const cartProduct = cart.products.find(p => p._id.toString() === product._id.toString());
    if (cartProduct) {
        cartProduct.quantity += quantity;
    } else {
        cart.products.push({ quantity, _id: product._id, name: product.name, brand: product.brand, price: product.price });
    }
    cart.totalAmount = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await cart.save();
    return cart;
}

CartSchema.methods.removeProduct = async function (productId, quantity) {
    let cart = this;
    cart.products = cart.products.map(p => {
        if (p._id.toString() === productId.toString()) {
            p.quantity -= quantity;
            if (p.quantity <= 0) {
                return null;
            }
        }
        return p;
    });
    cart.products = cart.products.filter(p => p !== null);
    cart.totalAmount = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await cart.save();
    return cart;
}

CartSchema.methods.checkOut = async function (products) {
    let cart = this;

    cart.products = cart.products.map(p => {
        p.price = p._id.price

    })

    cart.products = cart.products.filter(p => products.map(product => {
        if (product._id.toString() === p.product._id.toString()) {
            p.quantity = product.quantity;

        }
        return p;
    }));
    cart.totalAmount = cart.products.reduce((acc, p) => acc + p.product._id.price * p.quantity, 0);
    await cart.save();
    return cart;
}

export default mongoose.model("Cart", CartSchema);