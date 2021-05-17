import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {SideMenuService} from '../../services/side-menu.service';
import {OktaAuthService} from '@okta/okta-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private sideMenuService: SideMenuService, private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
      }
    );
  }

  toggleSideNav() {
    this.sideMenuService.toggle(true);
  }
}
