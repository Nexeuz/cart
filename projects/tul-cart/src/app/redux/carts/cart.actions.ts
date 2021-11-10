import { createAction, props } from '@ngrx/store';
import { Cart } from './../../interfaces/carts';



export const setCarts = createAction('[Cart/API] Set Carts', props<{ cart: Cart[] }>());
export const selectCart = createAction('[Home Page] Select Cart', props<{ cartId: string }>());
