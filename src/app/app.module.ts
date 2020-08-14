// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

// import { LoaderComponent } from './core/loader/loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { CustomMaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/auth/auth.service';
import { ProductService } from './core/services/product.service';
import { AuthGuard } from './core/guards/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApplicationService } from './core/services/application.service';
import { AccountService } from './core/services/account.service';
import { MoreDetailsComponent } from './modules/home/dialogs/product-details/more-details.component';
import { AcquiredrightsService } from './core/services/acquiredrights.service';
import { EquipmentTypeManagementService } from './core/services/equipmenttypemanagement.service';
import {  AuthInterceptorService, UnauthorisedInterceptor } from './core/interceptors/auth.interceptor';
import { LoaderService } from './core/services/loader.service';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DynamicDatabase } from './modules/home/pages/groups/groupmangement/groupmangement.component';
import { ConfigurationServiceService } from './configuration-service/configuration-service.service';
import { MatPaginatorModule } from '@angular/material';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    // LoaderComponent,
    MoreDetailsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    CustomMaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    ],
    entryComponents: [
      MoreDetailsComponent
    ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configurationService: ConfigurationServiceService) =>
                    () => configurationService.loadConfiguration().toPromise(),
      deps: [ConfigurationServiceService],
      multi: true
    },
    AuthService, LoaderService, ProductService, AuthGuard, ApplicationService,
     AccountService, AcquiredrightsService, EquipmentTypeManagementService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorisedInterceptor,
      multi: true
  }
],
  bootstrap: [AppComponent],
})
export class AppModule { }
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json');
}
