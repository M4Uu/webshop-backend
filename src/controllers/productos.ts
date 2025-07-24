import { ProductosModel } from "models/postgre/productos";
import { ResponsekitService as resService } from "../middleware/responsekit";
import { Request, Response } from "express"

export class ProductosController {
  private productosModel: typeof ProductosModel;
  constructor(productosModel: typeof ProductosModel) {
    this.productosModel = productosModel;
  }

  index = async (_req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.productosModel.index());
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  getProductoById = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.productosModel.getProductoById(req.params['id']));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }
}