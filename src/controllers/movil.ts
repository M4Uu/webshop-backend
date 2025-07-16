import { Request, Response } from "express"
import fs from 'fs';

export class MovilController {
  protected json_path_banklist = 'C:/Users/USUARIO/Desktop/webshop-workspace/webshop-backend/src/models/json/bancos.json'

  listbanks = async (_req: Request, res: Response) => {
    try {
      const rawData = fs.readFileSync(this.json_path_banklist, 'utf-8');
      res.status(200).json({
        data: JSON.parse(rawData),
        status: {
          statusCode: 200,
          message: 'Respuesta exitosa.'
        }
      })

    } catch (error: any) {
      res.status(500).json({
        status: {
          statusCode: 500,
          message: 'Server error: ', error
        }
      });
    }
  }
}