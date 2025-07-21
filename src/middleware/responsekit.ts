import { Response } from "express";

export class ResponsekitService {
  static cookieOptions = {
    secure: true,
    sameSite: 'none' as const,
  };

  static resWithData = (res: Response, status: number, message: string, data: any) =>
    res.status(status).json({
      data: data,
      status: {
        statusCode: status,
        message: message
      }
    });

  static resNotData = (res: Response, status: number, message: string) =>
    res.status(status).json({
      status: {
        statusCode: status,
        message: message
      }
    });

  static resError = (res: Response, status: number, error: any) =>
    res.status(status).json({ error: JSON.parse(error?.message as string) });

  static coockieSet = (res: Response, name_cookie: string, jwt: string | null) =>
    res.cookie(name_cookie, jwt,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60
      }
    );

}