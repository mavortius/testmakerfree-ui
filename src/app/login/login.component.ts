import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title: string;
  form: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.title = 'User Login';
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    const url = `${environment.apiUrl}/api/token/auth`;
    const username = this.form.value.Username;
    const password = this.form.value.Password;

    this.authService.login(username, password)
      .subscribe(() => {
          alert('Login successful! '
            + 'USERNAME: '
            + username
            + ' TOKEN: '
            + this.authService.getAuth()!.token
          );

          this.router.navigate(['home']);
        },
        err => {
          console.log(err);
          this.form.setErrors({
            'auth': 'Incorrect username or password'
          });
        });
  }

  onBack() {
    this.router.navigate(['home']);
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

// returns TRUE if the FormControl is valid
  isValid(name: string) {
    const e = this.getFormControl(name);
    return e && e.valid;
  }

// returns TRUE if the FormControl has been changed
  isChanged(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched);
  }

// returns TRUE if the FormControl is invalid after user changes
  hasError(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched) && !e.valid;
  }
}
