import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeRightComponent } from "../home-right/home-right";

interface Comment {
  author: string;
  text: string;
  time: string;
}

interface NewsPost {
  title: string;
  category: string;
  date: string;
  videoSrc: string;
  description: string;
  comments: Comment[];
  showComments: boolean;
  newComment: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, HomeRightComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  userName = 'Jorge Barbosa';
  menuOpen = false;
  profileOpen = signal(false);

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