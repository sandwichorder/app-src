import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
//import dataservice to push/receive data from API
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
    //people array
people: any[] = [];
errorMessage: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public dataService: DataService) {}
//get people async, when received sort array by name in aplhabetical order and set to people array
 getPeople(): void {
   this.dataService.get("/people")
    .subscribe(people => this.people = people.sort((n1,n2)=>{
      return (n1.name > n2.name) ? 1 : -1;
    }),  error => this.errorMessage = <any>error);
 }
//on startup get people from API/database
 ngOnInit(): void {
    this.getPeople();
  }

//open module to add new person data
  addPersonPrompt(){
      //initialise 'ionic alert' module
    let prompt = this.alertCtrl.create({
      title: 'Add Person',
      //inputs that will be accepted
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      //buttons that will be displayed and what to do if they are clicked
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          //if 'save' pressed
          handler: data => {
              //create new ID using UUID, can check if ID already exists, but cahnce that UUID will already exists is very small so no check is done
             data.id = UUID.UUID();
             //subit changes to API/databse, data will already have .name property from 'inputs' above
            this.dataService.post("/people",data)
              .subscribe(data => {
                console.log(data);
                this.getPeople();
              },error => this.errorMessage = <any>error);
              //create new order object and push it to databse
               let newPersonOrder:any = {};
                newPersonOrder.id = data.id;
                newPersonOrder.items = [];
                newPersonOrder.include = false;
                newPersonOrder.custom = "";
                //submit cahnges to API/database
                this.dataService.post("/orders",newPersonOrder)
                .subscribe(data => {
                        console.log(data);
                      },error => this.errorMessage = <any>error);
          }
        }
      ]
    });
    //show 'ionic alert' module
    prompt.present();
  }

//remove person from database
  removePerson(person){
      //send delete request to API
    this.dataService.delete("/people",person)
      .subscribe(data => {
            console.log(data);
            //if successfull then get updated people array async
            this.getPeople()
          },error => this.errorMessage = <any>error);
          //delete order associated with this person id
          this.dataService.delete("/orders",person)
       .subscribe(data => {
               console.log(data);
           },error => this.errorMessage = <any>error);
  }
//edit person module
  editPerson(person){
   //initialise 'ionic alert' module to edit data
      let prompt = this.alertCtrl.create({
      title: 'Edit Person',
      //define inputs and prefill with existing data
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
            //if save pressed submit changes to API/databse
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
    //display 'ionic alert' module
    prompt.present();
  }

}
