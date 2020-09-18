import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  msg: string;
  isVerified: boolean;
  mouseoverLogin: boolean;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
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
