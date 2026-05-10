import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface GameSettings {
  generation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = '/api';

  private difficultyConfig: { easy: { timer: number; hints: string[] }; medium: { timer: number; hints: string[] }; hard: { timer: number; hints: string[] } } = {
    easy:   { timer: 30, hints: ['type', 'region'] },
    medium: { timer: 20, hints: ['type'] },
    hard:   { timer: 10, hints: [] }
  };

  private currentSettings: GameSettings = { generation: 'gen1', difficulty: 'easy' };

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  setSettings(settings: GameSettings): void {
    this.currentSettings = settings;
  }

  getSettings(): GameSettings {
    return this.currentSettings;
  }

  getConfig(difficulty: string): { timer: number; hints: string[] } {
    return this.difficultyConfig[difficulty as keyof typeof this.difficultyConfig]
      || this.difficultyConfig.easy;
  }

  saveScore(difficulty: string, score: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/game/score`, { difficulty, score }, { headers: this.headers() });
  }

  saveHistory(pokemonName: string, result: 'correct' | 'wrong'): Observable<any> {
    return this.http.post(`${this.apiUrl}/game/history`, { pokemonName, result }, { headers: this.headers() });
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/game/history`, { headers: this.headers() });
  }

  getScores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/game/score`, { headers: this.headers() });
  }
}