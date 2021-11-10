import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Product } from '../../interfaces/products';



export const setProducts = createAction('[Products/API] Set Products', props<{ products: Product[] }>());
export const updateSelectedProducts = createAction('[HomePage] Update one Products', props<{  update: Update<Product> }>());
