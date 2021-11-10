import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { CartComponent } from './cart.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { TableProductsComponent } from './table-products/table-products.component';

import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  AngularFireAuthGuard,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/cart']);
const redirectUnauthorizedInLogin = () => redirectLoggedInTo(['/cart/create-order']);

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    children: [
      { path: '', component: TableProductsComponent },
      {
        path: 'login',
        component: AuthComponent,
        ...canActivate(redirectUnauthorizedInLogin),
      },
      { path: 'register', component: RegisterComponent,
      ...canActivate(redirectUnauthorizedInLogin),    },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
