import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttentionService {

  private http = inject(HttpClient);
  apiUrl = API_URL.replace(/\/+$/, ''); // trim trailing slash if present

  trackAttention(uid: string, sessionId?: string | number): Observable<any> {
    const payload: any = { uid, track: true };
    if (sessionId !== undefined && sessionId !== null && `${sessionId}`.trim() !== '') {
      payload.sessionId = `${sessionId}`;
    }
    return this.http.post(`${this.apiUrl}/analyze`, payload);
  }

  pauseAttention(uid: string, sessionId?: string | number): Observable<any> {
    const payload: any = { uid, track: false };
    if (sessionId !== undefined && sessionId !== null && `${sessionId}`.trim() !== '') {
      payload.sessionId = `${sessionId}`;
    }
    return this.http.post(`${this.apiUrl}/analyze`, payload);
  }

  getStudentAttentionLevel(uid: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/overall/${uid}`);
  }
}
