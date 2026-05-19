export interface FixedAssetResponse {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serial: string;
  location: string;
  sede: string;
  areaId: number;
  areaName: string;
  assignedToId: string;
  assignedToFullName: string;
  status: string;
  acquisitionDate: string;
  acquisitionValue: number;
  description: string;
  processor: string;
  ram: string;
  storage: string;
  os: string;
  ip: string;
  mac: string;
  warrantyDate: string;
  actaFirmada: boolean;
  actaDate: string;
}

export interface FixedAssetRequest {
  code: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serial: string;
  location: string;
  sede: string;
  areaId: number | null;
  assignedToId: string | null;
  status: string;
  acquisitionDate: string | null;
  acquisitionValue: number | null;
  description: string;
  processor: string;
  ram: string;
  storage: string;
  os: string;
  ip: string;
  mac: string;
  warrantyDate: string | null;
  actaFirmada: boolean;
  actaDate: string | null;
}