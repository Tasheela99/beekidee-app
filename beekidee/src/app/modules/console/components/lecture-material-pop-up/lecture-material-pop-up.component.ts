// Fixed Component
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ConsoleService} from "../../../../services/console.service";
import {NgIf} from "@angular/common";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-lecture-material-pop-up',
  standalone: true,
  templateUrl: './lecture-material-pop-up.component.html',
  styleUrl: './lecture-material-pop-up.component.scss',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButton, MatIconButton, MatIcon, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureMaterialPopUpComponent {

  private consoleService = inject(ConsoleService);
  private dialogRef = inject(MatDialogRef<LectureMaterialPopUpComponent>);


  // Add validators to ensure form fields are required
  form = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    subtitle: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    level: new FormControl('', [Validators.required]),
  })

  fileName: string = '';
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  submit() {
    if (this.form.invalid) {
      console.error('Form is invalid');
      this.form.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    const formValues = this.form.value;
    this.consoleService.saveLesson({
      file: this.selectedFile,
      subject: formValues.subject || '',
      title: formValues.title || '',
      subtitle: formValues.subtitle || '',
      type: formValues.type || '',
      level: formValues.level || '',
    }).then(() => {
      console.log("Saved successfully");
      this.form.reset();
      this.selectedFile = null;
      this.fileName = '';
      this.dialogRef.close(true);
    }).catch(err => {
      console.error("Save failed", err);
    });
  }

}
