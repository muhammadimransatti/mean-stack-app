import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { identifierModuleUrl } from '@angular/compiler';
import { Title } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {
    
  }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          email: post.email, 
          id: post._id
        };
      });
    }))

    .subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

getPost(id: string){
  return this.http.get<{_id: string, title: string, content: string, email, string}>("http://localhost:3000/api/posts/" + id);
}



  addPost(title: string, content: string, email: string) {
    const post: Post = { id: null, title: title, content: content, email: email };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

updatePost(id: string, title: string, content: string, email: string){
  const post: Post = {id: id, title: title, content: content, email: email};
  this.http.put("http://localhost:3000/api/posts/" + id, post)
  .subscribe(response => {
    const updatedPosts = [...this.posts];
    const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
    updatedPosts[oldPostIndex] = post;
    this.posts = updatedPosts;
    this.postsUpdated.next([...this.posts]);
  });
}




  deletePost(postId: string)
  {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
    this.posts = updatedPosts;
    this.postsUpdated.next([...this.posts]);
    });
  }


}
