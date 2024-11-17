import { RowDataPacket } from "mysql2"

export interface Uuid extends RowDataPacket {
  uuid: string
}
export interface Time extends RowDataPacket {
  time: string
}
export interface UserData extends RowDataPacket {
  id: string,
  user_name: string,
  email_address: string,
  first_name: string,
  last_name: string,
  pswd: string,
  created_ad: string
}