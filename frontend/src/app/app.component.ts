import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {SideMenuService} from './services/side-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-ecommerce';
  showSideMenu: boolean;

  constructor(private sideMenuService: SideMenuService, private el: ElementRef) {
  }

  ngOnInit() {
    this.updateMenuStatus();
  }

  updateMenuStatus() {
    const matContainer = this.el.nativeElement.querySelector('mat-sidenav-content');
    this.sideMenuService.menuToggle.subscribe(
      data => {
        console.log(data);
        this.showSideMenu = data;
      }
    );
  }

  hideMenu() {
    if (this.showSideMenu) {
      this.sideMenuService.toggle(false);
    }
  }
}
