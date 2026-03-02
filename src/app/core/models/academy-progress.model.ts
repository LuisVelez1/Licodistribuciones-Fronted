export interface CourseProgress {
    courseId: number;
    examPassed: boolean;
    score: number;
    attemps: number;
    approvedAt?: string; 
}