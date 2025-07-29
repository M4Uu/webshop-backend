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
      resService.resWithData(res, 200, 'Respuesta exitosa', await this.carritoModel.index(req.body)
      );
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  insertar = async (req: Request, res: Response) => {
    try {
      await this.carritoModel.insertar(req.body);
      resService.resNotData(res, 200, 'Añadido al carrito exitosamente.');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  eliminar = async (req: Request, res: Response) => {
    try {
      await this.carritoModel.eliminar(req.body);
      resService.resNotData(res, 200, 'Eliminado del carrito exitosamente.');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  disminuirCantidad = async (req: Request, res: Response) => {
    try {
      await this.carritoModel.disminuirCantidad(req.body);
      resService.resNotData(res, 200, 'Eliminado del carrito exitosamente.');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  aumentarCantidad = async (req: Request, res: Response) => {
    try {
      await this.carritoModel.aumentarCantidad(req.body);
      resService.resNotData(res, 200, 'Eliminado del carrito exitosamente.');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  vendido = async (req: Request, res: Response) => {
    try {
      await this.carritoModel.vendido(req.body);
      resService.resNotData(res, 200, 'Venta realizada exitosamente.');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

}