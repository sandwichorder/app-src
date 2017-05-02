import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MenuPage } from '../pages/menu/menu';
import { PeoplePage } from '../pages/people/people';
import { OrderPage } from '../pages/order/order';
import { ItemSelectionPage } from '../pages/item-selection/item-selection';

import {CategoryItemsFilter} from '../misc/pipes';
import {DataService} from '../services/data.service';

@NgModule({
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  declarations: [
    MyApp,
    MenuPage,
    ItemSelectionPage,
    OrderPage,
    PeoplePage,
    CategoryItemsFilter
  ],
  
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    ItemSelectionPage,
    OrderPage,
    PeoplePage   
  ],
  providers: [DataService,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {} 