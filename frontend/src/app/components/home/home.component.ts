import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ProductCategory} from '../../common/product-category';
import {Product} from '../../common/product';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  productCategories: ProductCategory[];
  sales = ['books', 'pads', 'cups', 'tags'];

  constructor(private productService: ProductService, private cartService: CartService) {
  }

  ngOnInit() {
    this.listProductCategories();
  }

  handleListProducts(category: number): Observable<Product[]> {
    return this.productService.getProductListPaginate(0, 5,
      category).pipe(map(
      data => {
        return data._embedded.products;
      }
    ));
  }

  addToCart(tempProduct: Product) {
    console.log(`Add to cart: ${tempProduct.name}, ${tempProduct.unitPrice}`);
    const cartItem = new CartItem(tempProduct);
    this.cartService.addToCart(cartItem);
  }

  private listProductCategories() {
    this.productService.getProductCategoryList().subscribe(
      data => {
        console.log('Product Categories =' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
