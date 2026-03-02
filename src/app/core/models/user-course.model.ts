export interface UserCourseProgress {
  courseId: number;
  examPassed: boolean;
  approvedAt?: string;
  score?: number;
  attempts?: number;
}
