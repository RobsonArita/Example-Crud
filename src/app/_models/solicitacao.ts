import { Produto } from "./produto"

export class Solicitacao {
    id!: string

    solicitante!: string
    cpfSolicitante!: string

    setor!: string
    dataDeCriacao!: string
    prazoDeCotacao!: string

    prioridade!: number

    produto!: string
    quantidade!: number

    tipoEmbalagem!: string
    descricaoEmbalagem!: string

    isDeleting: boolean = false
}