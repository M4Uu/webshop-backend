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

  getPrioridad = async (_req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.pedidoModel.getPrioridad());
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.pedidoModel.getById(req.body));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Pedido creado exitosamente', await this.pedidoModel.create(req.body));

      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      await this.pedidoModel.update(req.body)
      resService.resNotData(res, 200, 'Pedido creado exitosamente');
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  updateAdmin = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Pedido creado exitosamente', await this.pedidoModel.updateAdmin(req.body));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      await this.pedidoModel.delete(req.body)
      resService.resNotData(res, 200, 'Pedido eliminado exitosamente');
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }
}