import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from "@angular/material/card";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { NgForOf, NgIf } from "@angular/common";
import { ConsoleService } from "../../../../../../services/console.service";

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    CarouselModule,
    MatCardModule,
    MatCardHeader,
    NgForOf,
    NgIf
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit {

  private consoleService = inject(ConsoleService);

  lessons: any[] = [];
  selectedLesson: any | null = null;

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
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
  }

  fetchLessons(): void {
    this.consoleService.getLessonsByLevelTypeAndSubject("PRE_INTERMEDIATE", "PLAIN_TASK", "අංක")
      .then((lessons: any[]) => {
        console.log(lessons)
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
}
