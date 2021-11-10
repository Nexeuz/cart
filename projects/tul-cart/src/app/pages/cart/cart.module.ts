import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { TableProductsComponent } from './table-products/table-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { RegisterComponent } from './auth/register/register.component';


@NgModule({
  declarations: [CartComponent, TableProductsComponent, AuthComponent, CreateOrderComponent, RegisterComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CartModule { }
