// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationServiceService {
  private readonly configPath: string = 'assets/configs/int/configuration.json';
  public $configurations: Observable<any>;
  constructor(
    private http: HttpClient
  ) { }

  loadConfiguration(): any {
    if (!this.$configurations) {
      this.$configurations = this.http.get<any>(this.configPath).pipe(
        shareReplay(1)
      );
    }
    return this.$configurations;
  }
}
