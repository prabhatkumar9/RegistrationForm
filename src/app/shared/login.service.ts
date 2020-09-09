import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './register.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  LoginUser(user: Login): Observable<any> {
    return this.httpClient
      .post<any>('http://localhost:3000/login', user);
  }

  verifyToken(token: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:3000/verify', token);
  }
}
