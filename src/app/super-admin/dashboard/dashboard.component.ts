import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('closeCatModal') private closeCatModal: ElementRef;
  showImg = false;
  // @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;
  images: any = "./../../../assets/image/Camera.png";
  croppedImage: any = "./../../../assets/image/Camera.png";
  addProjectForm: FormGroup;
  addCategoryForm: FormGroup;
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
  option: any;
  selectededitProject: any = {};
  projectAction: string;
  projectActionBtn: string;
  get frm() { return this.addProjectForm.controls; }
  get frmCat() { return this.addCategoryForm.controls; }
  imageChangedEvent: any = '';
  showErr = false;
  searchText: string;
  searchdrop: string = '';
  filterResults: any = [];
  statusList: any = [{ 'name': "Active" }, { 'name': "Hold" }, { 'name': "Cancelled" }, { 'name': "Completed" }, { 'name': "Proposed" }]
  // disabledControl = true;
  // croppedImage: any = '';

  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router,
    public ngzone: NgZone,) {
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

    this.option = this.router.snapshot.data.viewOption;
    this.ngzone.run(() => {
      if (this.option == 'projectPage') {
        this.userdetails = this.dataService.getData("userData");
        console.log("item", this.userdetails);
        this.getStates();
        this.catData = {}
        this.getProjects();
      }
      else if (this.option == 'projectgetById') {
        this.userdetails = this.dataService.getData("userData");
        console.log("item", this.userdetails);
        this.getStates();
        this.catData = {}
        this.router.queryParams.subscribe(params => {
          let temp = params["data"];
          console.log("temp", temp)
          this.getProjectById(temp)
        });
      }
    })

    // this.router.queryParams.subscribe(params => {
    //   let temp = params["data"];
    //   console.log("temp", temp)
    //   this.getProjectById(temp)
    // });
    // this.getGymList();
    // this.newForm();
    // this.userdetails = this.dataService.getData("userData");
    // console.log("item", this.userdetails);
    // // this.getProjects();
    // this.getStates();
    // // this.getCities();
    // this.catData = {}
  }

  getProjectById(temp) {
    this.http.getMethod("projects/getProjectsByTeam/" + temp).then((response: any) => {
      console.log('response.data', response.data)
      this.projectList = response.data;
      this.AllProjList = response.data;
      this.projectList = this.projectList.sort(function (a, b) { return a.project_name.localeCompare(b.project_name) });
      console.log("projectList", this.projectList);
      this.backupProjList = this.projectList
      this.getuserRoles();
    }).catch((err) => {
      console.log(err);
      if (err.statusText == "Unauthorized") {
        this.dataService.navigateForward("auth/login");

      }
    });
  }


  chngFun(data) {
    data = data.toLowerCase()
    if (data == "") {
      this.projectList = this.backupProjList
    }
    let projectLists = [];
    this.projectList.map((pro: any) => {
      let proName = pro.project_name.toLowerCase()
      let result = proName.startsWith(data)
      if (result) {
        projectLists.push(pro)
      }
    })
    this.projectList = projectLists;
  }
  checkFilter(data) {
    //console.log(this.searchdrop)
    console.log("project search------------->", this.searchdrop)
    if (this.projectList.length == 0) {
      this.noProject = "No projects available";
    }
    if (this.searchdrop == "") {
      this.projectList = this.AllProjList;
    } else {
      this.filterProjList = []
      this.AllProjList.map((i) => {
        if (i.status == this.searchdrop) {
          if (i) {
            this.filterProjList.push(i);
          }
        }
      })
      this.projectList = this.filterProjList;
    }
  }
  addProject() {
    this.images = "./../../../assets/image/Camera.png";
    this.newForm();
    this.dataService.console(this.addProjectForm);
    this.showAdd = true;
    // this.getStates();
    this.projectAction = "Add New Project";
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
    // console.log(item);
    this.route.navigate(["admin/viewproject"], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
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

  editProject(data) {


    this.selectededitProject = {};

    this.showAdd = false;
    this.projectAction = "Edit Project";
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
      this.selectededitProject = data;
      this.selectededitProject.state = data.stateCode;
      this.selectededitProject.city = data.city;
      this.selectededitProject.description = data.description;
      this.selectededitProject.status = data.status;
      this.selectededitProject.address = data.address;
      this.images = this.http.imageURL + "" + data.project_img;
    }, 500);
  }

  async deleteProject(item) {
    this.deleteproject = await this.dataService.showDelete("Please Confirm", "The selected User will be Deleted?", "Delete");


    if (this.deleteproject == true) {
      this.http.deleteMethod('projects/' + item.project_id, '').then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getProjects();
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
  getProjects() {
    this.http.getMethod("projects?user_id=" + this.userdetails.user_id).then((response: any) => {
      console.log('response.data', response.data)
      this.projectList = response.data;
      this.AllProjList = response.data;
      this.projectList = this.projectList.sort(function (a, b) { return a.project_name.localeCompare(b.project_name) });
      console.log("projectList", this.projectList);
      this.backupProjList = this.projectList
      this.getuserRoles();
    }).catch((err) => {
      console.log(err);
      if (err.statusText == "Unauthorized") {
        this.dataService.navigateForward("auth/login");

      }
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
    this.showAdd = true;
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
      projectname: ['', Validators.compose([Validators.required, Validators.pattern('')])],
      state: ['', Validators.compose([Validators.required])],
      // email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      // phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      // pincode: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6), Validators.maxLength(6)])],
      description: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([])]
    },

    );
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
          "project_name": this.addProjectForm.value.projectname,
          "description": this.addProjectForm.value.description,
          "state": this.selectedState,  //this.addProjectForm.value.state,
          "city": this.addProjectForm.value.city,
          "address": this.addProjectForm.value.area,
          "project_img": img,
          "status": "Active",
          "start_date": "2021-02-22",
          "end_date": "2021-08-22"

        }

        // if (this.showAdd == true) {
        this.http.postMethod("projects", req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);

          this.getProjects();
          this.closeModal.nativeElement.click();
          this.showImg = false;
          // this.getDashboard();
        }).catch((err) => {
          console.log(err);
        });


      } else {
        if (!this.croppedImage) {
          this.dataService.showError("error", "Please select the profile image");
        }

        this.dataService.markFormGroupTouched(this.addProjectForm);
      }
    } else {

      this.editPro = await this.dataService.showDelete("Please Confirm", "Do you want to Update the project?", "Update");

      console.log(item);
      if (this.editPro == true) {
        var img;
        var request = {};
        if (this.showImg) {
          img = this.images;
          request = {
            "project_name": item.project_name,
            "description": item.description,
            "state": this.selectedState,  //this.addProjectForm.value.state,
            "city": item.city,
            "address": item.address,
            "project_img": img,
            'status': item.status
          }
        } else {
          img = item.project_img;
          request = {
            "project_name": item.project_name,
            "description": item.description,
            "state": this.selectedState,  //this.addProjectForm.value.state,
            "city": item.city,
            "address": item.address,
            'status': item.status
          }
        }

        this.http.putMethod("projects/" + item.project_id, request).then((response: any) => {
          this.dataService.console(response);
          this.dataService.showSuccess("success", response.message);
          this.closeModal.nativeElement.click();
          // this.categoriesList = response.data;
          this.getProjects();
          this.showImg = false;
        }).catch((err) => {
          console.log(err);
        });
      }
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
