// screens/types.ts
export interface User {
  id:          number;
  phoneNumber: string;
  name:        string;
  location:    string;
  email?:      string;
}