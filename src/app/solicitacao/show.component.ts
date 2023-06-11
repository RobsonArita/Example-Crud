import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { produtos, solicitacoes } from '@app/_helpers';
import { SolicitacaoService } from '@app/_services/solicitacao.service';
import { first } from 'rxjs/operators';
import { AlertService } from '@app/_services';

@Component({
  selector: 'app-detalhe-solicitacao',
  templateUrl: 'show.component.html'
})
export class DetalheSolicitacaoComponent {
  form: FormGroup;
  loading = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private solicitacaoService: SolicitacaoService,
    private alertService: AlertService
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
      quantidade: [''],
      situacao: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    // Use o ID para buscar os detalhes da solicitação do serviço ou armazenamento adequado
    const solicitacao = solicitacoes.find(solicitacao => solicitacao.id === Number(id))
    const produto = produtos.find(produto => produto.id === solicitacao.produto)
    const produtoNome = produto?.nome

    this.form.get('setor')?.setValue(solicitacao?.setor)
    this.form.get('prioridade')?.setValue(solicitacao?.prioridade)
    this.form.get('dataDeCriacao')?.setValue(solicitacao?.dataDeCriacao)
    this.form.get('prazoDeCotacao')?.setValue(solicitacao?.prazoDeCotacao)
    this.form.get('tipoEmbalagem')?.setValue(solicitacao?.tipoEmbalagem)
    this.form.get('descricaoEmbalagem')?.setValue(solicitacao?.descricaoEmbalagem)
    this.form.get('solicitante')?.setValue(solicitacao?.solicitante)
    this.form.get('cpfSolicitante')?.setValue(solicitacao?.cpfSolicitante)
    this.form.get('produto')?.setValue(produtoNome)
    this.form.get('quantidade')?.setValue(solicitacao?.quantidade)
    this.form.get('situacao')?.setValue(solicitacao?.situacao ?? 'aguardando')
  }

  aprovar(){
    const id = this.route.snapshot.params.id;
    console.log('aprova')
    this.solicitacaoService.update(id, { situacao: 'aprovado' }).pipe(first())
    .subscribe(() => {
        this.alertService.success('Solicitacao aprovada', { keepAfterRouteChange: true });
        this.router.navigate(['../../'], { relativeTo: this.route });
    })
    .add(() => this.loading = false);
  }

  reprovar(){
    const id = this.route.snapshot.params.id;
    this.solicitacaoService.update(id, { situacao: 'reprovado' }).pipe(first())
    .subscribe(() => {
        this.alertService.success('Solicitacao reprovada', { keepAfterRouteChange: true });
        this.router.navigate(['../../'], { relativeTo: this.route });
    })
    .add(() => this.loading = false);
  }

  voltar() {
    console.log('voltar')
    this.router.navigate(['/solicitacao']);
  }
}
