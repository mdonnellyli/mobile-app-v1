// screens/types.ts
export interface Role {
  id: number;
  name: string;
}
export interface User {
  id: number;
  phoneNumber: string;
  name: string;
  location: string;
  email?: string;
  roles: Role[];
}