import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit {

  data: any[] = [];
  pokemonsList: any[] = [];
  size: number = 10;
  page: number = 0;
  records: number = 151;
  namePokemon: string = "";

  constructor(private pokemonService: PokemonService, private router: Router,) { }

  ngOnInit(): void {
    this.getPokemons({ pageIndex: 0, pageSize: this.records });
  }

  getPokemons(obj: any) {
    this.data = []
    const start = obj.pageIndex * obj.pageSize;
    const end = obj.pageIndex * obj.pageSize + obj.pageSize;

    if (this.pokemonsList.length === 0) {
      for (let i = start; i <= end; i++) {
        if (i > 0) {
          this.pokemonService.getPokemons(i).subscribe({
            next: (res) => {

              const pokemonData = {
                position: i,
                image: res.sprites.other.dream_world.front_default,
                name: res.name
              };

              this.pokemonsList.push(pokemonData);
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log(this.pokemonsList)
              if (this.pokemonsList.length === this.records - 1) {
                for (let i = 1; i <= this.size; i++) {
                  this.data.push(this.pokemonsList[i - 1])
                }
              }
            }
          });
        }
      }
    } else {
      for (let i = start + 1; i <= end; i++) {
        this.data.push(this.pokemonsList[i - 1])
      }
    }
  }

  search() {
    let pokemonData;
    this.data = [];
    this.records = 0;
    //cargando

    this.pokemonService.getPokemon(this.namePokemon).subscribe(res => {
      pokemonData = {
        image: res.sprites.other.dream_world.front_default,
        name: res.name
      };
      this.data.push(pokemonData);
      this.records += 1;
    },
      err => {
        console.log(err);
      })
  }

  //Obtiene elemento seleccionado
  // getRow(row: { position: any; }){
  //   this.router.navigateByUrl(`/pokeDetail/${row.position}`)
  // }

}
