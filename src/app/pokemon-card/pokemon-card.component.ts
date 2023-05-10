import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';

export interface Pokemon {
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
  filteredPokemon: Observable<Pokemon[]>;
  sortOrder: boolean = true;
  loading: boolean = false;


  constructor(private pokemonService: PokemonService, private router: Router,) {
    this.filteredPokemon = this.pokemonCtrl.valueChanges
      .pipe(
        startWith(''),
        map((pokemon) => pokemon ? this.filterPokemon(pokemon) : this.pokemonsList.slice())
      );

  }

  ngOnInit(): void {
    this.getPokemons({ pageIndex: 0, pageSize: this.records });
  }

  getPokemons(obj: any) {
    this.data = []
    this.loading = true;
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
                this.loadData(this.page, this.size)
              }
            }
          });
        }
      }
    } else {
      this.loadData(start, end)
    }
  }

  filterPokemon(value: string): Pokemon[] {
    const filterValue = value?.toLowerCase();
    return this.pokemonsList.filter(pokemon => pokemon.name.toLowerCase().indexOf(filterValue) === 0);
  }

  pokemonSelected(obj: any) {
    const pokemon = this.pokemonsList.find(x => x.name === obj.option.value);
    this.data = [pokemon];
    this.records = 1;
    console.log(pokemon)
  }

  deletePokemon(position: number) {
    const pokemonIndex = this.pokemonsList.findIndex(x => x.position === position);
    const pokemonIndexData = this.data.findIndex(x => x.position === position);
    this.pokemonsList.splice(pokemonIndex, 1);
    this.data.splice(pokemonIndexData, 1);
    this.records -= 1
  }

  sortPokemon() {
    if (this.sortOrder) {
      this.pokemonsList = this.pokemonsList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    } else {
      this.pokemonsList = this.pokemonsList.sort((a, b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0));
    }
    this.page = 1;
    this.loadData(0, this.size);
    this.sortOrder = !this.sortOrder;
  }

  loadData(start: number, end: number) {
    this.data = [];
    this.data = this.pokemonsList.slice(start, end)
    this.loading= false;
  }

}


