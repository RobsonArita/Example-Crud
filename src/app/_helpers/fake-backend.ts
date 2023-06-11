import { Injectable } from '@angular/core'
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { delay, materialize, dematerialize } from 'rxjs/operators'

import { Produto } from '@app/_models/produto'

// array in local storage for registered users
const usersKey = 'users'
const usersJSON = localStorage.getItem(usersKey)
let users: any[] = usersJSON ? JSON.parse(usersJSON) : []

const solicitacoesKey = 'solicitacoes'
const solicitacoesJSON = localStorage.getItem(solicitacoesKey)
export let solicitacoes: any[] = solicitacoesJSON ? JSON.parse(solicitacoesJSON) : []

const produtosKey = 'produtos'
const produtosJSON = localStorage.getItem(produtosKey)
export let produtos: Array<Produto> = produtosJSON ? JSON.parse(produtosJSON) : []

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request
        console.log({ url, method, body })

        return handleRoute()

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users') && method === 'GET':
                    return getUsers()
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById()
                case url.endsWith('/users') && method === 'POST':
                    return createUser()
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser()
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser()

                case url.endsWith('/solicitacao') && method === 'GET':
                    return getSolicitacoes()
                case url.match(/\/solicitacao\/\d+$/) && method === 'GET':
                    return getSolicitacaoById()
                case url.endsWith('/solicitacao') && method === 'POST':
                    return createSolicitacao()
                case url.match(/\/solicitacao\/\d+$/) && method === 'PUT':
                    return updateSolicitacao()
                case url.match(/\/solicitacao\/\d+$/) && method === 'DELETE':
                    return deleteSolicitacao()

                case url.endsWith('/produtos') && method === 'GET':
                    return getProdutos()
                case url.match(/\/produtos\/\d+$/) && method === 'GET':
                    return getProdutoById()
                case url.endsWith('/produtos') && method === 'POST':
                    return createProduto(body)
                case url.match(/\/produtos\/\d+$/) && method === 'PUT':
                    return updateProduto(body)
                case url.match(/\/produtos\/\d+$/) && method === 'DELETE':
                    return deleteProduto()

                default:
                    // pass through any requests not handled above
                    return next.handle(request)
            }    
        }

        // route functions

        function getUsers() {
            return ok(users.map(x => userBasicDetails(x)))

        }

        function getUserById() {
            const user = users.find(x => x.id === idFromUrl())
            return ok(userBasicDetails(user))
        }

        function createUser() {
            const user = body

            if (users.find(x => x.email === user.email)) {
                return error(`User with the email ${user.email} already exists`)
            }

            // assign user id and a few other properties then save
            user.id = newUserId()
            delete user.confirmPassword
            users.push(user)
            localStorage.setItem(usersKey, JSON.stringify(users))

            return ok()
        }

        function updateUser() {
            let params = body
            let user = users.find(x => x.id === idFromUrl())

            if (params.email !== user.email && users.find(x => x.email === params.email)) {
                return error(`User with the email ${params.email} already exists`)
            }

            // only update password if entered
            if (!params.password) {
                delete params.password
            }

            // update and save user
            Object.assign(user, params)
            localStorage.setItem(usersKey, JSON.stringify(users))

            return ok()
        }

        function deleteUser() {
            users = users.filter(x => x.id !== idFromUrl())
            localStorage.setItem(usersKey, JSON.stringify(users))
            return ok()
        }

        function getSolicitacoes() {
            const formatedSolicitacoes = solicitacoes.map(solicitacao => {
                const detailSolicitacao = solicitacaoBasicDetails(solicitacao)

                const produto = produtos.find(produto => produto.id === detailSolicitacao.produto)
                const produtoNome = produto?.nome
                detailSolicitacao.produto = produtoNome
                
                return detailSolicitacao
            })

            if (!formatedSolicitacoes[0]?.id && formatedSolicitacoes.length === 1) formatedSolicitacoes.pop()
            return ok(formatedSolicitacoes)
        }

        function getSolicitacaoById() {
            const solicitacao = solicitacoes.find(x => x.id === idFromUrl())
            const detailSolicitacao = solicitacaoBasicDetails(solicitacao)

            return ok(detailSolicitacao)
        }

        function createSolicitacao() {
            const solicitacao = body

            // assign user id and a few other properties then save
            solicitacao.id = newSolicitacaoId()
            solicitacoes.push(solicitacao)
            localStorage.setItem(solicitacoesKey, JSON.stringify(solicitacoes))

            return ok()
        }

        function updateSolicitacao() {
            let params = body
            let solicitacao = solicitacoes.find(x => x.id === idFromUrl())
            // update and save
            Object.assign(solicitacao, params)
            localStorage.setItem(solicitacoesKey, JSON.stringify(solicitacoes))

            return ok()
        }

        function deleteSolicitacao() {
            solicitacoes = solicitacoes.filter(x => x.id !== idFromUrl())
            localStorage.setItem(solicitacoesKey, JSON.stringify(solicitacoes))
            return ok()
        }

        function getProdutos() {
            const formatedProducts = produtos.map(product => {
                const formatedProduct = produtoBasicDetails(product)
                return formatedProduct
            })

            if (!formatedProducts[0]?.id && formatedProducts.length === 1) formatedProducts.pop()
            return ok(formatedProducts)
        }
        
        function getProdutoById() {
            const produto = produtos.find(x => x.id === idFromUrl().toString())
            if (!produto) error('product not found!')
            return ok(produtoBasicDetails(produto as Produto))
        }
        
        function createProduto(body: Produto) {
            const produto = body
            
            if (produtos.find(x => x.nome === produto.nome)) {
              return error(`User with the name ${produto.nome} already exists`)
            }
        
            produto.id = newProdutoId().toString()
            produtos.push(produto)
            localStorage.setItem(produtosKey, JSON.stringify(produtos))
        
            return ok()
        }
        
        function updateProduto(body: Produto) {
            let params = body
            let produto = produtos.find(x => x.id === idFromUrl().toString())
            if (!produto) error('Produto not found!')
        
            if (params.nome !== produto?.nome && produtos.find(x => x.nome === params.nome)) {
                return error(`produto with the name ${params.nome} already exists`)
            }
    
        
            // update and save produto
            Object.assign(produto as Produto, params)
            localStorage.setItem(produtosKey, JSON.stringify(produtos))
        
            return ok()
        }
        
        function deleteProduto() {
            produtos = produtos.filter(x => x.id !== idFromUrl().toString())
            localStorage.setItem(produtosKey, JSON.stringify(produtos))
            return ok()
          }
        
        function produtoBasicDetails(produto: Produto) {
            const { id, nome, descricao } = produto
            return { id, nome, descricao }
          }
        
        function  newProdutoId() {
            return produtos.length ? Math.max(...produtos.map(x => Number(x.id))) + 1 : 1
          }

        // helper functions

        function error(message: any) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        }

        function userBasicDetails(user: any) {
            const { id, title, firstName, lastName, email, role } = user
            return { id, title, firstName, lastName, email, role }
        }

        function solicitacaoBasicDetails(solicitacao: any) {
            const { id, prioridade, solicitante, cpfSolicitante, produto, quantidade, setor, dataDeCriacao, prazoDeCotacao } = solicitacao
            return { id, prioridade, solicitante, cpfSolicitante, produto, quantidade, setor, dataDeCriacao, prazoDeCotacao }
        }

        function idFromUrl() {
            const urlParts = url.split('/')
            return parseInt(urlParts[urlParts.length - 1])
        }

        function newUserId() {
            return users.length ? Math.max(...users.map(x => x.id)) + 1 : 1
        }

        function newSolicitacaoId() {
            return solicitacoes.length ? Math.max(...solicitacoes.map(x => x.id)) + 1 : 1
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)) // delay observable to simulate server api call
        }
        
    }
}
export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}