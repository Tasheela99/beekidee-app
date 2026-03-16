import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {LessonsContextComponent} from "./components/lessons-context/lessons-context.component";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatList, MatListItem} from "@angular/material/list";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-kids-dashboard',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    LessonsContextComponent,
    MatButton,
    MatDrawer,
    MatDrawerContainer,
    MatList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './kids-dashboard.component.html',
  styleUrl: './kids-dashboard.component.scss'
})
export class KidsDashboardComponent {

  private router = inject(Router)

  logout() {
    this.router.navigate(['/security/sign-in']);
  }

  openPopup(s: string, s2: string) {

  }
}
