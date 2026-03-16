import { Component, inject, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { YOUTUBE_PLAYER_CONFIG, YouTubePlayer } from "@angular/youtube-player";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { AnimationDialogComponent } from "../../../../../../components/animation-dialog/animation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { DraggableCameraComponent } from "../../../../../../components/draggable-camera/draggable-camera.component";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { ConsoleService } from "../../../../../../services/console.service";

@Component({
  selector: 'app-plain-tasks',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgForOf,
    NgIf,
    MatButton,
    YouTubePlayer,
    MatInput,
    MatFormField,
    MatLabel,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    NgClass,
    CdkDropListGroup,
    DraggableCameraComponent,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatIconModule,
    MatCardModule,
    RouterOutlet,
    CarouselModule
  ],
  providers: [{
    provide: YOUTUBE_PLAYER_CONFIG,
    useValue: {
      loadApi: true
    }
  }],
  templateUrl: './constructivism-plus-attention.component.html',
  styleUrl: './constructivism-plus-attention.component.scss'
})
export class ConstructivismPlusAttentionComponent implements OnInit {
  videoId: string = '';
  items = [''];
  basket = [''];
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  showCamera = true;
  lessons: any[] = [];
  selectedLesson: any | null = null;

  dialog = inject(MatDialog);
  private consoleService = inject(ConsoleService);

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 5,
    navSpeed: 700,
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 }
    },
  };

  ngOnInit(): void {
    this.fetchLessons();
    this.start();
  }

  fetchLessons(): void {
    this.consoleService.getLessonsByLevelTypeAndSubject("PRE_INTERMEDIATE", "PLAIN_TASK", "අංක")
      .then((lessons: any[]) => {
        console.log(lessons);
        this.lessons = lessons;
        this.selectedLesson = lessons.length > 0 ? lessons[0] : null;
      })
      .catch(error => {
        console.error("Failed to fetch lessons:", error);
      });
  }

  selectLesson(lesson: any): void {
    this.selectedLesson = lesson;
  }

  toggleCameraVisibility() {
    this.showCamera = !this.showCamera;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.checkAnswer();
  }

  checkAnswer() {
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i] === this.searchItem) {
        this.itemFound = true;
        this.setAlerts(this.itemFound);
        break;
      } else {
        this.setAlerts(this.itemFound);
      }
    }
  }

  setAlerts(answer: boolean) {
    if (answer) {
      console.log(`${this.searchItem} is available in the items array.`);
      this.isAnswerCorrect = true;
      this.openAnimationDialog(true, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fhappy-start.webm?alt=media&token=f369ae30-66d3-4642-9c03-8405c18bf203');
      setTimeout(() => {
        this.moveToNext();
      }, 3000);
    } else {
      console.log(`${this.searchItem} is not available in the items array.`);
      this.openAnimationDialog(false, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fnot-correct.webm?alt=media&token=fc447df6-587a-4429-a56e-9f178fe12073');
    }
  }

  private openAnimationDialog(isCorrect: boolean, animationUrl: string): void {
    const dialogRef = this.dialog.open(AnimationDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100vh',
      width: '100vw',
      panelClass: 'fullscreen-dialog',
      data: { isCorrect, animationUrl }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Animation dialog closed');
    });
  }

  dataList: any = [
    {
      itemlist: ['Carrots', 'Tomatoes', 'Onions', 'Apples', 'Avocados', 'Bananas'],
      searchItem: 'Onions'
    },
    {
      itemlist: ['Red', 'Green', 'Blue', 'Yellow', 'White', 'Black'],
      searchItem: 'Blue'
    },
    {
      itemlist: ['1', '10', '20', '30', '50', '60'],
      searchItem: '50'
    },
  ];

  start() {
    this.items = this.dataList[0].itemlist;
    this.searchItem = this.dataList[0].searchItem;
    this.isStarted = true;
  }

  moveToNext() {
    this.counter += 1;
    this.reset();
    this.items = this.dataList[this.counter].itemlist;
    this.searchItem = this.dataList[this.counter].searchItem;
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.items = [];
    this.searchItem = '';
    this.basket = [];
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.dataList = [
      {
        itemlist: ['Carrots', 'Tomatoes', 'Onions', 'Apples', 'Avocados', 'Bananas'],
        searchItem: 'Onions'
      },
      {
        itemlist: ['Red', 'Green', 'Blue', 'Yellow', 'White', 'Black'],
        searchItem: 'Blue'
      },
      {
        itemlist: ['1', '10', '20', '30', '50', '60'],
        searchItem: '50'
      },
    ];
  }

  extractVideoId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement?.value || '';
    const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    this.videoId = videoIdMatch ? videoIdMatch[1] : '';
  }
}
