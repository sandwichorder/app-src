import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

//Import service for calls to API/Backend
import { DataService } from '../../services/data.service';
//Import item selection/'add item' page
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
    //people array to lookup person name
  people: any[] = [];
  //orders array, order id is same as related person id
  orders: any[] = [];
  //items array to calculate each order total
  items: any[] = [];
  errorMessage: any;
  //order search people by person name
  searchFilter: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public modalCtrl: ModalController) { }
//on startup get people and items async
  ngOnInit(): void {
    this.getPeople();

    this.getItems();
  }
//get people async, when received data, then get orders data
  getPeople(): void {
    this.dataService.get("/people")
      .subscribe(people => {
        this.people = people;
        this.getOrders();
      }, error => this.errorMessage = <any>error);
  }
  //get oders, once received sort them by person name, as it only contains id, compare getPersonName(id1) and getPersonName(id2)
  getOrders(): void {
    this.dataService.get("/orders")
      .subscribe(orders => {
        this.orders = orders.sort((a, b) => {
          return (this.getPersonName(a.id).toLowerCase() > this.getPersonName(b.id).toLowerCase()) ? 1 : -1;
        });
      }, error => this.errorMessage = <any>error);
  }
  //get items async
  getItems(): void {
    this.dataService.get("/items")
      .subscribe(items => {
        this.items = items;
      }, error => this.errorMessage = <any>error);
  }
//filter orders, if filter is empty, return all orders, else return orders using getPersonName(id).Contains(filter)
  filterOrders(): any[] {
    if (this.searchFilter == "") return this.orders;

    return this.orders.filter((order) => {
      return this.getPersonName(order.id).toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1
    });
  }

//get total price of order for single person
  getSingleOrderTotal(order): string {
    let total: number = 0;
    for (var item of order.items) {
      total += this.getItemTotal(item);
    }
//Return as custom string with 0.00 format
    return total == 0 ? '' : `Total £${total.toFixed(2)}`
  }
//lookup person name by id, as order id and person id are identical
  getPersonName(id): string {
    const person = this.people.find(person => person.id == id) || {};
    return person.hasOwnProperty('name') ? person.name : 'N/A';
  }

//get total for item quantity * price, lookup price in items array
  getItemTotal(item): number {
    const i = this.items.find(i => i.id == item.id);
    if (!i) return 0;
    return i ? Number(i.price * item.qty) : -1;
  }
//change order.include flag
  changeInclude(order) {
    order.show = order.include;
    //submit changes to API/database
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }
//change order.show flag, hide/show order details
  changeShow(order) {
    order.show = !order.show;
    //submit changes to API/database
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }
  //show page(ionic modal) for adding an item to order
  showSelection(order) {
      //if order items array does not yet exist, initialise empty
    if (!order.items) order.items = [];
    //create ionic modal
    let modal = this.modalCtrl.create(ItemSelectionPage);
    //create callback on 'module closed' before opening
    modal.onDidDismiss(data => {
        //if item was selected
      if (data != undefined) {
//loop through every item in selected order and if item already exists, increment
        let itemFound: boolean = false;
        for (var item of order.items) {
          if (item.id == data.id) {
            item.qty += 1;
            itemFound = true;
            break;
          }
        }
        //if item was not found add as new item to order
        if (!itemFound) {
          let newItem: any;
          newItem = {};
          newItem.id = data.id;
          newItem.qty = 1;
          //push item to order
          order.items.push(newItem);
          //submit changes to API/database
          this.dataService.post("/orders", order)
            .subscribe(data => {
              console.log(data);
            }, error => this.errorMessage = <any>error);
        }
      }
    })
    //open module
    modal.present();
  }
//decrease item count in selected order, if quantity is less or equal 1 then remove from order
  decreaseItem(order, item) {
    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      order.items.splice(order.items.indexOf(item), 1);
    }
    //submit changes to API/database
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }
//increase item count in order
  increaseItem(order, item) {
    item.qty += 1;
    //submit changes to API/database
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);;
  }
  //lookup item name by id in items array, as order contains only item id reference and quantity of item
  getItemName(id): string {
    for (var item of this.items) {
      if (item.id == id) {
        return item.name;
      }
    }
    return "N/A";
  }
//lookup item price for id in items array
  getItemPrice(id): number {
    const item = this.items.find(item => item.id == id) || {};
    if (!item) return 0
    return item.hasOwnProperty('price') ? item.price : 0;
  }
//get difference of paid and amount to pay and return appropriate string
  getChange(order): string {
    const paid: number = order.paid || 0;
//if nothing paid, return empty string
    if (paid == 0) return "";

//get order total by looping through every item in order and adding up qty * price
    const total = order.items.reduce((sum, item) => {
      return sum += item.qty * this.getItemPrice(item.id);
    }, 0);


    const change = total - paid;
//If paid too little, display 'Left' to pay, otherwise display 'Change' to give
    return `(${change > 0 ? 'Left' : 'Change'} ${change.toFixed(2)})`;
  }
//Sum up all orders totals to get total amount of $ that you should have to pay for orders
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
//if total is 0 then do not display anything, return empty
    return price == 0 ? "" : `(£${price.toFixed(2)})`;
  }
//reset order data by setting all order.include and order.show to false, and order.paid = nothing
  refreshOrder() {
    for (var order of this.orders) {
      order.include = false;
      order.paid = null;
      order.show = false;
      //submit changes to API/database
      this.dataService.post("/orders", order)
        .subscribe(data => {
          console.log(data);
        }, error => this.errorMessage = <any>error);
    }
  }
//generate a text for order, for example to send as a message
  generateOrderText() {
    let text: string = "";
    let newline = " \r\n";
    //looop through every order
    for (var order of this.orders) {
        //if it has include flag enabled
      if (order.include) {
          //generate custom text for this order
        let name = this.getPersonName(order.id);
        text += name + newline;
        for (var item of order.items) {
          let itname = this.getItemName(item.id);
          text += itname + " x " + item.qty + newline;
        }
        //add custom order text
        text += "Custom:" + order.custom;
        text += newline;
      }
    }
//open as email, can copy text and input as sms, (in ionic1 in which was first version of app, there was option for opening in sms as well, not sure how it's done in ionic2 so left as email)
    window.open(`mailto:?subject=Sandwich order&body=${encodeURIComponent(text)}`, "_self");
  }
//save all orders data to API/database
  saveOrder(order) {
    this.dataService.post("/orders", order)
      .subscribe(data => {
        console.log(data);
      }, error => this.errorMessage = <any>error);
  }
}
