import {Component, inject, NgZone} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Auth} from "@angular/fire/auth";
import {KidsService} from "../../../services/kids.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {doc, getDoc} from "@angular/fire/firestore";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    MatError,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../security.module.style.scss']
})
export class SignInComponent {

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private authService = inject(AuthService);
  private kidsService = inject(KidsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  loginForm: FormGroup;
  private firebaseAuth = inject(Auth);
  hidePassword: boolean = true;

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;

      // Show loading indicator (optional)
      this.isLoading = true;

      this.authService.signIn(email, password)
        .then(({userCredential, isAdmin}) => {
          console.log('Login successful!', userCredential);

          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.ngZone.run(() => {
            if (isAdmin) {
              // Admin users go directly to console
              this.router.navigateByUrl('/console');
            } else {
              // For regular users, check if they have kids registered
              this.kidsService.getKidsByParentEmail(email).subscribe({
                next: (kids) => {
                  this.router.navigateByUrl('/kids');
                  this.isLoading = false;
                },
                error: (error) => {
                  console.error('Error fetching kids data:', error);
                  this.snackBar.open('Error loading profile data', 'Close', {
                    duration: 3000
                  });
                  this.router.navigateByUrl('/security/kids-details');
                  this.isLoading = false;
                }
              });
            }
          });
        })
        .catch((error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          let errorMessage = 'Invalid email or password';

          // Handle specific Firebase auth errors
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed login attempts. Please try again later';
          }

          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
    } else {
      this.snackBar.open('Please fill out the form correctly before submitting.', 'Got it', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      console.log('Form is invalid');

      // Optional: highlight invalid fields
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
