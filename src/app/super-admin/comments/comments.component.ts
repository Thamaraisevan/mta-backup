import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import {Location} from '@angular/common';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import  {io} from 'socket.io-client';
import { ViewChild,ElementRef } from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
// export interface userList {
//   user_img: string;
//   name: string;
//   user_id:0;
// }
// export interface catList {
//   category_id: string;
//   category_name: string;
//   // user_id:0;
// }
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class CommentsComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  commentsData:any={};
  showReplies:boolean=true;
  chatList:any=[];
  chatListList : any;
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'user_id',
    textField: 'name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  dropdownSettingsCat:IDropdownSettings = {
    singleSelection: false,
    idField: 'category_id',
    textField: 'category_name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
//   chatList:any=[{"name":"Rajesh Kumar",'time':"2 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
// "replies":[{"name":"Sanjeev Ram",'time':"2 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}]
// },{"name":"Sanjeev Ram",'time':"4 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
// "replies":[{"name":"Rajesh Kumar",'time':"4 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}]
// }];
images: any;
 
  // chatList=[{'showReplies':false,'picture':'application/1614062892487_image_picker6503659757908921466.jpg','name':'Suresh','role':'owner','gymName':'TMF Gym','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Suresh",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '},
  // {'showReplies':false,'name':'Saranya','role':'Refilling Agent','gymName':'','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Saranya",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '}]
   createOffForm: FormGroup;
  messageList: any=[];
  socket:any;
  conversationList: any;
  message: string;
  tempChatList: any=[];
  searchDate:any;
  userList:any = []
  catList:any = []
  parent_comment_id:any;
  reciepent_name: string;
  reciepent_id: any;
  imageChangedEvent: any;
  fileName: any;
  files: any;
  urlLink: any;
  UserRole: any;
  deletecmd: any;
  handlesio: boolean = true;
  category_name: string;
  category_id: string;
  selectedItems:any=[];
  selectedCatItems:any=[];
  multiples:any={};
  reciepent_list: any=[];
  reciepent_id_list: any=[];
  category_id_list: any=[];
  category_list: any=[];
  microphone: boolean=true;
  reader = new FileReader();
  audioSource: any;
  record: any;
  recording: boolean;
  url: string;
  error: string;
  filterchart: any;
  selectedCommenttoReply: any={};
  get couponFrm() { return this.createOffForm.controls; }
  constructor( public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,private _location: Location,
    private domSanitizer: DomSanitizer) { 
      // this.filteredUsers = this.stateCtrl.valueChanges
      // .pipe(
      //   startWith(''),
      //   map(state => state ? this._filterStates(state) : this.userList.slice())
      // );

      // this.filteredcategory = this.catCtrl.valueChanges
      // .pipe(
      //   startWith(''),
      //   map(category => category ? this._filterCats(category) : this.catList.slice())
      // );
    }
    // stateCtrl = new FormControl();
    // catCtrl = new FormControl();
    // filteredUsers: Observable<userList[]>;
    // filteredcategory: Observable<catList[]>;
  
    
  
    // private _filterStates(value: string): userList[] {
    //   console.log(value);
    //   const filterValue = value.toLowerCase();
    //   this.reciepent_name=value;
    //   for(var i=0;i< this.userList.length;i++){
    //     if(value == this.userList[i].name){
    //     this.reciepent_id=this.userList[i].user_id;
    //     }
    //   }
    //   return this.userList.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0 );
    // }

    // private _filterCats(value: string): catList[] {
    //   console.log(value);
    //   const filterValue = value.toLowerCase();
    //   this.category_name=value;
    //   for(var i=0;i< this.catList.length;i++){
    //     if(value == this.catList[i].category_name){
    //     this.category_id=this.catList[i].category_id;
    //     }
    //   }
    //   return this.catList.filter(category => category.category_name.toLowerCase().indexOf(filterValue) === 0 );
    // }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];
    
      this.commentsData = JSON.parse(temp);
      if(this.commentsData.from == 'Project'){
        this.getUsers();
        this.getmappedCategory();
      }else{
        this.getCatUsers();
      }
   
   
    });
  
   
    this.socket = io(this.http.web_socket_url,{"path":"","forceNew":true,
    "reconnectionAttempts":3,"timeout":2000,
    "query":{
    "token":this.dataService.getData('token'),
    "document_id":this.commentsData.document_id
    }});
    this.socket.on("connect", () => {
      console.log("-------------socket io id------------->",this.socket.id); // x8WIv7-mJelg7on_ALbx
      var dda = this.dataService.getData("userData");
      this.UserRole = dda.role
      console.log("user data --------------->",this.UserRole)
    });

    //this.getConversation();
    // Dominic
      this.getMessages()
      .subscribe((message) => {
    console.log(message);
    
        if(this.chatList.length == 0){
          this.chatList=message;
          this.tempChatList=this.chatList;
          //console.log("come in chart list---------->",this.chatList)
          this.chatListList = this.chatList.length;
          var c = 0;
          this.chatList.map((i)=>{
            
            //console.log("loooping-------------------->",c)
            let x = String(i.audio)
            let y = x.split(".")
            c++;
            Object.assign(i,({filterchart : y[1]}),({count : c}))
            //Object.assign(i,())
            
          })
        }else if(this.chatList.length != message.length){
         
          this.chatList=message;
          this.tempChatList=this.chatList;
        }else{ 
          
        for(var i=0;i< message.length;i++){
          if(message[i].document_id == this.commentsData.document_id){ 
          if(message[i].replies == null){
            message[i].replies =[];
          }
          let index =  this.chatList.indexOf(this.chatList[i])
          // if(this.chatList[i].replies.length != message.data[i].replies.length){
           if(index != -1){ 
            this.chatList[index].replies=message[i].replies;
            console.log(this.chatList);
          // }
           }
        }
      }
      }
      this.handlesio = false;
  
      });
  }

