import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    imports: [RouterModule, NgbDropdownModule]
})
export class NavbarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
