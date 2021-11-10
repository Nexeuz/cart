import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Observable, combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Cart } from '../../../interfaces/carts';
import { ProductCart } from '../../../interfaces/product-carts';
import { JoinProductProductCart, Product } from '../../../interfaces/products';
import {
  AppState,
  selectAllProduct,
  selectAllProductCartId,
  selectCurrentCart,
} from '../../../redux';
import { updateSelectedProductsCarts } from '../../../redux/products-carts/products-cart.actions';
import { setProducts } from '../../../redux/products/products.actions';
import {
  PRODUCTS_CARTS,
  PRODUCTS_COLLECTION,
} from '../../../util/name-collections';

@Component({
  selector: 'app-table-products',
  templateUrl: './table-products.component.html',
  styleUrls: ['./table-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableProductsComponent implements OnInit {
  size: NzButtonSize = 'large';
  obsAllCartProducts$: Observable<JoinProductProductCart[]>;
  formGroup: FormGroup;
  private productsCollection: AngularFirestoreCollection<Product>;
  loadingTable = false;
  constructor(
    private store: Store<AppState>,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.formGroup = this.fb.group({
      controlArray: this.fb.array([]),
    });
    this.obsAllCartProducts$ = combineLatest([
      this.store.select(selectAllProduct),
      this.store.select(selectAllProductCartId),
      this.store.select(selectCurrentCart),
    ]).pipe(
      map(([products, cartProducts, currentCart]) => {
        const cart = currentCart as Cart;
        if (cart?.id) {
          return cartProducts
            .filter((it) => it.cart_id === cart.id)
            .map(
              (cartProduct) =>
                ({
                  ...cartProduct,
                  product: products.find(
                    (fi) => fi.id === cartProduct.product_id
                  ),
                } as unknown as JoinProductProductCart)
            );
        } else {
          return [];
        }
      }),
      map((cartProducts) => {
        this.formGroup.get('controlArray') as FormArray;

        for (const iterator of cartProducts) {
          const formInstance = new FormControl(iterator.quantity);
          (this.formGroup.controls['controlArray'] as FormArray).push(
            formInstance
          );
          iterator.formControl = formInstance;
        }
        return cartProducts;
      })
    );

    this.productsCollection = this.afs.collection<Product>(PRODUCTS_COLLECTION);

    this.productsCollection
      .valueChanges({ idField: 'id' })
      .pipe(
        tap((it: Product[]) => {
          this.store.dispatch(setProducts({ products: it }));
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  setFormValues() {
    this.formGroup = this.fb.group({
      dataArray: [],
    });
  }

  decreaseQuantity(data: JoinProductProductCart) {
    const newValue = Number(data.formControl.value) - 1;
    data.formControl.setValue(newValue);
    this.updateQuantity(data.id, newValue);
  }

  increaseQuantity(data: JoinProductProductCart) {
    const newValue = Number(data.formControl.value) + 1;
    data.formControl.setValue(newValue);
    this.updateQuantity(data.id, newValue);
  }

  changeInput(data: JoinProductProductCart) {
    const correctValue = Number(data.formControl.value);

    if (correctValue >= 1) {
      this.updateQuantity(data.id, data.formControl.value);
    }
  }

  updateQuantity(idCart: string, quantity: number) {
    this.store.dispatch(
      updateSelectedProductsCarts({
        update: {
          id: idCart,
          changes: {
            quantity: quantity,
          },
        },
      })
    );
    this.updateQuantityOnFirestore(idCart, quantity);
  }

  async updateQuantityOnFirestore(idCart: string, quantity: number) {
    this.loadingTable = true;
    await this.afs.doc<ProductCart>(`${PRODUCTS_CARTS}/${idCart}`).update({
      quantity: quantity,
    });
    this.loadingTable = false;
    this.cd.detectChanges();
  }

  async deleteItem(data: JoinProductProductCart) {
    this.loadingTable = true;
    await this.afs.doc(`${PRODUCTS_CARTS}/${data.id}`).delete();
    this.loadingTable = false;
    this.cd.detectChanges();
  }
}
