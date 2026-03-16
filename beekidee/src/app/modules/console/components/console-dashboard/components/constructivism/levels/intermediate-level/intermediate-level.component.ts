import { Component, inject } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Observable } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import { ConsoleService } from '../../../../../../../../services/console.service';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { AnimationDialogComponent } from "../../../../../../../../components/animation-dialog/animation-dialog.component";
import { ErrorDialogComponent } from '../../../../../../../../components/error-dialog/error-dialog.component';
import { NgClass, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  SaveResultsPopUpComponent
} from "../../../../../../../../components/save-results-pop-up/save-results-pop-up.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-medium-level',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    FormsModule,
    CdkDropListGroup,
    MatButton
  ],
  templateUrl: './intermediate-level.component.html',
  styleUrl: './intermediate-level.component.scss'
})
export class IntermediateLevelComponent {
  items: string[] = [];
  basket: string[] = [];
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  errorMessage: string = '';
  totalMarks = 0;
  maxMarksPerQuestion = 10;
  currentUser$: Observable<any>;
  userUid: string | null = null;
  gameStartTime: string | null = null;

  dialog = inject(MatDialog);
  private auth = inject(Auth);
  private consoleService = inject(ConsoleService);

  wrongAnswerCount: number = 0;

  constructor() {
    this.currentUser$ = user(this.auth);
    this.currentUser$.subscribe(user => {
      this.userUid = user ? user.uid : null;
      console.log('Current user UID:', this.userUid);
    });
  }

  dataList: any = [
    {
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
      searchItem: 'A',
      correctCount: 7
    },
    {
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
      searchItem: 'B',
      correctCount: 5
    },
    {
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
      searchItem: 'C',
      correctCount: 4
    },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const itemBeingMoved = event.previousContainer.data[event.previousIndex];
      if (event.container.data === this.basket) {
        if (this.basket.length > 0) {
          this.items.push(...this.basket);
        }
        this.basket = [];
        transferArrayItem(
          event.previousContainer.data,
          this.basket,
          event.previousIndex,
          0
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
    this.checkAnswer();
  }

  checkAnswer() {
    const correctCount = this.dataList[this.counter].correctCount;
    if (this.basket.length === 1 && parseInt(this.basket[0]) === correctCount) {
      this.itemFound = true;
      this.wrongAnswerCount = 0;
    } else {
      this.itemFound = false;
      this.wrongAnswerCount += 1;
    }

    this.setAlerts(this.itemFound);
    if (this.wrongAnswerCount >= 2) {
      this.showErrorDialog();
    }
  }

  setAlerts(answer: boolean) {
    this.isAnswerCorrect = answer;
    this.openAnimationDialog(
      answer,
      answer ?
        'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fhappy-start.webm?alt=media&token=f369ae30-66d3-4642-9c03-8405c18bf203' :
        'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fnot-correct.webm?alt=media&token=fc447df6-587a-4429-a56e-9f178fe12073'
    );

    if (answer) {
      this.awardMarks();
      setTimeout(() => {
        this.moveToNext();
      }, 3000);
    } else {
      setTimeout(() => {
        this.reset();
      }, 3000);
    }
  }

  private awardMarks(): void {
    this.totalMarks += this.maxMarksPerQuestion;

    console.log('=== CORRECT ANSWER LOGGED ===');
    console.log('User UID:', this.userUid);
    console.log('Question Number:', this.counter + 1);
    console.log('Correct Answer:', this.dataList[this.counter].correctCount);
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
      correctAnswer: this.dataList[this.counter].correctCount,
      marksAwarded: this.maxMarksPerQuestion,
      totalMarks: this.totalMarks,
      timestamp: new Date().toISOString(),
      gameType: 'intermediate-level'
    };

    if (this.userUid) {
      this.consoleService.logAnswer(answerLog)
        .subscribe({
          next: () => console.log('Answer log saved successfully'),
          error: (error) => console.error('Error saving answer log:', error)
        });
    } else {
      console.warn('Cannot log answer: userUid is missing');
    }
  }

  private showErrorDialog(): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Error dialog closed');
      this.reset();
    });
  }

  private openAnimationDialog(isCorrect: boolean, animationUrl: string): void {
    const dialogRef = this.dialog.open(AnimationDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100vh',
      width: '100vw',
      panelClass: 'fullscreen-dialog',
      data: {isCorrect, animationUrl}
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Animation dialog closed');
    });
  }

  start() {
    this.gameStartTime = new Date().toISOString();
    this.items = this.shuffleArray(['1', '4', '5', '7']);
    this.searchItem = this.dataList[0].searchItem;
    this.isStarted = true;
    this.basket = [];
    this.totalMarks = 0;
    this.errorMessage = '';
    const outerDiv = document.querySelector('.outer');
    if (outerDiv) {
      outerDiv.classList.add('started');
    }
  }

  moveToNext() {
    if (this.counter + 1 < this.dataList.length) {
      this.counter += 1;
      this.reset();
      this.items = this.shuffleArray(['1', '4', '5', '7']);
      this.searchItem = this.dataList[this.counter].searchItem;
      const outerDiv = document.querySelector('.outer');
      if (outerDiv) {
        outerDiv.classList.add('started');
      }
    } else {
      this.logGameCompletion();
      this.reset();
    }
  }

  finishGame(): void {
    this.logGameCompletion();
    this.reStartGame();
  }

  private logGameCompletion(): void {
    if (this.userUid && this.gameStartTime) {
      const gameEndTime = new Date().toISOString();
      const questionsAttempted = this.counter + 1;
      const correctAnswers = this.totalMarks / this.maxMarksPerQuestion;
      const accuracy = questionsAttempted > 0 ? (correctAnswers / questionsAttempted) * 100 : 0;
      const isNaturalCompletion = questionsAttempted === this.dataList.length;

      const gameResult = {
        userUid: this.userUid,
        questionsAttempted: questionsAttempted,
        correctAnswers: correctAnswers,
        totalMarks: this.totalMarks,
        maxPossibleMarks: this.dataList.length * this.maxMarksPerQuestion,
        accuracy: accuracy,
        overallPercentage: ((this.totalMarks / (this.dataList.length * this.maxMarksPerQuestion)) * 100),
        totalQuestions: this.dataList.length,
        completionTime: gameEndTime,
        gameStartTime: this.gameStartTime,
        gameType: 'intermediate-level',
        gameStatus: isNaturalCompletion ? 'completed_all' : 'finished_early',
        completionMethod: isNaturalCompletion ? 'natural' : 'manual'
      };

      this.consoleService.logGameCompletion(gameResult)
        .subscribe({
          next: () => console.log('Game result saved successfully'),
          error: (error) => console.error('Error saving game result:', error)
        });
    } else {
      console.warn('Cannot log game completion: userUid or gameStartTime is missing');
    }
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.basket = [];
    this.errorMessage = '';
    this.wrongAnswerCount = 0;
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.items = [];
    this.searchItem = '';
    this.totalMarks = 0;
    this.gameStartTime = null;
    const outerDiv = document.querySelector('.outer');
    if (outerDiv) {
      outerDiv.classList.remove('started');
    }
  }

  onImageError(event: Event) {
    this.errorMessage = 'Error loading image. Please check the URL or try again later.';
  }

  private shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  openSaveResultDialog(): void {
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
