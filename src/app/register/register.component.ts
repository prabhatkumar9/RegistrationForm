import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Register } from '../shared/register.model';
import { RegistrationService } from '../shared/registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // model class object
  register = new Register();

  isInvalidRegister: boolean;

  //pattern
  emailPattern = '^[a-z0-9,_%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$';

  constructor(
    private registerService: RegistrationService,
    private router: Router
  ) { }

  // custom validator for confirm password

  ngOnInit(): void {
    this.resetForm();
  }

  // new user
  addNewUser() {
    this.registerService.RegisterNewUser(this.register).subscribe((result) => {
      console.log(result)
    });

    this.router.navigate(['login']);
    this.resetForm();
  }



  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
      this.register = {
        username: '',
        password: '',
        email: '',
        mobile: null,
      };
    }
  }

}
