import {Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-draggable-camera',
  standalone: true,
  imports: [
    CdkDrag,
    MatButton,
    MatIcon,
    NgIf,
    CdkDragHandle,
    MatIconButton
  ],
  templateUrl: './draggable-camera.component.html',
  styleUrls: ['./draggable-camera.component.scss']
})
export class DraggableCameraComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  isActive = false;
  showCamera = true;
  private stream: MediaStream | null = null;
  modelsLoaded = false;
  faceDetectionInterval: any;
  startTime: number = 0;
  expressionsHistory: string[] = [];
  expressionCounts: any = {
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    neutral: 0,
    fearful: 0,
    disgusted: 0
  };
  lastExpressionTime: number = 0;

  ngOnInit() {
    this.requestCameraPermission();
  }

  ngAfterViewInit() {
    this.loadModels();
  }

  ngOnDestroy() {
    this.stopCamera();
    this.stopFaceDetection();
  }

  async loadModels() {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
      ]);
      console.log('All models loaded successfully');
      this.modelsLoaded = true;
      if (this.isActive) {
        this.startFaceDetection();
      }
    } catch (error) {
      console.error('Error loading models:', error);
      this.modelsLoaded = false;
    }
  }

  async requestCameraPermission() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({video: true});
      this.videoElement.nativeElement.srcObject = this.stream;
      this.videoElement.nativeElement.play();
      this.isActive = true;
      if (this.modelsLoaded) {
        this.startFaceDetection();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  toggleCamera() {
    if (this.isActive) {
      this.stopCamera();
      this.stopFaceDetection();
    } else {
      this.requestCameraPermission();
    }
    this.isActive = !this.isActive;
  }

  closeCamera() {
    this.showCamera = false;
    this.stopCamera();
    this.stopFaceDetection();
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private stopFaceDetection() {
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
      this.videoElement.nativeElement.style.border = 'none';
      this.videoElement.nativeElement.style.boxShadow = 'none';
    }
  }

  async startFaceDetection() {
    if (!this.modelsLoaded || !this.isActive) {
      return;
    }

    const video = this.videoElement.nativeElement;
    this.startTime = Date.now();

    this.faceDetectionInterval = setInterval(async () => {
      const detectionsWithExpressions = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detectionsWithExpressions.length > 0) {
        console.log('Face detected!');
        video.style.border = '2px solid green';

        const expressions: faceapi.FaceExpressions = detectionsWithExpressions[0].expressions;

        const expressionsObject = {
          angry: expressions.angry,
          disgusted: expressions.disgusted,
          fearful: expressions.fearful,
          happy: expressions.happy,
          neutral: expressions.neutral,
          sad: expressions.sad,
          surprised: expressions.surprised
        };

// Make sure the expression values are numbers
        const dominantExpression = Object.keys(expressionsObject).reduce((a, b) => {
          return expressionsObject[a as keyof typeof expressionsObject] > expressionsObject[b as keyof typeof expressionsObject]
            ? a
            : b;
        });

        // Store the expression in history
        this.expressionsHistory.push(dominantExpression);
        this.expressionCounts[dominantExpression] += 1;

        // Check if 10 seconds have passed
        const currentTime = Date.now();
        if (currentTime - this.startTime >= 10000) {
          this.calculateAverageExpression();
          this.startTime = currentTime; // Reset start time for the next 10-second window
        }

        console.log('Dominant Expression:', dominantExpression);
        console.log('Expression Probabilities:', expressions);

        if (dominantExpression === 'happy') {
          video.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.8)';
        } else if (dominantExpression === 'sad') {
          video.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.8)';
        } else if (dominantExpression === 'angry') {
          video.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
        } else {
          video.style.boxShadow = 'none';
        }
      } else {
        video.style.border = 'none';
        video.style.boxShadow = 'none';
      }
    }, 100);
  }

  calculateAverageExpression() {
    const totalExpressions: number = (Object.values(this.expressionCounts) as number[]).reduce((sum: number, count: number) => sum + count, 0);

    let maxProbability = 0;
    let averageExpression = 'neutral';

    for (const expression in this.expressionCounts) {
      const probability = this.expressionCounts[expression as keyof typeof this.expressionCounts] / totalExpressions;
      if (probability > maxProbability) {
        maxProbability = probability;
        averageExpression = expression;
      }
    }

    console.log('Average Expression in Last 10 seconds:', averageExpression);
  }
}
