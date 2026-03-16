import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  DocumentData,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Kid {
  id?: string;
  name: string;
  age: number;
  gender: string;
  gradeLevel?: string;
  interests?: string[];
  parentEmail: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class KidsService {
  private firestore: Firestore = inject(Firestore);
  private kidsCollection: CollectionReference<DocumentData>;
  private kidsSubject = new BehaviorSubject<Kid[]>([]);
  kids$ = this.kidsSubject.asObservable();

  constructor() {
    this.kidsCollection = collection(this.firestore, 'kids');
  }

  // Add a new kid to Firestore
  async addKid(kid: Omit<Kid, 'id'>): Promise<string> {
    try {
      const kidWithTimestamp = {
        ...kid,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(this.kidsCollection, kidWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error adding kid:', error);
      throw new Error('Failed to add child details');
    }
  }

  // Get kids by parent email
  getKidsByParentEmail(parentEmail: string): Observable<Kid[]> {
    const kidQuery = query(
      this.kidsCollection,
      where('parentEmail', '==', parentEmail),
      orderBy('createdAt', 'desc')
    );

    // Setup the snapshot listener
    onSnapshot(kidQuery, (querySnapshot) => {
      const kids: Kid[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Kid, 'id'>;
        kids.push({ id: doc.id, ...data });
      });
      this.kidsSubject.next(kids);
    }, (error) => {
      console.error('Error fetching kids:', error);
      this.kidsSubject.next([]);
    });

    return this.kids$;
  }

  // Get kids once (not real-time)
  async getKidsOnce(parentEmail: string): Promise<Kid[]> {
    try {
      const kidQuery = query(
        this.kidsCollection,
        where('parentEmail', '==', parentEmail),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(kidQuery);
      const kids: Kid[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Kid, 'id'>;
        kids.push({ id: doc.id, ...data });
      });

      return kids;
    } catch (error) {
      console.error('Error fetching kids once:', error);
      throw new Error('Failed to fetch children data');
    }
  }

  // Update kid details
  async updateKid(kidId: string, kidData: Partial<Kid>): Promise<void> {
    try {
      const kidRef = doc(this.firestore, `kids/${kidId}`);
      const updateData = {
        ...kidData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(kidRef, updateData);
    } catch (error) {
      console.error('Error updating kid:', error);
      throw new Error('Failed to update child details');
    }
  }

  // Delete a kid
  async deleteKid(kidId: string): Promise<void> {
    try {
      const kidRef = doc(this.firestore, `kids/${kidId}`);
      await deleteDoc(kidRef);
    } catch (error) {
      console.error('Error deleting kid:', error);
      throw new Error('Failed to delete child details');
    }
  }
}
