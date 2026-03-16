import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FirebaseDataService, SessionData} from "../../services/firebase-data.service";
import {AsyncPipe, DatePipe, NgIf, NgFor, DecimalPipe, NgClass} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

interface AverageData {
  overall_attention: number;
  eye_attention: number;
  face_attention: number;
  noise_attention: number;
  posture: number;
  totalRecords: number;
}

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
    AsyncPipe,
    DatePipe,
    NgIf,
    NgFor,
    MatButton,
    MatCardModule,
    MatIconModule,
    DecimalPipe,
    NgClass
  ],
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit, OnDestroy {
  studentSessions$: Observable<SessionData[]>;
  displayedColumns: string[] = ['timestamp', 'emotion', 'overall_attention', 'eye_attention', 'face_attention', 'noise_attention', 'posture'];
  dataSource = new MatTableDataSource<SessionData>([]);
  averageData: AverageData = {
    overall_attention: 0,
    eye_attention: 0,
    face_attention: 0,
    noise_attention: 0,
    posture: 0,
    totalRecords: 0
  };

  private subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<StudentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: string, sessionNumber: number },
    private firebaseDataService: FirebaseDataService
  ) {
    this.studentSessions$ = this.firebaseDataService.getStudentSessionsById(data.studentId);
  }

  ngOnInit() {
    const sub = this.studentSessions$.subscribe(sessions => {
      const filteredSessions = sessions.filter(session => session.sessionNumber === this.data.sessionNumber);
      this.dataSource.data = filteredSessions || [];
      this.calculateAverages(filteredSessions);
    });

    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private calculateAverages(sessions: SessionData[]): void {
    if (!sessions || sessions.length === 0) {
      this.averageData = {
        overall_attention: 0,
        eye_attention: 0,
        face_attention: 0,
        noise_attention: 0,
        posture: 0,
        totalRecords: 0
      };
      return;
    }

    const totals = sessions.reduce((acc, session) => {
      acc.overall_attention += session.overall_attention || 0;
      acc.eye_attention += session.eye_attention || 0;
      acc.face_attention += session.face_attention || 0;
      acc.noise_attention += session.noise_attention || 0;
      acc.posture += session.posture || 0;
      return acc;
    }, {
      overall_attention: 0,
      eye_attention: 0,
      face_attention: 0,
      noise_attention: 0,
      posture: 0
    });

    const count = sessions.length;

    this.averageData = {
      overall_attention: totals.overall_attention / count,
      eye_attention: totals.eye_attention / count,
      face_attention: totals.face_attention / count,
      noise_attention: totals.noise_attention / count,
      posture: totals.posture / count,
      totalRecords: count
    };
  }

  getAttentionColor(value: number): string {
    if (value >= 80) return 'high-attention';
    if (value >= 60) return 'medium-attention';
    if (value >= 40) return 'low-attention';
    return 'very-low-attention';
  }

  getPostureColor(value: number): string {
    if (value >= 0.8) return 'good-posture';
    if (value >= 0.6) return 'fair-posture';
    return 'poor-posture';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
