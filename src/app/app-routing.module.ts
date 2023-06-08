import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const usersModule = () => import('./users/users.module').then(x => x.UsersModule)
const solicitacoesModule = () => import('./solicitacao/solicitacao.module').then(x => x.SolicitacaoModule)

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'users', loadChildren: usersModule },
    { path: 'solicitacao', loadChildren: solicitacoesModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }