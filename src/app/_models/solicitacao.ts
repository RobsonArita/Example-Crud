export class Solicitacao {
    id!: string
    codigo!: string
    solicitante!: string
    setor!: string
    dataDeCriacao!: string
    prazoDeCotacao!: string
    isDeleting: boolean = false
}