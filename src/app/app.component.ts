import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { SharedModule } from './shared.module';

@Component({
  standalone: true,
  imports: [RouterModule, SharedModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Cheques Printing System';
  constructor(private primengConfig: PrimeNGConfig) {}
  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
