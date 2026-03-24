import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { FornecedoresComponent } from './pages/fornecedores/fornecedores';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'fornecedores', component: FornecedoresComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
