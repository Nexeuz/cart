import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'projects/tul-cart/src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  loading = false;
  showAlert = false;
  form: FormGroup;
  error: any;
  passwordVisible = false;
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

  async createUser() {
    this.loading = true;
    try {
      await this.authService.signUp(
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
