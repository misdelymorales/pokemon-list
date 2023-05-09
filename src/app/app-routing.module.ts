import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';

const routes: Routes = [
  {
    path: '',
    component: PokemonCardComponent,
  },
  {
    path: 'index',
    component: PokemonCardComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
