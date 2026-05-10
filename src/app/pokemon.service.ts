import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);
  private pokeApiUrl = 'https://pokeapi.co/api/v2';

  private generationRanges: Record<string, { min: number; max: number }> = {
    'gen1': { min: 1,   max: 151  },
    'gen2': { min: 152, max: 251  },
    'gen3': { min: 252, max: 386  },
    'gen4': { min: 387, max: 493  },
    'gen5': { min: 494, max: 649  },
    'gen6': { min: 650, max: 721  },
    'gen7': { min: 722, max: 809  },
    'gen8': { min: 810, max: 905  },
    'gen9': { min: 906, max: 1010 }
  };

  getRandomPokemon(generation: string): Observable<any> {
    const range = this.generationRanges[generation] || this.generationRanges['gen1'];
    const id = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    return this.getPokemonById(id);
  }

  getPokemonById(id: number): Observable<any> {
    return this.http.get(`${this.pokeApiUrl}/pokemon/${id}`);
  }

  getSilhouetteUrl(pokemon: any): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default
      || pokemon.sprites?.front_default
      || '';
  }

  getRandomChoices(correct: any, generation: string, count: number = 3): Observable<any[]> {
    const range = this.generationRanges[generation] || this.generationRanges['gen1'];
    const ids = new Set<number>();
    ids.add(correct.id);
    while (ids.size < count + 1) {
      ids.add(Math.floor(Math.random() * (range.max - range.min + 1)) + range.min);
    }
    const wrongIds = [...ids].filter(id => id !== correct.id);
    return forkJoin(wrongIds.map(id => this.getPokemonById(id))).pipe(
      map(wrongPokemon => this.shuffle([correct, ...wrongPokemon]))
    );
  }

  getHints(pokemon: any): { type: string; region: string } {
    const types = pokemon.types.map((t: any) => t.type.name).join(', ');
    const genId = this.getGenFromId(pokemon.id);
    return { type: types, region: genId };
  }

  private getGenFromId(id: number): string {
    for (const [gen, range] of Object.entries(this.generationRanges)) {
      if (id >= range.min && id <= range.max) return gen.toUpperCase();
    }
    return 'Unknown';
  }

  private shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
  }

  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}