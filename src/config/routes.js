import errorMiddleware from "../middlewares/error-middleware.js";
import userRoutes from "../routes/usersRoutes.js";
// import staffRoutes from "../routes/staffRoutes.js";
import authRoutes from "../routes/authRoutes.js";

export default function (app) {
    //Mount Routers
    app.use("/api/v1/users", userRoutes);
    // app.use("/api/v1/staff", staffRoutes);
    app.use("/api/v1/auth", authRoutes);

    // Error Middleware
    app.use(errorMiddleware);
}