import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Solicitacao } from '@app/_models/solicitacao';

const baseUrl = `${environment.apiUrl}/solicitacao`;

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Solicitacao[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Solicitacao>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}