import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { AuthorisedSideNavService } from '../services/authorised-side-nav.service';

@Component({
  selector: 'app-authorised-side-nav-toggler',
  templateUrl: './authorised-side-nav-toggler.component.html',
  styleUrls: ['./authorised-side-nav-toggler.component.scss']
})
export class AuthorisedSideNavTogglerComponent implements OnInit {

  constructor(
    public sideNavService: AuthorisedSideNavService, 
    public dataService: DataService 
  ) { }

  ngOnInit(): void {
  }

}
