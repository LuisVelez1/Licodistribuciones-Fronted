export interface Certificate {
  courseId: number;
  courseTitle: string;
  issuedAt: string;
  certificateUrl?: string;
  // Extended mock fields
  id?: number;
  userName?: string;
  score?: number;
}
