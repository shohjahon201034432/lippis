import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormControl, Validators, AbstractControl, ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterOutlet, ReactiveFormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  formsubmitted = false;
  showWelcomeBack = false;
  showPassword = false;

  myform = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      this.capitalizedValidator
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(12)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.allowedEmailValidator
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      this.noSpecialCharactersValidator
    ])
  });

  ngOnInit() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.formsubmitted = true;
    }
  }

  onSubmit() {
    if (this.myform.valid) {
      const formData = this.myform.value;
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (
          parsedData.name === formData.name &&
          parsedData.age === formData.age &&
          parsedData.email === formData.email &&
          parsedData.password === formData.password
        ) {
          this.showWelcomeBack = true;
          setTimeout(() => {
            this.showWelcomeBack = false;
            this.formsubmitted = true;
          }, 3000);
          return;
        }
      }

      localStorage.setItem('userData', JSON.stringify(formData));
      this.formsubmitted = true;
    } else {
      this.myform.markAllAsTouched();
      alert('Form not valid');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  capitalizedValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /^[A-Z]/.test(value) ? null : { capitalized: true };
  }

  noSpecialCharactersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const forbidden = /[!@#$%^&*()_+={}\[\]:;"'<>,.?\\|`~]/;
    return forbidden.test(value) ? { specialCharsNotAllowed: true } : null;
  }

  allowedEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const allowedDomains = ['gmail.com', 'yahoo.com', 'mail.ru', 'hotmail.com'];
    const domain = value.substring(value.lastIndexOf('@') + 1).toLowerCase();
    return allowedDomains.includes(domain) ? null : { invaliddomain: true };
  }
}
