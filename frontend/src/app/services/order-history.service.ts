import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OrderHistory} from '../common/order-history';


@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = '/api/orders';

  constructor(private http: HttpClient) { }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const searchUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.http.get<GetResponseOrderHistory>(searchUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}
