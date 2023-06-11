import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { produtos, solicitacoes } from '@app/_helpers';
import { Solicitacao } from '@app/_models/solicitacao';

@Component({
  selector: 'app-detalhe-solicitacao',
  templateUrl: 'show.component.html'
})
export class DetalheSolicitacaoComponent {
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      setor: [''],
      prioridade: [''],
      dataDeCriacao: [''],
      prazoDeCotacao: [''],
      tipoEmbalagem: [''],
      descricaoEmbalagem: [''],
      solicitante: [''],
      cpfSolicitante: [''],
      produto: [''],
      quantidade: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    // Use o ID para buscar os detalhes da solicitação do serviço ou armazenamento adequado
    const solicitacao = solicitacoes.find(solicitacao => solicitacao.id === Number(id))
    const produto = produtos.find(produto => produto.id === solicitacao.produto)
    const produtoNome = produto?.nome
    solicitacao.produto = produtoNome

    this.form.get('setor')?.setValue(solicitacao?.setor)
    this.form.get('prioridade')?.setValue(solicitacao?.prioridade)
    this.form.get('dataDeCriacao')?.setValue(solicitacao?.dataDeCriacao)
    this.form.get('prazoDeCotacao')?.setValue(solicitacao?.prazoDeCotacao)
    this.form.get('tipoEmbalagem')?.setValue(solicitacao?.tipoEmbalagem)
    this.form.get('descricaoEmbalagem')?.setValue(solicitacao?.descricaoEmbalagem)
    this.form.get('solicitante')?.setValue(solicitacao?.solicitante)
    this.form.get('cpfSolicitante')?.setValue(solicitacao?.cpfSolicitante)
    this.form.get('produto')?.setValue(solicitacao?.produto)
    this.form.get('quantidade')?.setValue(solicitacao?.quantidade)

  }

  voltar() {
    this.router.navigate(['/solicitacao']);
  }
}
