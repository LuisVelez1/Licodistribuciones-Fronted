import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginFacade } from './login.facade';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username = '';
  password = '';
  showModal = false;

  constructor(public facade: LoginFacade) {}

  onSubmit() {
    const credentials: LoginCredentials = {
      username: this.username,
      password: this.password
    };
    this.facade.login(credentials);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
