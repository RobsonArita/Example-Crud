import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '@environments/environment'
import { Produto } from '@app/_models/produto'

const baseUrl = `${environment.apiUrl}/produtos`

@Injectable({ providedIn: 'root' })
export class ProdutoService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Produto[]>(baseUrl)
    }

    getById(id: string) {
        return this.http.get<Produto>(`${baseUrl}/${id}`)
    }

    create(params: any) {
        return this.http.post(baseUrl, params)
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params)
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
    }
}