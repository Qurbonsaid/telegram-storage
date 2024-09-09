import { Router } from "express";
import { download, upload } from "../controllers/uploads.controllers";
import multer from "multer";

class UploadRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/:file_id", download);
    this.router.post(
      "/",
      multer({ storage: multer.memoryStorage() }).single("document"),
      upload
    );
  }
}

export default new UploadRoutes().router;
