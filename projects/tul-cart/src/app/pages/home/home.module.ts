import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { HomeComponent } from './home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, NgZorroAntdModule ],
  exports: [],
  declarations: [HomeComponent],
  providers: [],
})
export class HomeModule { }
