import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { EditorDetailsComponent } from './editor-details/editor-details.component';
import { EditorsListComponent } from './editors-list/editors-list.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AboutsComponent } from './abouts/abouts.component';
import { CheckHeaderPipe } from './pipes/check-header.pipe';
import { MakeLinkPipe } from './pipes/make-link.pipe';

@NgModule({
    declarations: [HomepageComponent, EditorsListComponent, EditorDetailsComponent, ProductsListComponent, ProductDetailsComponent, AboutsComponent, CheckHeaderPipe, MakeLinkPipe],
    imports: [
        CommonModule,
        LandingPageRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        SharedModule,
    ]
})
export class LandingPageModule { }
