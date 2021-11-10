import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Cart } from '../../../interfaces/carts';
import { AppState } from '../../../redux';
import { setProductsCarts } from '../../../redux/products-carts/products-cart.actions';
import { FirestoreService } from '../../../services/firestore.service';
import { CURRENT_CART } from '../../../util/localstorage-keys';
import { CARTS_COLLECTION } from '../../../util/name-collections';
@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  form: FormGroup;
  loading = false
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private afs: AngularFirestore,
    private firestoreService: FirestoreService,
    private router: Router,
    private modalService: NzModalService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      nationalId: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
    });
  }


  ngOnInit(): void {}

 async generateOrder() {
      const cartPrevius = localStorage.getItem(CURRENT_CART);
      if (cartPrevius) {
        this.loading = true
         const parsed = JSON.parse(cartPrevius) as Cart
        if (parsed?.status === 'pending') {
          await this.afs.doc<Cart>(`${CARTS_COLLECTION}/${parsed.id}`).update({
            status: 'completed',
          });
          await this.firestoreService.addCollectionAndSaveLocalstorage();

          this.store.dispatch(setProductsCarts({products: []}))
          this.loading = false
          this.showModal()
        }
      }

  }

  showModal() {
    const modal = this.modalService.success({
      nzTitle: '¡Se ha generado exitosamente tu orden!',
      nzContent: 'En los proximos 5 días te entregaremos tu pedido'
    }).afterClose.subscribe(it => {
      this.router.navigate(['/'])
    });
  }
}
