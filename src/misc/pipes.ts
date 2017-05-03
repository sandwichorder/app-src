import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'categoryItemsFilter',
  pure: false
})

export class CategoryItemsFilter implements PipeTransform {
  transform(categories: any[], searchFilter: string): any[] {
    console.log(searchFilter);
    let menu = categories.slice();
    if(searchFilter && searchFilter.trim() !== ''){
      return menu.map(category =>{ 
            return Object.assign(category, {
                items: category.items.filter(item => item.name.toLowerCase().indexOf(searchFilter.toLowerCase()) > -1)
            })
          }).filter(category => category.items.length > 0);
    }else{
      return menu;
    }
  }
}


