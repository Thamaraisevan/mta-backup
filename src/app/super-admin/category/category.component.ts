import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Location } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryVal: {};
  @ViewChild('mapuserModal') private mapuserModal: ElementRef;
  @ViewChild('addCategoryModal') private addCategoryModal: ElementRef;
  @ViewChild('uploadModal') private uploadModal: ElementRef;
  @ViewChild('closeModal') private closeModal: ElementRef;

  addCategoryForm: FormGroup;
  categoryList: any = [];
  categoryid: any;
  deleteConfirm: {};
  project: any;
  project_id: any;
  categoriesList: any = [];
  userList: any = [];
  projectList: any = [];
  userMain: boolean;
  categoryMain: boolean;
  selectedCategory: any;
  mapUserForm: FormGroup;
  uploadForm: FormGroup;
  projectDetails: any;
  url: any;
  imageChangedEvent: any;
  files: any;
  fileName: any;
  selectedDoc: any = {};
  documents: any;
  category_id: any;
  users: any = [];
  userLi: any = [];
  docViewer: boolean;
  userRolesList: any;
  role_id: any;
  gymImage: any;
  images: any;
  croppedImage: File;
  showImg: boolean;
  stateList: any;
  value: any;
  selectedState: any;
  cityList: any;
  showPassword: boolean;
  addUserForm: FormGroup;
  addUser: boolean;
  addEditlabel: string;
  addEditBtn: string;
  userData: any = {};

  get frmUser() { return this.mapUserForm.controls; }
  get frmCat() { return this.addCategoryForm.controls; };
  get frmUpload() { return this.uploadForm.controls; }
  get frm() { return this.addUserForm.controls; }
  showAdd: boolean;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'user_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  constructor(
    public dataService: DataService,
    public http: HttpService,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];

      this.projectDetails = JSON.parse(temp);
      console.log(this.projectDetails);
      this.project_id = this.projectDetails.project_id;

    })
    this.getmappedCategory();
    this.categoryMain = true;
    this.userMain = false;

    this.addCategoryForm = this.formBuilder.group({
      categoryname: ['', Validators.compose([Validators.required])],
      // projectname: ['', Validators.compose([Validators.required])]
      // unit: ['', Validators.compose([Validators.required])],
    });

    this.mapuserForm();
    this.upldForm();
    this.newForm();
  }
  upldForm() {
    this.uploadForm = this.formBuilder.group({
      filename: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    },

    );
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
  getStates() {
    this.http.getMethod("location/states?country_code=IN").then((response: any) => {
      this.stateList = response.data;
      console.log(" this.stateList", this.stateList);
    }).catch((err) => {
      console.log(err);
    });
  }
  getCities(state) {
    if (state.code) {
      this.value = state.code;
      this.selectedState = state.name;
    } else {
      this.value = state.target.value
      this.selectedState = state.target.options[state.target.options.selectedIndex].text;
    }

    this.http.getMethod("location/cities?country_code=IN&state_code=" + this.value).then((response: any) => {
      this.cityList = response.data;
    }).catch((err) => {
      console.log(err);
    });
  }

  adduser() {
    this.images = "";
    this.getStates();
    this.addUser = true;
    this.addEditlabel = 'Add New User';
    this.addEditBtn = "ADD";
    this.newForm();
    this.showAdd = true;
    this.showPassword = true;
    this.images = '';
    this.getuserRoles();
  }
  newForm() {
    this.addUserForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([])],
      annDate: ['', Validators.compose([])],
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
    var req = {};
    var image;



    if (this.addUserForm.status == 'VALID') {
      // var formData: any = new FormData();

      req = {
        "role_id": this.addUserForm.value.userType,
        "name": this.addUserForm.value.userName,
        "email": this.addUserForm.value.email,
        "mobile_no": this.addUserForm.value.phoneno,
        "city": this.addUserForm.value.city,
        "state": this.selectedState,
        "area": this.addUserForm.value.area,
        "password": this.addUserForm.value.pass,
        "cpassword": this.addUserForm.value.cpass,
        "status": "A",
        "dob": this.addUserForm.value.dob,
        "anniver_date": this.addUserForm.value.annDate,
        "loginpin": "",
        "user_img": this.images

      }

      // if (this.showAdd == true) {
      this.http.postMethod("users", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);

        this.showImg = false;
        this.closeModal.nativeElement.click();

        // this.getDashboard();
      }).catch((err) => {
        console.log(err);
      });
      // } else {
      //   this.http.putMethod("user/update-all/" + this.gymOwnerid, formData).then((response: any) => {
      //     this.dataService.showSuccess("success", response.response_desc);
      //     this.closeModal.nativeElement.click();
      //     // this.getDashboard();
      //   }).catch((err) => {
      //     console.log(err);
      //   });
      // }

    }
  }
  viewDoc(item) {
    this.selectedDoc = item;
    this.docViewer = false;
  }
  viewDocument(item) {
    this.docViewer = true;
    this.selectedDoc = item;

  }
  async uploadSubmit() {

    if (this.uploadForm.status == 'VALID') {
      // var formData: any = new FormData();


      let deleteconfirm = await this.dataService.showDelete("Document Upload", "Confirm to proceed with upload", "Confirm");
      if (deleteconfirm == true) {
        let user = this.dataService.userProfile;
        console.log("user", user);
        var userddetails = this.dataService.getData("userData");
        var req = {
          "file_name": this.uploadForm.value.title,
          "project_id": this.selectedCategory.project_id,
          "category_id": this.selectedCategory.category_id,
          "file": this.url,
          "user_id": userddetails.user_id,
          "description": this.uploadForm.value.description

        }

        console.log("req", req);
        this.http.postMethod("projects/addDocument", req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);

          this.uploadModal.nativeElement.click();
          this.uploadForm.reset();
          this.getDocuments();
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }

  async fileChangeEvent(event: any) {

    this.imageChangedEvent = event;
    console.log("Documents event", this.imageChangedEvent);
    this.files = this.imageChangedEvent.target.files[0];
    this.fileName = this.files.name;
    this.url = await this.uploadFileToServer(this.files);
    //    this.uploadForm.patchValue({
    //     title: this.fileName
    //  });

  }
  async uploadFileToServer(file) {
    return new Promise((resolve, reject) => {
      console.log(file);
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (res) {
        console.log(res.target.result);
        resolve(res.target.result);


      };
      reader.onerror = function (err) {
        console.log('there are some problems');
        reject(err);
      };
    })
  }

  getDocuments() {
    this.documents = []
    this.http.getMethod("projects/getDocuments?category_id=" + this.selectedCategory.category_id + "&project_id=" + this.selectedCategory.project_id).then((response: any) => {
      this.dataService.console(response);
      this.documents = response.data;
      if (this.documents == null) {
        this.documents = []
      } else {
        for (var i = 0; i < this.documents.length; i++) {
          var ext = this.documents[i].file;
          ext = ext.split(".")
          console.log(ext);
          this.documents[i].ext_img = ext[1];


        }
      }

    }).catch((err) => {
      console.log(err);
    });
  }

  mapuserForm() {
    this.mapUserForm = this.formBuilder.group({
      // projectname: ['', Validators.compose([Validators.required])],
      // categoryname: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
    },

    );
  }
  mapusers() {
    // this.getProjects();
    // this.getCategories();
    // this.getUsers('');
    this.getuserRoles();
    // this.category_id=this.selectedCategory.category_id;
  }
  showUsers(item) {
    this.selectedCategory = item;
    console.log(item);
    this.categoryMain = false;
    this.userMain = true;
    this.category_id = this.selectedCategory.category_id;
    this.project_id = this.selectedCategory.project_id;
    this.getCatUsers();
  }
  addModal() {
    this.showAdd = true;
    this.addCategoryForm.reset();
    // this.getProjects();
    this.getCategories();
    // this.getUsers();
  }
  getuserRoles() {
    this.http.getMethod("users/user_roles").then((response: any) => {
      this.userRolesList = response.data;
      console.log(" this.userRolesList", this.userRolesList);
    }).catch((err) => {
      console.log(err);
    });
  }
  getUsers(e) {
    this.userList = [];
    this.http.getMethod("users").then((response: any) => {
      this.dataService.console(response);


      for (var i = 0; i < response.data.length; i++) {
        if (e.target.value == response.data[i].role_id) {

          this.userList.push(response.data[i]);
          this.userList.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          })
          console.log("List of selected Map User", this.userList)
        }
      }




    }).catch((err) => {
      console.log(err);
    });
  }
  getCategories() {
    this.http.getMethod("categories/avail_cats").then((response: any) => {
      this.dataService.console(response);
      this.categoriesList = response.data;


    }).catch((err) => {
      console.log(err);
    });
  }

  getProjects() {
    this.http.getMethod("projects").then((response: any) => {
      this.projectList = response.data;
      console.log("projectList", this.projectList);
    }).catch((err) => {
      console.log(err);
    });
  }
  // editCategory(item){
  //   console.log("item", item);
  //   this.showAdd = false;
  //   this.addCategoryForm = this.formBuilder.group({
  //     category_name: [item.category_name, Validators.compose([Validators.required])],
  //   });
  //   this.categoryid = item.id;
  // }

  getmappedCategory() {
    this.http.getMethod("categories?project_id=" + this.project_id).then((response: any) => {
      console.log(response);
      this.categoryList = response.data;

    }).catch((err) => {
      console.log(err);

    });
  }



  getCatUsers() {
    this.http.getMethod("categories/getCatUsers?project_id=" + this.project_id + "&category_id=" + this.category_id).then((response: any) => {
      console.log(response.data);
      this.users = response.data;
      console.log("mapped user----------------------->", this.users)
    }).catch((err) => {
      console.log(err);

    });
  }

  addCategory() {

    // this.project_id=this.categoryList[0].project_id;
    // this.categoryVal = await this.dataService.categoryModal("Add Category","Add",true,"Category Name","Please enter Category Name");
    if (this.addCategoryForm.status == 'VALID') {

      let payload = {
        "project_id": this.project_id, "category_id": [this.addCategoryForm.value.categoryname], "user_id": []
      };
      console.log("payload", payload);

      // if(this.showAdd == true){

      this.http.postMethod('projects/mapCategory', payload).then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getmappedCategory();
        this.addCategoryModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
      // }else{
      //   // this.showAdd = true;
      //   console.log("edit");
      //     this.http.putMethod('product-management/' + this.categoryid, payload).then((response: any) => {
      //       console.log("response", response);
      //       this.dataService.showSuccess("success", response.message);
      //       // this.getCategory();
      //       this.closeModal.nativeElement.click();
      //     }).catch((err) => {
      //       console.log(err);
      //     }); 
      // }

    } else {
      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }

  async removeCat(e) {
    console.log("..........................", e)
    let deleteconfirm = await this.dataService.showDelete("Category Deleted", "Confirm to Delete Category", "Confirm");
    if (deleteconfirm == true) {

      var req = {
        "category_id": e.category_id,
        "project_id": e.project_id
      }

      this.http.postMethod('categories/removeCat/', req).then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getmappedCategory();
        this.addCategoryModal.nativeElement.click();
        window.location.reload()
      }).catch((err) => {
        console.log(err);
      });

      // this.http.deleteMethod('categories/categories/category_id='+e.category_id+'&project_id='+e.project_id, "").then((response: any) => {
      //   console.log("response", response);
      //   this.dataService.showSuccess("success", response.message);
      //   // this.getDashboard();
      //   this.closeModal.nativeElement.click();
      // }).catch((err) => {
      //   console.log(err);
      // });

    }
  }

  onCheckboxChange(e) {
    console.log(e);
    this.userLi.push(e.target.value);
  }
  mapuserSubmit() {

    // if (this.mapUserForm.status == 'VALID') {
    // var formData: any = new FormData();

    //       for (var i=0;i< this.mapUserForm.value.username.length;i++){
    // this.userLi.push(this.mapUserForm.value.username[i].user_id)
    //       }
    if (this.userLi.length != 0) {
      var req = {
        "category_id": this.category_id,
        "user_id": JSON.stringify(this.userLi),
        "project_id": this.project_id,


      }
      console.log(req);
      // if (this.showAdd == true) {
      this.http.postMethod("projects/mapUsers", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.getCatUsers();
        this.userLi = [];
        this.mapuserModal.nativeElement.click();
        // this.getDashboard();
      }).catch((err) => {
        console.log(err);
      });


      // } else {

      //   this.dataService.markFormGroupTouched(this.mapUserForm);
      // }
    }
  }
  showComments(item) {

    console.log(item);
    item.project_id = this.project_id;
    item.from = 'Category';
    this.router.navigate(["admin/comments"], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });


  }
  backClicked(boolean) {
    console.log("bolo 1", boolean)


    if (boolean == true) {
      this._location.back();
    }
    else {
      this.categoryMain = true;
      this.userMain = false;
    }

  }
}
