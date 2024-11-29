export interface OfertaCarona {
  id: number;
  nVagas: number;
  nVagasRestantes: number;
  saida: string;
  destino: string;
  pontosReferencia: string;
  dataCarona: Date;
  nomePessoaOfertante: string;
  meuStatusSolicitacao: string;
  idMinhaSolicitacao: number;
  minhaOferta: boolean;
}
