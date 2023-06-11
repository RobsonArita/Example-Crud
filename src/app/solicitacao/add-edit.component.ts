import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AlertService } from '@app/_services';
import { SolicitacaoService } from '@app/_services/solicitacao.service';
import { Produto } from '@app/_models/produto';

const urlProdutos = 'http://localhost:4000/produtos'
@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    options: any[] = [];

    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private solicitacaoService: SolicitacaoService,
        private alertService: AlertService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            solicitante: ['', Validators.required],
            prioridade: ['', Validators.required],
            cpfSolicitante: ['', Validators.required],
            setor: ['', Validators.required],
            dataDeCriacao: ['', [Validators.required]],
            prazoDeCotacao: ['', Validators.required],
            produto: ['', Validators.required],
            quantidade: ['', Validators.required],
            tipoEmbalagem: ['', Validators.required],
            descricaoEmbalagem: ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.solicitacaoService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }

        this.fetchOptions()
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    fetchOptions() {
        this.http.get<any>(urlProdutos).subscribe(data => {
            const optionArray = data.map((product: Produto) => { return { value: product.id, label: product.nome } })
            this.options = optionArray;
          });   
    }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('invalid')
            console.log({ invalid: this.form })
            return;
        }
        
        this.loading = true;
        if (this.isAddMode) {
            console.log('addmode')
            this.createSolicitacao();
        } else {
            this.updateSolicitacao();
        }
    }

    private createSolicitacao() {
        this.solicitacaoService.create(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Solicitacao criada', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateSolicitacao() {
        this.solicitacaoService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Solicitacao atualizada', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}