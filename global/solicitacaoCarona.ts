export interface SolicitacaoCaronaModel {
  id: number;
  idOfertaCarona: number;
  idPessoaSolicitante: number;
  aprovado: boolean;
  dataSolicitacao: string;
  nome: string;
  saida: string;
  destino: string;
  dataCarona: string;
}
