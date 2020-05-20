import { Component,Input,ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myApp';
  public imagePath;
  imgURL: any;
  profileList : any[] =[];
  searchList : any[] =[];
  searchStudent : string = null;
  displayStudentRecord : any = null;
  displayStudentPic;
 
  newStudent : string = null;
  public newProfilePic;

  constructor(private httpClient: HttpClient,
              private cd : ChangeDetectorRef){

    this.httpClient.get('http://127.0.0.1:8000/api/students/')
    .subscribe((res: any) =>{
        this.searchList = res;
    })

  }

  selectImage(){
    document.getElementById('upload-file').click();
  }

  selectStudentImage(){
    document.getElementById('upload-student-file').click();
  }

  searchAttendance(){
    for(let index=0;index<this.searchList.length;index++){
      if(this.searchStudent == this.searchList[index].name){
        this.displayStudentRecord = this.searchList[index];
        this.displayStudentPic = '../assets/'+ this.searchList[index].name.toString() + '.jpg'
        break;
      }
    }
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert("Only images are supported.");
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result;
    }
  }


  previewStudent(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert("Only images are supported.");
      return;
    }

    this.newProfilePic = files;
    var reader = new FileReader();

    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.addStudent();
    }  
  }

onUploadFile() {
  //Upload file here send a Form data
  const uploadFormData = new FormData();

  uploadFormData.append('image', this.imagePath[0], this.imagePath[0].name);
  uploadFormData.append('title','Test Image');
  uploadFormData.append('content', 'Content');
  this.httpClient.post('http://127.0.0.1:8000/api/posts/',uploadFormData)
  .subscribe((res: any) =>{
    console.log(res);
    this.profileList = res;
    this.httpClient.get('http://127.0.0.1:8000/api/students/')
    .subscribe((res: any) =>{
        this.searchList = res;
    })
  } )
  }

addStudent() {
  const nameFormData = new FormData();

  nameFormData.append('name',this.newStudent);
  nameFormData.append('days_present','0');
  nameFormData.append('profilePic',this.newProfilePic[0],this.newProfilePic[0].name)

  this.httpClient.post('http://127.0.0.1:8000/api/students/',nameFormData)
  .subscribe((res: any) =>{
      this.httpClient.get('http://127.0.0.1:8000/api/students/')
      .subscribe((res: any) =>{
          this.searchList = res;
      })
    })
  }

showFaces(){
  const uploadFormData = new FormData();

  uploadFormData.append('image', this.imagePath[0], this.imagePath[0].name);
  uploadFormData.append('title','Test Image');
  uploadFormData.append('content', 'Content');
  this.httpClient.post('http://127.0.0.1:8000/api/faces/',uploadFormData)
  .subscribe((res: any) =>{
    this.imgURL = 'data:image/png;base64,'+res;
    })
}

}
