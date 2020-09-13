import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './register.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  apiURL = 'http://localhost:5000';

  private socket = io(this.apiURL);

  constructor(private httpClient: HttpClient, private router: Router) { }

  LoginUser(user: Login): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + '/login', user);
  }

  verifyToken(token: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/verify', token);
  }

  joinSocket() {
    this.socket.send("this is client");
  }

}
