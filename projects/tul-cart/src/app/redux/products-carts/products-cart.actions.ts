import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ProductCart } from '../../interfaces/product-carts';



export const setProductsCarts = createAction('[Cart/API] Set Products Carts', props<{ products: ProductCart[] }>());
export const addSelectedProductsCarts = createAction('[HomePage] Add Products Carts', props<{ products: ProductCart }>());
export const updateSelectedProductsCarts = createAction('[HomePage] Update one Products Carts', props<{  update: Update<ProductCart> }>());
