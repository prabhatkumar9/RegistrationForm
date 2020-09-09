import { Injectable } from '@angular/core';
import { Register } from './register.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) { }

  public RegisterNewUser(user: Register): Observable<any> {
    return this.httpClient.post<any>(
      'http://localhost:3000/adduser',
      user
    );
  }


}
