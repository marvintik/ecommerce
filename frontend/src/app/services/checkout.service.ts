import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Purchase} from '../common/purchase';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = '/api/checkout/purchase';

  constructor(private http: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
    console.log(purchase);
    return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }
}
