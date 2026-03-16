import { Component } from '@angular/core';
import {LessonsComponent} from "../lessons/lessons.component";

@Component({
  selector: 'app-lessons-context',
  standalone: true,
  imports: [
    LessonsComponent
  ],
  templateUrl: './lessons-context.component.html',
  styleUrl: './lessons-context.component.scss'
})
export class LessonsContextComponent {

}
