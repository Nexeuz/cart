import { FormControl } from "@angular/forms";
import { ProductCart } from "./product-carts";

export interface Product {
  category: string
  description: string
  image: string
  name: string
  sku: string
  id?: string
  loading?: boolean
}


export interface JoinProductProductCart extends ProductCart {
  product: Product
  formControl: FormControl
}
