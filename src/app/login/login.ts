import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  constructor(private router: Router) { }

  login() {
    // Here you would typically have your authentication logic.
    // For now, we'll just navigate to the vasa-list component.
    this.router.navigate(['/vasa-list']);
  }
}