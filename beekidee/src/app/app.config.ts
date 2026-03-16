import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient} from "@angular/common/http";
import {getDatabase, provideDatabase} from "@angular/fire/database";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withHashLocation()), provideFirebaseApp(() => initializeApp({"projectId":"beekideeapp","appId":"1:964076128653:web:adb368e96a1bc48a8015c4","databaseURL":"https://beekideeapp-default-rtdb.firebaseio.com","storageBucket":"beekideeapp.appspot.com","apiKey":"AIzaSyDGV0LCwTeUH1CeIu1c7QjJK-BNHwFn-jw","authDomain":"beekideeapp.firebaseapp.com","messagingSenderId":"964076128653","measurementId":"G-CFE9ZEFGWV"})),
    provideAuth(() => getAuth()),provideDatabase(()=>getDatabase()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),
    provideAnimationsAsync(), provideAnimationsAsync(),provideHttpClient()]
};
