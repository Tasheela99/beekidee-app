import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf, NgClass, NgForOf } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-animation-dialog',
  template: `
    <div class="animation-container" (click)="closeDialog()">
      <div *ngIf="data.isCorrect" class="success-animation" [@successAnimation]="animationState">
        <!-- Success Animation Elements -->
        <div class="celebration-container">
          <!-- Confetti particles -->
          <div class="confetti" *ngFor="let particle of confettiParticles; let i = index"
               [style.left.px]="particle.x"
               [style.top.px]="particle.y"
               [style.background-color]="particle.color"
               [style.animation-delay.s]="particle.delay"></div>

          <!-- Main success icon -->
          <div class="success-icon" [@checkmarkAnimation]="animationState">
            <span class="emoji">😊</span>
          </div>

          <!-- Success text -->
          <div class="success-text" [@textAnimation]="animationState">
            <h2>Great Job!</h2>
            <p>You Got It!</p>
          </div>

          <!-- Sparkles around the icon -->
          <div class="sparkle" *ngFor="let sparkle of sparkles; let i = index"
               [style.left.px]="sparkle.x"
               [style.top.px]="sparkle.y"
               [style.animation-delay.s]="sparkle.delay">
            ⭐
          </div>
        </div>
      </div>

      <div *ngIf="!data.isCorrect" class="error-animation" [@errorAnimation]="animationState">
        <!-- Error Animation Elements -->
        <div class="error-container">
          <div class="error-icon" [@bounceAnimation]="animationState">
            <span class="emoji">😢</span>
          </div>

          <div class="error-text" [@textAnimation]="animationState">
            <h2>Oops!</h2>
            <p>Try Again!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgForOf, NgClass],
  animations: [
    trigger('successAnimation', [
      state('start', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => start', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    trigger('checkmarkAnimation', [
      state('start', style({ transform: 'scale(1) rotate(0deg)' })),
      transition('void => start', [
        style({ transform: 'scale(0) rotate(-180deg)' }),
        animate('1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ ngon: 'scale(1) rotate(0deg)' }))
      ])
    ]),

    trigger('textAnimation', [
      state('start', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => start', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s 0.5s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    trigger('errorAnimation', [
      state('start', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => start', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.8s ease-out',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    trigger('bounceAnimation', [
      state('start', style({ transform: 'translateY(0)' })),
      transition('void => start', [
        animate('0.8s ease-in-out', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-15px)', offset: 0.3 }),
          style({ transform: 'translateY(0)', offset: 0.5 }),
          style({ transform: 'translateY(-10px)', offset: 0.7 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ])
  ],
  styles: [`
    .animation-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      background: #fff3cd; /* Pastel yellow for a warm, kid-friendly feel */
      cursor: pointer;
      overflow: hidden;
    }

    .success-animation, .error-animation {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .celebration-container, .error-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .success-icon, .error-icon {
      position: relative;
      z-index: 10;
      font-size: 80px; /* Larger emoji for kids */
    }

    .success-icon .emoji {
      background: #b9f6ca; /* Pastel green background */
      border-radius: 50%;
      padding: 10px;
      display: inline-block;
    }

    .error-icon .emoji {
      background: #ffcccb; /* Pastel pink background */
      border-radius: 50%;
      padding: 10px;
      display: inline-block;
      font-size: 60px; /* Smaller for a less intense error */
    }

    .success-text, .error-text {
      font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; /* Playful font */
      z-index: 10;
    }

    .success-text h2, .error-text h2 {
      font-size: 3rem;
      margin: 0;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .success-text p, .error-text p {
      font-size: 1.5rem;
      margin: 8px 0 0 0;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .success-text h2 {
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #f9ca24); /* Rainbow gradient */
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .success-text p {
      color: #ff6b6b; /* Bright pink for success */
    }

    .error-text h2 {
      color: #ff6b6b; /* Soft pink for error */
    }

    .error-text p {
      color: #ff6b6b;
      font-size: 1.2rem; /* Smaller for a gentler tone */
    }

    /* Confetti Animation */
    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: confettiFall 2s ease-out infinite;
      pointer-events: none;
    }

    @keyframes confettiFall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }

    /* Sparkle Animation */
    .sparkle {
      position: absolute;
      font-size: 24px; /* Larger stars for twinkling effect */
      animation: sparkleFloat 3s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes sparkleFloat {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-20px) scale(1.2);
        opacity: 1;
      }
    }

    /* Pulse effect for success icon */
    .success-icon {
      animation: successPulse 2s ease-in-out infinite;
    }

    @keyframes successPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .success-text h2, .error-text h2 {
        font-size: 2.5rem;
      }

      .success-text p, .error-text p {
        font-size: 1.2rem;
      }

      .success-icon, .error-icon {
        font-size: 60px;
      }

      .error-icon .emoji {
        font-size: 50px;
      }
    }
  `]
})
export class AnimationDialogComponent implements OnInit, OnDestroy {
  animationState = 'start';
  confettiParticles: any[] = [];
  sparkles: any[] = [];
  private autoCloseTimer: any;

  constructor(
    public dialogRef: MatDialogRef<AnimationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isCorrect: boolean, animationUrl?: string }
  ) {}

  ngOnInit(): void {
    console.log('AnimationDialogComponent: ngOnInit called. Data:', this.data);

    if (this.data.isCorrect) {
      this.generateConfetti();
      this.generateSparkles();
    }

    // Auto-close after 3 seconds
    this.autoCloseTimer = setTimeout(() => {
      this.closeDialog();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  private generateConfetti(): void {
    const colors = ['#ffb6c1', '#b0e0e6', '#fffacd', '#98fb98']; // Pastel pink, baby blue, soft yellow, mint green

    for (let i = 0; i < 50; i++) {
      this.confettiParticles.push({
        x: Math.random() * window.innerWidth,
        y: -50,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1.5
      });
    }
  }

  private generateSparkles(): void {
    const positions = [
      { x: -40, y: -40 },
      { x: 40, y: -40 },
      { x: -40, y: 40 },
      { x: 40, y: 40 },
      { x: 0, y: -50 },
      { x: -50, y: 0 },
      { x: 50, y: 0 },
      { x: 0, y: 50 },
      { x: -30, y: -20 },
      { x: 30, y: 20 }
    ];

    positions.forEach((pos, index) => {
      this.sparkles.push({
        x: pos.x,
        y: pos.y,
        delay: index * 0.3
      });
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
    console.log('AnimationDialogComponent: Dialog closed.');
  }
}
