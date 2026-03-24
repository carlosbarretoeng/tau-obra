import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  LucideAngularModule,
  AlertTriangle,
  Asterisk,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Dock,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  Home,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  QrCode,
  Search,
  Trash2,
  Truck,
  Type,
  User,
  Users
} from 'lucide-angular';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        AlertTriangle,
        Asterisk,
        Building2,
        Calendar,
        Check,
        ChevronDown,
        Copy,
        Dock,
        DollarSign,
        Eye,
        EyeOff,
        FileText,
        Home,
        Lock,
        LogOut,
        Mail,
        Pencil,
        Phone,
        Plus,
        QrCode,
        Search,
        Trash2,
        Truck,
        Type,
        User,
        Users
      }),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
