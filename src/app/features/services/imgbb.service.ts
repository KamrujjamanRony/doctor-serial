import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ImgbbService {

  constructor(private readonly http: HttpClient) { }

  upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post('/upload', formData, { params: { key: environment.imgbbApi } }).pipe(map((response: any) => response['data']['url']));
  }
}
