import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const brand of value){
      if(brand.name.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultPosts.push(brand)

      }
    }
    return resultPosts
}
}
