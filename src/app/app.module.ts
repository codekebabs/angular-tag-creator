import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TagsFormComponent } from './components/tags-form/tags-form.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsService } from './services/tags.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule, ],
  declarations: [ AppComponent, HelloComponent, TagsFormComponent, NavigationComponent ],
  bootstrap:    [ AppComponent ],
  providers: [TagsService]
})
export class AppModule { }
