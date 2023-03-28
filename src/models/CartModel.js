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

    cart.products = cart.products.filter(p => products.map(product => {
        if (product._id.toString() === p._id.toString()) {
            p.price = product.price
            product.quantity -= p.quantity
            if (product.quantity <= 0) {
                return null;
            }
        }
        return p;
    }));

    cart.totalAmount = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    await this.model("Product").bulkWrite(products.map(p => ({ updateOne: { filter: { _id: p._id }, update: { $set: { quantity: p.quantity } } } })));
    await this.model("Order").create({ user: cart.user, products: cart.products, totalAmount: cart.totalAmount });
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();
    return cart;
}

export default mongoose.model("Cart", CartSchema);