import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    CommonModule,
    RouterLink
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../security.module.style.scss']
})
export class SignUpComponent {
  signupForm: FormGroup;
  hidePassword = true;
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  animals = ['🐸', '🦄', '🐙', '🦋', '🐨', '🦁', '🐯', '🐼'];
  currentAnimal = 0;

  constructor() {
    this.signupForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.min(1000000000)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Animate animals
    setInterval(() => {
      this.currentAnimal = (this.currentAnimal + 1) % this.animals.length;
    }, 2000);
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { displayName, email, phoneNumber, password } = this.signupForm.value;
      this.authService.signUp(email, password, displayName, phoneNumber)
        .then(() => {
          this.router.navigateByUrl('/security/kids-details');
        })
        .catch(error => {
          console.error('Sign-up failed:', error);
        });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName === 'displayName' ? 'We need to know your name!' : fieldName === 'email' ? 'We need your email!' : fieldName === 'phoneNumber' ? 'We need your phoneNumber!' : 'This field is required!'}`;
      if (field.errors['email']) return 'That doesn\'t look like an email';
      if (field.errors['min']) return 'You must enter 10 numbers';
      if (field.errors['minlength']) return 'Make it longer (at least 6 letters)';
    }
    return '';
  }
}
