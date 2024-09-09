import { Application } from "express";
import uploadRoutes from "./upload.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/uploads", uploadRoutes);
  }
}
