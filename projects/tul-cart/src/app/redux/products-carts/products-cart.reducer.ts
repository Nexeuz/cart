import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductCart } from '../../interfaces/product-carts';
import * as ProductActions from './products-cart.actions';

export interface State extends EntityState<ProductCart> {
  // additional entities state properties
  selectProductCarts: ProductCart[];
}

export const adapter: EntityAdapter<ProductCart> =
  createEntityAdapter<ProductCart>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectProductCarts: [],
});

export const getSelectetProductCarts = (state: State) =>
  state.selectProductCarts;

export const productCartReducer = createReducer(
  initialState,
  on(ProductActions.setProductsCarts, (state, { products }) => {
    return adapter.setAll(products, state);
  }),
  on(ProductActions.addSelectedProductsCarts, (state, { products }) => {
    return adapter.addOne(products, state)
    ;
  }),
  on(
    ProductActions.updateSelectedProductsCarts,
    (state, { update }) => {
      return adapter.updateOne(update, state);
    }
  )
);


const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();


export const selectProductCartIds = selectIds;

// select the dictionary of user entities
export const selectProductCartEntities = selectEntities;

// select the array of users
export const selectAllProductCart = selectAll;

// select the total user count
export const selectProductCartTotal = selectTotal
