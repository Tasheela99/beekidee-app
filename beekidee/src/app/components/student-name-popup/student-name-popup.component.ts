import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { AttentionService } from "../../services/attention.service";
import { AttentionLostPopupComponent } from "../attention-lost-popup/attention-lost-popup.component";

@Component({
  selector: 'app-student-name-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-name-popup.component.html',
  styleUrls: ['./student-name-popup.component.scss']
})
export class StudentNamePopupComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() onSubmit = new EventEmitter<{ name: string, round: number }>();
  @Output() onCancel = new EventEmitter<void>();
  isDialogOpen = false;

  readonly dialogRef = inject(MatDialogRef<StudentNamePopupComponent>);
  data = inject(MAT_DIALOG_DATA);

  private readonly attentionService = inject(AttentionService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Form now includes both studentName and roundNumber
  popupForm = new FormGroup({
    studentName: new FormControl(),
    roundNumber: new FormControl(),
  });

  ngOnInit(): void {
    // No longer need to watch auth state for UID
  }

  submitDetails(): void {
    const studentName = this.popupForm.get('studentName')?.value;
    const roundNumber = this.popupForm.get('roundNumber')?.value;

    // Ensure we have a student name before proceeding
    if (!studentName) {
      console.error('No student name provided.');
      return;
    }

    this.attentionService.trackAttention(
      studentName,
      roundNumber
    ).subscribe(() => {

      const intervalId = setInterval(() => {
        this.attentionService.getStudentAttentionLevel(studentName)
          .subscribe((response: any) => {
            console.log('Raw response:', response);

            // If the backend returns an array of objects [{ overall: 59.07 }]
            const overallValue = Array.isArray(response) && response.length > 0
              ? response[0]?.overall
              : null;

            console.log('Current Overall Attention:', overallValue);

            if (overallValue !== null) {
              if (
                this.router.url === '/console/admin/dashboard/constructivism-plus-attention/pre-intermediate'
              ) {
                if (overallValue < 65 && !this.isDialogOpen) {
                  this.openDialog();
                }
                if (overallValue >= 65 && this.isDialogOpen) {
                  this.closeDialog();
                }
              }
            } else {
              console.error("No overall value found.");
              clearInterval(intervalId);
            }
          });
      }, 10000); // 10-second interval

      this.dialogRef.close();
    });
  }

  // Open the dialog and set the dialog open state to true
  openDialog(): void {
    this.dialog.open(AttentionLostPopupComponent);
    this.isDialogOpen = true;
  }

  // Close the dialog and set the dialog open state to false
  closeDialog(): void {
    this.dialog.closeAll();
    this.isDialogOpen = false;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Kept for parity; not used now because there’s no text field.
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitDetails();
    }
  }
}
