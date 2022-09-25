import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NotesDetailsComponent } from './pages/notes-details/notes-details.component';

const routes: Routes = [
  { path: '', component: MainLayoutComponent, children:[
  { path: '', component: NotesListComponent},
  { path: 'new', component: NotesDetailsComponent},
  { path: ':id', component: NotesDetailsComponent},

]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
