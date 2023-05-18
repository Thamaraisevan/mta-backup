import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  flag: any;
  showAgent = false;
  showTechnician = false;
  refillingAgent: any;
  technician: any;
  taskHistory: any = [];
  techTask: any = [];
  projectDetails: any;
  imageChangedEvent: any;
  files: any;
  fileName: any;
  url: any;
  projectList: any=[];

  constructor(
    public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];
    
      this.projectDetails = JSON.parse(temp);
      if ( this.projectDetails.documents == null){
        this.projectDetails.documents=[]
      }
   
    });
    this.getProjects();
    console.log(this.projectDetails);
  }
  getProjects() {
    this.http.getMethod("projects?user_id="+this.projectDetails.user_id).then((response: any) => {
      this.projectList = response.data;
      console.log("projectList", this.projectList);
    }).catch((err) => {
      console.log(err);
    });
  }
  viewProjects(item){
    console.log(item);
    this.router.navigate(["admin/viewproject"],{ queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
  }
 async fileChangeEvent(event: any) {
    
    this.imageChangedEvent = event;
    console.log("Documents event", this.imageChangedEvent);
    this.files=this.imageChangedEvent.target.files[0];
    this.fileName=this.files.name;
   this.url= await this.uploadFileToServer(this.files);
   
    let deleteconfirm= await this.dataService.showDelete("Document Upload", "Confirm to proceed with upload","Confirm");
    if (deleteconfirm == true){
      let user=this.dataService.userProfile;
      console.log("user",user);
      var req={
        "file_name":this.fileName,
        "project_id":this.projectDetails.project_id,
        "category_id":this.projectDetails.category_id,
        "file":this.url,
        "user_id":user.user_id
        
      }

    
        this.http.postMethod("projects/addDocument", req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);
         
        }).catch((err) => {
          console.log(err);
        });
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
backClicked() {
  this._location.back();
}
}
