import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';



@Injectable()
export class FirebaseService {

  items:FirebaseListObservable<any[]>;

  constructor(public af: AngularFireDatabase) {
    //this.albums = database.list('albums');
    this.items = af.list('/games');
  }

  // addData(fastBallData) {
  //     console.log(fastBallData, 'fastballData');
  //     let obj = fastBallData.reduce((acc, val) => {
  //     //console.log(val, "fb value");
  //     let key = this.items.push(val).key;
  //         acc[key] = val;
  //         return acc;
  //   }, {});
  // }

  getFastballData() {
    return this.items;
  }
}
 