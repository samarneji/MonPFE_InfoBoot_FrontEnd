import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private apiUrl = 'http://127.0.0.1:2387/documents/';  // URL de votre API
    domainesUrl = 'http://127.0.0.1:2387/domaine';
    projectsUrl = 'http://127.0.0.1:2387/project';
    constructor(private http: HttpClient) {}

    getDocuments(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
    getDomaineById(id: number): Observable<any> {
        return this.http.get<any>(`${this.domainesUrl}/${id}`);
    }

    getProjectById(id: number): Observable<any> {
        return this.http.get<any>(`${this.projectsUrl}/${id}`);
    }
}
