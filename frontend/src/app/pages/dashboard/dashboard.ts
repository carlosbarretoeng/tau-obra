import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SupabaseService } from '../../core/services/supabase.service';
import { LoadingService } from '../../core/services/loading.service';
import { ExpenseDistributionCardComponent } from '../../shared/components/expense-distribution-card/expense-distribution-card';
import { ButtonComponent } from '../../shared/components/button/button';
import { Obra } from '../../models/Obra.model';
import { ShortNumberPipe } from '../../shared/pipes/short-number.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ExpenseDistributionCardComponent, ButtonComponent, ShortNumberPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private supabase = inject(SupabaseService);

  public obra = signal<Obra | null>(null);
  public isLoading = signal<boolean>(true);

  async ngOnInit() {
    this.isLoading.set(true);
    this.loadingService.show();

    const { data: { user } } = await this.supabase.auth.getUser();
    if (user) {
      // Buscamos a obra ativa (status true) vinculada ao usuário logado
      const { data, error } = await this.supabase.client
        .from('obras')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', true)
        .limit(1);

      if (error) {
        console.error('Error fetching active obra:', error);
      } else if (data && data.length > 0) {
        this.obra.set(data[0] as Obra);
      }

      this.isLoading.set(false);
      this.loadingService.hide();
    }
  }

  public isBudgetOver(): boolean {
    const obra = this.obra();
    if (!obra) return false;
    return (obra.executed_budget + obra.allocated_budget) > obra.initial_budget;
  }

  public getBudgetOverrun(): number {
    const obra = this.obra();
    if (!obra) return 0;
    return (obra.executed_budget + obra.allocated_budget) - obra.initial_budget;
  }

  public getExecutedProgress(): number {
    const obra = this.obra();
    if (!obra || obra.initial_budget === 0) return 0;
    return (obra.executed_budget / obra.initial_budget) * 100;
  }

  public getAllocatedProgress(): number {
    const obra = this.obra();
    if (!obra || obra.initial_budget === 0) return 0;
    return (obra.allocated_budget / obra.initial_budget) * 100;
  }

  public getObraProgress(): number {
    const obra = this.obra();
    if (!obra || obra.initial_budget === 0) return 0;
    return ((obra.executed_budget + obra.allocated_budget) / obra.initial_budget) * 100;
  }
}
