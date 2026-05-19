export interface NewsComment {
  id: number;
  newsId: number;

  userId: string;
  author: string;

  comment: string;
  createdAt: string;
}