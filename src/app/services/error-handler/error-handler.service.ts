import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  getAuthErrorMessage(error: any): string {
    if (!error.code) {
      if (error.message === 'auth/username-already-in-use') {
        return 'Username is already in use.';
      }
      return 'An unknown error occurred.';
    }

    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password.';

      case 'auth/email-already-in-use':
        return 'Email is already in use.';

      default:
        return `An error occurred: ${error.message}`;
    }
  }
}
