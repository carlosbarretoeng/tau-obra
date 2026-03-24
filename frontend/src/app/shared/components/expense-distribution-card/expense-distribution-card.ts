import { Component, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunburstChartComponent } from '../sunburst-chart/sunburst-chart';

@Component({
  selector: 'app-expense-distribution-card',
  standalone: true,
  imports: [CommonModule, SunburstChartComponent],
  templateUrl: './expense-distribution-card.html',
  styleUrl: './expense-distribution-card.css'
})
export class ExpenseDistributionCardComponent implements OnInit {
  title = input<string>('Distribuição de Despesas');

  // Data internal loading simulation
  isLoading = signal(true);
  internalData = signal<any[]>([]);

  ngOnInit() {
    // Simulando carregamento de dados
    setTimeout(() => {
      /*this.internalData.set([
        {
          label: 'Infra',
          value: 12000,
          color: '#3b82f6',
          children: [
            { label: 'Sapatas', value: 8000, color: '#60a5fa' },
            { label: 'Baldrame', value: 4000, color: '#93c5fd' }
          ]
        },
        {
          label: 'Super',
          value: 18000,
          color: '#10b981',
          children: [
            { label: 'Pilares', value: 10000, color: '#34d399' },
            { label: 'Vigas', value: 8000, color: '#6ee7b7' }
          ]
        },
        {
          label: 'Vedação',
          value: 9000,
          color: '#f59e0b',
          children: [
            { label: 'Tijolo', value: 6000, color: '#fbbf24' },
            { label: 'Cimento', value: 3000, color: '#fcd34d' }
          ]
        }
      ]);*/
      this.isLoading.set(false);
    }, 500);
  }
}
