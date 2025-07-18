import { JWTMiddlewareInitial, JWTMiddlewareRefresh, JWTParse } from "../middleware/jws";
import * as schema from "../schema/user"
import { Request, Response } from "express"

export class UserController {
  private userModel: any;
  constructor(userModel: any) {
    this.userModel = userModel
  }

  logOut = async (_req: Request, res: Response) => {
    const cookieOptions = {
      secure: true,
      sameSite: 'none' as const,
    };
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    res.status(200).json({
      status: {
        statusCode: 200,
        message: 'Log out.'
      }
    });
  }

  protected = async (req: Request, res: Response) => {
    const token = req.cookies['access_token']

    if (!token) {
      res.status(403).json({
        status: {
          statusCode: 403,
          message: 'Access not authorized (Not Coockies)'
        }
      });
      return;
    }
    try {
      res.status(200).json({
        payload: JWTParse(token),
        status: {
          statusCode: 200,
          message: 'Account current'
        }
      })
    } catch {
      res.clearCookie('access_token');
      const ref_token = req.cookies['refresh_token']
      if (!token) {
        res.status(403).json({
          status: {
            statusCode: 403,
            message: 'Access not authorized'
          }
        });
        return;
      }
      try {
        const user = JWTMiddlewareInitial(await this.userModel.refreshUser({ input: JWTParse(ref_token) }))
        res.cookie('access_token',
          user,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60
          }
        )
        res.status(200).json({
          payload: user,
          status: {
            statusCode: 200,
            message: 'Account current'
          }
        })
      } catch {
        res.status(401).json({
          status: {
            statusCode: 401,
            message: 'Account expired'
          }
        });
        return;
      }
    }
  }

  login = async (req: Request, res: Response) => {
    const body = schema.validatePartialUser(req.body)
    const data = await this.userModel.getUser(body.data);
    if (!data) {
      res.status(401).json({
        status: {
          statusCode: 401,
          message: 'Correo o contraseña inválidos'
        }
      });
      return;
    }
    const user = JWTMiddlewareInitial(data);
    const ref_user = JWTMiddlewareRefresh(data.cedula);

    try {
      res.cookie('access_token',
        user,
        {
          httpOnly: true, // ;a coockie solo se puede acceder en el servidor
          secure: true, //la coockie solo se puede acceder en https
          sameSite: 'none', // la coockie entre múltiples dominios (con 'none' solo se puede acceder desde el mismo dominio)
          maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
        }
      )

      res.cookie('refresh_token',
        ref_user,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 30 * 24 * 60 * 60 * 1000
        }
      )

      res.status(200).json({
        status: {
          statusCode: 200,
          message: 'Login Success'
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: {
          statusCode: 500,
          message: 'Server_error'
        }
      });
      return;
    }
  }

  register = async (req: Request, res: Response) => {
    req.body.cedula = Number(req.body.cedula);
    const result = schema.validatePartialUser(req.body)
    let user;
    if (result.error) {
      res.status(422).json({ error: JSON.parse(result.error?.message as string) })
      return;
    }
    try {
      user = await this.userModel.register(result.data);
      user ?
        res.status(201).json({
          status: {
            user: user,
            statusCode: 201,
            message: 'Usuario registrado correctamente'
          }
        })
        : res.status(406).json({
          status: {
            statusCode: 406,
            message: 'Error al registarar'
          }
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: {
          statusCode: 500,
          message: 'Server error'
        }
      });
      return;
    }
  }

  delete = async (_req: Request, res: Response) => {
    res.status(201).json({
      status: {
        statusCode: 200,
        message: 'Este endpoint aún no se ha hecho, pero al menos manda un mensaje.'
      }
    })
  }

  update = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      res.status(400).json({ error: JSON.parse(result.error?.message as string) })
      return;
    }
    await this.userModel.update(result.data);
    res.status(201).json({
      status: {
        statusCode: 201,
        message: 'Datos cambiados (Perfil)'
      }
    })
    return;
  }

  getMovil = async (req: Request, res: Response) => {
    const body = schema.validatePartialUser(req.body);
    try {
      const result = await this.userModel.getMovil(body.data?.cedula);
      res.status(200).json({
        data: result,
        status: {
          statusCode: 200,
          message: 'Datos cambiados'
        }
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: {
          statusCode: 500,
          message: 'Server error'
        }
      });
      return;
    }
  }

  updateMovil = async (req: Request, res: Response) => {
    const result = schema.validatePartialUser(req.body)
    if (result.error) {
      res.status(400).json({ error: JSON.parse(result.error?.message as string) })
      return;
    }
    await this.userModel.updateMovil(result.data);
    res.status(201).json({
      status: {
        statusCode: 201,
        message: 'Datos cambiados (Móvil)'
      }
    })
    return;
  }
}