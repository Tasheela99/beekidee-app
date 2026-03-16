import {Component, Inject, NgModule} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, NgModel} from "@angular/forms";

@Component({
  selector: 'app-save-results-pop-up',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './save-results-pop-up.component.html',
  styleUrl: './save-results-pop-up.component.scss'
})
export class SaveResultsPopUpComponent {

  gameResult = {
    name: '',
    session: '',
    marks: 0
  };

  constructor(
    public dialogRef: MatDialogRef<SaveResultsPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.gameResult);
  }

}
