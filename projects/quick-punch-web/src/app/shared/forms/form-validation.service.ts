import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';
import { Errors, Field } from './+state/forms.interfaces';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormValidationService {

  getErrorMessage(errorKey: string, errorValue?: any): string {
    const messages: { [key: string]: Function } = {
      required: () => 'This field is required',
      minlength: (params: any) =>
        'The minimum number of characters is ' + params.requiredLength,
      maxlength: (params: any) =>
        'The maximum allowed number of characters is ' + params.requiredLength,
      pattern: (params: any) =>
        'The required pattern is: ' + params.requiredPattern,
    };

    return messages[errorKey]
      ? messages[errorKey](errorValue)
      : 'Unknown error';
  }

  aggregateErrors(formGroup: FormGroup, fields: Field[]): Errors {
    const errors: Errors = {};
    fields.forEach((field) => {
      const control = formGroup.get(field.name);
      if (control && control.errors && (control.dirty || control.touched)) {
        errors[field.name] = Object.keys(control.errors)
          .map((errorKey) => {
            const errorValue = control.errors?.[errorKey];
            const errorMessage = this.getErrorMessage(errorKey, errorValue);
            const placeholderText = field.label ? ` ${field.label}` : '';
            return `${placeholderText} - ${errorMessage}`;
          })
          .join(', ');
      }
    });
    return errors;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if(control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true })
      } else if(control instanceof FormGroup) {
        control.markAsTouched({ onlySelf: true })
        this.validateAllFormFields(control);
      }
    })
  }
}