sanitize(url: string) {
  return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  /**
  * Start recording.
  */
  initiateRecording() {
  this.recording = true;
  let mediaConstraints = {
  video: false,
  //audio: true,
  audio: {echoCancellation:true}
  };
  navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
  * Will be called automatically.
  */
  successCallback(stream) {
  var options = {
  mimeType: "audio/wav",
  // numberOfAudioChannels: 1
  };
  //Start Actuall Recording
  var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
  this.record = new StereoAudioRecorder(stream, options);
  this.record.record();
  }
  /**
  * Stop recording.
  */
  stopRecording(data) {
    console.log(data);
    this.selectedCommenttoReply=data;
  this.recording = false;
  
    this.record.stop(this.processRecording.bind(this));

  
  }
  /**
  * processRecording Do what ever you want with blob
  * @param  {any} blob Blog
  */
  async processRecording(blob) {
    console.log("blob", blob);
  // this.url = URL.createObjectURL(blob);
  // console.log(" this.url",  this.url);
  
  var base64data=await this.uploadFileToServer(blob);

  var req;
  if(this.parent_comment_id){
   req={
    'document_id':this.commentsData.document_id,
    'user_id':this.commentsData.user_id,
    'audio':base64data,
    'comment':this.message,
    'parent_comment_id':this.parent_comment_id,
    'recipient':this.reciepent_list,
    'category_id_list':this.category_id_list,
    'category_list':this.category_list,
    'recipient_id':this.reciepent_id_list
  }
  }
  else{
   req={
    'document_id':this.commentsData.document_id,
    'user_id':this.commentsData.user_id,
    'audio':base64data,
    'comment':this.message,
    'recipient':this.reciepent_list,
    'category_id_list':this.category_id_list,
    'category_list':this.category_list,
    'recipient_id':this.reciepent_id_list,
    'project_id':this.commentsData.project_id
   } 
  }

  
  console.log("get parent id in open replies--------------->",this.parent_comment_id)
  console.log("data----------------->",req)
    this.http.postMethod("utils/getAudioUrl", req).then((response: any) => {
      this.url=response.data;
      location.reload();
      // if(this.selectedCommenttoReply){
      //   this.initSocket("",this.selectedCommenttoReply);
      //   }else{
      //     this.initSocket("",this.commentsData);
      //   } 
        //dominic
        console.log(response);
    }).catch((err) => {
      console.log(err);
    });
  
  
  }
  /**
  * Process Error.
  */
  errorCallback(error) {
  this.error = 'Can not play audio in your browser';
  }
  
  async uploadSubmit(data) {
    //console.log("Valid=====",this.uploadForm.status)   
      //if (this.uploadForm.status == 'VALID') {
        // var formData: any = new FormData();
            
       console.log(data)
    
  //}
  }

  async uploadFileToServer(file) {
    return new Promise((resolve, reject) => {
   
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
  getCatUsers(){
    this.http.getMethod("categories/getCatUsers?project_id="+this.commentsData.project_id+'&category_id='+this.commentsData.category_id).then((response: any) => {
       
      this.userList=response.data;
      console.log(this.userList);
          }).catch((err) => {
            console.log(err);
      
          });
  }

  getmappedCategory(){
    this.http.getMethod("categories?project_id="+this.commentsData.project_id).then((response: any) => {
       
      this.catList=response.data;
      console.log(this.catList);
          }).catch((err) => {
            console.log(err);
      
          });
  }
  getUsers() {
     
    this.http.getMethod("projects/getmappedUser?project_id="+this.commentsData.project_id).then((response: any) => {

      let res = response.data;
      this.userList=res;
      console.log(this.userList);
      // for(var i=0; i < res.length;i++){
      //   if (res[i].role_id == 6){
      //     this.usersListCus.push(res[i]);
      //   }else if(res[i].role_id == 2){
      //     this.usersListStaf.push(res[i]);
      //   }
      //   else if(res[i].role_id == 3){
      //     this.usersListCont.push(res[i]);
      //   }
      //   else if(res[i].role_id == 4 || res[i].role_id == 5){
      //     this.usersListVend.push(res[i]);
      //   }
      //   else if(res[i].role_id == 5){
      //     this.usersListC.push(res[i]);
      //   }
      // }
      
    }).catch((err) => {
      console.log(err);
    });
  }
  initSocket(msg, item){
    console.log("--------------------------enter init socket-----------------------------?",item) 
    // this.socket = io(this.http.web_socket_url,{"path":"","forceNew":true,
    // "reconnectionAttempts":3,"timeout":2000,
    // "query":{
    //   "token":this.dataService.getData('token'),
    //   "document_id":this.commentsData.document_id
    // }});

    //dominic
    //console.log('this.reciepent_id',this.reciepent_id);
    if(item.comment_id == undefined){
    this.socket.emit("create-document-comment", JSON.stringify({'user_id':this.commentsData.user_id,'project_id':this.commentsData.project_id,'project_name':this.commentsData.project_name,'audio':this.url,'comment':msg,"document_id":item.document_id,'recipient_id':JSON.stringify(this.reciepent_id_list),
    'recipient':JSON.stringify(this.reciepent_list),'category_id_list':JSON.stringify(this.category_id_list),'category_list':JSON.stringify(this.category_list)}));
    this.handlesio = true;
  }else{
      this.socket.emit("create-document-comment", JSON.stringify({'user_id':this.commentsData.user_id,'project_id':this.commentsData.project_id,'project_name':this.commentsData.project_name,'audio':this.url,'comment':msg,"document_id":this.commentsData.document_id,'parent_comment_id':item.comment_id,'recipient_id':JSON.stringify(this.reciepent_id_list),'recipient':JSON.stringify(this.reciepent_list),'category_id_list':JSON.stringify(this.category_id_list),'category_list':JSON.stringify(this.category_list)}));
    this.handlesio= true;
    }
    this.reciepent_id_list=[];
    this.reciepent_list=[];
    this.category_id_list=[];
    this.category_list=[];
  }

  updateSocket(item){
    this.socket = io(this.http.web_socket_url,{"path":"","forceNew":true,
    "reconnectionAttempts":3,"timeout":2000,
    "query":{
      "token":this.dataService.getData('token'),
      "document_id":this.commentsData.document_id
    }});
    
    this.socket.emit("update-message", {"message_id":item.message_id,});
    this.dataService.showSuccess("success", "This conversation is closed successfully");
  }

  async fileChangeEvent(event: any) {
    
    this.imageChangedEvent = event;
    console.log("Documents event", this.imageChangedEvent);
    this.files=this.imageChangedEvent.target.files[0];
    this.fileName=this.files.name;
   //this.urlLink= await this.processRecording(this.files);
//    this.uploadForm.patchValue({
//     title: this.fileName
//  });
  
  }
//   async uploadFileToServer1(file) {
//     return new Promise((resolve, reject) => {
//     console.log(file);
//     var reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = function(res) {
//         console.log(res.target.result);
//         resolve(res.target.result);
        
        
//     };
//     reader.onerror = function(err) {
//         console.log('there are some problems');
//         reject(err);
//     };
//   })
// }

  async sendMessage(msg: string,item){
    console.log(msg);
    if(this.imageChangedEvent){
    
      console.log("file----------------->",this.imageChangedEvent)
    this.files=this.imageChangedEvent.target.files[0];
    var base64datafile=await this.uploadFileToServer(this.files);;
      console.log("parent id is there----------->",this.parent_comment_id)
      var req;
      if(this.parent_comment_id){
         req={
          'document_id':this.commentsData.document_id,
          'user_id':this.commentsData.user_id,
          'audio':base64datafile,
          'parent_comment_id':this.parent_comment_id,
          'comment':msg,
          'recipient':this.reciepent_list,
          'category_id_list':this.category_id_list,
          'category_list':this.category_list,
          'recipient_id':this.reciepent_id_list
        }
      }
      else{
         req={
          'document_id':this.commentsData.document_id,
          'user_id':this.commentsData.user_id,
          'audio':base64datafile,
          'comment':msg,
          'recipient':this.reciepent_list,
          'category_id_list':this.category_id_list,
          'category_list':this.category_list,
          'recipient_id':this.reciepent_id_list,
          'project_id':this.commentsData.project_id
        }
      }
    
  
    console.log("come dta ------------------>",req)
      this.http.postMethod("utils/getAudioUrl", req).then((response: any) => {
        this.url=response.data;
        location.reload();


          //dominic
        // if(this.selectedCommenttoReply){
        //   this.initSocket("",this.selectedCommenttoReply);
        //   }else{
        //     this.initSocket("",this.commentsData);
        //   } 

          //dominic
          console.log(response);
      }).catch((err) => {
        console.log(err);
      });
    }

   
   if(msg !=""){ 
    this.selectedItems=[];
    this.selectedCatItems=[];
    this.message="";

      this.initSocket(msg,item);
   }
   
    
}

//DOMINIC
async deleteComment(item){
  this.deletecmd = await this.dataService.showDelete("Please Confirm", "The selected Comment will be Deleted?", "Delete");
 console.log("------------------------------->",item)

  if (this.deletecmd == true) {
    this.http.deleteMethod('utils/deletecomment/' + item.comment_id, '').then((response: any) => {
      console.log("response", response);
      this.dataService.showSuccess("success", response.message);
      location.reload();
      this.closeModal.nativeElement.click();
    }).catch((err) => {
      console.log(err);
    });
  }
}

onUserSelect(e){
console.log(e);
this.reciepent_id_list.push(e.user_id);
this.reciepent_list.push(e.name);
}

// onSelectAllUsers(e){
//   this.reciepent_id_list=e;
//   this.reciepent_list=e;
// }
// onSelectAllCats(e){
//   this.category_id_list=e[0].category_id;
//   this.category_list=e[0].category_name;
// }
onCatSelect(e){
  console.log(e);
  this.category_id_list.push(e.category_id);
  this.category_list.push(e.category_name);
  }
getMessages(){
  return Observable.create((observer) => {
          this.socket.on('document-comments', (message) => {
            // console.log(JSON.parse(message));

            console.log("console data ----------------->",message)
            if(this.handlesio == true){  
            observer.next(message);
              this.handlesio = false;
              this.chatList = message;
              console.log("chartlist data DOMMM----------------->",message)
              
              var c = 0;
          this.chatList.map((i)=>{
            let x = String(i.audio)
            let y = x.split(".")
            c++;
            Object.assign(i,({filterchart : y[1]}),({count : c}))
          })
              
            }
            });
  });
}
  addOffer(){
    
  }

  openModal(){

  }

  couponSubmit(){

  }
  openReplies(item){
    item.showReplies= (item.showReplies == false) ? true:false;
    this.showReplies= (item.showReplies == false) ? true:false;
    console.log("----------------------------->",item)
    this.parent_comment_id = item.comment_id
  }
  dateFormat(date){
    return moment(date).format('LLLL');
  }
  dateChange(e){
    console.log(e);
    
    if(e == ""){
      this.chatList=this.tempChatList;
    }else{ 
      this.chatList=[];
    for(var i=0;i< this.tempChatList.length;i++){
    if(e == moment(this.tempChatList[i].message_on).format('YYYY-MM-DD')){
      this.chatList.push(this.tempChatList[i])
    }
  }
}
  }
  // getConversation(){
  //   this.http.getMethod("help-desk/conversations").then((response: any) => {
  //     this.chatList = response.data;
  //     console.log("category list", this.chatList);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }
  
  backClicked() {
    this._location.back();
  }


}


