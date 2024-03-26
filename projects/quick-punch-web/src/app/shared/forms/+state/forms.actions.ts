import { FormGroup } from '@angular/forms';
import { Errors } from './forms.interfaces';
import { props, createActionGroup, emptyProps } from '@ngrx/store';

export const formsActions = createActionGroup({
  source: 'Forms',
  events: {
    setData: props<{ data: any }>(),
    updateData: props<{ data: any }>(),
    validateData: emptyProps(),
    updateValidity: props<{ valid: boolean; }>(),
    setStructure: props<{ structure: any }>(),
    setErrors: props<{ errors: Errors }>(),
    initializeErrors: emptyProps(),
    initializeForm: emptyProps(),
    resetForm: emptyProps(),
  },
});
