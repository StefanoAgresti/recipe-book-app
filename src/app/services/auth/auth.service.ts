import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  User,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  router = inject(Router);

  currentUser: Signal<User | null> = toSignal(user(this.auth), {
    initialValue: null,
  });

  async isUsernameTaken(username: string): Promise<boolean> {
    //Create users collection in firestore
    const usersRef = collection(this.firestore, 'users');

    const q = query(usersRef, where('username', '==', username));

    const snapshot = await getDocs(q);

    return !snapshot.empty;
  }

  async signup({ email, username, photoURL, password }: AuthData) {
    try {
      //Check username availability
      const isUsernameTaken = await this.isUsernameTaken(username!);
      if (isUsernameTaken) {
        throw new Error('Username is already taken.');
      }

      //Create the user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error('User creation failed.');
      }

      //Update profile with username
      await updateProfile(user, { displayName: username, photoURL: photoURL });

      //Create user document in firestore
      const userRef = doc(this.firestore, `users/${user.uid}`);

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: user.displayName,
      });
    } catch (error) {
      console.error(error);
    }
  }

  login({ email, password }: AuthData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }
}
