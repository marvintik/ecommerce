import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SideMenuService} from '../../services/side-menu.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  toggle = false;

  constructor(private sideMenuService: SideMenuService) { }

  ngOnInit(): void {
    this.updateMenuStatus();
  }

  hideMenu() {
    this.sideMenuService.toggle(false);
  }

  updateMenuStatus() {
    this.sideMenuService.menuToggle.subscribe(
      data => this.toggle = data
    );
  }
}
