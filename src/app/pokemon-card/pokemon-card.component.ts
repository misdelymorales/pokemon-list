import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit{

  data: any[] = [];
  size: number = 10;
  page: number = 0;

  constructor(private pokemonService : PokemonService,  private router: Router) {}

  ngOnInit(): void {
    this.getPokemons({pageIndex: this.page, pageSize: this.size});
  }

  getPokemons(obj: any) {
    let pokemonData;
    this.data = []
    

    console.log(obj)

    const start = obj.pageIndex * obj.pageSize;
    const end = obj.pageIndex * obj.pageSize + obj.pageSize - 1;

    for (let i = start; i <= end ; i++) {
      console.log(i)
      if(i > 0){
        this.pokemonService.getPokemons(i).subscribe(
          res => {
            pokemonData = {
              position: i,
              image: res.sprites.other.dream_world.front_default,
              name: res.name
            };
            this.data.push(pokemonData);
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  }

  //Filtro para el paginador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  
  }

 //Obtiene elemento seleccionado
  getRow(row: { position: any; }){
    this.router.navigateByUrl(`/pokeDetail/${row.position}`)
  }

}
