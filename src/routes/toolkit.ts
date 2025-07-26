import { Router } from "express";
import { ToolkitController } from "../controllers/toolkit";
import multer from 'multer';


export const createToolkitRouter = () => {
  const toolkitRouter = Router()
  const toolkitController = new ToolkitController()
  const upload = multer({ storage: multer.memoryStorage() });

  // ENDPOINTS
  toolkitRouter.get('/listbanks', toolkitController.listbanks);
  toolkitRouter.post('/upload_img', upload.single('image'), toolkitController.uploadImage);

  return toolkitRouter;
}