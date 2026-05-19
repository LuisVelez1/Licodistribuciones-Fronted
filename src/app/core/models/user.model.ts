export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  sede?: string;
  status?: string;
  areaId?: number;
  areaName?: string;
  birthDate?: string;
  createdAt?: string;
  roles?: string[];
  loginTime?: string;
}