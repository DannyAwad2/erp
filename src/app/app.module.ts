import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CacheInterceptor } from './core/Interceptors/cache.Interceptor';
import { RouterModule } from '@angular/router';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB7EGyDrnxFGrw4rwkLTldj5vSH4jtFGic',
  authDomain: 'erp-webapp-56091.firebaseapp.com',
  projectId: 'erp-webapp-56091',
  storageBucket: 'erp-webapp-56091.firebasestorage.app',
  messagingSenderId: '605854437185',
  appId: '1:605854437185:web:6c550e66c3cbb421635bc0',
};

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
  ],
})
export class AppModule {}
