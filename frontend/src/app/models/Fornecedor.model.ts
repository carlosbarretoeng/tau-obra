export interface Fornecedor {
  id?: string;
  user_id: string;
  nome: string;
  documento?: string; // CPF ou CNPJ
  categoria?: string; // Ex: Materiais, Serviços, Aluguel
  contato?: string;
  endereco?: string;
  pix?: string; // Chave Pix
}
