import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { DataService } from '../../services/data.service';
import { ItemSelectionPage } from '../item-selection/item-selection';
/*
  Generated class for the Order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage implements OnInit {
  people: any[] = [];
  orders: any[] = [];
  items: any[] = [];
  errorMessage: any;
  ordertext: string;
  searchFilter:string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public modalCtrl: ModalController) { }

  ngOnInit(): void {
    this.getPeople();

    this.getItems();
  }

  getPeople(): void {
    this.dataService.get("/people")
      .subscribe(people => {
        this.people = people;
        this.getOrders();
      }, error => this.errorMessage = <any>error);
  }
  getOrders(): void {
    this.dataService.get("/orders")
      .subscribe(orders => {
        this.orders = orders.sort((a, b) => {
          return (this.getPersonName(a.id).toLowerCase() > this.getPersonName(b.id).toLowerCase()) ? 1 : -1;
        });
      }, error => this.errorMessage = <any>error);
  }

filterOrders():any[]{
 if(this.searchFilter == "") return this.orders;

  return this.orders.filter((order)=>{
    return this.getPersonName(order.id).toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1
  });
}
  getItems(): void {
    this.dataService.get("/items")
      .subscribe(items => {
        this.items = items;
      }, error => this.errorMessage = <any>error);
  }

  getSingleOrderTotal(order): string {
    let total: number = 0;
    for (var item of order.items) {
      total += this.getItemTotal(item);
    }

    return total == 0 ? '' : `Total £${total.toFixed(2)}`
  }

  getPersonName(id): string {
    const person = this.people.find(person => person.id == id) || {};
    return person.hasOwnProperty('name') ? person.name : 'N/A';
  }


  getItemTotal(item): number {
    const i = this.items.find(i => i.id == item.id);
    if (!i) return 0;
    return i ? Number(i.price * item.qty) : -1;
  }

  changeInclude(order) {
    order.show = order.include;
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }

  changeShow(order) {
    order.show = !order.show;
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }
  showSelection(order) {
    if (!order.items) order.items = [];
    let modal = this.modalCtrl.create(ItemSelectionPage);
    modal.onDidDismiss(data => {
      if (data != undefined) {

        let itemFound: boolean = false;
        for (var item of order.items) {
          if (item.id == data.id) {
            item.qty += 1;
            itemFound = true;
            break;
          }
        }
        if (!itemFound) {
          let newItem: any;
          newItem = {};
          newItem.id = data.id;
          newItem.qty = 1;
          order.items.push(newItem);
          this.dataService.post("/orders", order)
            .subscribe(data => {
              console.log(data);
            }, error => this.errorMessage = <any>error);
        }
      }
    })
    modal.present();
  }

  decreaseItem(order, item) {
    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      order.items.splice(order.items.indexOf(item), 1);
    }
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }

  increaseItem(order, item) {
    item.qty += 1;
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);;
  }
  getItemName(id): string {
    for (var item of this.items) {
      if (item.id == id) {
        return item.name;
      }
    }
    return "N/A";
  }

  getItemPrice(id): number {
    const item = this.items.find(item => item.id == id) || {};
    if (!item) return 0
    return item.hasOwnProperty('price') ? item.price : 0;
  }

  getChange(order): string {
    const paid: number = order.paid || 0;

    if (paid == 0) return "";


    const total = order.items.reduce((sum, item) => {
      return sum += item.qty * this.getItemPrice(item.id);
    }, 0);


    const change = total - paid;

    return `(${change > 0 ? 'Left' : 'Change'} ${change.toFixed(2)})`;
  }

  getOrderTotal(): string {
    let price: number = 0;
    for (var id of Object.keys(this.orders)) {
      let order = this.orders[id];
      if (order.include) {
        for (var item of order.items) {
          price += item.qty * this.getItemPrice(item.id);
        }
      }
    }

    return price == 0 ? "" : `(£${price.toFixed(2)})`;
  }

  refreshOrder() {
    for (var order of this.orders) {
      order.include = false;
      order.paid = 0;
      order.show = false;
      this.dataService.post("/orders", order)
        .subscribe(data => {
          console.log(data);
        }, error => this.errorMessage = <any>error);
    }
  }

  generateOrderText() {
    let text: string = "";
    let newline = "\n";
    for (var order of this.orders) {
      if (order.include) {
        let name = this.getPersonName(order.id);
        text += name + newline;
        for (var item of order.items) {
          let itname = this.getItemName(item.id);
          text += itname + " x " + item.qty + newline;
        }
        text += newline;
      }
    }
    this.ordertext = text;
  }

  saveOrder(order){
      this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }
}
