import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

import { DataService } from '../../services/data.service';
/*
  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',

})

export class MenuPage implements OnInit {

  categories: any[] = [];
  items: any[] = [];
    searchFilter:string = "";
  errorMessage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public dataService: DataService) { }

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

  addCategoryPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Add Category',
      inputs: [
        {
          name: 'name',
          placeholder: 'Category'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            data.id = UUID.UUID();
            this.dataService.post("/categories", data)
              .subscribe(data => {
                console.log(data);
                this.getMenu();
              }, error => this.errorMessage = <any>error);
          }
        }
      ]
    });
    prompt.present();
  }

  addCatItemPrompt(catId) {
    let prompt = this.alertCtrl.create({
      title: 'Add Item',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'price',
          placeholder: 'Price (£)',
          type: "number"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            if (!data.price) {
              this.addCatItemPrompt(catId);
              return;
            }
            data.id = UUID.UUID();
            data.catId = catId;
            this.dataService.post("/items", data)
              .subscribe(data => {
                console.log(data);
                this.getMenu();
              }, error => this.errorMessage = <any>error);;
          }
        }
      ]
    });
    prompt.present();
  }

  editCategory(cat) {
    let prompt = this.alertCtrl.create({
      title: 'Edit Category',
      inputs: [
        {
          name: 'name',
          value: cat.name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            data.id = cat.id;
            this.dataService.post("/categories", data)
              .subscribe(data => {
                console.log(data);
                this.getMenu();
              }, error => this.errorMessage = <any>error);;
          }
        }
      ]
    });
    prompt.present();
  }

  editItem(item) {
    let prompt = this.alertCtrl.create({
      title: 'Edit Item',
      inputs: [
        {
          name: 'name',
          value: item.name
        },
        {
          name: 'price',
          value: item.price,
          type: "number"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            if (!data.price) {
              this.editItem(item);
              return;
            }
            data.id = item.id;
            data.catId = item.catId;
            this.dataService.post("/items", data)
              .subscribe(data => {
                console.log(data);
                this.getMenu();
              }, error => this.errorMessage = <any>error);;
          }
        }
      ]
    });
    prompt.present();
  }

  removeItem(item) {
    this.dataService.delete("/items", item)
      .subscribe(data => {
        console.log(data);
        this.getMenu();
      }, error => this.errorMessage = <any>error);;
  }

  removeCategory(cat) {
    const items = this.items.filter(x => x.catId == cat.id);

    for (var i of items) this.removeItem(i);
    console.log(items);
    this.dataService.delete("/categories", cat)
      .subscribe(data => {
        console.log(data);
        this.getMenu();
      }, error => this.errorMessage = <any>error);;
  }

  getItemPrice(item) {
    return item.hasOwnProperty('price') ? Number(item.price).toFixed(2) : Number(0).toFixed(2);
  }
}
