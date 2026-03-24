import { sample } from 'lodash';
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  private apelidos = ['Engenheiro', 'Mestre', 'Patrão', 'Chefia',
    'Comandante', 'Capitão'];

  userEmail = signal<string | undefined>(undefined);
  isDropdownOpen = signal(false);
  apelido = signal<string>('');

  async ngOnInit() {
    const { data: { user } } = await this.supabase.auth.getUser();
    this.userEmail.set(user?.email);
    this.setSaudacao();
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  navigateToProfile() {
    this.closeDropdown();
    this.router.navigate(['/dashboard/profile']);
  }

  async logout() {
    this.closeDropdown();
    await this.supabase.auth.signOut();
    this.router.navigate(['/']);
  }

  setSaudacao() {
    this.apelido.set(sample(this.apelidos) || '');
  }
}
