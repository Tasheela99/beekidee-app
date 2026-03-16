import {Component, inject} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NgClass, NgIf, CommonModule} from "@angular/common";
import { Auth, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {AnimationDialogComponent} from "../../../../../../../../components/animation-dialog/animation-dialog.component";
import {MatButton} from "@angular/material/button";
import {
  SaveResultsPopUpComponent
} from "../../../../../../../../components/save-results-pop-up/save-results-pop-up.component";
import {ConsoleService} from "../../../../../../../../services/console.service";

@Component({
  selector: 'app-pre-intermediate-level',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    CdkDropListGroup,
    CommonModule,
    MatButton
  ],
  templateUrl: './pre-intermediate-level.component.html',
  styleUrl: './pre-intermediate-level.component.scss'
})
export class PreIntermediateLevelComponent {
  items: string[] = [];
  videoId: string = '';
  basket: string[] = [];
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  showCamera = true;

  // Marking system properties
  totalMarks = 0;
  maxMarksPerQuestion = 10;
  currentUser$: Observable<any>;
  userUid: string | null = null;

  dialog = inject(MatDialog);
  private auth = inject(Auth);
  private consoleService = inject(ConsoleService);

  constructor() {
    this.currentUser$ = user(this.auth);
    this.currentUser$.subscribe(user => {
      this.userUid = user ? user.uid : null;
      console.log('Current user UID:', this.userUid);
    });
  }

  toggleCameraVisibility() {
    this.showCamera = !this.showCamera;
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('Drop event triggered', event);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data === this.basket) {
        if (this.basket.length > 0) {
          this.items.push(...this.basket);
          this.basket = [];
        }

        transferArrayItem(
          event.previousContainer.data,
          this.basket,
          event.previousIndex,
          0
        );

        if (this.basket.length > 1) {
          const latestItem = this.basket.pop()!;
          this.items.push(...this.basket);
          this.basket = [latestItem];
        }
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    console.log('Items after drop:', this.items);
    console.log('Basket after drop:', this.basket);

    this.checkAnswer();
  }

  checkAnswer() {
    if (this.basket.length === 1 && this.basket[0] === this.searchItem) {
      this.itemFound = true;
    } else {
      this.itemFound = false;
    }
    this.setAlerts(this.itemFound);
  }

  setAlerts(answer: boolean) {
    this.isAnswerCorrect = answer;

    // Show animation dialog
    this.openAnimationDialog(answer);

    if (answer) {
      this.awardMarks();
      setTimeout(() => {
        this.moveToNext();
      }, 3500);
    } else {
      setTimeout(() => {
        this.reset();
      }, 3500);
    }
  }

  private awardMarks(): void {
    this.totalMarks += this.maxMarksPerQuestion;

    console.log('=== CORRECT ANSWER LOGGED ===');
    console.log('User UID:', this.userUid);
    console.log('Question Number:', this.counter + 1);
    console.log('Correct Answer:', this.searchItem);
    console.log('Marks Awarded:', this.maxMarksPerQuestion);
    console.log('Total Marks:', this.totalMarks);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=============================');

    this.logAnswerToFirebase();
  }

  private logAnswerToFirebase(): void {
    const answerLog = {
      userUid: this.userUid,
      questionNumber: this.counter + 1,
      correctAnswer: this.searchItem,
      marksAwarded: this.maxMarksPerQuestion,
      totalMarks: this.totalMarks,
      timestamp: new Date().toISOString(),
      gameType: 'pre-intermediate-level'
    };

    console.log('Answer log ready for Firebase:', answerLog);
  }

