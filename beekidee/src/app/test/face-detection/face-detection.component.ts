import {Component, ViewChild, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-face-detection',
  standalone: true,
  imports: [],
  template: `
    <video #videoElement autoplay muted width="640" height="480"></video>
    <canvas #canvasElement width="640" height="480" style="position: absolute; top: 0; left: 0;"></canvas>
  `,
  styles: [],
})
export class FaceDetectionComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  modelsLoaded = false; // Add a flag

  async ngAfterViewInit() {
    await this.loadModels();
    if (this.modelsLoaded) {
      this.startVideo();
    }
  }

  async loadModels() {
    try {
      // Load all required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models')
      ]);

      console.log('All models loaded successfully');
      this.modelsLoaded = true;
    } catch (error) {
      console.error('Error loading models:', error);
      this.modelsLoaded = false;
    }
  }

  async startVideo() {
    if (!this.modelsLoaded) {
      console.error('Models not loaded. Cannot start video.');
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener('play', async () => {
          const displaySize = { width: video.width, height: video.height };
          faceapi.matchDimensions(canvas, displaySize);
          setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          }, 100);
        });
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  }
}
