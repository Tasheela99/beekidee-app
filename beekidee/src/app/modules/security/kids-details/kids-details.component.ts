import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import { Subscription } from 'rxjs';
import {Kid, KidsService} from "../../../services/kids.service";
import {AuthService} from "../../../services/auth.service";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatList, MatListItem, MatListItemIcon} from "@angular/material/list";

@Component({
  selector: 'app-kids-details',
  templateUrl: './kids-details.component.html',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatIcon, NgIf, MatInput, MatSelect, MatOption, MatButton, MatProgressSpinner, MatList, MatListItemIcon, MatListItem, RouterLink, NgForOf],
  standalone: true,
  styleUrls: ['./kids-details.component.scss']
})
export class KidsDetailsComponent implements OnInit, OnDestroy {
  kidForm: FormGroup;
  isSubmitting = false;
  kids: Kid[] = [];
  parentEmail: any | null = null;
  private userSubscription: Subscription | null = null;
  private kidsSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private kidsService: KidsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.kidForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(17)]],
      gender: ['', [Validators.required]],
      gradeLevel: [''],
      interests: ['']
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.parentEmail = user.email;
        this.loadKids();
      } else {
        this.router.navigate(['/security/sign-in']);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.kidsSubscription) {
      this.kidsSubscription.unsubscribe();
    }
  }

  loadKids(): void {
    if (this.parentEmail) {
      this.kidsSubscription = this.kidsService.getKidsByParentEmail(this.parentEmail).subscribe(
        kidsList => {
          this.kids = kidsList;
        }
      );
    }
  }

  async onSubmit(): Promise<void> {
    if (this.kidForm.invalid || !this.parentEmail) {
      return;
    }

    this.isSubmitting = true;

    try {
      const interests = this.kidForm.value.interests
        ? this.kidForm.value.interests.split(',').map((i: string) => i.trim())
        : [];

      const kidData: Omit<Kid, 'id'> = {
        name: this.kidForm.value.name,
        age: this.kidForm.value.age,
        gender: this.kidForm.value.gender,
        gradeLevel: this.kidForm.value.gradeLevel || '',
        interests: interests,
        parentEmail: this.parentEmail,
        createdAt: new Date().toISOString()
      };

      await this.kidsService.addKid(kidData);

      // Reset form after successful submission
      this.kidForm.reset();
      this.isSubmitting = false;

      // No need to manually reload kids as the subscription should update automatically
    } catch (error) {
      console.error('Error saving kid details:', error);
      this.isSubmitting = false;
    }
  }
}
