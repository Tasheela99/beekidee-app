import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-attention-lost-popup',
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './attention-lost-popup.component.html',
  styleUrl: './attention-lost-popup.component.scss'
})
export class AttentionLostPopupComponent implements OnInit{

  videoUrls: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/attention-focus%2FIMG_6938.MOV?alt=media&token=d6435f07-69f4-4fcd-98f3-214ec6aee06c',
    'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/attention-focus%2FIMG_6939.MOV?alt=media&token=b84c605a-31cc-4ec4-b098-4236fd7f4310',
    'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/attention-focus%2FIMG_6940.MOV?alt=media&token=0ec0d19e-2b23-46e4-af35-92417e58488e'
  ];

  selectedVideo: string = 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/attention-focus%2FIMG_6938.MOV?alt=media&token=d6435f07-69f4-4fcd-98f3-214ec6aee06c';

  ngOnInit() {
    this.shuffleAndSelectVideo();
  }

  shuffleAndSelectVideo() {
    const randomIndex = Math.floor(Math.random() * this.videoUrls.length);
    this.selectedVideo = this.videoUrls[randomIndex];
  }
}
