import {Component, OnInit} from '@angular/core';
import {ProductService} from 'src/app/services/product.service';
import {Product} from 'src/app/common/product';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from "../../common/cart-item";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId = 1;
  previousCategoryId = 1;
  currentCategoryName: string;
  searchMode = false;

  thePageNumber = 0;
  thePageSize = 10;
  theTotalElements = 0;
  previousKeyword: string = null;
  sales = ['books', 'pads', 'cups', 'tags'];

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(event?: PageEvent) {

    if (event !== undefined) {
      this.thePageNumber = event.pageIndex;
      this.thePageSize = event.pageSize;
    }
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  private handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 0;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, the pageNumber=${this.thePageNumber}`);

    this.productService.searchProductListPaginate(this.thePageNumber, this.thePageSize, theKeyword)
      .subscribe(this.processResults());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 0;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, the PageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber, this.thePageSize,
                                              this.currentCategoryId).subscribe(this.processResults());
  }


  private processResults() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(tempProduct: Product) {
    console.log(`Add to cart: ${tempProduct.name}, ${tempProduct.unitPrice}`);
    const cartItem = new CartItem(tempProduct);
    this.cartService.addToCart(cartItem);
  }
}
