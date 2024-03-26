import { Component, Input, ChangeDetectionStrategy, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { Field } from '../../+state/forms.interfaces';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';
import { Store } from '@ngrx/store';
import { formsActions } from '../../+state/forms.actions';
import { ngrxFormsEffects, ngrxFormsQuery } from '../..';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  private readonly formValidationService = inject(FormValidationService);
  private readonly store = inject(Store);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.store.select(ngrxFormsQuery.selectValid)
    .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef),)
    .subscribe((res) => {
      this.changeDetectorRef.markForCheck();
    });
  }

  get control() {
    return this.group.controls[this.field.name];
  }

  get showError() {
    const { dirty, touched, errors } = this.control;
    return (dirty || touched) && errors;
  }

  get errors() {
    return this.control.errors
      ? Object.keys(this.control.errors).map(key =>
          this.formValidationService.getErrorMessage(key, this.control.errors?.[key]))
      : [];
  }
}
