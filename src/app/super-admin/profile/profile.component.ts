import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('addUserModal') private addUserModal: ElementRef;
  projectDetails: any={};
  projectList: any=[];
  imageChangedEvent: any;
  files: any=[];
  fileName: any;
  url: any;
  userDetails: any={};
  adminList:any=[];
  showAdd: boolean;
  showPassword: boolean;
  getUserId: any;
  images: any;
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  stateList: any=[];
  selectedState: any;
  cityList: any=[];
  userRolesList: any=[];
  userData: any={};
  modelTitle: string;
  value: any;
  gymImage: any;
  showImg: boolean;
  croppedImage: File;
  deleteuser: unknown;
  selecteduser: any;
  addUser: boolean;
  userdetails: any;
  modelBtn: string;
  tempuserDetails: any={};
  selectedUser: any={};
  get frm() { return this.addUserForm.controls; }
  get frmedit() { return this.editUserForm.controls; }
  constructor(public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,
    private _location: Location) { }

    ngOnInit(): void {
      this.tempuserDetails = this.dataService.getData("userData");
      console.log(this.tempuserDetails);
      this.userdetails = this.dataService.getData("userData");
      console.log("item", this.userdetails);
      this.getsubAdmin();
      this.newForm();
      this.addnewForm();
      this.getStates();
      this.getuserRoles();
      //console.log(this.projectDetails);
    }
    addModal() {
      this.showAdd = true;
      this.modelTitle="Add New User ";
      this.modelBtn="ADD";
      this.showPassword = true;
      // this.images = './../../../assets/image/Camera.png'
       this.addUserForm.reset();
      
    
    }
    edit(){
      
      this.showAdd = false;
      this.modelTitle="Edit Profile";
      this.modelBtn="Edit";
      this.userData.area=this.userDetails.area;
      this.userData.city= this.userDetails.city;
      this.userData.email_id= this.userDetails.email_id
      this.userData.mobile_no= this.userDetails.mobile_no;
      this.userData.name= this.userDetails.name;
      this.userData.role= this.userDetails.role
      // this.userData.state= this.userDetails.state;
      
      for(var i=0; i <  this.stateList.length;i++){
   if(this.userDetails.state == this.stateList[i].name){
    this.userData.state = this.stateList[i].code;
    this.getCities(this.stateList[i])
   }
   }
   for(var i=0; i <  this.cityList.length;i++){
    if(this.userDetails.city == this.cityList[i].name){
     this.userData.city = this.cityList[i].code;
    }
   
      }
      this.userData.user_id= this.userDetails.user_id
      // this.userData.user_img= "image/1617016711006_user_img.png"
      this.images="https://demo.emeetify.com:81/"+this.userData.user_img;
      console.log(this.userDetails);
    
    
  };
    getStates(){
      this.http.getMethod("location/states?country_code=IN").then((response: any) => {
        this.stateList = response.data;
        console.log(" this.stateList",  this.stateList);
      }).catch((err) => {
        console.log(err);
      });
    }
    getCities(state){
      if(state.code){
        this.value=state.code;
        this.selectedState = state.name;
      }else{
        this.value=state.target.value
        this.selectedState = state.target.options[state.target.options.selectedIndex].text;
      }
     
      this.http.getMethod("location/cities?country_code=IN&state_code="+ this.value).then((response: any) => {
        this.cityList = response.data;
      }).catch((err) => {
        console.log(err);
      });
    }
    getuserRoles() {
      this.http.getMethod("users/user_roles").then((response: any) => {
        this.userRolesList.push(...response.data);
        console.log(" this.userRolesList",  this.userRolesList);
      }).catch((err) => {
        console.log(err);
      });
    }
    adduser(){
      // this.images = "./../../../assets/image/user.svg";
      this.addnewForm();
      this.addUser=true;
      // this.addUserForm.patchValue({"userType": 1});
      //this.userData();
    }
    newForm() {
      this.editUserForm = this.formBuilder.group({
        userType: ['', Validators.compose([Validators.required])],
        userName: ['', Validators.compose([Validators.required])],
        dob:['',Validators.compose([])],
        annDate:['',Validators.compose([])],
         email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
         phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
         state: ['', Validators.compose([Validators.required])],
         city: ['', Validators.compose([Validators.required])],
        area: ['', Validators.compose([Validators.required])],
        pass: ['', Validators.compose([Validators.required])],
        cpass: ['', Validators.compose([Validators.required])],
           }, 
     
      );
    }
    addnewForm() {
      this.addUserForm = this.formBuilder.group({
        userType: ['', Validators.compose([Validators.required])],
        userName: ['', Validators.compose([Validators.required])],
        dob:['',Validators.compose([])],
        annDate:['',Validators.compose([])],
         email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
         phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
         state: ['', Validators.compose([Validators.required])],
         city: ['', Validators.compose([Validators.required])],
        area: ['', Validators.compose([Validators.required])],
        pass: ['', Validators.compose([Validators.required])],
        cpass: ['', Validators.compose([Validators.required])],
           }, 
     
      );
    }
    adduserSubmit() {
      this.dataService.console(this.addUserForm);
      var req={};
      if(this.showAdd){ 
      if (this.addUserForm.status == 'VALID') {
        // var formData: any = new FormData();
        if(this.images){
         req={
          "role_id":this.addUserForm.value.userType ,
          "name":this.addUserForm.value.userName,
          "email":this.addUserForm.value.email, 
          "mobile_no":this.addUserForm.value.phoneno, 
          "city":this.addUserForm.value.city, 
          "state":this.selectedState,
          "area":this.addUserForm.value.area, 
          "password":this.addUserForm.value.pass, 
          "status":"A", 
          "loginpin":"",
          "user_img":this.images
          
        }
        if(this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date"){
          req['anniver_date']=this.addUserForm.value.annDate;
          req['dob']=this.addUserForm.value.dob;
        }
        }else{
          req={
            "role_id":this.addUserForm.value.userType ,
            "name":this.addUserForm.value.userName,
            "email":this.addUserForm.value.email, 
            "mobile_no":this.addUserForm.value.phoneno, 
            "city":this.addUserForm.value.city, 
            "state":this.selectedState,
            "area":this.addUserForm.value.area, 
            "password":this.addUserForm.value.pass, 
            "status":"A", 
            "loginpin":"",
            
          }
          if(this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date"){
            req['anniver_date']=this.addUserForm.value.annDate;
            req['dob']=this.addUserForm.value.dob;
          }
        }
        
          this.http.postMethod("users", req).then((response: any) => {
            this.dataService.showSuccess("success", response.message);

            this.getsubAdmin();
            this.addUserModal.nativeElement.click();
            
           
          }).catch((err) => {
            console.log(err);
          });
        
  
      } 
      // else {
      //   if (!this.images) {
      //     this.dataService.showError("error", "Please select the profile image");
      //   }
        
      //   this.dataService.markFormGroupTouched(this.addUserForm);
      // }
    }else{
     
    if(!this.showImg){ 
      req={
        "role_id":this.addUserForm.value.userType ,
        "name":this.addUserForm.value.userName,
        "email":this.addUserForm.value.email, 
        "mobile_no":this.addUserForm.value.phoneno, 
        "city":this.addUserForm.value.city, 
        "state":this.selectedState,
        "area":this.addUserForm.value.area, 
        "password":this.addUserForm.value.pass, 
        "status":"A", 
        
      }
      if(this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date"){
        req['anniver_date']=this.addUserForm.value.annDate;
        req['dob']=this.addUserForm.value.dob;
      }
    }else{
      req={
        "role_id":this.addUserForm.value.userType ,
        "name":this.addUserForm.value.userName,
        "email":this.addUserForm.value.email, 
        "mobile_no":this.addUserForm.value.phoneno, 
        "city":this.addUserForm.value.city, 
        "state":this.selectedState,
        "area":this.addUserForm.value.area, 
        "password":this.addUserForm.value.pass, 
        "status":"A", 
        "user_img":this.images
        
      }
      if(this.addUserForm.value.annDate != "Invalid date" && this.addUserForm.value.dob != "Invalid date"){
        req['anniver_date']=this.addUserForm.value.annDate;
        req['dob']=this.addUserForm.value.dob; 
      }
    }

        this.http.putMethod("users/"+this.getUserId, req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);
         // if(this.showAdd){ 
          this.getsubAdmin();
         // }
          this.addUserModal.nativeElement.click();
          
         
        }).catch((err) => {
          console.log(err);
        });
      

    // } else {
    //   if (!this.images) {
    //     this.dataService.showError("error", "Please select the profile image");
    //   }
      
    //   this.dataService.markFormGroupTouched(this.addUserForm);
    // }
    }
    }
    getsubAdmin() {
      this.adminList=[];
      this.http.getMethod("users").then((response: any) => {

        let res = response.data;
        for(var i=0; i < res.length;i++){
          if (res[i].role_id == 1 && res[i].user_id != 4){
            this.adminList.push(res[i]);
          }
          if(this.tempuserDetails.user_id === res[i].user_id){
            this.userDetails=res[i];
          }
        }
        
      }).catch((err) => {
        console.log(err);
      });
    }

    viewProjects(item){
      console.log(item);
      this.router.navigate(["admin/viewproject"],{ queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
    }
    selectImage(event: any) {
      console.log(event);
      console.log(event.files);
  
      this.gymImage = event.files[0];
      if (event.files[0]) {
        this.dataService.readImage(event.files[0]).then((base64Data: any) => {
          console.log(base64Data.result);
          this.images = base64Data.result;
        });
      }
    }
  
    fileChangeEvent(event: any): void {
      this.showImg = true;
      this.imageChangedEvent = event;
      console.log("imagechange event", this.imageChangedEvent);
    }
  
    imageCropped(event: ImageCroppedEvent) {
      this.images = event.base64;
      console.log("event", event);
  
      this.croppedImage = this.base64ToFile(
        event.base64,
        this.imageChangedEvent.target.files[0].name,
      )
  
      console.log("fileeeeeee", this.imageChangedEvent.target.files[0]);
      console.log("imagessssss", this.croppedImage);
      return this.croppedImage;
    }
  
    imageLoaded() {
      /* show cropper */
      console.log("image load");
    }
  
    cropperReady() {
      /* cropper ready */
      console.log("cropper ready");
    }
  
    loadImageFailed() {
      /* show message */
      console.log("failed");
    }
  
    base64ToFile(data, filename) {
      const arr = data.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
  
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  
    saveImage() {
      this.showImg = false;
      console.log("this.croppedImage", this.croppedImage);
    }
  backClicked() {
    this._location.back();
  }

  viewUser(item){
    console.log(item);
    this.router.navigate(["admin/userdetails"],{ queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
  }

  editUser(item){
    // this.addUserForm.reset();
    this.addUser=false;
    this.showAdd = false;
    this.getUserId = item.user_id
    this.modelTitle="Edit Profile";
      this.modelBtn="EDIT";
    this.userData={};
    this.selecteduser =item;
    this.userData.userType=item.role ? item.role:item.role_id;
    this.userData.userName=item.name ? item.name : item.userName;
    this.userData.email=item.email ? item.email: item.email_id;
    this.userData.phoneno=item.mobile_no;
    // this.userData.city=item.city;
    // this.userData.state=item.state;
    this.userData.area=item.area;
    this.userData.pass=item.password;
    this.userData.status=item.status;
    this.userData.dob=moment(item.dob).format('YYYY-MM-DD');
    this.userData.annDate=moment(item.anniver_date).format('YYYY-MM-DD');
    this.userData.loginpin=item.loginpin;
    this.userData.images=item.user_img;
    this.images ="https://demo.emeetify.com:81/"+item.user_img;
       
    
    setTimeout(()=>{                           //<<<---using ()=> syntax
      for(var i=0; i <  this.stateList.length;i++){
        if(item.state == this.stateList[i].name){
         this.userData.state = this.stateList[i].code;
         this.getCities(this.stateList[i]);
        }
        }
        
  
 }, 500);
    setTimeout(()=>{                           //<<<---using ()=> syntax
      // for(var i=0; i <  this.cityList.length;i++){
      //   if(item.city == this.cityList[i].name){
         this.userData.city = item.city;
         this.userData.userType=item.role_id;
      //   }
      //  }
 }, 1000);
    // for(var i=0; i <  this.stateList.length;i++){
    //   if(item.state == this.stateList[i].name){
    //    this.userData.state = this.stateList[i].code;
    //    this.getCities(this.stateList[i])
    //   }
    //   }
    //   for(var i=0; i <  this.cityList.length;i++){
    //    if(item.city == this.cityList[i].name){
    //     this.userData.city = this.cityList[i].code;
    //    }
    //   }
    //   for(var i=0; i <  this.userRolesList.length;i++){
    //     if(item.role == this.userRolesList[i].role || item.role_id == this.userRolesList[i].role_id){
    //      this.userData.userType = this.userRolesList[i].role_id;
    //     }
    //    }
console.log(this.userData);
  }
  async deleteUser(item){
    this.deleteuser = await this.dataService.showDelete("Please Confirm", "The selected User will be Deleted?", "Delete");
   
  
    if (this.deleteuser == true) {
      this.http.deleteMethod('users/' + item.user_id, '').then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getsubAdmin();
        this.closeModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  viewpic(item){
    this.selectedUser=item;
  }
}
