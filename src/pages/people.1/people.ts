import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

import {DataService} from '../../services/data.service';
/*
  Generated class for the People page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-people',
  templateUrl: 'people.html'
})
export class PeoplePage implements OnInit{
people: any[] = [];
errorMessage: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public dataService: DataService) {}

 getPeople(): void {
   this.dataService.get("/people")
    .subscribe(people => this.people = people.sort((n1,n2)=>{
      return (n1.name > n2.name) ? 1 : -1;
    }),  error => this.errorMessage = <any>error);
 }

 ngOnInit(): void {
    this.getPeople();
  }


  addPersonPrompt(){
    let prompt = this.alertCtrl.create({
      title: 'Add Person',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data => {
             data.id = UUID.UUID();
            this.dataService.post("/people",data)
              .subscribe(data => {
                console.log(data);
                this.getPeople();
              },error => this.errorMessage = <any>error);
               let newPersonOrder:any = {};
                newPersonOrder.id = data.id;
                newPersonOrder.items = [];
                newPersonOrder.include = false;
                newPersonOrder.custom = "";
                this.dataService.post("/orders",newPersonOrder)
                .subscribe(data => {
                        console.log(data);
                      },error => this.errorMessage = <any>error);

          }
        }
      ]
    });
    prompt.present();
  }


  removePerson(person){
    this.dataService.delete("/people",person)
      .subscribe(data => {
            console.log(data);
            this.getPeople()
          },error => this.errorMessage = <any>error);
          this.dataService.delete("/orders",person)
       .subscribe(data => {
               console.log(data);
           },error => this.errorMessage = <any>error);
  }

  editPerson(person){
   
      let prompt = this.alertCtrl.create({
      title: 'Edit Person',
      inputs: [
        {
          name: 'name',
          value: person.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data => {
            data.id = person.id;
            this.dataService.post("/people",data)
            .subscribe(data => {
                console.log(data);
                this.getPeople();
              },error => this.errorMessage = <any>error);
          }
        }
      ]
    });
    prompt.present();
  }

}
