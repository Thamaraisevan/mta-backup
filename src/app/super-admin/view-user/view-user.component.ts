import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  images: any = "./../../../assets/image/user.svg";
  memberData: any;
  orderList: any = [];
  viewOrderList: any;
  user_id: any;

  constructor(
    private route: ActivatedRoute,
    public http: HttpService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];
      this.memberData = JSON.parse(temp);
    });
    this.user_id = this.memberData.user_id;
    this.getOrders();

  }

  getOrders(){
    // console.log("data", data);
    this.http.getMethod("order/get-order-details-by-userid?user_id=" + this.user_id).then((response: any) => {
      this.orderList = response.data;
      console.log("Orders listttt", this.orderList);
    }).catch((err) => {
      console.log(err);
    });
  }

  getWallet(){
    this.http.getMethod("order/get-order-details-by-userid?user_id=" + this.user_id).then((response: any) => {
      this.orderList = response.data;
      console.log("Orders listttt", this.orderList);
    }).catch((err) => {
      console.log(err);
    });
  }

  viewOrders(data){
    console.log("data", data);
    this.viewOrderList = data;
  }

}
