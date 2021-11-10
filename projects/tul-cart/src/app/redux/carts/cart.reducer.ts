import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {  createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { Cart } from './../../interfaces/carts';

export interface State extends EntityState<Cart> {
  // additional entities state properties
  selectCartId: string | null;
}

export const adapter: EntityAdapter<Cart> = createEntityAdapter<Cart>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectCartId: null
});


export const cartReducer = createReducer(
  initialState,
  on(CartActions.setCarts, (state, { cart }) => {
    return adapter.setAll(cart, state);
  }),
  on(CartActions.selectCart, (state, { cartId }) => {
    return { ...state, selectCartId: cartId };
  }),
);




export const getSelectedCartId = (state: State) => state.selectCartId;

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();


export const selectCartIds = selectIds;

// select the dictionary of user entities
export const selectCartEntities = selectEntities;

// select the array of users
export const selectAllCart = selectAll;

// select the total user count
export const selectCartTotal = selectTotal
