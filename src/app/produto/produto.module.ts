import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoRoutingModule } from './produto-routing.module';
import { LayoutComponent } from './layout-produto.component';
import { ProdutoComponent } from './list-produto.component';
import { AddEditComponent } from './add-edit-produto.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProdutoRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ProdutoComponent,
        AddEditComponent
    ]
})
export class ProdutosModule { }