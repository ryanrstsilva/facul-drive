import { OfertaCarona } from "@/global/ofertaCarona";
import { SolicitacaoCaronaModel } from "@/global/solicitacaoCarona";

import api from "./api";

interface NovaSolicitacaoParams {
  IdOfertaCarona: number;
}

interface ExcluirSolicitacaoParams {
  Id: number;
}

interface NovaCaronaParams {
  NVagas: number;
  Saida: string;
  Destino: string;
  PontosReferencia: string;
  DataCarona: string;
}

interface DeletarOfertaParams {
  Id: number;
}

export const novaOferta = (params: NovaCaronaParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log(params.DataCarona);
    api
      .post("Carona/CadastroOfertaCarona", params, config)
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(response.data || "Erro ao enviar solicitação.");
          console.log("Log" + response.data);
        }
      })
      .catch((error) => reject(error));
  });
};

export const deletarOferta = (params: DeletarOfertaParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    api
      .delete(`Carona/DeletarOfertaCarona/${params.Id}`, config)
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(response.data || "Erro ao deletar oferta.");
        }
      })
      .catch((error) => reject(error));
    });
  };

export const listarOfertasCaronas = (): Promise<OfertaCarona[]> => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    api
      .get<OfertaCarona[]>("Carona/ListarOfertasCaronas", config)
      .then((response) => {
        // if (!response.ok) {
        //   reject(new Error(`HTTP error! status: ${response.status}`));
        //   return;
        // }
        // if (!response.data) {
        //   reject(new Error('Nenhum dado recebido da API'));
        //   return;
        // }
        if (response.data && response.ok) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => reject(error));[]
      // .catch((error) => {
      //   reject(error?.message || 'Erro ao buscar ofertas de carona');
      //   });
  });
};

export const listarSolicitacoes = (): Promise<SolicitacaoCaronaModel[]> => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    api
      .get<SolicitacaoCaronaModel[]>("Carona/ListarSolicitacoesCaronas", config)
      .then((response) => {
        if (response.data && response.ok) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => reject(error));
  });
};

export const aprovarSolcitacao = (id: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const config = {
      // headers: {
      //     "Content-Type": "application/json",
      // },
    };
    api
      .get<boolean>("Carona/AprovarSolicitacao/" + id, config)
      .then((response) => {
        if (response.data && response.ok) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => reject(error));
  });
};

export const novaSolicitacao = (
  params: NovaSolicitacaoParams,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    api
      .post("Carona/NovaSolicitacao", params, config)
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(response.data || "Erro ao enviar solicitação.");
        }
      })
      .catch((error) => reject(error));
  });
};

export const excluirSolicitacao = (
  params: ExcluirSolicitacaoParams,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    api
      .post("Carona/RemoverSolicitacao", params, config)
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(response.data || "Erro ao excluir solicitação.");
        }
      })
      .catch((error) => reject(error));
  });
};
