import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private http: HttpClient) { }

  addCarousel(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.CarouselApi, model)
  }

  getAllCarousel(): Observable<any[]> {
    return this.http.get<any[]>(environment.CarouselApi);
  }

  getCompanyCarousel(companyID: any): Observable<any[]> {
    return this.getAllCarousel().pipe(
      map(carousel => carousel.filter(a => a.companyID === companyID))
    );
  }

  getCarousel(id: any): Observable<any>{
    return this.http.get<any>(`${environment.CarouselApi}/GetCarouselById?id=${id}`);
  }

  updateCarousel(id: any, updateCarouselRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.CarouselApi}/EditCarousel/${id}`, updateCarouselRequest);
  }

  deleteCarousel(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.CarouselApi}/DeleteCarousel?id=${id}`);
  }
}
