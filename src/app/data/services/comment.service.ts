import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment, CommentWithUser } from '../../domain/models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = `${environment.url}api/comments`;

  constructor(private http: HttpClient) { }

  getByIncident(incidentId: number): Observable<CommentWithUser[]> {
    return this.http.get<CommentWithUser[]>(`${this.apiUrl}/incident/${incidentId}`);
  }

  create(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  update(id: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, { content });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
