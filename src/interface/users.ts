import { RowDataPacket } from "mysql2"

export interface Uuid extends RowDataPacket {
  uuid: string
}
export interface Time extends RowDataPacket {
  time: string
}
export interface UserData extends RowDataPacket {
  cedula: number,
  credencial: string,
  nombres: string,
  nombre_usuario: string,
  localidad: string,
  correo: string,
  imagen_url: string,
}