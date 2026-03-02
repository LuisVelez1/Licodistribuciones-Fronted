import { CommonModule } from "@angular/common";
import { LoadingService } from "../../../core/services/loading.service";
import { Component, inject } from "@angular/core";

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="splash-screen" [class.hide]="!isLoading()">
      <img src="assets/images/Logo.png" class="logo" />
      <p>Cargando...</p>
    </div>
  `
})
export class GlobalSpinnerComponent {
  private loadingService = inject(LoadingService);
  isLoading = this.loadingService.isLoading;
}
