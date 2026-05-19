import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { NewsComment } from '../models/news-comment.models';
import { NewsCommentRequest } from '../models/news-comment-request.model';

@Injectable({
  providedIn: 'root'
})
export class NewsCommentService {

  private apiUrl = API_ENDPOINTS.comments;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getComments(newsId: number): Observable<NewsComment[]> {

    return this.http.get<NewsComment[]>(
      `${this.apiUrl}/${newsId}/comments`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  createComment(
    newsId: number,
    request: NewsCommentRequest
  ): Observable<NewsComment> {

    return this.http.post<NewsComment>(
      `${this.apiUrl}/${newsId}/comments`,
      request,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  private getAuthHeaders(): HttpHeaders {

    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {

      const token = localStorage.getItem('token');

      if (token) {
        headers = headers.set(
          'Authorization',
          `Bearer ${token}`
        );
      }
    }

    return headers;
  }
}