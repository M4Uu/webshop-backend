import { Request, Response } from "express"
import { ResponsekitService as resService } from "../middleware/responsekit";
import storj from '../middleware/storj';
import sharp from 'sharp';
import { randomUUID } from 'crypto'
import { getBancos } from "../models/json/bancos";

const uploadImage = async (req: any) => {
  const optimizationOptions: sharp.WebpOptions = {
    quality: 85,
    alphaQuality: 90,
    lossless: false,
    nearLossless: true,
    smartSubsample: true
  };

  const webpBuffer = await sharp(req.file.buffer)
    .webp(optimizationOptions)
    .toBuffer();

  return {
    imageUrl: await storj.uploadImage(`img-${randomUUID()}.webp`, webpBuffer),
    webpBuffer: webpBuffer
  }
}

export class ToolkitController {

  listbanks = async (_req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Respuesta exitosa', getBancos());
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
      resService.resNotData(res, 400, 'No image uploaded');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.file.mimetype)) {
      res.status(415).send('Formato no soportado');
      return;
    }

    try {
      const { imageUrl, webpBuffer } = await uploadImage(req);
      resService.resWithData(res, 200, 'success', {
        url: imageUrl,
        size: webpBuffer.byteLength,
        originalSize: req.file.size
      })
      return;
    } catch (reason) {
      console.log('Error in toolkit update image:', reason);
      resService.resNotData(res, 401, 'Server Error');
      return;
    }
  }
}