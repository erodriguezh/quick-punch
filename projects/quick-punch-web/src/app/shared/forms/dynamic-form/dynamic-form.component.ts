import { Errors, Field } from '../+state/forms.interfaces';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { debounceTime, map, tap, filter } from 'rxjs/operators';
import { DynamicFieldDirective } from './dynamic-field.directive';
import { AsyncPipe } from '@angular/common';
import { formsActions } from '..';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FormValidationService } from '../form-validation.service';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  imports: [ReactiveFormsModule, DynamicFieldDirective, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly formValidation = inject(FormValidationService);

  @Input() structure$!: Observable<Field[]>;
  @Input() data$!: Observable<any>;
  @Input() touchedForm$!: Observable<boolean>;
  @Output() updateForm: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  fieldsConfig: { [key: string]: Field } = {};

  ngOnInit() {
    this.structure$
      .pipe(
        map(this.formBuilder),
        tap((f) => (this.form = f)),
        tap((f) => this.listenFormChanges(f)),
        (f$) => combineLatest([f$, this.data$]),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.patchValue);

    if (this.touchedForm$) {
      this.touchedForm$
        .pipe(
          filter((t) => !t && !!this.form),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => this.form.reset());
    }

    this.actions$.pipe(
      filter(() => !!this.form),
      ofType(formsActions.validateData)
    )
    .subscribe(() => this.validateForm(this.form));
  }

  private formBuilder = (structure: Field[]): FormGroup => {
    const group = this.fb.group({});
    structure.forEach((field) => group.addControl(field.name, this.control(field)));
    return group;
  };

  private control = (field: Field): FormControl => {
    return this.fb.control('', field.validator);
  };

  private patchValue = ([form, data]: [FormGroup, any]) => {
    data ? form.patchValue(data, { emitEvent: false }) : form.patchValue({}, { emitEvent: false });
  };

  private listenFormChanges(form: FormGroup) {
    form.valueChanges
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe((changes) => {
        if (!form.valid) {
          return this.gatherAndDispatchErrors(form);
        }
        this.updateForm.emit(changes);
      });
  }

  private validateForm(form: FormGroup) {
    const isValid = form.valid;
    this.store.dispatch(formsActions.updateValidity({ valid: isValid }));
    if (!isValid) {
      this.gatherAndDispatchErrors(form, true);
    }
  }

  private gatherAndDispatchErrors(form: FormGroup, isFullFormValidation = false) {
    combineLatest([of(form), this.structure$, of(isFullFormValidation)])
    .pipe(
      tap(([form, fields, isFullFormValidation]) => {
        if (isFullFormValidation) {
          this.formValidation.validateAllFormFields(form);
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(([form, fields]) => {
      const errors = this.formValidation.aggregateErrors(form, fields);
      this.store.dispatch(formsActions.setErrors({ errors }))
    });
  }
}
