import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeRightComponent } from "../home-right/home-right";
import { CommonModule } from '@angular/common';

interface Comment {
  author: string;
  text: string;
  time: string;
}

interface NewsPost {
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
  imports: [FormsModule, HomeRightComponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  userName = 'Jorge Barbosa';
  menuOpen = false;
  profileOpen = signal(false);
  showUploadForm = false;

  newPost: NewPostForm = this.emptyForm();

  newsPosts: NewsPost[] = [
    {
      title: '¡Bienvenidos a la nueva Intranet Lico Distribuciones!',
      category: 'Comunicado',
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }),
      videoSrc: 'assets/videos/VIdeoHome.mp4',
      description: 'Explora todas las herramientas y funcionalidades que hemos preparado para mejorar nuestra comunicación interna.',
      comments: [
        { author: 'Laura Gómez', text: '¡Qué buena noticia! Me encanta la nueva plataforma.', time: 'hace 2 horas' },
        { author: 'Carlos Ruiz', text: 'Muy buena iniciativa para el equipo.', time: 'hace 1 hora' }
      ],
      showComments: false,
      newComment: ''
    },
    {
      title: 'Actualización de procesos - Temporada 2025',
      category: 'Operaciones',
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }),
      videoSrc: 'assets/videos/videoHome2.mp4',
      description: 'Conoce los nuevos procedimientos y cambios implementados para optimizar nuestras operaciones este año.',
      comments: [],
      showComments: false,
      newComment: ''
    }
  ];

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
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPost.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  publishPost() {
    if (!this.newPost.title || !this.newPost.category || !this.newPost.description) return;

    const post: NewsPost = {
      title: this.newPost.title,
      category: this.newPost.category,
      description: this.newPost.description,
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }),
      comments: [],
      showComments: false,
      newComment: ''
    };

    if (this.newPost.contentType === 'video' && this.newPost.videoPreview) {
      post.videoSrc = this.newPost.videoPreview;
    }
    if (this.newPost.contentType === 'image' && this.newPost.imagePreview) {
      post.imageSrc = this.newPost.imagePreview;
    }

    this.newsPosts.unshift(post);
    this.newPost = this.emptyForm();
    this.showUploadForm = false;
  }

  toggleComments(index: number) {
    this.newsPosts[index].showComments = !this.newsPosts[index].showComments;
  }

  addComment(index: number) {
    const post = this.newsPosts[index];
    if (!post.newComment.trim()) return;
    post.comments.push({
      author: this.userName,
      text: post.newComment.trim(),
      time: 'ahora mismo'
    });
    post.newComment = '';
  }

  toogleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  toogleProfile() { this.profileOpen.update(open => !open); }
}
