import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';
import { Solicitacao } from '@app/_models/solicitacao';
import { SolicitacaoService } from '@app/_services/solicitacao.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    solicitacoes!: Solicitacao[];

    constructor(private solicitacaoService: SolicitacaoService) {}

    ngOnInit() {
        this.solicitacaoService.getAll()
            .pipe(first())
            .subscribe(solicitacoes => this.solicitacoes = solicitacoes);
    }

    deleteSolicitacao(id: string) {
        const solicitacao = this.solicitacoes.find(x => x.id === id);
        if (!solicitacao) return;
        solicitacao.isDeleting = true;
        this.solicitacaoService.delete(id)
            .pipe(first())
            .subscribe(() => this.solicitacoes = this.solicitacoes.filter(x => x.id !== id));
    }
}