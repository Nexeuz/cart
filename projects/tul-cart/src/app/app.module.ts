import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AngularFireModule } from '@angular/fire';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { reducers } from './redux';
import { LANGUAGE_CODE } from '@angular/fire/auth';

registerLocaleData(es);

const firebaseConfig = {
  apiKey: "AIzaSyDmGh_a0zmjsJ9fHM1_3SBffFjSov_XMRw",
  authDomain: "otro-test-tul.firebaseapp.com",
  projectId: "otro-test-tul",
  storageBucket: "otro-test-tul.appspot.com",
  messagingSenderId: "49492124875",
  appId: "1:49492124875:web:1adb2b797e125b9346e74e"
};

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    NgZorroAntdModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),

    EffectsModule.forRoot([]),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES },
    { provide: LANGUAGE_CODE, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
