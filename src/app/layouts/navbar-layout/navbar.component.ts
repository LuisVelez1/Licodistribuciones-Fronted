import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { UserService } from '../../core/services/user.service';
import { LoginInfo } from '../../core/models/login-info.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule]
})
export class NavbarComponent implements OnInit {

  user: LoginInfo | null = null;
  isMenuOpen: boolean = false;
  role: string | null = null;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getCurrentUser().subscribe({
        next: (data) => {
          this.user = { ...data, loginTime: new Date() };
          this.sessionService.setLoginInfo(this.user);
          this.role = this.sessionService.getRole();
        }
      });
    }
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  toggleMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    this.isMenuOpen = !this.isMenuOpen;
    
    this.cdr.detectChanges();
    
    const menuElement = document.querySelector('.side-menu');
    if (menuElement) {
      if (this.isMenuOpen) {
        menuElement.classList.add('open');
      } else {
        menuElement.classList.remove('open');
      }
    }
  }

  closeMenu(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.isMenuOpen = false;
    
    const menuElement = document.querySelector('.side-menu');
    if (menuElement) {
      menuElement.classList.remove('open');
    }
    
    this.cdr.detectChanges();
  }

  onUserMenuClick(event: MouseEvent) {
    event.stopPropagation();
  }

  logout(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/login']);
  }
}