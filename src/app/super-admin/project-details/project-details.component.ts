import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
// import { viewerType } from '../../../../node_modules/doc-viewer-angular/modules/document-viewer.component'
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('mapuserModal') private mapuserModal: ElementRef;

  flag: any;
  showAgent = false;
  showTechnician = false;
  refillingAgent: any;
  technician: any;
  deletedoc: any;
  taskHistory: any = [];
  techTask: any = [];
  projectDetails: any;
  imageChangedEvent: any;
  files: any;
  fileName: any;
  url: any;
  editasignproject: any = {};
  uploadForm: FormGroup;
  selectededitDoc: any = {}
  mapCatForm: FormGroup;
  mapUserForm: FormGroup;
  categoriesList: any;
  projectList: any;
  getCategory: any = [];
  userList: any = [];
  project_role: string;
  user_id: any = [];
  selectedItems: any = [];
  // dropdownSettings: IDropdownSettings = {
  //   singleSelection: false,
  //   idField: 'user_id',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true
  // };
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'user_id',
    textField: 'name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  category: any;
  selectedDoc: any = {};
  documents: any;
  roList: any = [{ 'id': "M", 'name': 'Manager' }, { 'id': "L", 'name': 'Lead' }, { 'id': "O", 'name': 'Other' }]
  usersinProject: any = [];
  vw_rights_docs: any = [];
  ryts: any = [];
  usersinRightsProject: any = [];
  docViewer: boolean;
  userRolesList: any = [];
  documentAction: any;
  categoryList: any = [];
  addUser: boolean = true;
  addEditlabel: string;
  UserRole: string;
  images: string;
  addEditBtn: string;
  addUserForm: FormGroup;
  gymImage: any;
  showImg: boolean;
  userdetails: any;
  croppedImage: File;
  showAdd: boolean;
  showPassword: boolean;
  stateList: any = [];
  value: any;
  selectedState: any;
  cityList: any = [];
  userData: any = {};
  get frm() { return this.addUserForm.controls; }
  get frmUpload() { return this.uploadForm.controls; }
  get frmCat() { return this.mapCatForm.controls; }
  get frmUser() { return this.mapUserForm.controls; }
  constructor(
    public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let temp = params["data"];
      this.userdetails = this.dataService.getData("userData");
      console.log("item", this.userdetails);
      this.projectDetails = JSON.parse(temp);
      this.getmappedUsers();
      this.getmappedCategory();

    });
    console.log(this.projectDetails);
    this.upForm();
    this.mapcatForm();
    this.mapUsForm();
    this.newForm();
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
  addModal() {
    this.showAdd = true;
    this.showPassword = true;
    this.images = '';
    this.addUserForm.reset();
    this.getuserRoles();

  }
  adduser() {
    this.images = "";
    this.getStates();
    this.addUser = true;
    this.addEditlabel = 'Add New User';
    this.addEditBtn = "ADD";
    this.addUserForm.controls['pass'].enable();
    this.addUserForm.controls['cpass'].enable();
    this.newForm();
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

  upForm() {
    this.uploadForm = this.formBuilder.group({
      filename: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    },

    );
  }
  mapcatForm() {
    this.mapCatForm = this.formBuilder.group({
      projectname: ['', Validators.compose([Validators.required])],
      categoryname: ['', Validators.compose([Validators.required])]
    },

    );
  }
  mapUsForm() {
    this.mapUserForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      role: ['', Validators.compose([Validators.required])],
      user_id: ['null', Validators.compose([])]
    },

    );
  }

  adduserSubmit() {
    this.dataService.console(this.addUserForm);
    var req = {};
    var image;



    if (this.addUserForm.status == 'VALID') {
      // var formData: any = new FormData();
      var img;
      if (this.images != '') {
        img = this.images;
      }
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
        "user_img": img

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
  addcategory() {
    // this.getProjects();
    // this.getCategories();
    // this.getUsers();
    //console.log(this.projectDetails);

    this.router.navigate(["admin/categoriesView"], { queryParams: { 'data': JSON.stringify(this.projectDetails) }, skipLocationChange: false });

  }
  mapusers() {
    // this.getProjects();
    // this.getCategories();
    // this.getUsers();
    this.getuserRoles();
  }
  getUsers(id) {
    this.userList = [];
    if (id == '6') {
      this.project_role = 'O';
    } else {
      this.project_role = '';
    }
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
  getDocuments() {
    this.documents = [];
    var r = this.usersinProject;

    var not = r.map(item => {
      return item.user_id
    })

    var userDet = this.dataService.getData("userData");
    this.UserRole = userDet.role;

    var usr_id;
    if (this.UserRole == "ADMIN") {
      usr_id = not;
    } else {
      usr_id = userDet.user_id;
    }
    console.log("users id >>>>>>>>>>>", usr_id)


    this.http.getMethod("categories/getCategorybyuser?user_id=" + this.userdetails.user_id,).then((response: any) => {
      this.dataService.console(response);
      // console.log("cat Users",response.data)
      this.getCategory = response.data


      var DataSet = [];

      this.getCategory.map((i) => {
        if (i.category_id !== null) {
          DataSet.push(i.category_id)
        }
      })
      console.log("USRID", DataSet)
      var CategoryUser = JSON.stringify(DataSet);
      var CatData = CategoryUser.substring(1, CategoryUser.length - 1)

      if (CatData === null || CatData === "null") {

        this.http.getMethod("projects/getDocuments?project_id=" + this.projectDetails.project_id + "&&users_id=" + usr_id,).then((response: any) => {
          this.dataService.console(response);
          this.documents = response.data;
          console.log("roll------------------->", this.UserRole)
          console.log("documents------------------->", this.documents)
          this.ryts = this.documents.map(item => {
            return this.ryts = item.vw_rights;
          })
          console.log("rytes------>", this.ryts)
          if (this.documents == null) {
            this.documents = []
          } else {
            for (var i = 0; i < this.documents.length; i++) {
              var ext = this.documents[i].file;
              ext = ext.split(".")
              console.log(ext);
              this.documents[i].ext_img = ext[1];
              //  if(ext[1] == 'docx'){
              //   this.documents[i].ext_img="../assets/image/doc.svg";
              //  }else  if(ext[1] == 'pdf'){
              //   this.documents[i].ext_img="../assets/image/pdf.svg";
              //  }else if(ext[1] == 'xls'){
              //   this.documents[i].ext_img="../assets/image/xls.png";
              //  }else{

              //   this.documents[i].ext_img="../assets/image/file.svg";
              //  }

            }
          }

        }).catch((err) => {
          console.log(err);
        });
      }
      else {
        this.http.getMethod("projects/getDocuments?project_id=" + this.projectDetails.project_id + "&&users_id=" + usr_id).then((response: any) => {
          this.dataService.console(response);
          this.documents = response.data;
          console.log("roll------------------->", this.UserRole)
          console.log("documents------------------->", this.documents)
          this.ryts = this.documents.map(item => {
            return this.ryts = item.vw_rights;
          })
          console.log("rytes------>", this.ryts)
          if (this.documents == null) {
            this.documents = []
          } else {
            for (var i = 0; i < this.documents.length; i++) {
              var ext = this.documents[i].file;
              ext = ext.split(".")
              console.log(ext);
              this.documents[i].ext_img = ext[1];
              //  if(ext[1] == 'docx'){
              //   this.documents[i].ext_img="../assets/image/doc.svg";
              //  }else  if(ext[1] == 'pdf'){
              //   this.documents[i].ext_img="../assets/image/pdf.svg";
              //  }else if(ext[1] == 'xls'){
              //   this.documents[i].ext_img="../assets/image/xls.png";
              //  }else{

              //   this.documents[i].ext_img="../assets/image/file.svg";
              //  }

            }
          }

        }).catch((err) => {
          console.log(err);
        });
      }



    }).catch((err) => {
      console.log(err);
    })
  }

  mapuserSubmit() {
    //if (this.mapUserForm.status == 'VALID') {
    // var formData: any = new FormData();

    console.log('this.user_id', this.user_id)

    var req = {
      "category_id": null,
      "user_id": JSON.stringify(this.user_id),
      "project_id": this.projectDetails.project_id,
      "project_role": this.project_role
    }
    console.log(req);
    // if (this.showAdd == true) {
    this.http.postMethod("projects/mapUsers", req).then((response: any) => {
      this.dataService.showSuccess("success", response.message);
      this.mapUserForm.reset();
      this.userList = [];
      this.getmappedUsers();
      this.mapuserModal.nativeElement.click();

      // this.getDashboard();
    }).catch((err) => {
      console.log(err);
    });
    // } else {
    //   this.dataService.markFormGroupTouched(this.mapUserForm);
    // }
    //}
  }

  getCategories() {
    this.http.getMethod("categories/avail_cats").then((response: any) => {
      // this.dataService.console(response);
      this.categoriesList = response.data;


    }).catch((err) => {
      console.log(err);
    });
  }
  getmappedCategory() {
    this.http.getMethod("categories?project_id=" + this.projectDetails.project_id).then((response: any) => {
      console.log(response);
      this.categoryList = response.data;

    }).catch((err) => {
      console.log(err);

    });
  }
  getProjects() {
    this.http.getMethod("projects").then((response: any) => {
      this.projectList = response.data;
      console.log("projectList", this.projectList);
      for (var i = 0; i < this.projectList.length; i++) {
        if (this.projectList[i].project_id = this.projectDetails.project_id) {
          this.projectDetails = this.projectList[i];
        }
      }

    }).catch((err) => {
      console.log(err);
    });
  }
  getmappedUsers() {
    this.http.getMethod("projects/getmappedUser?project_id=" + this.projectDetails.project_id).then((response: any) => {
      this.usersinProject = response.data;
      this.usersinProject.map(item => {
        if (item.vw_rights == null) {
          delete item.vw_rights;
          Object.assign(item, { 'vw_rights': 'null' })
        }

      })

      this.usersinProject.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      console.log("user in project", this.usersinProject)

      //   this.vw_rights_docs = this.usersinProject.map(item=>{

      //   this.vw_rights_docs = item.vw_rights;

      //   if(this.vw_rights_docs == null){
      //     this.vw_rights_docs = null;
      //   }
      //   else{
      //     this.vw_rights_docs=this.vw_rights_docs.split(","); 
      //   }
      //  return this.vw_rights_docs = this.vw_rights_docs  

      // })

      // console.log("usr vw rights after split----------->", (this.vw_rights_docs));
      // Object.assign(this.usersinProject,{'vw_rights_docs':this.vw_rights_docs})



      //comment
      //return this.usersinProject;
      //console.log("finally get value ", this.usersinProject.vw_rights_docs)
      // if(this.vw_rights_docs.indexOf(453) !== -1){
      //     console.log("ok")
      //   }
      //   if(this.vw_rights_docs.indexOf(453) === -1){
      //     console.log("not ok")
      //   }

      // this.userpro[0] = this.usersinProject.push(this.projectDetails);
      // console.log("projectList", this.projectList);
      // for (var i=0;i< this.projectList.length;i++){
      //       if(this.projectList[i].project_id = this.projectDetails.project_id){
      //         this.projectDetails = this.projectList[i];
      //       }
      // }

    }).catch((err) => {
      console.log(err);
    });
  }
  getmappedUsersRights() {
    console.log("user_data=====", this.user_id)
    this.http.getMethod("projects/getmappedUser?project_id=" + this.projectDetails.project_id).then((response: any) => {
      this.usersinRightsProject = response.data;

      // this.userpro[0] = this.usersinProject.push(this.projectDetails);
      // console.log("projectList", this.projectList);
      // for (var i=0;i< this.projectList.length;i++){
      //       if(this.projectList[i].project_id = this.projectDetails.project_id){
      //         this.projectDetails = this.projectList[i];
      //       }
      // }

    }).catch((err) => {
      console.log(err);
    });
  }
  async addViewRights(data) {
    console.log(data);


    let deleteconfirm = await this.dataService.showDelete("Document Update", "Confirm to proceed with Update", "Confirm");
    if (deleteconfirm == true) {

      console.log("req", data);
      var data_user_id = data.user_id;
      var data_document_id = data.document_id;
      let ref = {
        "project_id": this.projectDetails.project_id,
        "user_id": data_user_id,
        "vw_rights": data_user_id,
        "document": data_document_id
      }
      console.log("data ========>>>>", ref);
      this.http.putMethod(`projects/putCategory/${ref.user_id}`, ref).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.getDocuments();
        this.closeModal.nativeElement.click();
        this.uploadForm.reset();
        this.getmappedUsers()
      }).catch((err) => {
        console.log(err);
      });

    }

  }

  async removeViewRights(data) {
    console.log(data);


    let deleteconfirm = await this.dataService.showDelete("Document Update", "Confirm to proceed with Update", "Confirm");
    if (deleteconfirm == true) {

      console.log("req", data);
      let ref = {
        "project_id": this.projectDetails.project_id,
        "user_id": data.user_id,
        "document": data.document_id,
        "vw_rights": 0
      }
      console.log("data ========>>>>", ref);
      this.http.putMethod(`projects/putCategory/${data.user_id}`, ref).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.getDocuments();
        this.closeModal.nativeElement.click();
        this.uploadForm.reset();
        this.getmappedUsers()
      }).catch((err) => {
        console.log(err);
      });

    }
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  categoryChange(event) {
    console.log(event.target.value);
  }

  mapCatSubmit() {

    if (this.mapCatForm.status == 'VALID') {
      // var formData: any = new FormData();

      var req = {
        "category_id": this.mapCatForm.value.categoryname,
        "user_id": [],
        "project_id": this.mapCatForm.value.projectname,


      }
      console.log(req);
      // if (this.showAdd == true) {
      this.http.postMethod("projects/mapCategory", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.closeModal.nativeElement.click();
        // this.getDashboard();
      }).catch((err) => {
        console.log(err);
      });


      // } else {

      //   this.dataService.markFormGroupTouched(this.mapUserForm);
      // }
    }
  }
  viewDoc(item) {
    this.selectedDoc = {};
    this.selectedDoc = item;
    this.docViewer = false;
    console.log(item)
  }
  async viewDocument(item) {
    this.selectedDoc = {};
    this.docViewer = true;
    this.selectedDoc = item;
    console.log(item);
    await this.dataService.presentLoading();

    setTimeout(() => {
      this.dataService.dismissLoading();
    }, 5000)
  }


  async uploadSubmit(data) {
    //console.log("Valid=====",this.uploadForm.status)   
    //if (this.uploadForm.status == 'VALID') {
    // var formData: any = new FormData();

    console.log("condition=======>", this.documentAction);
    if (this.documentAction == "ADD") {
      let deleteconfirm = await this.dataService.showDelete("Document Upload", "Confirm to proceed with upload", "Confirm");
      if (deleteconfirm == true) {
        let user = this.dataService.getData("userData");
        console.log("user", user);
        var req = {
          "file_name": this.uploadForm.value.title,
          "project_id": this.projectDetails.project_id,
          "category_id": this.projectDetails.category_id ? this.projectDetails.category_id : null,
          "file": this.url,
          "user_id": user.user_id,
          "description": this.uploadForm.value.description

        }

        console.log("req", req);
        this.http.postMethod("projects/addDocument", req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);
          this.getDocuments();
          this.getmappedUsers();
          this.closeModal.nativeElement.click();
          this.uploadForm.reset();
          window.location.reload();
        }).catch((err) => {
          console.log(err);
        });
      }
    }

    if (this.documentAction == "EDIT") {
      let deleteconfirm = await this.dataService.showDelete("Document Update", "Confirm to proceed with Update", "Confirm");
      if (deleteconfirm == true) {
        let user = this.dataService.userProfile;
        console.log("user", user);
        var req = {
          "file_name": this.uploadForm.value.title,
          "project_id": this.projectDetails.project_id,
          "category_id": this.projectDetails.category_id ? this.projectDetails.category_id : null,
          "file": this.url,
          "user_id": user.user_id,
          "description": this.uploadForm.value.description,
        }

        console.log("req", req);
        console.log("data ========>>>>", data.document_id);
        this.http.putMethod(`projects/editDocument/${data.document_id}`, req).then((response: any) => {
          this.dataService.showSuccess("success", response.message);
          this.getDocuments();
          this.closeModal.nativeElement.click();
          this.uploadForm.reset();
        }).catch((err) => {
          console.log(err);
        });
      }
    }

    //}
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
  getuserRoles() {
    this.http.getMethod("users/user_roles").then((response: any) => {
      this.userRolesList = response.data;
      console.log(" this.userRolesList", this.userRolesList);
    }).catch((err) => {
      console.log(err);
    });
  }
  showComments(item) {
    item.project_name = this.projectDetails.project_name;
    console.log(item);

    item.from = 'Project';
    this.router.navigate(["admin/comments"], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });


  }

  async editDoc(data) {
    this.documentAction = "EDIT"
    this.selectededitDoc = {};

    setTimeout(() => {
      this.selectededitDoc = data;
      this.selectededitDoc.document_id = data.document_id;
      this.selectededitDoc.title = data.title;
      this.selectededitDoc.discription = data.discription;
      console.log(this.selectededitDoc)
    }, 500);
  }

  async rmveditdata() {
    this.selectededitDoc = {};
    this.documentAction = "ADD"
  }

  async viewDocDel(item) {
    this.deletedoc = await this.dataService.showDelete("Please Confirm", "The selected category will be Deleted?", "Delete");

    //console.log("test completetd")
    if (this.deletedoc == true) {
      this.http.deleteMethod('projects/document/' + item.document_id, '').then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.getDocuments();
        this.closeModal.nativeElement.click();
        this.uploadForm.reset();

      }).catch((err) => {
        console.log(err);
      });
    }
  }

  async deleteassignproject(user) {

    var data_a = user;
    var data_b = this.projectDetails.project_id;

    this.deletedoc = await this.dataService.showDelete("Please Confirm", "The selected User will be Remove The Project?", "Delete");

    if (this.deletedoc == true) {


      this.http.deleteMethod('projects/mappedUser/' + data_a + '/' + data_b, '').then((response: any) => {
        console.log("response", response);
        this.dataService.showSuccess("success", response.message);
        this.getmappedUsers();
        this.mapuserModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  backClicked() {
    this._location.back();
  }
}
