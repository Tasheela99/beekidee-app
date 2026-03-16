import {inject, Injectable} from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, getAuth,
  GoogleAuthProvider, signInWithEmailAndPassword,
  signInWithPopup, updateProfile,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query, where, getDocs, updateDoc
} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';

interface UserData {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  lastLogin?: string;
  updatedAt?: string;
  createdAt?: string;
  role?: string[];
  [key: string]: any;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  auth = inject(Auth);
  firestore = inject(Firestore);

  constructor() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await this.getUserData(user.uid);
          this.currentUserSubject.next(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.currentUserSubject.next(null);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    });

    this.auth = getAuth();
  }

  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);

      // Save user data to Firestore
      await this.saveUserData(credential.user);

      return credential;
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      if (error.code === 'permission-denied') {
        throw new Error('Database permission denied. Please check Firestore rules.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed.');
      } else {
        throw new Error(error.message || 'An error occurred during sign-in');
      }
    }
  }

  private async saveUserData(user: any): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userRef);

      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: user.role
      };

      if (!userDoc.exists()) {
        const newUserData: UserData = {
          ...userData,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newUserData);
      } else {
        await setDoc(userRef, userData, {merge: true});
      }

    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  private async getUserData(uid: string): Promise<UserData> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async signUp(email: any, password: any, displayName: any, phoneNumber: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: displayName,
        });
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          role: ['KID', 'PARENT'],
        };
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, userData);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw new Error('Failed to sign up. Please try again.');
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }


  /**
   * User data interface to properly type Firestore document data
   */


  /**
   * Signs in a user and returns their credentials along with role information
   * @param email User email
   * @param password User password
   * @returns Promise with user credentials and role information
   */
  async signIn(email: string, password: string): Promise<{
    userCredential: UserCredential,
    isAdmin: boolean,
    userRoles: string[]
  }> {
    try {
      // Authenticate the user
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      // Get the user document to check roles
      const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
      const userDoc = await getDoc(userRef);

      let userRoles: string[] = [];
      let isAdmin = false;

      if (userDoc.exists()) {
        // Use proper typing with the interface
        const userData = userDoc.data() as UserData;

        // Access the role property using index notation or with proper type checking
        userRoles = userData.role || [];
        // Alternative approach: userRoles = userData['role'] || [];

        // Check if user has admin roles
        isAdmin = userRoles.some(role =>
          ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(role)
        );

        // Update last login time
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString()
        }).catch(error => console.warn('Failed to update last login time:', error));
      }

      return {
        userCredential,
        isAdmin,
        userRoles
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  }

  async initializeAdmin(): Promise<void> {
    try {
      const adminEmail = "admin@gmail.com";
      const adminPassword = "123456789";
      const adminPhoneNumber = "0766308272";

      // First, ensure we're logged out (to prevent any auth issues)
      //await this.signOut(this.auth).catch(() => {}); // Ignore errors if not signed in

      // Check if admin already exists
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('role', 'array-contains', 'ADMIN'));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          console.log('Admin user already exists.');
          return;
        }
      } catch (error) {
        console.warn('Error checking for existing admin:', error);
        // Continue execution - we'll try to create the admin anyway
      }

      // Try to create new user
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(this.auth, adminEmail, adminPassword);
        console.log('Created new admin user');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // Try to sign in with existing account
          try {
            userCredential = await signInWithEmailAndPassword(this.auth, adminEmail, adminPassword);
            console.log('Signed in with existing admin account');
          } catch (signInError) {
            console.error('Failed to sign in with existing admin account:', signInError);
            throw new Error('Admin email exists but unable to sign in. Check credentials.');
          }
        } else {
          console.error('Error creating admin user:', error);
          throw error;
        }
      }

      const user = userCredential.user;
      if (user) {
        // Update profile
        await updateProfile(user, {
          displayName: "Administrator",
        });

        // Prepare user data
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: "Administrator",
          phoneNumber: adminPhoneNumber,
          photoURL: user.photoURL || null,
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          role: ['ADMIN', 'SUPER_ADMIN', 'TEACHER'],
        };

        // Set user document
        try {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          await setDoc(userRef, userData);
          console.log('Admin user data saved successfully');
        } catch (firestoreError) {
          console.error('Error saving admin data to Firestore:', firestoreError);
          throw new Error('Failed to save admin data. Check Firestore permissions.');
        }
      }
    } catch (error) {
      console.error('Error during admin initialization:', error);
      throw new Error('Failed to initialize admin. Please check the console for details.');
    }
  }

}
