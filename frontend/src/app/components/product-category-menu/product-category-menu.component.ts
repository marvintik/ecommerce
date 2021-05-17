import { Component, OnInit } from '@angular/core';
import {ProductCategory} from '../../common/product-category';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.scss']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.listProductCategories();
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
