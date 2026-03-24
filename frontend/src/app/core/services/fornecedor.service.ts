import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Fornecedor } from '../../models/Fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private supabase = inject(SupabaseService);

  async getAll(): Promise<Fornecedor[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase.client
      .from('fornecedores')
      .select('*')
      .eq('user_id', user.id)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar fornecedores:', error);
      return [];
    }

    return data as Fornecedor[];
  }

  async create(fornecedor: Fornecedor): Promise<Fornecedor | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase.client
      .from('fornecedores')
      .insert({ ...fornecedor, user_id: user.id })
      .select();

    if (error) {
      console.error('Erro ao criar fornecedor:', error);
      return null;
    }

    return data[0] as Fornecedor;
  }

  async update(id: string, fornecedor: Partial<Fornecedor>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('fornecedores')
      .update(fornecedor)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      return false;
    }

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('fornecedores')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar fornecedor:', error);
      return false;
    }

    return true;
  }
}
