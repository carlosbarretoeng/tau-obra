import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipeService } from '../../core/services/equipe.service';
import { LoadingService } from '../../core/services/loading.service';
import { MembroEquipe } from '../../models/Equipe.model';
import { ButtonComponent } from '../../shared/components/button/button';
import { InputComponent } from '../../shared/components/input/input';
import { SelectComponent, SelectOption } from '../../shared/components/select/select';

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent
  ],
  templateUrl: './equipe.html',
  styleUrl: './equipe.css'
})
export class EquipeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private equipeService = inject(EquipeService);
  private loadingService = inject(LoadingService);

  public membros = signal<MembroEquipe[]>([]);
  public isFormOpen = signal(false);
  public editingId = signal<string | null>(null);
  public searchTerms = signal('');

  public isDeleteModalOpen = signal(false);
  public memberToDelete = signal<MembroEquipe | null>(null);
  public toast = signal<{ message: string, type: 'success' | 'error' } | null>(null);

  public cargoOptions: SelectOption[] = [
    { value: 'Mestre de Obras', label: 'Mestre de Obras' },
    { value: 'Pedreiro', label: 'Pedreiro' },
    { value: 'Servente', label: 'Servente' },
    { value: 'Eletricista', label: 'Eletricista' },
    { value: 'Encanador', label: 'Encanador' },
    { value: 'Pintor', label: 'Pintor' },
    { value: 'Gesseiro', label: 'Gesseiro' },
    { value: 'Engenheiro', label: 'Engenheiro' },
    { value: 'Arquiteto', label: 'Arquiteto' },
    { value: 'Mão de Obra', label: 'Mão de Obra' },
    { value: 'Outros', label: 'Outros' }
  ];

  public equipeForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    cargo: ['Pedreiro', [Validators.required]],
    contato: ['', [Validators.required]],
    pix: [''],
    remuneracao: [null],
    ativo: [true]
  });

  async ngOnInit() {
    await this.loadEquipe();
  }

  async loadEquipe() {
    this.loadingService.show();
    const data = await this.equipeService.getAll();
    this.membros.set(data);
    this.loadingService.hide();
  }

  toggleForm(membro?: MembroEquipe) {
    if (membro) {
      this.editingId.set(membro.id!);
      this.equipeForm.patchValue(membro);
    } else {
      this.editingId.set(null);
      this.equipeForm.reset({ cargo: 'Pedreiro', ativo: true });
    }
    this.isFormOpen.set(!this.isFormOpen());
  }

  async onSubmit() {
    if (this.equipeForm.invalid) return;

    this.loadingService.show();
    const formData = this.equipeForm.value as MembroEquipe;

    try {
      if (this.editingId()) {
        await this.equipeService.update(this.editingId()!, formData);
      } else {
        await this.equipeService.create(formData);
      }
      await this.loadEquipe();
      this.isFormOpen.set(false);
      this.showToast(this.editingId() ? 'Membro atualizado!' : 'Membro cadastrado!');
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  confirmDelete(membro: MembroEquipe) {
    this.memberToDelete.set(membro);
    this.isDeleteModalOpen.set(true);
  }

  async onDelete() {
    const member = this.memberToDelete();
    if (!member || !member.id) return;

    this.loadingService.show();
    try {
      await this.equipeService.delete(member.id);
      await this.loadEquipe();
      this.isDeleteModalOpen.set(false);
      this.memberToDelete.set(null);
      this.showToast('Membro removido!', 'error');
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  makeCall(phone: string | undefined) {
    if (phone) {
      window.open(`tel:${phone.replace(/\D/g, '')}`, '_self');
    }
  }

  copyToClipboard(text: string | undefined) {
    if (text && text !== 'N/A') {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copiado!');
      });
    }
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3000);
  }

  filteredMembros() {
    const terms = this.searchTerms().toLowerCase();
    return this.membros().filter(m =>
      m.nome.toLowerCase().includes(terms) ||
      m.cargo.toLowerCase().includes(terms)
    );
  }

  async toggleMemberStatus(membro: MembroEquipe) {
    this.loadingService.show();
    try {
      await this.equipeService.update(membro.id!, { ...membro, ativo: !membro.ativo });
      await this.loadEquipe();
      this.showToast(!membro.ativo ? 'Membro ativado!' : 'Membro inativado!');
    } catch (error) {
      console.error('Erro ao atualizar status do membro:', error);
    } finally {
      this.loadingService.hide();
    }
  }
}
