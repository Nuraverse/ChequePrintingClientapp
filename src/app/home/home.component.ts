import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToPrintSettings() {
    this.router.navigate(['/cheque-print-settings']);
  }

  navigateToPrintMaster() {
    this.router.navigate(['/cheque-printing']);
  }
}
