import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

function passwordMatchValidator(passwordForm: FormGroup) {
  const newPassword = passwordForm.get('newPassword').value;
  const confirmPassword = passwordForm.get('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  formSubmitAttempt = false;
  emailChange = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+-=])[0-9a-zA-Z!@#$%^&*()_+-=]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: passwordMatchValidator
    }),
      this.emailForm = this.fb.group({
        newEmail: ['', [Validators.required, Validators.email]]
      }),
      this.passwordForm.valueChanges.subscribe(() => {
        this.formSubmitAttempt = false;
      }),
      this.emailForm.valueChanges.subscribe(() => {
        this.formSubmitAttempt = false;
      })

  }

  isFieldInvalid(field: string) {
    switch (field) {
      case 'newEmail':
        return (
          (!this.emailForm.get(field).valid && this.emailForm.get(field).touched) ||
          (this.emailForm.get(field).untouched && this.formSubmitAttempt)
        );
      default:
        return (
          (!this.passwordForm.get(field).valid && this.passwordForm.get(field).touched) ||
          (this.passwordForm.get(field).untouched && this.formSubmitAttempt)
        );
    }
  }


  onHistory() {
    this.router.navigate(['/history'])
  }
  onChangeEmail() {
    this.emailChange = !this.emailChange
  }
  changeEmail() {
    if (this.emailForm.valid) {
      const data = {
        newEmail: this.emailForm.value.newEmail
      };
      /* this.authService.updateUser(data).subscribe((res: any) => { updateUser func
         // do something with the response
       });*/
    }
    this.formSubmitAttempt = true;
  }
  changePassword() {
    if (this.passwordForm.valid) {
      const data = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };
      /* this.authService.updateUser(data).subscribe((res: any) => { updateUser func
         // do something with the response
       });*/
    }
    this.formSubmitAttempt = true;
  }

}
