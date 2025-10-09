import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  _id: string;
  text: string;
  imageUrl?: string;
  postedBy: { _id?: string; name: string; role: string }; // add _id for ownership
  postedDate: Date;
  likes: string[];
  comments: { _id: string; text: string; commentedBy: { name: string }; commentedDate: Date }[];
}

@Component({
  selector: 'app-information-sharing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './information-sharing.html',
  styleUrls: ['./information-sharing.css']
})
export class InformationSharingComponent {
  posts: Post[] = [];
  newPostText: string = '';
  newPostImage: File | null = null;
  token = localStorage.getItem('token') || '';
  commentText: string = '';
  selectedPostId: string = '';

  constructor(private http: HttpClient) {
    this.loadPosts();
  }

  onImageSelected(event: any) {
    this.newPostImage = event.target.files[0];
  }

  loadPosts() {
    this.http.get<Post[]>('http://localhost:5000/posts')
      .subscribe({
        next: (data) => this.posts = data,
        error: (err) => alert('Error loading posts: ' + (err.error?.message || 'Unknown error'))
      });
  }

  createPost() {
    if (!this.newPostText.trim() && !this.newPostImage) {
      return alert('Post must have text or image');
    }

    const formData = new FormData();
    formData.append('text', this.newPostText);
    if (this.newPostImage) {
      formData.append('image', this.newPostImage);
    }

    this.http.post('http://localhost:5000/posts', formData, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.newPostText = '';
        this.newPostImage = null;
        this.loadPosts();
      },
      error: (err) => alert('Error posting: ' + (err.error?.message || 'Unknown error'))
    });
  }

  addComment(postId: string) {
    if (!this.commentText.trim()) return alert('Comment cannot be empty');
    this.http.post(`http://localhost:5000/posts/${postId}/comments`, { text: this.commentText.trim() }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.commentText = '';
        this.selectedPostId = '';
        this.loadPosts();
      }
    });
  }

  toggleLike(postId: string) {
    this.http.post(`http://localhost:5000/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe(() => this.loadPosts());
  }

  selectPostForComment(postId: string) {
    this.selectedPostId = postId;
  }

  // ✅ Delete a post
  deletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.http.delete(`http://localhost:5000/posts/${postId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p._id !== postId); // update UI
      },
      error: (err) => alert('Error deleting post: ' + (err.error?.message || 'Unknown error'))
    });
  }

  // ✅ Check if current logged-in user is the post owner
  isOwner(post: Post): boolean {
    if (!this.token) return false;
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1])); // decode JWT
      return post.postedBy && (post.postedBy as any)._id === payload.userId;
    } catch {
      return false;
    }
  }
}
