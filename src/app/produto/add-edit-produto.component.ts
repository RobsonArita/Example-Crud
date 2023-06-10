import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { first } from 'rxjs/operators'

import { AlertService } from '@app/_services'
import { ProdutoService } from '@app/_services/produto.service'

@Component({ templateUrl: 'add-edit-produto.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup
    id!: string
    isAddMode!: boolean
    loading = false
    submitted = false

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private produtoService: ProdutoService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id']
        this.isAddMode = !this.id

        this.form = this.formBuilder.group({
            codigo: ['', Validators.required],
            nome: ['', Validators.required],
            descricao: ['', Validators.required],
            tipoEmbalagem: ['', [Validators.required]]
        })

        if (!this.isAddMode) {
            this.produtoService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x))
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls }

    onSubmit() {
        this.submitted = true
        console.log('submit')
        // reset alerts on submit
        this.alertService.clear()

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('invalid')
            console.log({ invalid: this.form })
            return
        }

        this.loading = true
        if (this.isAddMode) {
            console.log('addmode')
            this.createProduct()
        } else {
            this.updateProduct()
        }
    }

    private createProduct() {
        this.produtoService.create(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Produto criado', { keepAfterRouteChange: true })
                this.router.navigate(['../'], { relativeTo: this.route })
            })
            .add(() => this.loading = false)
    }

    private updateProduct() {
        this.produtoService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Produto atualizado', { keepAfterRouteChange: true })
                this.router.navigate(['../../'], { relativeTo: this.route })
            })
            .add(() => this.loading = false)
    }
}