import { Injectable, signal, computed, Signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = signal(0);

  public isLoading: Signal<boolean> = computed(() => this.loadingCount() > 0);

  show(): void {
    this.loadingCount.update(n => n + 1);
  }

  hide(): void {
    this.loadingCount.update(n => Math.max(0, n - 1));
  }

  reset(): void {
    this.loadingCount.set(0);
  }

  getCount(): number {
    return this.loadingCount();
  }
}