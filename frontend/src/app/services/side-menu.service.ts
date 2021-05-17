import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  menuToggle: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  toggle(open: boolean): void {
    this.menuToggle.next(open);
  }
}
