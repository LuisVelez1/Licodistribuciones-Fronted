export interface LoginInfo {
  id?: string;
  token?: string;
  firstName: string;
  lastName: string;
  email?: string;
  position?: string;
  phone?: string;
  sede?: string;
  loginTime: Date | string;
}
