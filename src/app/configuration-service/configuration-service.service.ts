import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationServiceService {
  private readonly configPath: string = location.hostname.includes('localhost')
    ? 'assets/config/dev/configuration.json'
    : 'assets/config/configuration.json';
  public $configurations: Observable<any>;
  constructor(private http: HttpClient) { }

  loadConfiguration(): any {
    if (!this.$configurations) {
      this.$configurations = this.http
        .get<any>(this.configPath)
        .pipe(shareReplay(1));
    }
    return this.$configurations;
  }
}
