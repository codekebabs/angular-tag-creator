import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

// This wont work
export function duplicateValidator(list: []): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log(list, control.value);
       
        if (control.value !== undefined) {
           if (list.find(x => x === control.value)) {
            return { 'duplicate': true };
           }
        }
        return null;
    };
}