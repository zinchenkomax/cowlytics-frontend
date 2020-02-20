import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {StorageService} from './services/storage/storage.service';
import { EditableComponent } from './components/grid/editable/editable.component';
import { EditModeDirective } from './components/grid/editable/directives/edit-mode.directive';
import { ViewModeDirective } from './components/grid/editable/directives/view-mode.directive';
import { EditOnEnterDirective } from './components/grid/editable/directives/edit-on-enter.directive';
import { FocusableDirective } from './components/grid/editable/directives/focusable.directive';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {FakeBackendInterceptor} from './interceptors/fake-backend/fake-backend-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    HomeComponent,
    EditableComponent,
    EditModeDirective,
    ViewModeDirective,
    EditOnEnterDirective,
    FocusableDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  providers: [
    StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
