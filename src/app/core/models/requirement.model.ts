import { RequirementType } from "./requirement-type.model";

export interface Requirement {
  id: number;
  title: string;
  description: string;
  areaId: number;
  areaName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdBy: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  type: RequirementType;
  active: boolean;
}
