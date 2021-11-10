import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Cart } from '../../interfaces/carts';

import { Product } from '../../interfaces/products';
import { AppState, selectAllProduct, selectCurrentCart } from '../../redux';
import {
  setProducts,
  updateSelectedProducts,
} from '../../redux/products/products.actions';
import { ProductCart } from './../../interfaces/product-carts';
import {
  CARTS_COLLECTION,
  PRODUCTS_CARTS,
  PRODUCTS_COLLECTION,
} from '../../util/name-collections';
import {
  addSelectedProductsCarts,
  setProductsCarts,
  updateSelectedProductsCarts,
} from './../../redux/products-carts/products-cart.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private productsCollection: AngularFirestoreCollection<Product>;
  private productCartCollection: AngularFirestoreCollection<ProductCart>;
  selectedProduct: Product = {
    category: '',
    name: '',
    description: '',
    sku: '',
    image: '',
    id: '',
    loading: false,
  };
  modalVisible = false;
  products$: Observable<Product[]>;
  loadingBuy = false;

  constructor(private afs: AngularFirestore, private store: Store<AppState>) {
    this.productsCollection = this.afs.collection<Product>(PRODUCTS_COLLECTION);
    this.productCartCollection =
      this.afs.collection<ProductCart>(PRODUCTS_CARTS);
    this.productsCollection
      .valueChanges({ idField: 'id' })
      .pipe(
        tap((it: Product[]) => {
          const productAndLoading = it.map((it) => ({ ...it, loading: false }));
          this.store.dispatch(setProducts({ products: productAndLoading }));
        })
      )
      .subscribe();
    this.products$ = this.store.select(selectAllProduct);
  }

  ngOnInit(): void {}

  async addToCurrentToCart(product: Product) {
    this.selectedProduct = product;
    this.dispatchLoading(product, true);
    const currentCart = (await this.store
      .select(selectCurrentCart)
      .pipe(take(1))
      .toPromise()) as Cart;
    // looking current id products based on cart id in database

    if (currentCart) {
      const docRef = await this.afs
        .collection<ProductCart>(PRODUCTS_CARTS)
        .ref.where('product_id', '==', `${product.id}`)
        .where('cart_id', '==', `${currentCart.id}`)
        .get();
      if (docRef.docs.length === 0) {
        // there are not carts

        const idDoc = this.afs.createId();
        this.afs
          .collection(PRODUCTS_CARTS)
          .doc(idDoc)
          .set(this.buildCartObject(idDoc, product, currentCart));
        this.store.dispatch(
          addSelectedProductsCarts({
            products: this.buildCartObject(idDoc, product, currentCart),
          })
        );
      } else {
        const ref = this.afs.doc<ProductCart>(
          `${PRODUCTS_CARTS}/${docRef.docs[0].id}`
        );
        const pr = await ref.valueChanges().pipe(take(1)).toPromise();
        if (pr) {
          ref.update({
            quantity: pr.quantity + 1,
          });
          this.store.dispatch(
            updateSelectedProductsCarts({
              update: {
                id: pr.id,
                changes: {
                  quantity: pr.quantity + 1,
                },
              },
            })
          );
        }
      }
    } else {
      return
    }

    this.dispatchLoading(product, false);
    this.showModal();
  }

  dispatchLoading(product: Product, loading: boolean) {
    this.store.dispatch(
      updateSelectedProducts({
        update: {
          id: product?.id || '',
          changes: {
            loading: loading,
          },
        },
      })
    );
  }

  buildCartObject(idDoc: string, product: Product, currentCart: Cart) {
    return {
      id: idDoc,
      product_id: product.id as string,
      cart_id: currentCart.id as string,
      quantity: 1,
    };
  }

  showModal() {
    this.modalVisible = true;
  }

  handleOkMiddle(): void {
    this.modalVisible = false;
  }

  handleCancelMiddle(): void {
    this.modalVisible = false;
  }
}
