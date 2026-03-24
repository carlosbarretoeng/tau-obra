import { Component, input, signal, forwardRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  icon = input<string | null>(null);
  
  valueChange = output<string>();
  
  showPassword = signal(false);
  value = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let rawValue = target.value;

    if (this.type() === 'taxId') {
      rawValue = this.applyTaxIdMask(rawValue);
      target.value = rawValue;
    } else if (this.type() === 'telephone') {
      rawValue = this.applyPhoneMask(rawValue);
      target.value = rawValue;
    } else if (this.type() === 'money') {
      rawValue = this.applyMoneyMask(rawValue);
      target.value = rawValue;
    }

    this.value = rawValue;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  private applyTaxIdMask(v: string): string {
    v = v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const isCnpjPattern = /[A-Z]/.test(v) || v.length > 11;
    if (isCnpjPattern) {
      if (v.length > 12) {
        const head = v.substring(0, 12);
        const tail = v.substring(12, 14).replace(/[^0-9]/g, '');
        v = head + tail;
      }
      v = v.substring(0, 14);
    } else {
      if (v.length > 9) {
        const head = v.substring(0, 9);
        const tail = v.substring(9, 11).replace(/[^0-9]/g, '');
        v = head + tail;
      }
      v = v.substring(0, 11);
    }

    let out = '';
    if (isCnpjPattern) {
      for (let i = 0; i < v.length; i++) {
        if (i === 2) out += '.';
        if (i === 5) out += '.';
        if (i === 8) out += '/';
        if (i === 12) out += '-';
        out += v[i];
      }
    } else {
      for (let i = 0; i < v.length; i++) {
        if (i === 3) out += '.';
        if (i === 6) out += '.';
        if (i === 9) out += '-';
        out += v[i];
      }
    }
    return out;
  }

  private applyPhoneMask(v: string): string {
    v = v.replace(/\D/g, ''); 
    let out = '';
    for (let i = 0; i < v.length; i++) {
      if (i === 0) out += '(';
      if (i === 2) out += ') ';
      if (v.length <= 10) {
        if (i === 6) out += '-';
      } else {
        if (i === 7) out += '-';
      }
      out += v[i];
    }
    return out.substring(0, 15);
  }

  private applyMoneyMask(v: string): string {
    v = v.replace(/\D/g, '');
    if (!v) return '';
    const val = parseInt(v, 10);
    const s = val.toString().padStart(3, '0');
    const cents = s.slice(-2);
    const integerPart = s.slice(0, -2);
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedInteger},${cents}`;
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  get inputType(): string {
    if (this.type() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return 'text'; 
  }

  get iconName(): string | null {
    if (this.icon()) return this.icon();
    
    switch (this.type()) {
      case 'email': return 'mail';
      case 'password': return 'asterisk';
      case 'text': return 'type';
      case 'search': return 'search';
      case 'date': return 'calendar';
      case 'taxId': return 'dock';
      case 'telephone': return 'phone';
      case 'money': return 'dollar-sign';
      default: return null;
    }
  }
}
