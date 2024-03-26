import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '../../shared/forms';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../auth/auth.store';
import { Store } from '@ngrx/store';

const structure: Field[] = [
  {
    type: 'INPUT',
    name: 'personellNumber',
    label: 'Personell Number',
    placeholder: 'Enter your personell number',
    validator: [Validators.required],
  },
  {
    type: 'INPUT',
    name: 'pin',
    label: 'Pin',
    placeholder: 'Enter your first name pin',
    validator: [Validators.required],
    attrs: {
      type: 'password',
    },
  },
];

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ListErrorsComponent, DynamicFormComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly authStore = inject(AuthStore);

  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  ngOnInit() {
    this.store.dispatch(formsActions.setStructure({ structure }));
  }

  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  submit() {
    this.store.dispatch(formsActions.validateData());
    this.authStore.register();
  }

  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }
}
