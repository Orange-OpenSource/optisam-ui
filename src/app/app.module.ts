// import { LoaderComponent } from './core/loader/loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { EquipmentTypeManagementService } from './core/services/equipmenttypemanagement.service';
import {
  AuthInterceptorService,
  UnauthorisedInterceptor,
} from './core/interceptors/auth.interceptor';
import { LoaderService } from './core/services/loader.service';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigurationServiceService } from './configuration-service/configuration-service.service';
import { SharedModule } from './shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CheckMetricsLengthPipe } from '@home/pages/acquiredrights/pipes/check-metrics-length.pipe';

@NgModule({
  declarations: [
    AppComponent,
    // LoaderComponent,
    MoreDetailsComponent,
    CheckMetricsLengthPipe,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatIconModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [MoreDetailsComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configurationService: ConfigurationServiceService) => () =>
        configurationService.loadConfiguration().toPromise(),
      deps: [ConfigurationServiceService],
      multi: true,
    },
    AuthService,
    LoaderService,
    ProductService,
    AuthGuard,
    ApplicationService,
    AccountService,
    EquipmentTypeManagementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorisedInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json');
}
