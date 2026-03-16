import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Auth, onAuthStateChanged} from "@angular/fire/auth";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        observer.next(true);
        observer.complete();
      } else {
        router.navigate(['/security/sign-in'], { queryParams: { returnUrl: state.url } });
        observer.next(false);
        observer.complete();
      }
    });
  });
};
