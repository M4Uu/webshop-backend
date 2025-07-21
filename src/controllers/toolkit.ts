import { Request, Response } from "express"
import { ResponsekitService as resService } from "../middleware/responsekit";
import storj from '../middleware/storj';
import sharp from 'sharp';
import { randomUUID } from 'crypto'
import { UserModel } from "../models/postgre/users";
import { getBancos } from "../models/json/bancos";


export class ToolkitController {

  listbanks = async (_req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Respuesta exitosa', getBancos());
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }


  uploadimg = async (req: Request, res: Response) => {
    if (!req.file) {
      resService.resNotData(res, 400, 'No image uploaded');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.file.mimetype)) {
      res.status(415).send('Formato no soportado');
      return;
    }

    const fileName = `img-${randomUUID()}.webp`;

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

    try {
      const imageUrl = await storj.uploadImage(fileName, webpBuffer);
      const result = await UserModel.updateImage({ imagen_url: imageUrl, cedula: req.params['cedula'] });

      if (result) {
        resService.resWithData(res, 200, 'success', {
          url: imageUrl,
          size: webpBuffer.byteLength,
          originalSize: req.file.size
        })
      } else {
        resService.resNotData(res, 401, 'Error update image in DB');
      }
      return;
    } catch (reason) {
      console.log('Error in toolkit update image:', reason);
      return;
    }
  }
}