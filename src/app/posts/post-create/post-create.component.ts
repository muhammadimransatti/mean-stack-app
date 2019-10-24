import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validator, Validators} from "@angular/forms";
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { fromEventPattern } from 'rxjs';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

enteredId = '';  
enteredTitle = '';
enteredContent = '';
enteredEmail = '';
post: Post;
private mode = 'create';
private postId: string;
isLoading = false;
form : FormGroup;



constructor(public postsService: PostsService, public route: ActivatedRoute) { }

ngOnInit() {
  this.form = new FormGroup({
    'title': new FormControl(null,{validators: [Validators.required, Validators.minLength(3)]}),
    'content': new FormControl(null, {validators: [Validators.required]}),
    'email': new FormControl(null, {validators: [Validators.required]}),
  });
  this.route.paramMap.subscribe((paramMap) => {
    if(paramMap.has('postId')){
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      this.postsService.getPost(this.postId).subscribe(postData =>{
      this.isLoading = false;
        this.post = {id: postData._id, title: postData.title, content: postData.content, email: postData.email};
        this.form.setValue({title: this.post.title, content: this.post.content, email: this.post.email});
      });
    } else {
      this.mode = 'create';
      this.postId = null;
    }
  });
}



onSavePost(){
  if(this.form.invalid){
    return ;
  }
  this.isLoading = true;
  if(this.mode === 'create'){
    this.postsService.addPost(this.form.value.title, this.form.value.content , this.form.value.email);
  } else {
    this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content , this.form.value.email);
  }

this.form.reset();
}
}
