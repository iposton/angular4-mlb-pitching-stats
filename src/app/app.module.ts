import { masterFirebaseConfig } from './api-keys';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'

import {
  MdButtonModule,
  MdCardModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
  MdAutocompleteModule,
  MdButtonToggleModule,
  MdCheckboxModule,
  MdChipsModule,
  MdCoreModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdInputModule,
  MdListModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';
import 'hammerjs';
import 'rxjs/add/operator/map'
import { CdkTableModule } from '@angular/cdk';


import { AppComponent } from './app.component';
import { OrderBy } from './orderby.pipe';
import {InfoService} from './info.service';

import { FirebaseService } from './firebase.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { PlayerComponent } from './player/player.component';
import { PitchingStatsComponent, MyDialog } from './pitching-stats/pitching-stats.component';

export const firebaseConfig = {
  apiKey: masterFirebaseConfig.apiKey,
  authDomain: masterFirebaseConfig.authDomain,
  databaseURL: masterFirebaseConfig.databaseURL,
  storageBucket: masterFirebaseConfig.storageBucket
};

@NgModule({
  declarations: [
    AppComponent,
    MyDialog,
    OrderBy,
    PlayerComponent,
    PitchingStatsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdButtonModule,
    MdMenuModule,
    MdCardModule,
    MdIconModule,
    MdAutocompleteModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdChipsModule,
    MdCoreModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    CdkTableModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot([
         {
          path: '',
          redirectTo: 'pitching-stats',
          pathMatch: 'full'
        },
        {
          path: 'daily-stats/:id',
          component: PlayerComponent,
          
        },
        {
          path: 'pitching-stats',
          component: PitchingStatsComponent
        }
    ])
  ],
  providers: [InfoService, FirebaseService],
  entryComponents: [
    MyDialog
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
