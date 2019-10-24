import { Component, OnInit} from '@angular/core';
import { NgForm} from "@angular/forms";
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
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

constructor(public postsService: PostsService, public route: ActivatedRoute) { }

ngOnInit() {
  this.route.paramMap.subscribe((paramMap) => {
    if(paramMap.has('postId')){
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.postsService.getPost(this.postId).subscribe(postData =>{
        this.post = {id: postData._id, title: postData.title, content: postData.content, email: postData.email};
      });
    } else {
      this.mode = 'create';
      this.postId = null;
    }
  });
}



onSavePost(form: NgForm){
  if(form.invalid){
    return ;
  }
  if(this.mode === 'create'){
    this.postsService.addPost(form.value.title, form.value.content , form.value.email);
  } else {
    this.postsService.updatePost(this.postId, form.value.title, form.value.content , form.value.email);
  }

form.resetForm();
}





}
