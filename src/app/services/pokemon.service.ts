import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private data: string = "https://pokeapi.co/api/v2/pokemon?limit=151";
  constructor() { }
}
