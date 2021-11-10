import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { Cart } from '../interfaces/carts';
import { AppState } from '../redux';
import { selectCart } from '../redux/carts/cart.actions';
import { CURRENT_CART_KEY } from '../util/localstorage-keys';
import { CARTS_COLLECTION } from '../util/name-collections';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  authState$ = this.afAuth.authState;

  constructor(
    private afs: AngularFirestore,
    private store: Store<AppState>,
    private afAuth: AngularFireAuth
  ) {}

  async addCollectionAndSaveLocalstorage() {
   await this.authState$.pipe(take(1)).toPromise();
    const added = (
      await this.afs
        .collection<Cart>(CARTS_COLLECTION)
        .add({ status: 'pending' })
    ).id;
    localStorage.setItem(CURRENT_CART_KEY, added);
    this.store.dispatch(selectCart({ cartId: added }));
  }
}
