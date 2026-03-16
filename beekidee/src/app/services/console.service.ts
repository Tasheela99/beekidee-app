import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  addDoc, collectionGroup, updateDoc, arrayUnion
} from '@angular/fire/firestore';
import {ref, Storage, uploadBytes, getDownloadURL, deleteObject} from '@angular/fire/storage';
import {v4 as uuidv4} from 'uuid';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, from, Observable, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";

export interface Lesson {
  lessonId: string;
  subject: string;
  title: string;
  subtitle: string;
  type: string;
  level: string;
  lessonUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

interface GameSession {
  marks: number;
  timestamp: any; // Can be Firestore Timestamp or Date
}

interface StudentDocument {
  gameSessions?: {
    [sessionId: string]: GameSession;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private snackBar = inject(MatSnackBar);

  public async saveLesson(data: {
    file: File;
    subject: string;
    title: string;
    subtitle: string;
    type: string;
    level: string;
  }): Promise<void> {
    try {
      console.log('Starting to save lesson with data:', {
        subject: data.subject,
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        level: data.level,
        fileName: data.file?.name
      });

      // Validate input data
      if (!data.file) {
        throw new Error('File is required');
      }

      if (!data.subject || !data.title || !data.subtitle || !data.type || !data.level) {
        throw new Error('All form fields are required');
      }

      const lessonId = uuidv4();
      const filePath = `lessons/${lessonId}/${data.file.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadResult = await uploadBytes(fileRef, data.file);
      const downloadURL = await getDownloadURL(fileRef);

      const lessonData = {
        lessonId,
        subject: data.subject,
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        level: data.level,
        lessonUrl: downloadURL,
        fileName: data.file.name,
        fileSize: data.file.size,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      const lessonDocRef = doc(this.firestore, `lessons/${lessonId}`);
      await setDoc(lessonDocRef, lessonData);

      this.snackBar.open('Lesson saved successfully', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

    } catch (error) {
      console.error('Error saving lesson:', error);

      let errorMessage = 'Failed to save lesson';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });

      throw error;
    }
  }

  public async deleteLesson(lessonId: any, fileName: any): Promise<void> {
    try {
      const filePath = `lessons/${lessonId}/${fileName}`;
      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
      const lessonDocRef = doc(this.firestore, `lessons/${lessonId}`);
      await deleteDoc(lessonDocRef);
      this.snackBar.open('Lesson deleted successfully', 'Close', {duration: 3000, panelClass: ['snackbar-success']});
    } catch (error) {
      this.snackBar.open('Failed to delete lesson', 'Close', {duration: 3000, panelClass: ['snackbar-error']});
      throw new Error('Failed to delete lesson');
    }
  }

  public async getAllLessons(): Promise<any[]> {
    try {
      const lessonsRef = collection(this.firestore, 'lessons');
      const querySnapshot = await getDocs(lessonsRef);
      return querySnapshot.docs.map(doc => ({lessonId: doc.id, ...doc.data()}));
    } catch (error) {
      throw new Error('Failed to fetch lessons');
    }
  }

  public async getLessonById(lessonId: any): Promise<any | null> {
    try {
      const lessonRef = doc(this.firestore, `lessons/${lessonId}`);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        return {lessonId, ...lessonSnap.data()};
      } else {
        return null;
      }
    } catch (error) {
      this.snackBar.open('Failed to fetch lesson', 'Close', {duration: 3000, panelClass: ['snackbar-error']});
      throw new Error('Failed to fetch lesson');
    }
  }

  public async getLessonsByType(type: string): Promise<Lesson[]> {
    try {
      const lessonsRef = collection(this.firestore, 'lessons');
      const q = query(lessonsRef, where('type', '==', type));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => doc.data() as Lesson);
    } catch (error) {
      console.error('Error fetching lessons by type:', error);
      return [];
    }
  }

  public async getLessonsByLevel(level: string): Promise<Lesson[]> {
    try {
      const lessonsRef = collection(this.firestore, 'lessons');
      const q = query(lessonsRef, where('level', '==', level));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => doc.data() as Lesson);
    } catch (error) {
      console.error('Error fetching lessons by level:', error);
      return [];
    }
  }

  public async getLessonsByLevelAndType(level: string, type: string): Promise<Lesson[]> {
    try {
      const lessonsRef = collection(this.firestore, 'lessons');
      const q = query(lessonsRef, where('level', '==', level), where('type', '==', type));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => doc.data() as Lesson);
    } catch (error) {
      console.error('Error fetching lessons by level and type:', error);
      return [];
    }
  }

  public async getLessonsByLevelTypeAndSubject(level: string, type: string, subject: string): Promise<Lesson[]> {
    try {
      const lessonsRef = collection(this.firestore, 'lessons');
      const q = query(
        lessonsRef,
        where('level', '==', level),
        where('type', '==', type),
        where('subject', '==', subject)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => doc.data() as Lesson);
    } catch (error) {
      console.error('Error fetching lessons by level, type, and subject:', error);
      return [];
    }
  }

  logAnswer(answerLog: {
    userUid: string | null;
    questionNumber: number;
    correctAnswer: string;
    marksAwarded: number;
    totalMarks: number;
    timestamp: string;
    gameType: string
  }): Observable<void> {
    if (!answerLog.userUid) {
      console.warn('Cannot log answer: userUid is missing');
      return from(Promise.reject('User UID is missing'));
    }

    const answersCollection = collection(this.firestore, `users/${answerLog.userUid}/answers`);
    return from(addDoc(answersCollection, {
      ...answerLog,
      createdAt: answerLog.timestamp
    })).pipe(
      map(() => void 0)
    );
  }

  /**
   * Logs game completion data to Firestore.
   * @param gameResult The game result object containing userUid, questionsAttempted, correctAnswers, totalMarks, maxPossibleMarks, accuracy, overallPercentage, totalQuestions, completionTime, gameStartTime, gameType, gameStatus, and completionMethod.
   * @returns An Observable that resolves when the game result is logged successfully.
   */
  logGameCompletion(gameResult: {
    userUid: string;
    questionsAttempted: number;
    correctAnswers: number;
    totalMarks: number;
    maxPossibleMarks: number;
    accuracy: number;
    overallPercentage: number;
    totalQuestions: number;
    completionTime: string;
    gameStartTime: string | null;
    gameType: string;
    gameStatus: string;
    completionMethod: string;
  }): Observable<void> {
    const gamesCollection = collection(this.firestore, `users/${gameResult.userUid}/gameResults`);
    return from(addDoc(gamesCollection, {
      ...gameResult,
      createdAt: gameResult.completionTime
    })).pipe(
      map(() => void 0)
    );
  }


  saveResults(gameResult: { name: string; marks: number; session: string }): Observable<void> {
    const studentSessionRef = doc(
      this.firestore,
      `gameResults/${gameResult.name}/sessions/${gameResult.session}` // Store in subcollection
    );

    return from(setDoc(studentSessionRef, {
      marks: gameResult.marks,
      timestamp: new Date()
    }));
  }

  getResultsBySession(sessionId: string): Observable<any[]> {
    // Query all "sessions" subcollections
    const sessionsQuery = collectionGroup(this.firestore, 'sessions');

    return from(getDocs(sessionsQuery)).pipe(
      map(snapshot => {
        return snapshot.docs
          .filter(sessionDoc => sessionDoc.id === sessionId) // Match session ID
          .map(sessionDoc => ({
            name: sessionDoc.ref.parent.parent?.id, // Student name
            session: sessionId,
            marks: sessionDoc.data()['marks'],
            timestamp: sessionDoc.data()['timestamp']?.toDate()
          }));
      }),
      catchError(error => {
        console.error('Firestore Error:', error);
        return of([]);
      })
    );
  }

  getAllResults(): Observable<any[]> {
    const sessionsQuery = collectionGroup(this.firestore, 'sessions');

    return from(getDocs(sessionsQuery)).pipe(
      map(snapshot => {
        return snapshot.docs.map(sessionDoc => ({
          studentName: sessionDoc.ref.parent.parent?.id,
          sessionId: sessionDoc.id,
          marks: sessionDoc.data()['marks'],
          timestamp: sessionDoc.data()['timestamp']?.toDate?.() || null
        }));
      }),
      catchError(error => {
        console.error('Error fetching all results:', error);
        return of([]);
      })
    );
  }


}
