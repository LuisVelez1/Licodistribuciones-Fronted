import { environment } from '../../../enviroments/enviroment.prod';

export const API_BASE_URL = environment.apiGatewayUrl;

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  users: `${API_BASE_URL}/api/users`,
  documents: `${API_BASE_URL}/api/documents`,
  birthdays: `${API_BASE_URL}/api/users/birthdays`,
  certificates: `${API_BASE_URL}/api/academy/certificates`,
  academy: `${API_BASE_URL}/api/academy`,
  requirements: `${API_BASE_URL}/api/requirements`,
};
