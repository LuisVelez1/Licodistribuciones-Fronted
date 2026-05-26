import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeRightComponent } from '../home-right/home-right';
import { NewsService } from '../../core/services/news.service';
import { UserService } from '../../core/services/user.service';
import { NewsCommentService } from '../../core/services/news-comment.service';

interface Comment {
  id: number;
  newsId: number;

  userId: string;
  author: string;

  comment: string;
  createdAt: string;
}

interface NewsPost {
  id: number;
  userId: number;
  title: string;
  category: string;
  date: string;
  videoSrc?: string;
  imageSrc?: string;
  description: string;
  comments: Comment[];
  showComments: boolean;
  newComment: string;
}

interface NewPostForm {
  title: string;
  category: string;
  description: string;

  contentType: 'video' | 'image' | 'none';

  videoPreview: string;
  imagePreview: string;

  videoFile: File | null;
  imageFile: File | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HomeRightComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private newsService: NewsService,
    private userService: UserService,
    private newsCommentService: NewsCommentService
  ) {}

  currentUser: any = null;
  menuOpen = false;
  editingPostId: number | null = null;
  profileOpen = signal(false);
  showDeleteModal = false;
  postToDeleteId: number | null = null;

  showUploadForm = false;

  newPost: NewPostForm = this.emptyForm();

  newsPosts: NewsPost[] = [];
  isUploading = false;
  uploadProgress = 0;

  ngOnInit(): void {
  this.loadNews();
  this.loadCurrentUser();
}

loadCurrentUser() {
  this.userService.getCurrentUser().subscribe({
    next: (user) => {
      this.currentUser = user;
    },
    error: (err) => {
      console.error('Error obteniendo usuario actual', err);
    }
  });
}

canManagePost(post: any): boolean {

  if (!this.currentUser) return false;

  const isSuperAdmin =
    this.currentUser.roles?.includes('SUPER_ADMIN');

  const isAdmin =
    this.currentUser.roles?.includes('ADMIN');

  const isOwner =
    String(post.userId) === String(this.currentUser.id);

  return isSuperAdmin || isAdmin || isOwner;
}

loadNews() {
  this.newsService.getAll().subscribe({
    next: (data: any[]) => {
      this.newsPosts = data.map((n: any) => ({
        id: n.id,
        userId: n.createdBy,
        title: n.title,
        category: n.category,
        description: n.description,
        date: new Date(n.createdAt).toLocaleDateString('es-CO', {
          day: '2-digit', month: 'long', year: 'numeric'
        }),
        videoSrc: n.videoUrl ? `http://localhost:8081/api/${n.videoUrl}` : undefined,
        imageSrc: n.imageUrl ? `http://localhost:8081/api/${n.imageUrl}` : undefined,
        comments: (n.comments || []).map((c: any) => ({
          id: c.id,
          newsId: n.id,
          userId: c.userId,
          author: c.author,
          comment: c.comment,
          createdAt: c.createdAt
        })),
        showComments: false,
        newComment: ''
      }));
    },
    error: (err) => console.error('Error cargando noticias', err)
  });
}
      


  publishPost() {

  if (!this.newPost.title || !this.newPost.category || !this.newPost.description) {
    return;
  }

  const payload = {
    title: this.newPost.title,
    category: this.newPost.category,
    description: this.newPost.description,
    contentType: this.newPost.contentType.toUpperCase()
  };

  let file: File | undefined;

  if (this.newPost.contentType === 'video') {
    file = this.newPost.videoFile ?? undefined;
  }

  if (this.newPost.contentType === 'image') {
    file = this.newPost.imageFile ?? undefined;
  }

  this.isUploading = true;
  this.uploadProgress = 0;

  const request$ = this.editingPostId
    ? this.newsService.update(this.editingPostId, payload, file)
    : this.newsService.create(payload, file);

  request$.subscribe({
    next: () => {
      this.loadNews();
      this.newPost = this.emptyForm();
      this.showUploadForm = false;
      this.isUploading = false;
      this.editingPostId = null;
    },
    error: (err) => {
      console.error(err);
      this.isUploading = false;
    }
  });
}

  private emptyForm(): NewPostForm {

    return {

      title: '',

      category: '',

      description: '',

      contentType: 'none',

      videoPreview: '',

      imagePreview: '',

      videoFile: null,

      imageFile: null
    };
  }

  toggleUploadForm() {

    this.showUploadForm = !this.showUploadForm;

    if (!this.showUploadForm) {
      this.newPost = this.emptyForm();
    }
  }

  startEdit(post: NewsPost) {
    this.showUploadForm = true;
    this.editingPostId = post.id;

    const contentType = post.videoSrc ? 'video' : post.imageSrc ? 'image' : 'none';

    this.newPost = {
      title: post.title,
      category: post.category,
      description: post.description,
      contentType: contentType,
      videoPreview: post.videoSrc ?? '',
      imagePreview: post.imageSrc ?? '',
      videoFile: null,
      imageFile: null
    };
  }

  onVideoSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {

      const file = input.files[0];

      this.newPost.videoFile = file;

      this.newPost.videoPreview = URL.createObjectURL(file);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.newPost.imageFile = file;
      this.newPost.imagePreview = URL.createObjectURL(file);
    }
  }

  toggleComments(index: number) {

  const post = this.newsPosts[index];

  post.showComments = !post.showComments;

  if (post.showComments) {

    this.newsCommentService.getComments(post.id).subscribe({

      next: (comments) => {

        post.comments = comments.map(c => ({

          id: c.id,
          newsId: c.newsId,

          userId: c.userId,
          author: c.author,

          comment: c.comment,

          createdAt: c.createdAt
        }));
      },

      error: (err) => {
        console.error('Error cargando comentarios', err);
      }
    });
  }
}

  addComment(index: number) {

  const post = this.newsPosts[index];

  if (!post.newComment.trim()) return;

  this.newsCommentService.createComment(
    post.id,
    {
      comment: post.newComment
    }
  ).subscribe({

    next: (comment) => {

      post.comments.push(comment);

      post.newComment = '';
    },

    error: (err) => {
      console.error('Error creando comentario', err);
    }
  });
}

openDeleteModal(id: number) {
  this.postToDeleteId = id;
  this.showDeleteModal = true;
}

closeDeleteModal() {
  this.showDeleteModal = false;
  this.postToDeleteId = null;
}

confirmDelete() {
  if (!this.postToDeleteId) return;

  this.newsService.delete(this.postToDeleteId).subscribe({
    next: () => {
      this.newsPosts = this.newsPosts.filter(p => p.id !== this.postToDeleteId);
      this.closeDeleteModal();
    },
    error: (err) => {
      console.error('Error eliminando noticia', err);
      this.closeDeleteModal();
    }
  });
}

  toogleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toogleProfile() {
    this.profileOpen.update(open => !open);
  }
}