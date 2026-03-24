import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class ButtonComponent {
  label = input<string>('');
  title = input<string>('');
  icon = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'ghost' | 'icon' | 'danger'>('primary');
  size = input<'normal' | 'small'>('normal');
  disabled = input<boolean>(false);
  clickAction = output<void>();

  onButtonClick() {
    if (!this.disabled()) {
      this.clickAction.emit();
    }
  }

  getClass(): string {
    let bgColor = 'bg-gradient-to-r from-blue-600 to-emerald-600 active:from-blue-700 active:to-emerald-700 shadow-[0_12px_24px_-8px_rgba(59,130,246,0.3)]';
    let font = 'text-white font-bold tracking-wide';
    let padding = 'py-4 px-4';
    let rounded = 'rounded-2xl';
    let width = 'w-full';

    if (this.variant() === 'secondary') {
      bgColor = 'bg-gradient-to-r from-slate-600 to-slate-600 active:from-slate-700 active:to-slate-700 border border-white/5';
    }

    if (this.variant() === 'ghost') {
      bgColor = 'bg-transparent active:bg-slate-700 border border-white/5';
    }

    if (this.variant() === 'danger') {
      bgColor = 'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-[0_12px_24px_-8px_rgba(220,38,38,0.3)] border border-red-500/50';
    }

    if (this.variant() === 'icon') {
      width = '';
      bgColor = 'bg-white/[0.05] border border-white/[0.1] hover:text-white';
    }

    if (this.size() === 'small') {
      font = 'text-sm';
      rounded = 'rounded-xl';
      padding = 'py-1 px-5';
      /*
      'py-2.5 text-sm px-5 rounded-xl': variant() !== 'icon' && size() === 'small',
      'w-10 h-10 rounded-xl bg-white/5 border border-white/10': variant() === 'icon' && size() === 'small',
      */
    }

    return `${bgColor} ${font} ${padding} ${rounded} ${width} flex items-center justify-center gap-2 transform transition-all duration-200`;
  }

  /*

  {
    'w-full': variant() !== 'icon',
    'text-white font-bold tracking-wide rounded-2xl flex items-center justify-center gap-2 transform transition-all duration-200': true,
    'py-4 rounded-xl text-base px-4': variant() !== 'icon',
    'aspect-square w-10 h-10 rounded-lg text-sm bg-white/[0.05] border border-white/[0.1] hover:text-white': variant() === 'icon',
    'bg-gradient-to-r from-blue-600 to-emerald-600 active:from-blue-700 active:to-emerald-700 shadow-[0_12px_24px_-8px_rgba(59,130,246,0.3)]': variant() === 'primary' && !disabled(),
    'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-white/5': variant() === 'secondary' && !disabled(),
    'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-[0_12px_24px_-8px_rgba(220,38,38,0.3)] border border-red-500/50': variant() === 'danger' && !disabled(),
    'opacity-50 cursor-not-allowed grayscale-[0.5]': disabled(),
  }

  */

}
