import { Component, OnInit } from '@angular/core';
import { Login } from '../shared/register.model';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // email pattern
  emailPattern = '^[a-z0-9,_%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  // error message
  ermsg: string = '';
  // login model class object
  userlogin = new Login();


  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    console.log("clicked");
    this.loginService.LoginUser(this.userlogin).subscribe((result) => {
      console.log(result);
    });

    this.loginService.joinSocket();
  }

}
