import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import * as faceapi from 'face-api.js';
import {FaceDetectionComponent} from "./test/face-detection/face-detection.component";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  private auth = inject(AuthService);

  async ngAfterViewInit() {
    try {
      await this.auth.initializeAdmin();
      console.log('Admin initialization complete');
    } catch (error) {
      console.error('Admin initialization failed:', error);
    }
  }

  title = 'beekidee';

}
