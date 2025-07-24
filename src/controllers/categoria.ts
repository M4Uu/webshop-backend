import { CategoriaModel } from "../models/postgre/categoria";
import { ResponsekitService as resService } from "../middleware/responsekit";
import { Request, Response } from "express"

export class CategoriaController {
  private categoriaModel: typeof CategoriaModel;
  constructor(categoriaModel: typeof CategoriaModel) {
    this.categoriaModel = categoriaModel;
  }

  index = async (_req: Request, res: Response) => {
    try {
      const data = await this.categoriaModel.index();
      resService.resWithData(res, 200, 'Consulta exitosa', data);
      return;
    } catch (reason) {
      resService.resError(res, 400, reason);
      return;
    }
  }
}