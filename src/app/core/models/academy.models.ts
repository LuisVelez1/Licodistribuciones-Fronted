export interface Course {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  examUrl: string;
  order: number;

  isEnrolled: boolean;
  examPassed: boolean;
  score?: number;
  attemps?: number;
  approvedAt?: string;
}
