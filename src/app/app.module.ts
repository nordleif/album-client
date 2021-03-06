import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AuthInterceptor } from './auth.interceptor';
import { LoginComponent } from './login/login.component';
import { CoverComponent } from './cover/cover.component';
import { JsonRpcInterceptor } from './json-rpc.interceptor';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthCallbackComponent,
    CoverComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(), deps: [PlatformLocation] },
    { multi: true, provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor },
    { multi: true, provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor },
    { multi: true, provide: HTTP_INTERCEPTORS, useClass: JsonRpcInterceptor },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
