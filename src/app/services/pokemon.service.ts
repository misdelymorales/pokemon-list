import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private urlEndPoint: string =  "https://pokeapi.co/api/v2";

  constructor(private http: HttpClient) { }

  getPokemons(index: {}){
    return  this.http.get<any>(`${this.urlEndPoint}/pokemon/${index}`)
  }

  getPokemon(name: string){
    return this.http.get<any>(`${this.urlEndPoint}/pokemon/${name}`)
  }

}
