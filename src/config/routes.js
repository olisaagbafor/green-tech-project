import errorMiddleware from "../middlewares/error-middleware.js";
import usersRoutes from "../routes/usersRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import productsRoutes from "../routes/productsRoutes.js";

export default function (app) {
    //Mount Routers
    app.use("/api/v1/products", productsRoutes);
    app.use("/api/v1/users", usersRoutes);
    app.use("/api/v1/auth", authRoutes);

    // Error Middleware
    app.use(errorMiddleware);
}