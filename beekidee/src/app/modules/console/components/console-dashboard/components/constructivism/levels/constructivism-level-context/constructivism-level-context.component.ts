import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-constructivism-level-context',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,
    MatButton,
    MatCard,
    MatCardContent],
  templateUrl: './constructivism-level-context.component.html',
  styleUrl: './constructivism-level-context.component.scss'
})
export class ConstructivismLevelContextComponent {

}

