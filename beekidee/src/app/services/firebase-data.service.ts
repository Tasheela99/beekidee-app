import { Injectable } from '@angular/core';
import { Database, ref, onValue, off } from '@angular/fire/database';
import { Observable } from 'rxjs';

export interface SessionData {
  id: string;
  emotion: string;
  eye_attention: number;
  face_attention: number;
  noise_attention: number;
  overall_attention: number;
  posture: number;
  timestamp: number;
  studentId: string;
  sessionNumber: number;
}

export interface StudentSummary {
  studentId: string;
  sessionNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {
  constructor(private database: Database) {}

  getUniqueStudentsBySession(sessionNumber: number): Observable<StudentSummary[]> {
    return new Observable(observer => {
      const studentsRef = ref(this.database, 'students');

      const unsubscribe = onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        const studentSummaries: StudentSummary[] = [];

        if (data) {
          const seenStudents = new Set<string>();
          Object.keys(data).forEach(studentId => {
            const student = data[studentId];
            if (student.sessions) {
              Object.keys(student.sessions).forEach(sessionNum => {
                if (parseInt(sessionNum) === sessionNumber && !seenStudents.has(studentId)) {
                  studentSummaries.push({ studentId, sessionNumber: parseInt(sessionNum) });
                  seenStudents.add(studentId);
                }
              });
            }
          });
        }

        observer.next(studentSummaries);
      }, (error) => {
        observer.error(error);
      });

      return () => {
        off(studentsRef);
      };
    });
  }

  getStudentSessionsById(studentId: string): Observable<SessionData[]> {
    return new Observable(observer => {
      const studentRef = ref(this.database, `students/${studentId}`);

      const unsubscribe = onValue(studentRef, (snapshot) => {
        const data = snapshot.val();
        const sessionDataArray: SessionData[] = [];

        if (data && data.sessions) {
          Object.keys(data.sessions).forEach(sessionNumber => {
            const session = data.sessions[sessionNumber];
            if (session.data) {
              Object.keys(session.data).forEach(dataId => {
                const sessionEntry = session.data[dataId];
                sessionDataArray.push({
                  id: dataId,
                  emotion: sessionEntry.emotion || 'N/A',
                  eye_attention: sessionEntry.eye_attention || 0,
                  face_attention: sessionEntry.face_attention || 0,
                  noise_attention: sessionEntry.noise_attention || 0,
                  overall_attention: sessionEntry.overall_attention || 0,
                  posture: sessionEntry.posture || 0,
                  timestamp: sessionEntry.timestamp || 0,
                  studentId: studentId,
                  sessionNumber: parseInt(sessionNumber)
                });
              });
            }
          });
        }

        sessionDataArray.sort((a, b) => b.timestamp - a.timestamp);
        observer.next(sessionDataArray);
      }, (error) => {
        observer.error(error);
      });

      return () => {
        off(studentRef);
      };
    });
  }
}
