import { ProductosModel } from "../models/postgre/productos";
import { ResponsekitService as resService } from "../middleware/responsekit";
import { Request, Response } from "express"
import { validatePartialProducto } from "../schema/productos";

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

  catalogo = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.productosModel.catalogo(req.body)
      );
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  getProductoById = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.productosModel.getProductoById(req.body));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  create = async (req: Request, res: Response) => {
    const body = validatePartialProducto(req.body);
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.productosModel.create(body.data));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  update = async (req: Request, res: Response) => {
    const body = validatePartialProducto(req.body);
    try {
      resService.resWithData(res, 200, 'Consulta exitosa', await this.productosModel.update(body.data));
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }

  calificacion = async (req: Request, res: Response) => {
    const body = validatePartialProducto(req.body);
    try {
      await this.productosModel.calificacion(body.data)
      resService.resNotData(res, 200, 'Consulta exitosa');
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }
}