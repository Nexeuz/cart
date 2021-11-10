import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Product } from '../../interfaces/products';
import { setProducts } from './products.actions';
import * as ProductActions from '../products/products.actions';

export interface State extends EntityState<Product> {
  // additional entities state properties
  selecProductId: string | null;
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selecProductId: null
});


export const productReducer = createReducer(
  initialState,
  on(ProductActions.setProducts, (state, { products }) => {
    return adapter.setAll(products, state);
  }),
  on(
    ProductActions.updateSelectedProducts,
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


export const selectProductIds = selectIds;

// select the dictionary of user entities
export const selectProductEntities = selectEntities;

// select the array of users
export const selectAllProduct = selectAll;

// select the total user count
export const selectProductTotal = selectTotal




