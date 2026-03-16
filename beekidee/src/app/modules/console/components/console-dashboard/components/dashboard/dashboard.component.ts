import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { FirebaseDataService, SessionData, StudentSummary } from '../../../../../../services/firebase-data.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentDetailComponent } from '../../../../../../components/student-detail/student-detail.component';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { ConsoleService } from "../../../../../../services/console.service";
import { DataChartComponent } from "../../../../../../components/data-chart/data-chart.component";
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexMarkers,
  ApexForecastDataPoints, ApexLegend,
} from "ng-apexcharts";

interface StudentProgress {
  studentId: string;
  session001Data?: StudentSummary;
  session002Data?: StudentSummary;
  hasSession001: boolean;
  hasSession002: boolean;
  hasBothSessions: boolean;
  progressStatus: 'improved' | 'declined' | 'same' | 'new' | 'incomplete';
}

interface ProgressStats {
  totalStudents: number;
  studentsInBothSessions: number;
  newStudentsInSession002: number;
  droppedStudentsFromSession001: number;
  improvedStudents: number;
  declinedStudents: number;
  samePerformance: number;
  averageProgressRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatPaginator,
    MatSort,
    NgIf,
    MatProgressSpinner,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatButton,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    FormsModule,
    MatIconButton,
    DecimalPipe,
    MatTooltip,
    DataChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['studentId', 'sessionNumber'];
  dataSource001 = new MatTableDataSource<StudentSummary>();
  dataSource002 = new MatTableDataSource<StudentSummary>();
  resultsLength001 = 0;
  resultsLength002 = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  selectedSession: string = 'all';

  // Session results tables (names + marks)
  session0001DataSource = new MatTableDataSource<{ name: string; marks: number }>([]);
  session0002DataSource = new MatTableDataSource<{ name: string; marks: number }>([]);

  // Paginators for session results tables
  @ViewChild('paginator0001') paginator0001!: MatPaginator;
  @ViewChild('paginator0002') paginator0002!: MatPaginator;

  // Debug properties
  debugInfo = {
    session001Loaded: false,
    session002Loaded: false,
    session001Count: 0,
    session002Count: 0,
    lastError: ''
  };

  private subscription: Subscription = new Subscription();
  studentProgressData: StudentProgress[] = [];
  progressStats: ProgressStats = {
    totalStudents: 0,
    studentsInBothSessions: 0,
    newStudentsInSession002: 0,
    droppedStudentsFromSession001: 0,
    improvedStudents: 0,
    declinedStudents: 0,
    samePerformance: 0,
    averageProgressRate: 0
  };
  progressDataSource = new MatTableDataSource<StudentProgress>();
  progressDisplayedColumns: string[] = ['studentId', 'session001Status', 'session002Status', 'progressStatus', 'actions'];
  showProgressSection = true;

  // Progress table controls
  @ViewChild('progressPaginator', { static: false }) progressPaginator!: MatPaginator;
  @ViewChild('progressSort', { static: false }) progressSort!: MatSort;

  // Unique-students tables controls
  @ViewChild('paginator001', { static: false }) paginator001!: MatPaginator;
  @ViewChild('sort001', { static: false }) sort001!: MatSort;
  @ViewChild('paginator002', { static: false }) paginator002!: MatPaginator;
  @ViewChild('sort002', { static: false }) sort002!: MatSort;

  constructor(
    private firebaseDataService: FirebaseDataService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private consoleService: ConsoleService
  ) {}

  ngOnInit() {
    console.log('Dashboard component initialized');
    this.loadData();
    this.loadSessionResults();
  }

