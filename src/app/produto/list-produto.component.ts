import { Component, OnInit } from '@angular/core'
import { Produto } from '@app/_models/produto'
import { ProdutoService } from '@app/_services/produto.service'
import { first } from 'rxjs/operators'


@Component({ templateUrl: 'list-produto.component.html' })
export class ProdutoComponent implements OnInit {
    produtos!: Array<Produto>

    constructor(private produtoService: ProdutoService) {}

    ngOnInit() {
        this.produtoService.getAll()
            .pipe(first())
            .subscribe(produto => this.produtos = produto)
    }

    deleteProduto(id: string) {
        const produto = this.produtos.find(x => x.id === id)
        if (!produto) return
        produto.isDeleting = true
        this.produtoService.delete(id)
            .pipe(first())
            .subscribe(() => this.produtos = this.produtos.filter(x => x.id !== id))
    }
}