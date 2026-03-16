import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AuthService} from "../../../../services/auth.service";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatList, MatListItem} from "@angular/material/list";
import {NgOptimizedImage} from "@angular/common";
import {StudentNamePopupComponent} from "../../../../components/student-name-popup/student-name-popup.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-console-dashboard',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatButton,
    MatDrawerContainer,
    MatDrawer,
    MatList,
    MatListItem,
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    RouterLinkActive,
    StudentNamePopupComponent
  ],
  templateUrl: './console-dashboard.component.html',
  styleUrl: './console-dashboard.component.scss'
})
export class ConsoleDashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.signOut().then(()=>{
      this.router.navigateByUrl('/security/sign-in');
    })
  }

  goToOverview() {
    this.router.navigate(['/console/admin/dashboard/overview']);
  }

  readonly dialog = inject(MatDialog);

  openPopup(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    const dialogRef = this.dialog.open(StudentNamePopupComponent, {
      width: '100vh',
      height: '100vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
