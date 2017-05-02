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

  categories: any[] = [];
  items: any[] = [];
  errorMessage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public viewCtrl: ViewController) { }

  getMenu(): void {
    this.dataService.get("/categories")
      .subscribe((categories) => {
        this.categories = categories.sort((n1,n2)=>{
        return (n1.name>n2.name) ? 1 : -1;
      });
      }, error => this.errorMessage = <any>error);


    this.dataService.get("/items")
      .subscribe(items => this.items = items, error => this.errorMessage = <any>error);
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