  private openAnimationDialog(isCorrect: boolean): void {
    const dialogRef = this.dialog.open(AnimationDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100vh',
      width: '100vw',
      panelClass: 'fullscreen-dialog',
      disableClose: true,
      data: { isCorrect }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Animation dialog closed');
    });
  }

  dataList: any = [
    {
      itemlist: ['3', '2', '4'],
      searchItem: '3',
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/new-tree.png?alt=media&token=84dee878-9293-439c-91c3-ad9a76c3c81e'
    },
    {
      itemlist: ['5', '2', '4'],
      searchItem: '4',
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/new-tree.png?alt=media&token=84dee878-9293-439c-91c3-ad9a76c3c81e'
    },
    {
      itemlist: ['5', '2', '1', '4', '3'],
      searchItem: '5',
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/new-tree.png?alt=media&token=84dee878-9293-439c-91c3-ad9a76c3c81e'
    },
  ];

  start() {
    this.items = this.shuffleArray([...this.dataList[0].itemlist]);
    this.searchItem = this.dataList[0].searchItem;
    this.isStarted = true;
    this.basket = [];
    this.totalMarks = 0;
    const outerDiv = document.querySelector('.outer');
    if (outerDiv) {
      outerDiv.classList.add('started');
    }

    console.log('Game started by user:', this.userUid);
  }

  moveToNext() {
    if (this.counter + 1 < this.dataList.length) {
      this.counter += 1;
      this.reset();
      this.items = this.shuffleArray([...this.dataList[this.counter].itemlist]);
      this.searchItem = this.dataList[this.counter].searchItem;
    } else {
      console.log('All questions completed! User can now finish the game manually.');
      // Don't automatically finish - let user click finish button
      // Just reset for the current question
      this.reset();
    }
  }

  // NEW METHOD: Finish the game manually
  finishGame(): void {
    console.log('Game finished manually by user:', this.userUid);
    this.logGameCompletion();
    this.reStartGame();
  }

  private logGameCompletion(): void {
    const questionsAttempted = this.counter + 1;
    const correctAnswers = this.totalMarks / this.maxMarksPerQuestion;
    const accuracy = questionsAttempted > 0 ? (correctAnswers / questionsAttempted) * 100 : 0;
    const isNaturalCompletion = questionsAttempted === this.dataList.length;

    console.log('=== GAME COMPLETED ===');
    console.log('User UID:', this.userUid);
    console.log('Questions Attempted:', questionsAttempted);
    console.log('Correct Answers:', correctAnswers);
    console.log('Final Total Marks:', this.totalMarks);
    console.log('Total Questions Available:', this.dataList.length);
    console.log('Max Possible Marks:', this.dataList.length * this.maxMarksPerQuestion);
    console.log('Accuracy:', accuracy.toFixed(2) + '%');
    console.log('Overall Percentage:', ((this.totalMarks / (this.dataList.length * this.maxMarksPerQuestion)) * 100).toFixed(2) + '%');
    console.log('Completion Time:', new Date().toISOString());
    console.log('Game Status:', isNaturalCompletion ? 'Completed All Questions' : 'Finished Early');
    console.log('Completion Method:', isNaturalCompletion ? 'Natural' : 'Manual');
    console.log('=====================');

    const gameResult = {
      userUid: this.userUid,
      questionsAttempted: questionsAttempted,
      correctAnswers: correctAnswers,
      totalMarks: this.totalMarks,
      maxPossibleMarks: this.dataList.length * this.maxMarksPerQuestion,
      accuracy: accuracy,
      overallPercentage: ((this.totalMarks / (this.dataList.length * this.maxMarksPerQuestion)) * 100),
      totalQuestions: this.dataList.length,
      completionTime: new Date().toISOString(),
      gameType: 'pre-intermediate-level',
      gameStatus: isNaturalCompletion ? 'completed_all' : 'finished_early',
      completionMethod: isNaturalCompletion ? 'natural' : 'manual'
    };

    console.log('Game result ready for Firebase:', gameResult);
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.basket = [];
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.items = [];
    this.searchItem = '';
    this.totalMarks = 0;
    const outerDiv = document.querySelector('.outer');
    if (outerDiv) {
      outerDiv.classList.remove('started');
    }
  }

  extractVideoId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement?.value || '';
    const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    this.videoId = videoIdMatch ? videoIdMatch[1] : '';
  }

  private shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  get selectedAnswer(): string | null {
    return this.basket.length === 1 ? this.basket[0] : null;
  }

  get hasSelectedAnswer(): boolean {
    return this.basket.length === 1;
  }

  get currentTotalMarks(): number {
    return this.totalMarks;
  }

  get maxPossibleMarks(): number {
    return this.dataList.length * this.maxMarksPerQuestion;
  }

  getTreeCount(): number {
    if (this.counter === 0) return 3;
    if (this.counter === 1) return 4;
    if (this.counter === 2) return 5;
    return 3; // Default to 3 if counter is out of bounds
  }

  getTreeArray(): number[] {
    return Array(this.getTreeCount()).fill(0).map((_, index) => index);
  }

  openSaveResultDialog() {
    const dialogRef = this.dialog.open(SaveResultsPopUpComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consoleService.saveResults(result).subscribe({
          next: () => alert('Result saved!'),
          error: err => alert('Error saving result: ' + err)
        });
      }
    });
  }
}
