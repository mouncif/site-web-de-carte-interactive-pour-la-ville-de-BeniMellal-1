import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TypePlace } from '../models/type-place';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  url = environment.api;
  param = new HttpParams();

  constructor(private httpClient: HttpClient) { }

  addType(type: TypePlace) {
    return this.httpClient.post(`${this.url}/types`, type);
  }


  getAllTypes(): Observable<any> {
    return this.httpClient.get(`${this.url}/types`);
  }
}
