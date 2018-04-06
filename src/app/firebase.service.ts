import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseService {

  items:FirebaseListObservable<any[]>;

  constructor(public af: AngularFireDatabase) {
    this.items = af.list('/pitchspeeds') 
  }

  // addData(fastBallData) {
  //     //console.log(fastBallData, 'fastballData');
  //     this.items.push(fastBallData);
      
  // }

  getFastballData() {
    //console.log('getting fastball data from firebase...', this.items);
    return  this.items = this.af.list('/pitchspeeds');
  }
}
 