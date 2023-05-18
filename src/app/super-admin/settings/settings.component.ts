import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  duration: any;
  type: any;
  showAdd: any;
  addUserModal: any;
types=[{'name':"Days"},{'name':"Months"}];
  constructor(public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,
    private _location: Location) { }

  ngOnInit(): void {
  }


  update(){
    if(this.duration && this.type){ 
    var req={
      'duration':parseInt(this.duration),
      'duration_type':this.type
    }
    this.http.putMethod("utils/1", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      this.duration="";
      this.type="";
      // this.addUserModal.nativeElement.click();
      
     
    }).catch((err) => {
      console.log(err);
    });
  }else{
    this.dataService.showError("Error", "Fill all fields to Update");
  }
  }
  getsubAdmin() {
    throw new Error('Method not implemented.');
  }
}
