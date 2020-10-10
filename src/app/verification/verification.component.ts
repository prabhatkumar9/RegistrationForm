import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  msg: string;
  isVerified: boolean;
  mouseoverLogin: boolean;

  token: string;
  constructor(private loginService: LoginService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    // // this is the way to pass parameters in url
    this.activatedRoute.params.forEach((params) => {
      this.token = params['token'];
    });

    // console.log(this.token);
    this.callServices(this.token);
  }

  callServices(token) {
    // Subscriber
  }

  verifymail(value) {
    this.loginService.verifyToken({ token: value.tk }).subscribe((result) => {
      if (result.success) {
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 1500
        );

      }
      this.isVerified = result.success;
      this.msg = result.message;
    });

  }
}
