export interface UserA {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  sede: string;
  area: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
