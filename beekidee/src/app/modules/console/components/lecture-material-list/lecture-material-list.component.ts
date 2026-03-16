import {Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {LectureMaterialPopUpComponent} from "../lecture-material-pop-up/lecture-material-pop-up.component";
import {MatDialog} from "@angular/material/dialog";
import {ConsoleService, Lesson} from "../../../../services/console.service";
import {DatePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef,
  CdkTable
} from "@angular/cdk/table";

@Component({
  selector: 'app-lecture-material-list',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButton, MatAnchor, DatePipe, MatIconButton, MatIcon, CdkTable, CdkColumnDef, CdkHeaderCell, CdkCell, CdkCellDef, CdkHeaderCellDef, CdkHeaderRow, CdkRow, CdkRowDef, CdkHeaderRowDef],
  templateUrl: './lecture-material-list.component.html',
  styleUrl: './lecture-material-list.component.scss'
})
export class LectureMaterialListComponent implements OnInit{

  private dialog = inject(MatDialog);
  private consoleService = inject(ConsoleService);
  displayedColumns: string[] = ['title', 'subject', 'level', 'type', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Lesson>();

  ngOnInit() {
    this.loadData();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPopUp(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ) {
    const dialogRef = this.dialog.open(LectureMaterialPopUpComponent, {
      width: '550px',
      maxHeight: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        dialogRef.close(result)
      }
    });
  }

  async loadData(): Promise<void> {
    try {
      const lessons = await this.consoleService.getAllLessons();
      this.dataSource.data = lessons;
    } catch (error) {
      console.error('Error loading lessons', error);
    }
  }

  async delete(lesson: Lesson): Promise<void> {
    const confirmDelete = confirm(`Are you sure you want to delete "${lesson.title}"?`);
    if (!confirmDelete) return;
    try {
      await this.consoleService.deleteLesson(lesson.lessonId, lesson.fileName);
      this.loadData();
    } catch (error) {
      console.error('Deletion error:', error);
    }
  }
}
