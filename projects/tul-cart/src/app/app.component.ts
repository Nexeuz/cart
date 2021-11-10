import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, from, of } from 'rxjs';
import { Cart } from './interfaces/carts';
import { Product } from './interfaces/products';
import { CURRENT_CART, CURRENT_CART_KEY } from './util/localstorage-keys';
import {
  CARTS_COLLECTION,
  PRODUCTS_CARTS,
  PRODUCTS_COLLECTION,
} from './util/name-collections';
import { products } from './util/products';
import { selectCart, setCarts } from './redux/carts/cart.actions';
import { AppState, selectAllProductCartId, selectCurrentCart, selectCurrentProductCart } from './redux/index';
import { ProductCart } from './interfaces/product-carts';
import { map, scan, switchMap, tap } from 'rxjs/operators';
import { setProductsCarts } from './redux/products-carts/products-cart.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private productsCollection: AngularFirestoreCollection<Product>;
  private cartCollection: AngularFirestoreCollection<Cart>;
  private cartDoc: AngularFirestoreDocument<Cart>;
  cartDoc$: Observable<Cart | undefined>;
  private batch;
  cartProducts$: Observable<number>;
  authState$ = this.afAuth.authState;

  constructor(
    private afs: AngularFirestore,
    public store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    this.productsCollection = afs.collection<Product>(PRODUCTS_COLLECTION);
    this.cartProducts$ = this.store.select(selectAllProductCartId).pipe(
      switchMap((arr) => {
        if (arr.length > 0) {
          return from(arr).pipe(scan((acc, curr) => acc + curr.quantity, 0));
        } else {
          return of(0);
        }
      })
    );
    this.batch = this.afs.firestore.batch();
    this.cartDoc = afs.doc('cart/id');
    this.cartDoc$ = this.cartDoc.valueChanges();
    this.cartCollection = this.afs.collection<Cart>(CARTS_COLLECTION);
  }

  ngOnInit(): void {
    this.store.select(selectCurrentCart)
    .subscribe(it => {
      if (it) {
        this.afs
        .collection<ProductCart>(PRODUCTS_CARTS, (ref) =>
          ref.where(`cart_id`, '==', `${it.id}`)
        )
        .valueChanges()
        .subscribe((docs) => {
          this.store.dispatch(setProductsCarts({ products: docs }));
        });
      }

    })


    this.checkCurrentCart();
    this.cartCollection
      .valueChanges({ idField: 'id' })
      .subscribe((it: Cart[]) => {
        if (it.length > 0) {
          const currentKey = localStorage.getItem(CURRENT_CART_KEY);
          if (currentKey) {
            const current = it.filter((cart) => cart.id === currentKey);
            if (current.length > 0) {
              localStorage.setItem(CURRENT_CART, JSON.stringify(current[0]));
            } else {
            }
          } else {
          }
        }
        this.store.dispatch(setCarts({ cart: it }));
      });
  }

  async checkCurrentCart() {
    const currentCartKey = localStorage.getItem(CURRENT_CART_KEY);
    const currentCart = localStorage.getItem(CURRENT_CART);
    const currentObjectCart = currentCart
      ? (JSON.parse(currentCart) as Cart)
      : { status: 'pending', id: '' };
    if (currentCartKey === null) {
      this.firestoreService.addCollectionAndSaveLocalstorage();
    } else {
      this.store.dispatch(selectCart({ cartId: currentCartKey }));

    }
  }



  /**
   * Test function to create products faster :)
   */
  createProducts() {
    for (let item of products) {
      this.productsCollection.add(item);
    }
    this.batch.commit();
  }

  async signOut() {
    await this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
