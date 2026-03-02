import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HomeRightComponent } from "../home-right/home-right";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeRightComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  userName = 'Perfil'; 
  menuOpen = false;
  profileOpen = signal(false);

  constructor() {}

  toogleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(){
    this.menuOpen = false;
  }

  toogleProfile(){
    this.profileOpen.update(open => !open); 
  }

}
