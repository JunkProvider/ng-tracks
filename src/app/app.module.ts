import { NgModule } from '@angular/core';
import { MainModule } from './main/main.module';
import { AppRoot } from './app-root';

@NgModule({
	declarations: [
		AppRoot,
	],
	imports: [
		MainModule
	],
	bootstrap: [AppRoot]
})
export class AppModule {}
