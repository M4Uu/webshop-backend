import { Request, Response } from "express"
import { ResponsekitService as resService } from "../middleware/responsekit";
import { CarritoModel } from "../models/postgre/carrito";

export class CarritoController {
  private carritoModel: any;
  constructor(carritoModel: CarritoModel) {
    this.carritoModel = carritoModel;
  }

  index = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res,
        200,
        'Respuesta exitosa',
        await this.carritoModel.index(req.body)
      );
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

}