import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notiForm: FormGroup;
  
  @ViewChild('closeModal') private closeModal: ElementRef;
  url: any;
  imageChangedEvent: any;
  files: any;
  GetUserNoti: any=[]
  fileName: any;
  userRolesList: any=[];
  userList: any=[];
  role_id:any;
  get frm() { return this.notiForm.controls; }
  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router ) {
    }
  ngOnInit(): void {
    this.newForm();
    this.getuserRoles();
    // this.getusers();
  }
  newForm() {
    this.notiForm = this.formBuilder.group({
      userType: ['null', Validators.compose([])],
      title: ['', Validators.compose([Validators.required])],
      filename:['',Validators.compose([])],
      description:['',Validators.compose([Validators.required])],
      user_id:['null',Validators.compose([])]
      
         }, 
   
    );
  }
  getuserRoles() {
    this.http.getMethod("users/user_roles").then((response: any) => {
      this.userRolesList=response.data;
      console.log(" this.userRolesList",  this.userRolesList);
    }).catch((err) => {
      console.log(err);
    });
  }
  getUsers(id) {
    this.userList=[];
    this.http.getMethod("users?role_id="+id).then((response: any) => {

      let res = response.data;
      for(var i=0; i < res.length;i++){
        if (res[i].role_id == id){
          this.userList.push(res[i]);
        }
        
      }
      
    }).catch((err) => {
      console.log(err);
    });
  }
  clearNotification(){
    this.notiForm.reset();
  }
  
  public  getUserNoti(id,con){
    if(id != "" && con == true ){
    this.GetUserNoti.push(id);
    }
    if(id != "" && con == false){
      this.GetUserNoti.shift(id)
    }
    console.log('this.GetUserNoti',this.GetUserNoti)
  }
sendNotification(){
  if(this.notiForm.status == 'VALID'){ 
    var req={
    "title":this.notiForm.value.title,
    "user_type":this.notiForm.value.userType,
    "description":this.notiForm.value.description,
    "user_id":this.GetUserNoti, //this.notiForm.value.user_id,
    "img_url":this.url
  }
  if(req.user_type == 0){
    delete req.user_id
    Object.assign(req,{user_id:0})
  }
  console.log("req",req);
    this.http.postMethod("utils/addNoti", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      this.notiForm.reset();
     this.closeModal.nativeElement.click();
    }).catch((err) => {
      console.log(err);
    });
  }
}

async fileChangeEvent(event: any) {
    
  this.imageChangedEvent = event;
  console.log("Documents event", this.imageChangedEvent);
  this.files=this.imageChangedEvent.target.files[0];
  this.fileName=this.files.name;
 this.url= await this.uploadFileToServer(this.files);


}
async uploadFileToServer(file) {
  return new Promise((resolve, reject) => {
  console.log(file);
  var reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function(res) {
      console.log(res.target.result);
      resolve(res.target.result);
      
      
  };
  reader.onerror = function(err) {
      console.log('there are some problems');
      reject(err);
  };
})
}


 // /addNoti
}
