import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  user,
  User,
  verifyBeforeUpdateEmail,
  AuthCredential,
  reauthenticateWithCredential,
  deleteUser,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
  updateDoc,
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
        throw new Error('auth/username-already-in-use');
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

      return user;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: AuthData) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async reauthenticateUser(credential: AuthCredential) {
    const user = this.currentUser();
    if (!user) throw new Error('User not authenticated.');

    return await reauthenticateWithCredential(user, credential);
  }

  async updateUsername(username: string) {
    await updateProfile(this.currentUser()!, { displayName: username });

    // Update user document in firestore
    const userRef = doc(this.firestore, `users/${this.currentUser()!.uid}`);
    await updateDoc(userRef, {
      username: username,
    });
  }

  async updatePhotoURL(photoURL: string) {
    await updateProfile(this.currentUser()!, { photoURL });
  }

  async updateEmail(newEmail: string) {
    await verifyBeforeUpdateEmail(this.currentUser()!, newEmail);
  }

  async updatePassword(newPassword: string) {
    await updatePassword(this.currentUser()!, newPassword);
  }

  async deleteUser(user: User) {
    await deleteUser(user);
  }

  async logout() {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }
}
