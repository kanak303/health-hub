export type Role = "admin" | "doctor" | "patient" | "clinic";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
