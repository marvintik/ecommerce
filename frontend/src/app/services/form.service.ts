import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Country} from '../common/country';
import {HttpClient} from '@angular/common/http';
import {State} from "../common/state";
import {map} from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countryUrl = '/api/countries';
  private stateUrl = '/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardsYears(): Observable<number[]>{
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe(map(
      response => response._embedded.countries
    ));
  }

  getStates(theCountryCode: string): Observable<State[]> {
    console.log(theCountryCode);
    const searchUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(map(
      response => response._embedded.states
    ));
  }
}
interface GetResponseCountries {
  _embedded: {
    countries: Country[]
  };
}
interface GetResponseStates {
  _embedded: {
    states: State[]
  };
}
