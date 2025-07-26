import { VentasModel } from "../models/postgre/ventas";
import { ResponsekitService as resService } from "../middleware/responsekit";
import { Request, Response } from "express"

export class VentasController {
  private ventasModel: typeof VentasModel;
  constructor(ventasModel: typeof VentasModel) {
    this.ventasModel = ventasModel;
  }

  index = async (_req: Request, res: Response) => {
    try {
      const data = await this.ventasModel.index();
      resService.resWithData(res, 200, 'Consulta exitosa', data);
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  getVentasByCedula = async (req: Request, res: Response) => {
    try {
      const data = await this.ventasModel.getVentasByCedula(req.body);
      resService.resWithData(res, 200, 'Consulta exitosa', data);
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }
}