import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  name: {};
  
  constructor(private pokemonService : PokemonService) { 
    this.name = {};
  }

  ngOnInit(): void {
    
  }

  search(){
    this.pokemonService.getPokemons(this.name).subscribe(
      (data : any) => {
        console.log(data)
        this.name = data;
      }
    )
  }
}
