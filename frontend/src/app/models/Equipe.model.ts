export interface MembroEquipe {
  id?: string;
  user_id: string;
  nome: string;
  cargo: string; // Ex: Pedreiro, Arquiteto, Engenheiro, Mestre de Obras
  contato?: string; // Telefone
  pix?: string;
  remuneracao?: number; // Opcional: Valor por dia/mês
  ativo: boolean;
  created_at?: string;
}
