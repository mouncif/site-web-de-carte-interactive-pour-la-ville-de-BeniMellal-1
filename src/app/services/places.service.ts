import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../models/place';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  url = environment.api;
  param = new HttpParams();

  constructor(private httpClient: HttpClient) { }

  addPlace(place: Place) {
    return this.httpClient.post(`${this.url}/places`, place);
  }

  updateReservation(place: Place) {
    return this.httpClient.put(`${this.url}/places`, place);
  }

  getAllPlaces(): Observable<any> {
    return this.httpClient.get(`${this.url}/places`);
  }

  getPlacesBytype(type: string): Observable<any> {
    return this.httpClient.get(`${this.url}/places?type=${type}`);
  }

  getPlaceById(id: number): Observable<any> {
    return this.httpClient.get(`${this.url}/places/${id}`);
  }

  deletePlace(id: number) {
    return this.httpClient.delete(`${this.url}/places/${id}`);
  }
}
