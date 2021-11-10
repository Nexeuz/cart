import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loading = false;
  form: FormGroup;
  passwordVisible = false;
  error: any;
  showAlert = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  async loginUser() {
    this.loading = true;
    try {
      await this.authService.SignInEmailPassword(
        this.form.get('email')?.value,
        this.form.get('password')?.value
      );
      this.router.navigateByUrl('cart/create-order');
    } catch (e) {
      this.showAlert = true;
      this.loading = false;
      this.error = e;
    }
  }
}
