import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';

export interface Pokemon{
  image: string;
  name: string;
}

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
  pokemonCtrl = new FormControl();
  filteredPokemon: Observable<Pokemon[]>

  constructor(private pokemonService: PokemonService, private router: Router,) {
    this.filteredPokemon = this.pokemonCtrl.valueChanges
    .pipe(
      startWith(''),
      map((pokemon) =>pokemon ? this.filterPokemon(pokemon) : this.pokemonsList.slice())
    );
   }

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

    this.pokemonService.getPokemon(this.namePokemon).subscribe({
      next: (res) => {
      pokemonData = {
        image: res.sprites.other.dream_world.front_default,
        name: res.name
      };
      this.data.push(pokemonData);
      this.records += 1;
    },
    error: (err) => {
        console.log(err);
      },
      complete: ()=>{
       
      // this.data= this.pokemonsList.filter(x => x.name.includes(this.namePokemon))
      //   console.log(this.pokemonsList)
      }
    });
  }

  filterPokemon(value: string): Pokemon[] {
    const filterValue = value.toLowerCase();
    return this.pokemonsList.filter(pokemon => pokemon.name.toLowerCase().indexOf(filterValue)=== 0);
  }

  pokemonSelected(obj: any){
    const pokemon = this.pokemonsList.find(x => x.name === obj.option.value);
    this.data = [pokemon];
    this.records= 1;
    console.log(pokemon)
  }

  deletePokemon(position: number){
    const pokemonIndex= this.pokemonsList.findIndex(x => x.position === position);
    const pokemonIndexData= this.data.findIndex(x => x.position === position);
    this.pokemonsList.splice(pokemonIndex, 1);
    this.data.splice(pokemonIndexData, 1);
    this.records -=1
  }

}
