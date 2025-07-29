import { Request, Response } from "express"
import { ResponsekitService as resService } from "../middleware/responsekit";
import { GuardadosModel } from "../models/postgre/guardados";

export class GuardadosController {
  private guardadosModel: any;
  constructor(guardadosModel: GuardadosModel) {
    this.guardadosModel = guardadosModel;
  }

  index = async (req: Request, res: Response) => {
    try {
      resService.resWithData(res,
        200,
        'Respuesta exitosa',
        await this.guardadosModel.index(req.body)
      );
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  insertar = async (req: Request, res: Response) => {
    try {
      await this.guardadosModel.insertar(req.body)
      resService.resNotData(res, 200, 'Guardado exitosamente');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

  eliminar = async (req: Request, res: Response) => {
    try {
      await this.guardadosModel.eliminar(req.body)
      resService.resNotData(res, 200, 'Eliminado de los guardados de manera exitosa');
    } catch (error: any) {
      resService.resNotData(res, 500, 'Server error:' + error);
    }
  }

}