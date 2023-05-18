import { Component,ChangeDetectionStrategy , OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExcelServicesService } from '../../service/excel-services.service'; 
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { HttpService } from 'src/app/service/http.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { isEqual, isObject, difference, transform } from 'lodash';
import { CalendarEvent, CalendarView, DAYS_OF_WEEK,CalendarDateFormatter, DateFormatterParams  } from 'angular-calendar';
import * as moment from 'moment';
import { CustomDateFormatter } from '../utils/custom-date-formatter.provider';
moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.SUNDAY,
    doy: 0,
    
  },
 
});

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class AttendanceComponent implements OnInit {
  staffList: any=[];
  contractorList: any=[];
  AdminList: any=[];
  selectedDate: any;
  checkINData: any={};
  checkOUTData: any={};
  selectDate:any;
  user_id: any;
  user: any;
  activeState: any={};
  attendanceList: any=[];
  docUrl: any;
  excel=[]; 
  constructor(
    public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private excelService:ExcelServicesService
  ) {
  
    
  }


  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();
  
  events: CalendarEvent[] = [];
  ngOnInit(): void {
    this.getUsers();
    this.selectDate = moment(this.viewDate).format('DD-MMMM-YYYY');
    
  }
  getUsers() {
    this.staffList=[];
  this.contractorList=[];
  this.AdminList=[];
    this.http.getMethod("users").then((response: any) => {

      let res = response.data;
      for(var i=0; i < res.length;i++){
        if(res[i].role_id == 2){
          this.staffList.push(res[i]);
         
        }
        else if(res[i].role_id == 5){
          this.contractorList.push(res[i]);
        }
        else if(res[i].role_id == 1){
          this.AdminList.push(res[i]);
        }
        
      }
      console.log("stafff lissttt",this.staffList);
      console.log(this.contractorList);
      this.user= this.staffList[0];
      this.activeState =this.user;
      this.dayClicked(this.selectDate);
    }).catch((err) => {
      console.log(err);
    });
   
  }

  dayClicked(day){
console.log(day);
console.log("%%%",this.selectDate)
this.selectedDate =moment(day.date).format('D MMM, ddd');
this.selectDate = moment(day.date).format('DD-MM-YYYY');
this.fetchAttendance(this.user);
  }

  
  fetchAttendance(item){
    console.log("$$$$$",this.selectDate)
    console.log("fetch attendenac---------->",item);
    this.activeState = item;
    this.user_id=item.user_id;
    this.user =item;
    this.http.getMethod("attendance?user_id="+parseInt(this.user_id)+"&&date="+this.selectDate).then((response: any) => {
      let res = response.data;
      this.attendanceList=res;
      
      console.log("-----------attendance------------>",this.attendanceList)
      this.excel = this.attendanceList;
      

      if(this.attendanceList == undefined){
        this.attendanceList = null;
      }
      // if(res.length){ 
    //   for(var i=0; i < res.length;i++){
    //     if(res[i].checkType =="IN"){
    //       this.checkINData=res[i];
    //     }else{
    //       this.checkOUTData=res[i];
    //     }
    //   }
    // }else{
    //   this.checkINData={};
    //   this.checkOUTData={};
    // }
      //console.log("Attendence list by res--->",res);
    }).catch((err) => {
      console.log(err);
    });
    this.fetchAllAttendance(item);
  }

  fetchAttendance1(item){
    console.log("@@@@@",this.selectDate)
    console.log("fetch attendenac---------->",item);
    this.activeState = item;
    console.log(this.selectDate)
    console.log("confirm")
    
    var da = this.selectDate.split("-");

    console.log("da length----------->",da.length)
    if(da.length == 3){
       return this.selectDate = da[1]+"-"+da[2];
    }
    
    this.user_id=item.user_id;
    this.user =item;
    this.http.getMethod("attendance?user_id="+parseInt(this.user_id)+"&&date="+this.selectDate).then((response: any) => {
      let res = response.data;
      this.attendanceList=res;
      
      console.log("-----------attendance------------>",this.attendanceList)
      this.attendanceList = this.attendanceList.map((item)=>{
        delete item.user_id
        delete item.updated_at
        delete item.id
        delete item.created_at
        delete item.latLng
        return this.attendanceList = item;
      })

      console.log("filter attentence----------->",this.attendanceList)
      this.excel = this.attendanceList;
      

      if(this.attendanceList == undefined){
        this.attendanceList = null;
      }
      // if(res.length){ 
    //   for(var i=0; i < res.length;i++){
    //     if(res[i].checkType =="IN"){
    //       this.checkINData=res[i];
    //     }else{
    //       this.checkOUTData=res[i];
    //     }
    //   }
    // }else{
    //   this.checkINData={};
    //   this.checkOUTData={};
    // }
      //console.log("Attendence list by res--->",res);
    }).catch((err) => {
      console.log(err);
    });
    this.fetchAllAttendance(item);
  }
  
  exportAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.excel, 'Attendence Detatils'); 
    console.log(this.excel) 
 }

 exportAsMonthXLSX():void {
  this.excelService.exportAsExcelFile(this.excel, 'Attendence Detatils'); 
  console.log(this.excel) 
 }

  fetchAllAttendance(item){
    console.log(item);
    this.activeState = item;
    console.log(this.selectDate)
    this.user_id=item.user_id;
    this.user =item;
    this.http.getMethod("attendance/?date="+this.selectDate).then((response: any) => {

      let res = response.data;
    this.docUrl=res.docUrl;
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }
}
