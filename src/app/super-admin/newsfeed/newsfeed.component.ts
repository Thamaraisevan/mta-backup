import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { DataService } from 'src/app/service/data.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  images: any;
  showReplies: boolean = false;
  chatList: any = [];
  // chatList=[{'showReplies':false,'picture':'application/1614062892487_image_picker6503659757908921466.jpg','name':'Suresh','role':'owner','gymName':'TMF Gym','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Suresh",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '},
  // {'showReplies':false,'name':'Saranya','role':'Refilling Agent','gymName':'','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Saranya",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '}]
  createOffForm: FormGroup;
  messageList: any = [];
  socket: any;
  conversationList: any;
  message: string;
  tempChatList: any = [];
  searchDate: any;
  usersList: any=[];
  feedForm: FormGroup;
  userRolesList: any=[];
  showAdd: boolean;
  showPassword: boolean;
  addProjectForm: any;
  gymImage: any;
  showImg: boolean;
  imageChangedEvent: any;
  croppedImage: File;
  usersListCus: any=[];
  usersListStaf: any=[];
  usersListCont: any=[];
  usersListVend: any=[];
  usersListC: any=[];
  cityList: any=[];
  url: any;
  files: any;
  fileName: any;
  uploadForm: any;
  feedList: any=[];
  feedTypeList:any=[{'id':"N",'name':"NewsFeed"},{'id':"H",'name':"Hightlights"}]
  hightlightList: any=[];
  searchText:string;
  selectedFeed: any={};
  action:string="Add";
  deleteFd: any;
  selectedFeedV: any={};
  filterfeedResults:any=[];
  filterhighResults:any=[];
  get frm() { return this.feedForm.controls; }
  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router ) {


  }

  ngOnInit(): void {
   
    this.newForm();
   this.getFeeds();
  }

  
  addModal() {
    this.showAdd = true;
    this.showPassword = true;
    this.images = './../../../assets/image/Camera.png'
    this.feedForm.reset();
  }
  
  getFeeds() {
    
    this.http.getMethod("newsfeed").then((response: any) => {
      this.feedList =[];
      this.hightlightList=[];
      for(var i=0; i < response.data.length;i++){
       if(response.data[i].feed_type =="N"){
        
        this.feedList.push(response.data[i]);
       }else{
        this.hightlightList.push(response.data[i]);
       }
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  adduser(){
    this.images = "./../../../assets/image/user.svg";
    this.action = 'Add';
  }
  newForm() {
    this.feedForm = this.formBuilder.group({
      feedType: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      filename:['',Validators.compose([])],
      description:['',Validators.compose([Validators.required])]
      
         }, 
   
    );
  }
  
  async uploadSubmit() {
    
    if (this.feedForm.status == 'VALID') {
      // var formData: any = new FormData();
      
      
      let deleteconfirm= await this.dataService.showDelete("NewsFeed / Highlights", "Confirm to proceed with upload","Confirm");
      if (deleteconfirm == true){
        if(this.action == "Add"){ 
        var req={
          "title_text":this.feedForm.value.title,
          "feed_type":this.feedForm.value.feedType,
          "description":this.feedForm.value.description,
          "img_url":this.url
          
        }
        console.log("req",req);
          this.http.postMethod("newsfeed", req).then((response: any) => {
            this.dataService.showSuccess("success", response.message);
           this.getFeeds();
           this.closeModal.nativeElement.click();
          }).catch((err) => {
            console.log(err);
          });
      }else{
        var request={};
        if(!this.showImg){ 
        request={
          "title_text":this.feedForm.value.title,
          "feed_type":this.feedForm.value.feedType,
          "description":this.feedForm.value.description,
          "img_url":this.url
        }
      }else{
        request={
          "title_text":this.feedForm.value.title,
          "feed_type":this.feedForm.value.feedType,
          "description":this.feedForm.value.description,
	  // "img_url":this.url
          
        }
      }
        console.log("req",req);
          this.http.putMethod("newsfeed/"+this.selectedFeed.id, request).then((response: any) => {
            this.dataService.showSuccess("success", response.message);
           this.getFeeds();
           this.closeModal.nativeElement.click();
          }).catch((err) => {
            console.log(err);
          });
      }
  
        
      }
  }
}

async deleteFeed(item){
  this.deleteFd = await this.dataService.showDelete("Please Confirm", "The respected NewsFeed / Highlight will be Deleted?", "Delete");
  console.log("tmp", this.deleteFd);

  if (this.deleteFd == true) {
    this.http.deleteMethod('newsfeed/' + item.id, '').then((response: any) => {
      console.log("response", response);
      this.dataService.showSuccess("success", response.message);
      this.getFeeds();
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
   if(this.selectedFeed.title_text == undefined){
//    this.feedForm.patchValue({
//     title: this.fileName
//  });
}
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

viewFeed(data){
  this.selectedFeed={};
    this.selectedFeedV =data;
}
editFeed(data){
  this.selectedFeed={};
  this.selectedFeed =data;
  console.log(data);
  var feedType_id;
  for(var i=0; i <  this.feedTypeList.length;i++){
    if(data.feed_type == this.feedTypeList[i].name){
      feedType_id=this.feedTypeList[i].id;
    }
    }
  this.feedForm.patchValue({
    title: data.title_text,
    feedType:data.feed_type,
    description:data.description

 });
  this.action = 'Edit';
}
}
