import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  private readonly router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/punch-clock']);
    }, 1000);
  }

}
