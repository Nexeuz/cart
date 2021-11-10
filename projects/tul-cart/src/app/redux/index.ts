import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromProductCart from './products-carts/products-cart.reducer';
import * as fromCart from './carts/cart.reducer';
import * as fromProduct from './products/products.reducer';


export interface AppState {
  products: fromProduct.State;
  carts: fromCart.State;
  productCarts: fromProductCart.State
}
export const reducers: ActionReducerMap<AppState> = {
  products: fromProduct.productReducer,
  carts: fromCart.cartReducer,
  productCarts: fromProductCart.productCartReducer
};



export const selectCartState = createFeatureSelector<fromCart.State>('carts');

export const selectCartEntities = createSelector(
  selectCartState,
  fromCart.selectCartEntities
);

export const selectCurrentCartId = createSelector(
  selectCartState,
  fromCart.getSelectedCartId
);
export const selectCurrentCart = createSelector(
  selectCartEntities,
  selectCurrentCartId,
  (cartEntities, cartId) => cartId && cartEntities[cartId]
);


export const selectProductCartState = createFeatureSelector<fromProductCart.State>('productCarts');

export const selectCurrentProductCart = createSelector(
  selectProductCartState,
  fromProductCart.getSelectetProductCarts
);


export const selectAllProductCartId = createSelector(
  selectProductCartState,
  fromProductCart.selectAllProductCart
);


export const selectProductState = createFeatureSelector<fromProduct.State>('products');


export const selectAllProduct = createSelector(
  selectProductState,
  fromProduct.selectAllProduct
);