  ngAfterViewInit() {
    console.log('AfterViewInit called');

    // ✅ Wire paginators for the *session results* tables (0001/0002)
    // (ensure these are set once view is ready)
    if (this.paginator0001) this.session0001DataSource.paginator = this.paginator0001;
    if (this.paginator0002) this.session0002DataSource.paginator = this.paginator0002;

    // ✅ Set up other paginators/sorts (unique-students + progress)
    this.setupAllPaginatorsAndSorts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setupAllPaginatorsAndSorts() {
    console.log('Setting up all paginators and sorts');
    this.setupSessionPaginatorsAndSort();
    this.setupProgressPaginator();
  }

  // Unique-students tables (001/002)
  private setupSessionPaginatorsAndSort() {
    console.log('Setting up session paginators and sort');

    if (this.paginator001) {
      this.dataSource001.paginator = this.paginator001;
      console.log('Paginator001 connected');
    } else {
      console.log('Paginator001 not available');
    }

    if (this.sort001) {
      this.dataSource001.sort = this.sort001;
      console.log('Sort001 connected');
    } else {
      console.log('Sort001 not available');
    }

    if (this.paginator002) {
      this.dataSource002.paginator = this.paginator002;
      console.log('Paginator002 connected');
    } else {
      console.log('Paginator002 not available');
    }

    if (this.sort002) {
      this.dataSource002.sort = this.sort002;
      console.log('Sort002 connected');
    } else {
      console.log('Sort002 not available');
    }
  }

  // Progress table
  private setupProgressPaginator() {
    console.log('Setting up progress paginator');
    if (!this.showProgressSection) return;

    if (this.progressPaginator) {
      this.progressDataSource.paginator = this.progressPaginator;
      console.log('Progress Paginator connected');
    } else {
      console.log('Progress Paginator not available');
    }

    if (this.progressSort) {
      this.progressDataSource.sort = this.progressSort;
      console.log('Progress Sort connected');
    } else {
      console.log('Progress Sort not available');
    }
  }

  loadData() {
    console.log('Starting to load data');
    this.isLoadingResults = true;
    this.isRateLimitReached = false;
    this.debugInfo.lastError = '';

    let completedRequests = 0;
    const totalRequests = 2;

    const checkAllLoaded = () => {
      completedRequests++;
      console.log(`Completed requests: ${completedRequests}/${totalRequests}`);

      if (completedRequests >= totalRequests) {
        this.isLoadingResults = false;
        console.log('All data loaded, analyzing progress and setting up paginators');

        // Analyze student progress first
        this.analyzeStudentProgress();

        // Force change detection
        this.cdr.detectChanges();

        // Setup paginators after data is loaded and DOM is updated
        setTimeout(() => {
          this.setupAllPaginatorsAndSorts();
          this.cdr.detectChanges();
        }, 100);
      }
    };

    // Load Session 001 data (unique students)
    console.log('Subscribing to session 001 data');
    const sub001 = this.firebaseDataService.getUniqueStudentsBySession(1).subscribe({
      next: (data: StudentSummary[]) => {
        console.log('Session 001 data received:', data);
        this.debugInfo.session001Loaded = true;
        this.debugInfo.session001Count = data ? data.length : 0;

        if (data && Array.isArray(data)) {
          this.dataSource001.data = data;
          this.resultsLength001 = data.length;
          console.log(`Session 001: ${data.length} records loaded`);
        } else {
          console.warn('Session 001 data is not an array:', data);
          this.dataSource001.data = [];
          this.resultsLength001 = 0;
        }

        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading session 001:', error);
        this.debugInfo.lastError = `Session 001 error: ${error.message || error}`;
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.cdr.detectChanges();
      }
    });

    // Load Session 002 data (unique students)
    console.log('Subscribing to session 002 data');
    const sub002 = this.firebaseDataService.getUniqueStudentsBySession(2).subscribe({
      next: (data: StudentSummary[]) => {
        console.log('Session 002 data received:', data);
        this.debugInfo.session002Loaded = true;
        this.debugInfo.session002Count = data ? data.length : 0;

        if (data && Array.isArray(data)) {
          this.dataSource002.data = data;
          this.resultsLength002 = data.length;
          console.log(`Session 002: ${data.length} records loaded`);
        } else {
          console.warn('Session 002 data is not an array:', data);
          this.dataSource002.data = [];
          this.resultsLength002 = 0;
        }

        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading session 002:', error);
        this.debugInfo.lastError = `Session 002 error: ${error.message || error}`;
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.cdr.detectChanges();
      }
    });

    this.subscription.add(sub001);
    this.subscription.add(sub002);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource001.filter = filterValue.trim().toLowerCase();
    this.dataSource002.filter = filterValue.trim().toLowerCase();

    if (this.dataSource001.paginator) this.dataSource001.paginator.firstPage();
    if (this.dataSource002.paginator) this.dataSource002.paginator.firstPage();
  }

  filterBySession() {
    this.cdr.detectChanges();
    if (this.dataSource001.paginator) this.dataSource001.paginator.firstPage();
    if (this.dataSource002.paginator) this.dataSource002.paginator.firstPage();
  }


  openDialog(studentId: string, sessionNumber: number): void {
    const dialogRef = this.dialog.open(StudentDetailComponent, {
      minWidth: '95vw',
      data: { studentId, sessionNumber }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  private analyzeStudentProgress() {
    console.log('Analyzing student progress...');

    const studentMap = new Map<string, StudentProgress>();

    // Session 001 students
    this.dataSource001.data.forEach(student => {
      if (!studentMap.has(student.studentId)) {
        studentMap.set(student.studentId, {
          studentId: student.studentId,
          session001Data: student,
          hasSession001: true,
          hasSession002: false,
          hasBothSessions: false,
          progressStatus: 'incomplete'
        });
      }
    });

    // Session 002 students
    this.dataSource002.data.forEach(student => {
      if (studentMap.has(student.studentId)) {
        const existing = studentMap.get(student.studentId)!;
        existing.session002Data = student;
        existing.hasSession002 = true;
        existing.hasBothSessions = true;
        existing.progressStatus = this.calculateProgressStatus(existing.session001Data!, student);
      } else {
        studentMap.set(student.studentId, {
          studentId: student.studentId,
          session002Data: student,
          hasSession001: false,
          hasSession002: true,
          hasBothSessions: false,
          progressStatus: 'new'
        });
      }
    });

    this.studentProgressData = Array.from(studentMap.values());
    this.progressDataSource.data = this.studentProgressData;

    this.calculateProgressStats();
    console.log('Progress analysis complete:', this.progressStats);
  }

  private calculateProgressStatus(session001: StudentSummary, session002: StudentSummary): 'improved' | 'declined' | 'same' {
    // Placeholder logic - replace with actual comparison metrics
    const session001Score = this.getStudentScore(session001);
    const session002Score = this.getStudentScore(session002);

    if (session002Score > session001Score) return 'improved';
    if (session002Score < session001Score) return 'declined';
    return 'same';
  }

  private getStudentScore(student: StudentSummary): number {
    // TODO: replace with your real scoring logic
    return Math.random() * 100;
  }

  private calculateProgressStats() {
    const stats = this.progressStats;
    stats.totalStudents = this.studentProgressData.length;
    stats.studentsInBothSessions = this.studentProgressData.filter(s => s.hasBothSessions).length;
    stats.newStudentsInSession002 = this.studentProgressData.filter(s => s.progressStatus === 'new').length;
    stats.droppedStudentsFromSession001 = this.studentProgressData.filter(s => s.hasSession001 && !s.hasSession002).length;
    stats.improvedStudents = this.studentProgressData.filter(s => s.progressStatus === 'improved').length;
    stats.declinedStudents = this.studentProgressData.filter(s => s.progressStatus === 'declined').length;
    stats.samePerformance = this.studentProgressData.filter(s => s.progressStatus === 'same').length;

    const studentsWithBothSessions = this.studentProgressData.filter(s => s.hasBothSessions);
    if (studentsWithBothSessions.length > 0) {
      stats.averageProgressRate = (stats.improvedStudents / studentsWithBothSessions.length) * 100;
    }
  }

  toggleProgressSection() {
    this.showProgressSection = !this.showProgressSection;
    this.cdr.detectChanges();

    if (this.showProgressSection) {
      setTimeout(() => {
        this.setupProgressPaginator();
        this.cdr.detectChanges();
      }, 200);
    }
  }

  getProgressStatusIcon(status: string): string {
    switch (status) {
      case 'improved': return 'trending_up';
      case 'declined': return 'trending_down';
      case 'same': return 'trending_flat';
      case 'new': return 'person_add';
      case 'incomplete': return 'help_outline';
      default: return 'help_outline';
    }
  }
  getProgressStatusText(status: string): string {
    switch (status) {
      case 'improved': return 'Improved';
      case 'declined': return 'Declined';
      case 'same': return 'Same';
      case 'new': return 'New Student';
      case 'incomplete': return 'Missing Session';
      default: return status;
    }
  }

  applyProgressFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.progressDataSource.filter = filterValue.trim().toLowerCase();
    if (this.progressDataSource.paginator) this.progressDataSource.paginator.firstPage();
  }

  openProgressDialog(studentId: string): void {
    const student = this.studentProgressData.find(s => s.studentId === studentId);
    if (student) {
      const dialogRef = this.dialog.open(StudentDetailComponent, {
        minWidth: '95vw',
        data: {
          studentId,
          sessionNumber: student.hasSession002 ? 2 : 1,
          progressData: student
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('Progress dialog was closed');
      });
    }
  }

  // ---------- Session Results (0001 / 0002) ----------
  loadSessionResults() {
    this.consoleService.getResultsBySession("001").subscribe(results => {
      console.log(results);
      this.session0001DataSource.data = results;

      // ensure paginator is attached after async update
      Promise.resolve().then(() => {
        if (this.paginator0001) this.session0001DataSource.paginator = this.paginator0001;
      });
    });

    this.consoleService.getResultsBySession("002").subscribe(results => {
      console.log(results);
      this.session0002DataSource.data = results;

      Promise.resolve().then(() => {
        if (this.paginator0002) this.session0002DataSource.paginator = this.paginator0002;
      });
    });

    this.consoleService.getAllResults().subscribe(r => {
      console.log(r);
    });
  }

  downloadResultsJson(): void {
    this.consoleService.getAllResults().subscribe(results => {
      const jsonData = JSON.stringify(results, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-results.json';
      a.click();

      URL.revokeObjectURL(url);
    });
  }
}
