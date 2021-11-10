import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { ProductCart } from '../../interfaces/product-carts';
import { AppState, selectAllProductCartId } from '../../redux';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  currentIndex = 0;
  obsAllCartProducts$: Observable<ProductCart[]>;
  authState: Observable<firebase.User | null>
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private auth: AuthService,
    private afs: AngularFireAuth
  ) {
    this.authState = this.afs.authState;
    this.obsAllCartProducts$ = this.store.select(selectAllProductCartId);
  }

  ngOnInit(): void {
    this.changeStep();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.changeStep();
      });
  }

  changeStep() {
    if (
      this.router.url.includes('register') ||
      this.router.url.includes('login')
    ) {
      this.currentIndex = 1;
    } else if (this.router.url.includes('create-order')) {
      this.currentIndex = 2;
    } else {
      this.currentIndex = 0;
    }
  }

  async nextIndex() {
    if (this.currentIndex === 0) {
      await this.router.navigateByUrl('/cart/register');
    } else if (this.currentIndex === 1) {
      await this.router.navigateByUrl('/cart/create-order');
    }
  }

  async previusIndex() {
    if (this.currentIndex === 1) {
      await this.router.navigateByUrl('/cart');
    } else if (this.currentIndex === 2 && !((await this.auth.auth.authState.pipe(take(1)).toPromise())?.email)) {
      await this.router.navigateByUrl('/cart/register');
    } else if (this.currentIndex === 2)  {
      await this.router.navigateByUrl('/cart');
    }
  }
}
