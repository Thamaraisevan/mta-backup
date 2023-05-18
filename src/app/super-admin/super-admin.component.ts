import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { HttpService } from '../service/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
  userdetails: any;

  changePasswordForm: FormGroup;

  get passwdFrm() { return this.changePasswordForm.controls; }

  showErr = false;

  constructor(private el: ElementRef, 
    public router: Router, 
    public dataService: DataService,
    public http: HttpService,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userdetails = this.dataService.getData("userData");
    console.log("item", this.userdetails);

    this.changePasswordForm = this.formBuilder.group({
      oldPass: ['', Validators.compose([Validators.required])],
      pass: ['', Validators.compose([Validators.required])],
      cpass: ['', Validators.compose([Validators.required])],
    }, 
    { 
      validators: this.passwordValidate.bind(this),
    }
    );

    // $("#sidebarCollapse").click(function(e) {
    //   console.log("e", e);
    //   e.preventDefault();
    //   $("#wrapper").toggleClass("toggled");
    // });

  }

  addGymSubmit(){
    
  }

  passwordValidate(formGroup: FormGroup) {
    const { value: password } = formGroup.get('pass');
    const { value: confirmPassword } = formGroup.get('cpass');
    if(password === confirmPassword){
      this.showErr = false;
    }else{
      this.showErr = true;
    }
  }

  openMenu() {
    let myTag = this.el.nativeElement.querySelector("#sidebar");
    let toggtag = this.el.nativeElement.querySelector("#content-togg");

    if(!toggtag.classList.contains('active')) {
      toggtag.classList.add('active');
    } else {
      toggtag.classList.remove('active');
    }
    // console.log("my tag",myTag);

    if (!myTag.classList.contains('active')) {
      myTag.classList.add('active');

      // this.dataService.showTour = { 'margin-left': '0em !important' }
      console.log("active");
    } else {
      myTag.classList.remove('active');
      // this.dataService.showTour = { 'margin-left': '15.5em !important' };
      console.log("inactive");
    }
  }

  // closeMenu(){
  //   // this.sideClass = 'not-open';
  //   this.showToggle = !this.showToggle;
  //   let myTag = this.el.nativeElement.querySelector("#sidebar");
  //   if (!myTag.classList.contains('active')) {
  //     // myTag.classList.remove('inactive');
  //     myTag.classList.add('active');
  //     console.log("active");
  //   }
  // }
  
  logout() {
    this.dataService.removeData("token")
    this.router.navigate([`/auth/login`]);
  }

  GotoProfile(){
    this.router.navigate([`/admin/profile`]);
  }
}
