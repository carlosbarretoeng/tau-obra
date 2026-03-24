import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FornecedorService } from '../../core/services/fornecedor.service';
import { LoadingService } from '../../core/services/loading.service';
import { Fornecedor } from '../../models/Fornecedor.model';
import { ButtonComponent } from '../../shared/components/button/button';
import { InputComponent } from '../../shared/components/input/input';
import { SelectComponent, SelectOption } from '../../shared/components/select/select';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent
  ],
  templateUrl: './fornecedores.html',
  styleUrl: './fornecedores.css'
})
export class FornecedoresComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);
  private loadingService = inject(LoadingService);

  public fornecedores = signal<Fornecedor[]>([]);
  public isFormOpen = signal(false);
  public editingId = signal<string | null>(null);
  public searchTerms = signal('');
  
  public isDeleteModalOpen = signal(false);
  public supplierToDelete = signal<Fornecedor | null>(null);

  public categoriaOptions: SelectOption[] = [
    { value: 'Materiais', label: 'Materiais' },
    { value: 'Serviços', label: 'Serviços' },
    { value: 'Aluguel', label: 'Aluguel' },
    { value: 'Equipamentos', label: 'Equipamentos' },
    { value: 'Mão de Obra', label: 'Mão de Obra' },
    { value: 'Outros', label: 'Outros' }
  ];

  public fornecedorForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    documento: ['', [Validators.required]],
    categoria: ['Materiais', [Validators.required]],
    contato: ['', [Validators.required]],
    pix: [''],
    endereco: ['']
  });

  async ngOnInit() {
    await this.loadFornecedores();
  }

  async loadFornecedores() {
    this.loadingService.show();
    const data = await this.fornecedorService.getAll();
    this.fornecedores.set(data);
    this.loadingService.hide();
  }

  toggleForm(fornecedor?: Fornecedor) {
    if (fornecedor) {
      this.editingId.set(fornecedor.id!);
      this.fornecedorForm.patchValue(fornecedor);
    } else {
      this.editingId.set(null);
      this.fornecedorForm.reset({ categoria: 'Materiais' });
    }
    this.isFormOpen.set(!this.isFormOpen());
  }

  async onSubmit() {
    if (this.fornecedorForm.invalid) return;

    this.loadingService.show();
    const formData = this.fornecedorForm.value as Fornecedor;

    try {
      if (this.editingId()) {
        await this.fornecedorService.update(this.editingId()!, formData);
      } else {
        await this.fornecedorService.create(formData);
      }
      await this.loadFornecedores();
      this.isFormOpen.set(false);
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  confirmDelete(fornecedor: Fornecedor) {
    this.supplierToDelete.set(fornecedor);
    this.isDeleteModalOpen.set(true);
  }

  async onDelete() {
    const supplier = this.supplierToDelete();
    if (!supplier || !supplier.id) return;

    this.loadingService.show();
    try {
      await this.fornecedorService.delete(supplier.id);
      await this.loadFornecedores();
      this.isDeleteModalOpen.set(false);
      this.supplierToDelete.set(null);
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  filteredFornecedores() {
    const terms = this.searchTerms().toLowerCase();
    return this.fornecedores().filter(f =>
      f.nome.toLowerCase().includes(terms) ||
      f.categoria?.toLowerCase().includes(terms) ||
      f.documento?.includes(terms)
    );
  }
}
