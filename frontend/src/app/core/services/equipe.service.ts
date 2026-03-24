import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { MembroEquipe } from '../../models/Equipe.model';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private supabase = inject(SupabaseService);

  async getAll(): Promise<MembroEquipe[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase.client
      .from('equipe')
      .select('*')
      .eq('user_id', user.id)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      return [];
    }

    return data as MembroEquipe[];
  }

  async create(membro: Partial<MembroEquipe>): Promise<MembroEquipe | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase.client
      .from('equipe')
      .insert({ ...membro, user_id: user.id })
      .select();

    if (error) {
      console.error('Erro ao criar membro da equipe:', error);
      return null;
    }

    return data[0] as MembroEquipe;
  }

  async update(id: string, membro: Partial<MembroEquipe>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('equipe')
      .update(membro)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar membro da equipe:', error);
      return false;
    }

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('equipe')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar membro da equipe:', error);
      return false;
    }

    return true;
  }
}
