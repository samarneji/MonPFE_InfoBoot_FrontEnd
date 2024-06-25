import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiBaseUrl = 'http://127.0.0.1:2387/api/';

  constructor(private http: HttpClient) { }

  getTotalBotMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_bot_messages/`);
  }

  getTotalUserMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_user_messages/`);
  }

  getTotalMessagesToday(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_messages_today/`);
  }

  getTotalTextResponseMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_text_response_messages/`);
  }

  getTotalFileResponseMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_file_response_messages/`);
  }
  getTotalSqlResponseMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_sql_response_messages/`);
  }
  getTotalMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_messages/`);
  }
  getTotalDocuments(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}total_documents/`);
  }
}
