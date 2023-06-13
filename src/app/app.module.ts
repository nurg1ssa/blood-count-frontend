import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';

import { abnormalitiesReducer } from './store/state/abnormalities.state';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { PopupComponent } from './components/header/popup/popup.component';
import { LangSwitcherComponent } from './components/header/lang-switcher/lang-switcher.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HistoryComponent } from './components/user-profile/history/history.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhiteBoxComponent } from './components/white-box/white-box.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { StatusButtonComponent } from './components/header/status-button/status-button.component';
import { CbcTableComponent } from './components/cbc-table/cbc-table.component';
import { RootUserComponent } from './components/roles/root-user/root-user.component';
import { NavigationBarComponent } from './components/roles/navigation-bar/navigation-bar.component';
import { UsersTableComponent } from './components/roles/root-user/users-table/users-table.component';
import { InviteUserComponent } from './components/roles/root-user/invite-user/invite-user.component';
import { GroupsManageComponent } from './components/roles/root-user/groups-manage/groups-manage.component';
import { CaseEntityComponent } from './components/roles/root-user/case-entity/case-entity.component';
import { CaseTableComponent } from './components/roles/root-user/case-entity/case-table/case-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegistrationComponent,
    PopupComponent,
    LangSwitcherComponent,
    UserProfileComponent,
    HistoryComponent,
    ErrorMessageComponent,
    FooterComponent,
    WhiteBoxComponent,
    StatusButtonComponent,
    CbcTableComponent,
    RootUserComponent,
    NavigationBarComponent,
    UsersTableComponent,
    InviteUserComponent,
    GroupsManageComponent,
    CaseEntityComponent,
    CaseTableComponent,
  ],
  imports: [
    ReactiveFormsModule,
    AppMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({}), 
    StoreModule.forFeature('abnormalities', abnormalitiesReducer)
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent],

})
export class AppModule { }
