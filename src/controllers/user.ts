import { ResponsekitService as resService } from "../middleware/responsekit";
import { JWTMiddlewareInitial, JWTMiddlewareRefresh, JWTParse } from "../middleware/jws";
import * as schema from "../schema/user"
import { Request, Response } from "express"

export class UserController {
  private userModel: any;
  constructor(userModel: any) {
    this.userModel = userModel;
  }

  logOut = async (_req: Request, res: Response) => {
    res.clearCookie('access_token', resService.cookieOptions);
    res.clearCookie('refresh_token', resService.cookieOptions);
    resService.resNotData(res, 200, 'Log out.');
    return;
  }

  protected = async (req: Request, res: Response) => {
    const token = req.cookies['access_token']

    if (!token) {
      resService.resNotData(res, 403, 'Access not authorized (Not Coockies)')
      return;
    }
    try {
      resService.resWithData(res, 200, 'Account current', JWTParse(token));
      return;
    } catch {
      res.clearCookie('access_token');
      const ref_token = req.cookies['refresh_token']
      if (!token) {
        resService.resNotData(res, 403, 'Access not authorized');
        return;
      }
      try {
        const user = JWTMiddlewareInitial(await this.userModel.refreshUser({ input: JWTParse(ref_token) }))
        resService.coockieSet(res, 'access_token', user);
        resService.resWithData(res, 200, 'Account current', user);
        return;
      } catch {
        resService.resNotData(res, 401, 'Account expired');
        return;
      }
    }
  }

  login = async (req: Request, res: Response) => {
    const body = schema.validatePartialUser(req.body)
    const data = await this.userModel.login(body.data);
    if (!data) {
      resService.resNotData(res, 401, 'Correo o contraseña inválidos');
      return;
    }
    const user = JWTMiddlewareInitial(data);
    const ref_user = JWTMiddlewareRefresh(data.cedula);

    try {
      resService.coockieSet(res, 'access_token', user);
      resService.coockieSet(res, 'refresh_token', ref_user);

      resService.resNotData(res, 200, 'Login Success');
    } catch (error) {
      console.log(error);
      resService.resNotData(res, 500, 'Server error');
      return;
    }
  }

  register = async (req: Request, res: Response) => {
    req.body.cedula = Number(req.body.cedula);
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 422, result.error);
      return;
    }
    try {
      const user = await this.userModel.register(result.data);
      user ? resService.resNotData(res, 201, 'Usuario registrado correctamente')
        : resService.resNotData(res, 406, 'Error al registrar');
    } catch (err) {
      console.log(err);
      resService.resNotData(res, 500, 'Server error');
      return;
    }
  }

  delete = async (_req: Request, res: Response) =>
    resService.resNotData(res, 200, 'Este endpoint aún no se ha hecho, pero al menos manda un mensaje.')

  update = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    await this.userModel.update(result.data);
    resService.resNotData(res, 201, 'Datos cambiados (Perfil)');
    return;
  }

  getMovil = async (req: Request, res: Response) => {
    const body = schema.validatePartialUser(req.body);
    try {
      resService.resWithData(res, 200, 'Datos obtenidos', await this.userModel.getMovil(body.data?.cedula));
      return
    } catch (err) {
      console.log(err);
      resService.resNotData(res, 500, 'Server error');
      return;
    }
  }

  updateMovil = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    await this.userModel.updateMovil(result.data);
    resService.resNotData(res, 201, 'Datos Cambiados (Móvil)');
    return;
  }

  getRoles = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    const data = await this.userModel.getRoles(result.data.cedula);
    resService.resWithData(res, 200, 'Consulta exitosa', data);
    return;
  }

  getUsers = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    const data = await this.userModel.getUsers();
    resService.resWithData(res, 200, 'Consulta exitosa', data);
    return;
  }

  toggleAdmin = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    const data = await this.userModel.toggleAdmin(result.data.cedula);
    resService.resWithData(res, 200, data.message, data.status);
    return;
  }

  toggleStatus = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    const data = await this.userModel.toggleStatus(result.data.cedula);
    resService.resWithData(res, 200, data.message, data.status);
    return;
  }

  isActive = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      resService.resError(res, 400, result.error);
      return;
    }
    const data = await this.userModel.isActive(result.data.cedula);
    resService.resWithData(res, 200, data.message, data.status);
    return;
  }
}