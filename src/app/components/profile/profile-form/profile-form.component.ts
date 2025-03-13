import { Component } from '@angular/core';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    UpdateProfileComponent,
    UpdateEmailComponent,
    UpdatePasswordComponent,
    DeleteUserComponent,
  ],
  templateUrl: './profile-form.component.html',
})
export class ProfileFormComponent {}
