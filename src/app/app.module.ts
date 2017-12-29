import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from './common/common.module';
import { DomainModule } from './domain/domain.module';
import { App } from './app';
import { default as routes } from './app.routes';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false }
    ),
    CommonModule,
    DomainModule
  ],
  bootstrap: [App]
})
export class AppModule {}
