import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  
  loginForm: FormGroup;
  otp: any;
  get frm() { return this.loginForm.controls; }

  emailForm: FormGroup;
  get emailFrm() { return this.emailForm.controls; }

  changePwdForm: FormGroup;
  get passwdFrm() { return this.changePwdForm.controls; }

  showEmail = false;
  showOTP = false;
  showChangePwd = false;

  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: Router ) { }


  ngOnInit(): void {
    // this.loginForm = this.formBuilder.group({
    //   email_or_phone_number: ['vasanthm@gmail.com', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
    //   password: ['qwerty12', Validators.compose([Validators.required])],
    // });
    this.loginForm = this.formBuilder.group({
      email_id: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      password: ['', Validators.compose([Validators.required])],
    });
    this.dataService.console("login");

    this.emailForm = this.formBuilder.group({
      emailid : ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
    });

    this.changePwdForm = this.formBuilder.group({
      newPassword : ['', Validators.compose([Validators.required])],
      confirmPassword : ['', Validators.compose([Validators.required])],
    })
  }

  login() {
    if (this.loginForm.status == 'VALID') {
      this.dataService.removeData("token")

      let req = this.loginForm.value;
      this.http.postMethod("users/login", req).then((response: any) => {
        console.log("response", response);
        this.dataService.authToken = response.token;
        this.dataService.setData("token", response.token);
        this.dataService.setData("userData", response.data);
        this.dataService.userProfile = response.data;
        // this.dataService.showSuccess("success", response.message);
        if (response.data.role == 'ADMIN') {
          this.dataService.navigateForward("admin/dashboard");
        
        }
        // else if (response.data.role == 'STAFF') {
        //   this.dataService.navigateForward("admin/dashboard");
        // }
         this.dataService.navigateForward("admin/dashboard");
      }).catch((err) => {
        console.log(err);
      });
    } else {
      this.dataService.markFormGroupTouched(this.loginForm);
    }
   
  }

  forgotPassword(){
    this.showEmail = true;
    this.showOTP = false;
    this.showChangePwd = false;
    this.emailForm.reset();
  }

  verifyEmail() {

    let req = {
      'email_id': this.emailForm.value.emailid
    }

    this.http.postMethod("users/forgotPassword", req).then((response: any) => {
      console.log(response);
      this.dataService.showSuccess("success", response.message);
      // this.closeModal.nativeElement.click();
      // this.getDashboard();
      this.showOTP = true;
      this.showChangePwd = false;
      this.showEmail = false;
      
    }).catch((err) => {
      console.log(err);
    });
  }

  onOtpChange(event){
    console.log("event", event);
    this.otp = event;
  }

  verifyOTP(){
    if(this.otp == '' || this.otp == undefined){
      this.dataService.showError("Error", 'Enter the OTP that we have sent to your registered Email.');
    }else{ 
    let req = {
      'email_id': this.emailForm.value.emailid,
      'otp': this.otp
    }

    this.http.postMethod("users/validate_otp", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      // this.closeModal.nativeElement.click();
      // this.getDashboard();
      this.showOTP = false;
      this.showChangePwd = true;
      this.showEmail = false;
    }).catch((err) => {
      console.log(err);
    });
  }
  }

  changePass(){
    if((this.changePwdForm.value.confirmPassword && this.changePwdForm.value.newPassword) && this.changePwdForm.value.confirmPassword == this.changePwdForm.value.newPassword){ 
    let req = {
      "email_id": this.emailForm.value.emailid,
      "password": "",
      "newPassword":this.changePwdForm.value.confirmPassword,
    }

    this.http.postMethod("users/changePassword", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      // this.closeModal.nativeElement.click();
      // this.getDashboard();
      this.showOTP = false;
      this.showChangePwd = false;
      this.showEmail = false;
      this.emailForm.reset();
      this.closeModal.nativeElement.click();
    }).catch((err) => {
      console.log(err);
    });
  }else{
    this.dataService.showError("Error", 'Please enter valid New password & Confirm Password');

  }
}

  otpPage(){
    this.showEmail = false;
    this.showOTP = true;
    this.showChangePwd = false;
  }

  emailVerifyPage(){
    this.showEmail = true;
    this.showOTP = false;
    this.showChangePwd = false;
  }

  changePwdPage(){
    this.showEmail = false;
    this.showOTP = false;
    this.showChangePwd = true;
  }

  backToOtpPage(){
    this.showEmail = false;
    this.showOTP = true;
    this.showChangePwd = false;
  }
}
