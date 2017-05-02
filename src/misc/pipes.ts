import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'categoryItemsFilter',
  pure: false
})

export class CategoryItemsFilter implements PipeTransform {
  transform(items: any[], catId: string): any[] {
     let catItems : any[] = [];
      items.forEach(function(item){
        if (item.catId == catId){
          catItems.push(item);
        }
      });
      catItems = catItems.sort((n1,n2)=>{
        return (n1.name>n2.name) ? 1 : -1;
      });
  return catItems

  }
}


