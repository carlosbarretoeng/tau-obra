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
  variant = input<'primary' | 'secondary' | 'icon' | 'danger'>('primary');
  disabled = input<boolean>(false);
  clickAction = output<void>();

  onButtonClick() {
    if (!this.disabled()) {
      this.clickAction.emit();
    }
  }
}
