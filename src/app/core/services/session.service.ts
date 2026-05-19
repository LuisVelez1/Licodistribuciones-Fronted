import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginInfo } from '../models/login-info.models';

@Injectable({ providedIn: 'root' })
export class SessionService {

  private loginInfoSubject = new BehaviorSubject<LoginInfo | null>(null);
  loginInfo$ = this.loginInfoSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setLoginInfo(info: LoginInfo) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('loginInfo', JSON.stringify(info));
      if(info.token){
        localStorage.setItem('token', info.token);
      }
    }
    this.loginInfoSubject.next(info);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getRole(): string | null {
    const info = this.getLoginInfo();
    
    if (info && info.roles && info.roles.length > 0) {
      const primaryRole = info.roles[0];
      return primaryRole.replace('ROLE_', '');
    }

    return null;
  }

  getLoginInfo(): LoginInfo | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('loginInfo');
      if (stored) return JSON.parse(stored);
    }
    return this.loginInfoSubject.value;
  }

  isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      return Date.now() > expiration;
    } catch (e) {
      console.warn('Token mal formado, limpiando sesión...', e);
      this.clearSession();
      return true;
    }
  }

  clearSession() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loginInfo');
      localStorage.removeItem('token');
    }
    this.loginInfoSubject.next(null);
  }
}

