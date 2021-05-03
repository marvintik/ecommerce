import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from 'src/app/services/product.service';
import {ActivatedRoute} from '@angular/router';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService: ProductService, private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  private handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(theProductId).subscribe(
      data => this.product = data
    );
  }

  addToCart() {
    console.log(`Add to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
