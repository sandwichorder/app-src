import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { DataService } from '../../services/data.service';
/*
  Generated class for the ItemSelection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-item-selection',
  templateUrl: 'item-selection.html'
})
export class ItemSelectionPage implements OnInit {
 menu: any[] = [];
   displayMenu: any[] = [];
   searchFilter: string = "";
  errorMessage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public viewCtrl: ViewController) { }

  getMenu(): void {
    this.dataService.get("/categories")
      .subscribe((categories) => {

         this.dataService.get("/items")
           .subscribe(items => {

              this.menu = categories.map(category => {
                  return Object.assign(category, { 
                    items: items.filter(item => item.catId == category.id).sort( (a, b) => a.name > b.name ? 1 : -1)
                  })
              }).sort( (a, b) => a.name > b.name ? 1 : -1);
              this.displayableMenu();

        }, error => this.errorMessage = <any>error);

      }, error => this.errorMessage = <any>error);
  }

  displayableMenu():void{
     this.displayMenu = [];
    for(var cat of this.menu){
      let category:any = {};
      let newItems:any[]=[];
      for(var item of cat.items){
        if (item.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1){
          newItems.push(item);
        }
      }
      if (newItems.length > 0){
      category.name = cat.name;
      category.id = cat.id;
      category.items = newItems;
      this.displayMenu.push(category);}
    }


    // return Object.assign([],this.menu).map(category => {
    //   return Object.assign(category, {
    //         items: Object.assign([], category.items).filter(item => item.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
    //   })
    // }).filter(category => category.items.length > 0)
  }

  ngOnInit(): void {
    this.getMenu();
  }

  addItem(item) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getItemPrice(item) {
    return item.hasOwnProperty('price') ? Number(item.price).toFixed(2) : Number(0).toFixed(2);
  }
}
