import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import {Observable} from 'rxjs';


export interface Domaine {
    id: number;
    nom_domaine: string;
    description?: string;
}

export interface Project {
    id: number;
    projectName: string;
    projectDescription?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataLayerService {

    constructor(
        private http: HttpClient
    ) { }

    private apiUrl = 'http://127.0.0.1:2387'; // URL de base de l'API Django
    sendMessage(query: string, conversationId: number): Observable<any> {
        const url = `${this.apiUrl}chatbot/`;
        return this.http.post<any>(url, { query, conversation_id: conversationId });
    }
    getConversations(): Observable<any[]> {
        const url = `${this.apiUrl}conversations/`;
        return this.http.get<any[]>(url);
    }

    getMessages(conversationId: number): Observable<any[]> {
        const url = `${this.apiUrl}messages/${conversationId}/`;
        return this.http.get<any[]>(url);
    }
    getExportedDataQA(): Observable<any> {
        return this.http.get(`${this.apiUrl}/export-data/`);
    }
    getDocuments(): Observable<any> {
        return this.http.get(`${this.apiUrl}/documents/`); // Mettez à jour avec l'URL correcte de l'API
    }
    getDomaines(): Observable<any> {
        return this.http.get(`${this.apiUrl}/domaines/`); // Mettez à jour avec l'URL correcte de l'API
    }

    getProjects(): Observable<any> {
        return this.http.get(`${this.apiUrl}/projects/`); // Mettez à jour avec l'URL correcte de l'API
    }
    getScripts(): Observable<any> {
        return this.http.get(`${this.apiUrl}/api/script/`);
    }

    // Méthode pour créer une configuration de tâche
    createTaskConfiguration(taskConfig: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/api/task-configurations/`, taskConfig);
    }

    uploadFile(formData: FormData) {
        return this.http.post(`${this.apiUrl}/upload/`, formData);
    }
    getInvoices() {
        return this.http.get<any[]>('/api/invoices');
    }
    getInvoice(id) {
        return this.http.get<any[]>('/api/invoices/'+id);
    }
    saveInvoice(invoice) {
        if(invoice.id) {
            return this.http.put<any[]>('/api/invoices/'+invoice.id, invoice);
        } else {
            invoice.id = Utils.genId();
            return this.http.post<any[]>('/api/invoices/', invoice);
        }
    }
    deleteInvoice(id) {
        return this.http.delete<any[]>('/api/invoices/'+id);
    }
    getMails() {
        return this.http.get<any[]>('/api/mails');
    }
    getCountries() {
        return this.http.get<any[]>('/api/countries');
    }
    getProducts() {
        return this.http.get<any[]>('api/products');
    }
}
