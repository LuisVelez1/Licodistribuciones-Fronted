import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-requeriments',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './requeriments.html',
  styleUrl: './requeriments.scss'
})
export class RequerimentsComponent implements OnInit {

  currentUser: User | null = null;

  private readonly AGENT_KEYWORDS = ['coordinador', 'jefe', 'director'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.error('Error cargando usuario', err)
    });
  }

  get isAgent(): boolean {
    if (!this.currentUser?.position) return false;
    const pos = this.currentUser.position.toLowerCase();
    return this.AGENT_KEYWORDS.some(k => pos.includes(k));
  }

  get isSuperAdmin(): boolean {
    return this.currentUser?.roles?.includes('SUPER_ADMIN') ?? false;
  }
}