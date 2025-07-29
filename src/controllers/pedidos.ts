import { PedidoModel } from "../models/postgre/pedidos";
import { ResponsekitService as resService } from "../middleware/responsekit";
import { Request, Response } from "express"

export class PedidoController {
  private pedidoModel: typeof PedidoModel;
  constructor(pedidoModel: typeof PedidoModel) {
    this.pedidoModel = pedidoModel;
  }

  index = async (_req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.pedidoModel.index());
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  getByCedula = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.pedidoModel.getByCedula(req.body));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }
}