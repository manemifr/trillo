import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(input: Date): any{
    const date = new Date(input);

    const today = new Date();
    const tomorrow = new Date(today.getTime() + (24*60*60*1000));
    const week = new Date(today.getTime() + (7*24*60*60*1000));

    if (date <= today){
      return 'Overdue';
    } else if (date <= tomorrow) {
      return 'Aujourdh\'ui';
    } else if (date <= week){
      return 'Cette semaine';
    } else {
      return 'Prochainement';
    }
  }

}
