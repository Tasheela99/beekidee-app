import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-console-context',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './console-context.component.html',
  styleUrl: './console-context.component.scss'
})
export class ConsoleContextComponent {

}
