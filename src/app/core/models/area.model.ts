export interface AreaCreateRequest {
  name: string;
}

export interface AreaResponse {
  id: number;
  name: string;
  active: boolean;
  createdAt: string;
}

export interface AreaUpdateRequest {
  name: string;
  active: boolean;
}

