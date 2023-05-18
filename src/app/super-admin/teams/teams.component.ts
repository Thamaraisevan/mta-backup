// import { Component, OnInit } from '@angular/core';


// export class TeamsComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }


import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild(' closeModalPro') private closeModalPro: ElementRef
  @ViewChild('closeCatModal') private closeCatModal: ElementRef;
  showImg = false;
  // @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;
  images: any = "./../../../assets/image/Camera.png";
  croppedImage: any = "./../../../assets/image/Camera.png";
  addProjectForm: FormGroup;
  addCategoryForm: FormGroup;
  addNewProjectForm: FormGroup;
  mapUserForm: FormGroup;
  filterList: any = ['Current Month', 'Last Month', 'Last 3 Month', 'Last 6 Month']
  gymImage: any;
  gymList: any = [];
  showAdd: boolean;
  paymentType: any = [
    { id: 0, 'name': 'Rental' },
    { id: 1, 'name': 'Commission' },
  ];
  deleteproject: unknown;
  payment: any;
  showPassword: boolean = true;
  gymOwnerid: string;
  deleteConfirm: {};
  dashboardData: any;
  selectedPayment: any;
  // isDisabled = true;
  p: number = 1;
  fileToReturn: File;
  searchData: any;
  searchVal: any;
  catData: any
  userdetails: any;
  stateList: any;
  cityList: any;
  msg: string;
  statecode: any;
  projectList: any = [];
  teamList: any = [];
  AllProjList: any = [];
  filterProjList: any = [];
  backupProjList: any = []
  userRolesList: any;
  categoriesList: any;
  selectedState: any;
  noProject: string;
  selectedProject: any = {};
  categoryAction: string = "Add New category";
  catList: boolean;
  formHandle: boolean = true;
  deleteCate: unknown;
  editPro: unknown;
  selectededitProject: any = {};
  projectAction: string;
  projectActionBtn: string;
  projectNewList: any = [];
  teamData: any;
  userList: any = [];
  project_role: string;
  get frm() { return this.addProjectForm.controls; }
  get frmCat() { return this.addCategoryForm.controls; }
  get frmTeam() { return this.addNewProjectForm.controls; }
  get frmUser() { return this.mapUserForm.controls; }
  imageChangedEvent: any = '';
  showErr = false;
  searchText: string;
  searchdrop: string = '';
  filterResults: any = [];
  user_id: any = [];
  statusList: any = [{ 'name': "Active" }, { 'name': "Hold" }, { 'name': "Cancelled" }, { 'name': "Completed" }, { 'name': "Proposed" }]
  // disabledControl = true;
  // croppedImage: any = '';

  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router) {
    router.params.subscribe(val => {
      console.log("objectives");
      // this.getDashboard();
      // this.getGymList();
      // this.getProjects();
      this.newForm();
      this.categoryForm();
    })
  }
  ngOnInit(): void {
    // this.getGymList();
    // this.newForm();
    this.userdetails = this.dataService.getData("userData");
    console.log("item", this.userdetails);
    this.getTeams();
    this.getStates();
    // this.getCities();
    this.catData = {}
    this.addNewProjectForm = this.formBuilder.group({
      project: ['', Validators.compose([Validators.required])],

    })
    this.mapUserForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      // role: ['', Validators.compose([Validators.required])],
      user_id: ['null', Validators.compose([Validators.required])]
    },

    );
  }
  chngFun(data) {
    data = data?.toLowerCase()
    if (data == "") {
      this.teamList = this.backupProjList
    }
    let teamList = [];
    this.teamList.map((pro: any) => {
      let proName = pro.team_name?.toLowerCase()
      let result = proName?.startsWith(data)
      if (result) {
        teamList.push(pro)
      }
    })
    this.teamList = teamList;
  }
  checkFilter(data) {
    //console.log(this.searchdrop)
    console.log("project search------------->", this.searchdrop)
    if (this.teamList.length == 0) {
      this.noProject = "No projects available";
    }
    if (this.searchdrop == "") {
      this.teamList = this.AllProjList;
    } else {
      this.filterProjList = []
      this.AllProjList.map((i) => {
        if (i.status == this.searchdrop) {
          if (i) {
            this.filterProjList.push(i);
          }
        }
      })
      this.teamList = this.filterProjList;
    }
  }
  addProject() {
    this.images = "./../../../assets/image/Camera.png";
    this.newForm();
    this.dataService.console(this.addProjectForm);
    this.showAdd = true;
    // this.getStates();
    this.projectAction = "Add New Team";
    this.projectActionBtn = "ADD";
    // this.getcategoriesList();
    // this.getuserRoles();
  }
  getStates() {
    this.http.getMethod("location/states?country_code=IN").then((response: any) => {
      this.stateList = response.data;
      console.log(" this.stateList", this.stateList);
    }).catch((err) => {
      console.log(err);
    });
  }

  getCities(state) {
    console.log(state.target.value);
    this.selectedState = state.target.options[state.target.options.selectedIndex].text;

    this.http.getMethod("location/cities?country_code=IN&state_code=" + state.target.value).then((response: any) => {
      this.cityList = response.data;
    }).catch((err) => {
      console.log(err);
    });
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

  viewProjects(item) {
    this.route.navigate(["admin/projectsview"], { queryParams: { 'data': JSON.stringify(item.team_id) }, skipLocationChange: false });
  }

  viewpic(item) {
    this.selectedProject = item;
  }
  getuserRoles() {
    this.http.getMethod("users/user_roles").then((response: any) => {
      this.userRolesList = response.data;
      console.log(" this.userRolesList", this.userRolesList);
    }).catch((err) => {
      console.log(err);
    });
  }

  getUsers(id) {
    this.userList = [];
    // if (id == '6') {
    //   this.project_role = 'O';
    // } else {
    //   this.project_role = '';
    // }
    this.http.getMethod("users").then((response: any) => {
      for (var i = 0; i < response.data.length; i++) {
        if (id == response.data[i].role_id) {

          this.userList.push(response.data[i]);
          
        }
      }
      this.userList = this.userList.sort(function (a, b) { return a.name.localeCompare(b.name) })
      console.log("userrss", this.userList);

    }).catch((err) => {
      console.log(err);
    });
  }

  getUserNoti(id, con) {
    console.log("id", id, con)

    if (id != "" && con == true) {
      this.user_id.push(id);
    }
    if (id != "" && con == false) {
      this.user_id.shift(id)
    }
    console.log('this.user_id ', this.user_id)
  }

  editProject(data) {
    console.log("editProject",data)

    this.selectededitProject = {};

    this.showAdd = false;
    console.log('codedfalse')
    this.projectAction = "Edit Team";
    this.projectActionBtn = "EDIT";


    setTimeout(() => {                           //<<<---using ()=> syntax
      for (var i = 0; i < this.stateList.length; i++) {
        if (data.state == this.stateList[i].name) {
          data.stateCode = this.stateList[i].code;
          this.getCity(data.stateCode);
        }
      }
    }, 100);
    console.log(data);

    setTimeout(() => {
      this.addProjectForm = this.formBuilder.group({
        //Not Allowed Special Charachter = projectname: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z ]+$')])],
        teamname: [data?.team_name, Validators.compose([Validators.required, Validators.pattern('')])],
        description: [data?.description, Validators.compose([Validators.required])],
      });

      this.selectededitProject = data;
      this.selectededitProject.description = data.description;
    }, 500);
  }



  addProjectTeam(data) {
    console.log('data-->', data)
    this.teamData = data;
    this.projectAction = "Add New Project in Team";
    this.projectActionBtn = "ADD";
    this.getProjects();
  }

  async deleteProject(item) {
    console.log('team_id', item)
    this.deleteproject = await this.dataService.showDelete("Please Confirm", "The selected Team will be Deleted?", "Delete");


    if (this.deleteproject == true) {
      this.http.deleteMethod('teams/' + item.team_id, '').then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getTeams();
        this.closeModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }


  getcategoriesList() {
    this.http.getMethod("categories/avail_cats").then((response: any) => {
      this.dataService.console(response);
      this.categoriesList = response.data;


    }).catch((err) => {
      console.log(err);
    });
  }

  getTeams() {
    this.http.getMethod("teams").then((response: any) => {
      console.log('rsponsee', response.data)

      this.teamList = response.data;
      this.AllProjList = response.data;
      this.teamList = this.teamList.sort(function (a, b) { return a.team_name.localeCompare(b.team_name) });
      console.log("projeteamListctList", this.teamList);
      this.backupProjList = this.teamList
      this.getuserRoles();
    }).catch((err) => {
      console.log(err);
      if (err.statusText == "Unauthorized") {
        this.dataService.navigateForward("auth/login");

      }
    });
  }


  getProjects() {
    this.http.getMethod("projects?user_id=" + this.userdetails.user_id).then((response: any) => {
      console.log('response.data', response.data)
      this.projectList = response.data;
      this.projectList = this.projectList.sort(function (a, b) { return a.project_name.localeCompare(b.project_name) });
      console.log("projectList", this.projectList);

    }).catch((err) => {
      console.log(err);

    });
  }

  addcategory(data) {
    if (data !== undefined) {
      if (Object.keys(data).length > 0) {
        this.catData = data;
        console.log("catData", this.catData)
        this.categoryAction = 'Edit Category';
        this.catList = false;
        this.formHandle = false;
        this.categoryForm();
        this.dataService.console(this.addCategorySubmit);
      }
    }
    else {
      this.categoryAction = 'Add New Category';
      this.catList = false;
      this.formHandle = true;
      this.categoryForm();
      this.dataService.console(this.addCategorySubmit);
    }
  }
  onChange(data) {
    console.log("data", data.target);
    console.log("data state", this.addProjectForm.value.selstate);
    let temp = this.addProjectForm.value.selstate;
    for (let i = 0; i < this.stateList.length; i++) {
      if (temp == this.stateList[i].code) {
        this.statecode = this.stateList[i].name;
        console.log("statecode", this.statecode);
      }
      // console.log("statecode", statecode);
    }
    this.getCity(this.addProjectForm.value.selstate);
  }

  getCity(data) {
    console.log("data", data);
    this.http.getMethod("location/cities?country_code=IN&state_code=" + data).then((response: any) => {
      this.cityList = response.data;
      console.log("cityList", this.cityList);
    }).catch((err) => {
      console.log(err);
    });
  }

  onGymSearch(data) {
    console.log("data", data);
    this.searchVal = data;
  }

  search() {
    let req = {
      "search": this.searchVal
    }
    this.http.postMethod("user/gym-search", req).then((response: any) => {
      // this.dataService.showSuccess("success", response.response_desc);
      this.gymList = [];
      this.gymList = response.data;
      console.log("response", this.gymList);
    }).catch((err) => {
      console.log("error", err);
    });
  }

  reset() {
    // this.getDashboard();
  }

  addModal() {
    if(this.showAdd = true){
      console.log('codetrue')
    }
    this.showPassword = true;
    this.images = ''
    this.showImg = false;
    this.addProjectForm.reset();
  }

  onPaymentSelect(data) {
    this.addProjectForm.controls['paymentVal'].enable();
  }

  newForm() {
    this.addProjectForm = this.formBuilder.group({
      //Not Allowed Special Charachter = projectname: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z ]+$')])],
      teamname: ['', Validators.compose([Validators.required, Validators.pattern('')])],
      description: ['', Validators.compose([Validators.required])],
    });
  }
  categoryForm() {
    this.addCategoryForm = this.formBuilder.group({
      categoryname: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      userType: ['', Validators.compose([Validators.required])]
    },

    );
  }
  passwordValidate(formGroup: FormGroup) {
    const { value: password } = formGroup.get('pass');
    const { value: confirmPassword } = formGroup.get('cpass');
    if (password === confirmPassword) {
      this.showErr = false;
    } else {
      this.showErr = true;
    }
  }

  editGym(data) {
    console.log("data", data);
    this.showAdd = false;
    if(this.showAdd=false){
      console.log('codefalse')
    }
    this.showPassword = false;
    this.showImg = false;
    this.images = this.http.imageURL + data.picture;
    // let temp = this.dataService.getBase64ImageFromUrl(this.images);

    //   let temp = this.dataService.getBase64ImageFromUrl(this.images)
    //   .then(result => 
    //     console.log("base64 to file", result)
    //     ).catch(err => {
    //     console.error(err)
    //     });

    //  console.log("temp", temp);

    this.addProjectForm = this.formBuilder.group({
      gymname: [data.gym_name, Validators.compose([Validators.required])],
      gymownername: [data.gym_owner_name, Validators.compose([Validators.required])],
      email: [data.email_id, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      phoneno: [data.contact_no, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern("^[0-9]*$")])],
      selstate: [data.state, Validators.compose([Validators.required])],
      selcity: [data.city, Validators.compose([Validators.required])],
      address: [data.address, Validators.compose([Validators.required])],
      pincode: [data.pincode, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      selPayment: ['', Validators.compose([Validators.required])],
      paymentVal: [data.paid, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      bankAccNo: [data.bank_account_number, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      accHolderName: [data.bank_account_holder_name, Validators.compose([Validators.required])],
      branch: [data.bank_name, Validators.compose([Validators.required])],
      ifsc: [data.bank_ifsc_code, Validators.compose([Validators.required])],
      // payment_type : ['', Validators.compose([Validators.required])],
      // payment : ['', Validators.compose([Validators.required])],
    });

    // console.log("imagessssssssssssssssssssssss", this.images);
    this.croppedImage = this.images;
    //this.gymOwnerid = data.user_id;
  }

  async addprojectSubmit(item) {

    if (this.showAdd) {
      if (this.addProjectForm.status == 'VALID') {
        // var formData: any = new FormData();
        var img;
        if (this.images != '') {
          img = this.images;
        }
        var req = {
          "team_name": this.addProjectForm.value.teamname,
          "description": this.addProjectForm.value.description,

        }

        // if (this.showAdd == true) {
        this.http.postMethod("teams", req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);
          this.closeModal.nativeElement.click();
          this.closeModalPro.nativeElement.click();
          this.getTeams();

          // this.closeModal.nativeElement.click();
          this.showImg = false;
          // this.getDashboard();
        }).catch((err) => {
          console.log(err);
        });


      } else {

        this.dataService.markFormGroupTouched(this.addProjectForm);
      }
    } else {

      this.editPro = await this.dataService.showDelete("Please Confirm", "Do you want to Update the Team?", "Update");

      console.log("good", item);
      if (this.editPro == true) {
        var img;
        var request = {};
        if (this.showImg) {
          img = this.images;
          request = {
            "team_name": this.addProjectForm.value.teamname,
            "description": this.addProjectForm.value.description,
          }
        } else {
          img = item?.project_img;
          request = {
            "team_name": this.addProjectForm.value.teamname,
            "description": this.addProjectForm.value.description,
          }
        }

        this.http.putMethod("teams/" + item.team_id, request).then((response: any) => {
          this.dataService.console(response);
          this.closeModal.nativeElement.click();
          this.closeModalPro.nativeElement.click();
          this.dataService.showSuccess("success", response.message);

          // this.categoriesList = response.data;
          this.getTeams();
          this.showImg = false;
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }

  selectPro(data) {
    console.log(data, 'sss')
  }

  addteamSubmit(item) {

    if (this.addNewProjectForm.status == 'VALID') {

      var request = {
        "teams_id": this.teamData.team_id,
        "project_id": this.addNewProjectForm.value.project
      }
      this.http.putMethod("projects/addProjectsinTeams/" + JSON.parse(this.addNewProjectForm.value.project), request).then((response: any) => {
        this.dataService.console(response);
        this.dataService.showSuccess("success", response.message);
        this.closeModal.nativeElement.click();
        this.addNewProjectForm.reset();
        // this.categoriesList = response.data;
        this.getTeams();
        this.showImg = false;
      }).catch((err) => {
        console.log(err);
      });

    }
    else {
      this.dataService.markFormGroupTouched(this.addNewProjectForm)
    }

  }

  adduserSubmit() {

    console.log('this.user_id',this.user_id)

    if (this.mapUserForm.status == 'VALID') {

      var request = {
        "teams_id": this.teamData.team_id,
        "user_id": JSON.stringify(this.user_id),
      }
      console.log('request', request)
      // this.http.putMethod("projects/addProjectsinTeams/" + JSON.parse(this.addNewProjectForm.value.project), request).then((response: any) => {
      //   this.dataService.console(response);
      //   this.dataService.showSuccess("success", response.message);
      //   this.closeModal.nativeElement.click();
      //   // this.categoriesList = response.data;
      //   this.getTeams();
      // this.addNewProjectForm.reset();
      // this.user_id ='';
            //   this.showImg = false;
      // }).catch((err) => {
      //   console.log(err);
      // });

    }
    else {
      this.dataService.markFormGroupTouched(this.mapUserForm)
    }
  }


  addCategorySubmit() {

    this.dataService.console(this.addCategoryForm);

    if (this.addCategoryForm.status == 'VALID') {
      // var formData: any = new FormData();

      var req = {
        "category_name": this.addCategoryForm.value.categoryname,
        "description": this.addCategoryForm.value.description,
        "role_id": this.addCategoryForm.value.userType

      }

      // if (this.showAdd == true) {

      this.http.postMethod("categories", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.closeCatModal.nativeElement.click();

        // this.getDashboard();


      }).catch((err) => {
        console.log(err);
      });

    } else {

      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }

  editCategorySubmit(category_id) {
    // console.log("CAT",cate)
    if (this.addCategoryForm.status == 'VALID') {
      // var formData: any = new FormData();

      var req = {
        "category_name": this.addCategoryForm.value.categoryname,
        "description": this.addCategoryForm.value.description,
        "role_id": this.addCategoryForm.value.userType

      }

      // if (this.showAdd == true) {

      this.http.putMethod(`categories/${category_id}`, req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.closeCatModal.nativeElement.click();

        // this.getDashboard();


      }).catch((err) => {
        console.log(err);
      });

    } else {
      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }


  gotoGym(item: any) {
    // this.dataService.console(item);
    // this.dataService.selectedGym = item;
    let data = JSON.stringify(item);
    this.route.navigate(["admin/gymboard"], { queryParams: { 'item': data }, skipLocationChange: true });
  }

  async deleteGym(data) {
    console.log("data", data);
    this.deleteConfirm = await this.dataService.showDelete("Please Confirm", "The respected details will be Deleted?", "Delete");
    console.log("tmp", this.deleteConfirm);

    if (this.deleteConfirm == true) {
      this.http.deleteMethod('user/delete-all/' + data, '').then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        // this.getDashboard();
        this.closeModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  categoryList() {
    this.categoryAction = 'AVAILABLE CATEGORIES';
    this.catList = true;
    this.getcategoriesList();
  }
  backBtn() {
    this.categoryAction = 'Add New Category';
    this.catList = false;
  }
  async deleteCat(item) {
    this.deleteCate = await this.dataService.showDelete("Please Confirm", "The selected category will be Deleted?", "Delete");


    if (this.deleteCate == true) {
      this.http.deleteMethod('categories/' + item.category_id, '').then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getcategoriesList();

      }).catch((err) => {
        console.log(err);
      });
    }
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
}
