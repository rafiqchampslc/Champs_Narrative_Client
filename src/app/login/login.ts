import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.authService.loginUser(this.username, this.password).subscribe({
      next: (response) => {
        if (response && response.isActive === 1) {
          this.authService.setLoginState(response.userID, response.role);
          this.router.navigate(['/vasa-list']);
        } else if (response && response.isActive !== 1) {
          this.errorMessage = 'Inactive user! Login Failed!!';
        } else {
          this.errorMessage = 'UserID or Password Incorrect!!';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'UserID or Password Incorrect!!';
      }
    });
  }
}