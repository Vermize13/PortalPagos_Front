import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {
  private readonly apiUrl = `${environment.url}WeatherForecast`;

  constructor(private http: HttpClient) { }

  getWeatherForecast(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(this.apiUrl);
  }
}
