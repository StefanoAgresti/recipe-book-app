import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './profile-info.component.html',
})
export class ProfileInfoComponent {
  auth = inject(AuthService);
  error = signal(null);
}
