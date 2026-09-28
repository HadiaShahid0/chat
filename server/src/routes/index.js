import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import messageRoutes from "./messageRoutes.js";
import mfaRoutes from "./mfaRoutes.js"

const routes = (app) => {
  
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  app.use("/api/messages", messageRoutes);
  app.use("/api/auth/mfa", mfaRoutes)

};

export default routes;
